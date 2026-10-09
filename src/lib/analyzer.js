const keywordSet = new Set('and as assert async await break class continue def del elif else except finally for from global if import in is lambda not or pass raise return try while with yield print len range enumerate zip sum min max max float int str list dict set True False None'.split(' '))

function pythonIssue(source) {
  const cleaned = source.replace(/#[^\n]*|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, (match) => match.replace(/[^\n]/g, ' '))
  const declared = new Set()
  const add = (value) => (value.match(/[A-Za-z_]\w*/g) || []).forEach((name) => declared.add(name))
  for (const match of cleaned.matchAll(/\bdef\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/g)) {
    declared.add(match[1])
    add(match[2])
  }
  for (const match of cleaned.matchAll(/\bfor\s+(.+?)\s+in\b/g)) add(match[1])
  for (const match of cleaned.matchAll(/^\s*(?:import|from)\s+[^\n]+/gm)) add(match[0].replace(/^\s*(?:from|import)\s+/, ''))
  for (const match of cleaned.matchAll(/^\s*([A-Za-z_]\w*)\s*(?:[:+\-*/]?=)/gm)) declared.add(match[1])
  const unknown = new Set()
  const identifiers = /\b[A-Za-z_]\w*\b/g
  let match
  while ((match = identifiers.exec(cleaned))) {
    const name = match[0]
    if (keywordSet.has(name) || declared.has(name)) continue
    const before = cleaned.slice(0, match.index).trimEnd()
    const after = cleaned.slice(match.index + name.length).trimStart()
    if (before.endsWith('.') || after.startsWith('(')) continue
    unknown.add(name)
  }
  return [...unknown].slice(0, 2).map((name) => `Potential error: “${name}” may be used before it is defined, which can cause a NameError.`)
}

function parseLiteral(value, variables) {
  const text = value.trim()
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text)
  if (/^(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')$/.test(text)) return text.slice(1, -1).replace(/\\([\\'"nrt])/g, (_, char) => ({ n: '\n', r: '\r', t: '\t' })[char] ?? char)
  if (text.startsWith('[') && text.endsWith(']')) {
    const contents = text.slice(1, -1).trim()
    return contents ? splitArguments(contents).map((part) => parseLiteral(part, variables)) : []
  }
  if (/^[A-Za-z_]\w*$/.test(text) && Object.hasOwn(variables, text)) return variables[text]
  throw new Error('unsupported')
}

function splitArguments(value) {
  const parts = []
  let start = 0
  let depth = 0
  let quote = ''
  for (let i = 0; i < value.length; i++) {
    const char = value[i]
    if (quote) {
      if (char === quote && value[i - 1] !== '\\') quote = ''
    } else if (char === '"' || char === "'") quote = char
    else if ('(['.includes(char)) depth++
    else if (')]'.includes(char)) depth--
    else if (char === ',' && depth === 0) { parts.push(value.slice(start, i).trim()); start = i + 1 }
  }
  if (value.slice(start).trim()) parts.push(value.slice(start).trim())
  return parts
}

function evaluateExpression(expression, variables) {
  if (expression.trim().startsWith('[') && expression.trim().endsWith(']')) return parseLiteral(expression, variables)
  const tokens = expression.match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[A-Za-z_]\w*|\d+(?:\.\d+)?|[()+*/-]/g)
  if (!tokens || tokens.join('').replace(/\s/g, '') !== expression.replace(/\s/g, '')) throw new Error('unsupported')
  let position = 0
  const primary = () => {
    const token = tokens[position++]
    if (token === '(') { const value = sum(); if (tokens[position++] !== ')') throw new Error('syntax'); return value }
    if (token === undefined) throw new Error('syntax')
    if (token === '-') { const value = primary(); if (typeof value !== 'number') throw new Error('type'); return -value }
    return parseLiteral(token, variables)
  }
  const product = () => {
    let value = primary()
    while (tokens[position] === '*' || tokens[position] === '/') {
      const operator = tokens[position++]
      const right = primary()
      if (typeof value !== 'number' || typeof right !== 'number') throw new Error('type')
      value = operator === '*' ? value * right : value / right
    }
    return value
  }
  const sum = () => {
    let value = product()
    while (tokens[position] === '+' || tokens[position] === '-') {
      const operator = tokens[position++]
      const right = product()
      if (operator === '+' && typeof value === 'string' && typeof right === 'string') value += right
      else if (typeof value === 'number' && typeof right === 'number') value = operator === '+' ? value + right : value - right
      else throw new Error('type')
    }
    return value
  }
  const result = sum()
  if (position !== tokens.length) throw new Error('syntax')
  return result
}

function formatOutput(value) {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return `[${value.map((item) => typeof item === 'string' ? `'${item}'` : formatOutput(item)).join(', ')}]`
  return String(value)
}

function simulatePythonOutput(source) {
  const variables = Object.create(null)
  const output = []
  const lines = source.split(/\r?\n/).map((raw) => ({ raw, text: raw.trim(), indent: raw.length - raw.trimStart().length })).filter(({ text }) => text && !text.startsWith('#'))
  const unsupported = (error) => ({ supported: false, error, output: 'Output simulation is not available for this code yet.' })
  const execute = (statements) => {
    for (let i = 0; i < statements.length; i++) {
      const { text, indent } = statements[i]
      const loop = text.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\((\d+)\):$/)
      if (loop) {
        const body = []
        let j = i + 1
        while (j < statements.length && statements[j].indent > indent) body.push(statements[j++])
        if (!body.length || body.some((line) => line.indent <= indent + 0)) return unsupported()
        for (let n = 0; n < Number(loop[2]); n++) {
          variables[loop[1]] = n
          const result = execute(body)
          if (!result.supported) return result
        }
        i = j - 1
        continue
      }
      if (/^(?:for|while|if|elif|else|def|class|try|with)\b/.test(text)) return unsupported()
      const print = text.match(/^print\((.*)\)$/)
      if (print) {
        try { output.push(splitArguments(print[1]).map((part) => formatOutput(evaluateExpression(part, variables))).join(' ')) }
        catch (error) { return unsupported(error.message) }
        continue
      }
      const assignment = text.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/)
      if (assignment) {
        try { variables[assignment[1]] = evaluateExpression(assignment[2], variables) }
        catch (error) { return unsupported(error.message) }
        continue
      }
      return unsupported()
    }
    return { supported: true, output: output.join('\n') || '(no output)' }
  }
  return execute(lines)
}

function pythonSyntaxIssue(source) {
  const missingColon = source.split(/\r?\n/).find((line) => /^\s*(?:for|while|if|elif|else|def)\b/.test(line) && !/:\s*(?:#.*)?$/.test(line))
  if (missingColon) return 'A control statement or function definition may be missing a colon.'
  let depth = 0
  let quote = ''
  for (const char of source) {
    if (quote) { if (char === quote) quote = ''; continue }
    if (char === '"' || char === "'") quote = char
    else if ('([{'.includes(char)) depth++
    else if (')]}'.includes(char)) depth--
    if (depth < 0) return 'There is a closing bracket without a matching opening bracket.'
  }
  if (quote || depth !== 0) return 'A string or bracket appears to be left unfinished.'
  return null
}

function betterVersion(source, pattern, language) {
  if (language !== 'python') return { code: null, explanation: 'A safe, specific rewrite is not available for this language yet.' }
  const lines = source.split(/\r?\n/)
  for (let i = 0; i < lines.length - 2; i++) {
    const outer = lines[i].match(/^(\s*)for\s+(\w+)\s+in\s+(\w+)\s*:/)
    const inner = lines[i + 1].match(/^\s+for\s+(\w+)\s+in\s+(\w+)\s*:/)
    if (!outer || !inner) continue
    const condition = lines[i + 2].match(/^\s+if\s+(\w+)\s*==\s*(\w+)\s*:/)
    const append = lines[i + 3]?.match(/^\s+([A-Za-z_]\w*)\.append\((\w+)\)\s*$/)
    const breakAfterMatch = /^\s+break\s*$/.test(lines[i + 4] || '')
    if (!condition || !append || !breakAfterMatch || ![condition[1], condition[2]].includes(outer[2]) || ![condition[1], condition[2]].includes(inner[1]) || append[2] !== outer[2]) continue
    const resultName = append[1]
    const lookupName = `${inner[2]}_set`
    return {
      code: `${lookupName} = set(${inner[2]})\n${resultName} = [${outer[2]} for ${outer[2]} in ${outer[3]} if ${outer[2]} in ${lookupName}]`,
      explanation: `A set lookup replaces the repeated inner scan. The expected time changes from O(n × m) to O(n + m), with O(m) extra space. Learn set membership and time-space trade-offs.`,
    }
  }
  if (pattern.name === 'Nested traversal') return { code: null, explanation: 'Nested loops can have many purposes; there is not enough context here to generate a safe rewrite.' }
  return { code: null, explanation: 'Your code is already reasonably structured for this example.' }
}

export function analyzeCode(source, language) {
  const code = source.trim()
  const loops = [...code.matchAll(/\b(?:for|while)\b/gi)].length
  const nested = loops > 1 || /for[\s\S]{0,240}for\b/i.test(code)
  const usesMap = /\b(?:map|dict|hashmap|set|seen|lookup|freq|counts)\b|\.has\s*\(|\.get\s*\(/i.test(code)
  const binary = /\b(?:binary\s*search|mid|middle)\b/i.test(code) && /\b(?:left|low|start)\b/i.test(code)
  const recursive = /\breturn\s+([A-Za-z_]\w*)\s*\(/.test(code) || /\bdef\s+([A-Za-z_]\w*)[\s\S]*?\1\s*\(/.test(code)
  const sorting = /\.sort\s*\(|\bsorted\s*\(/i.test(code)
  let pattern = { name: 'Direct computation', time: 'O(1)', space: 'O(1)', practice: 'Edge cases & invariants', improve: 'Make the key condition explicit and test boundary values.' }
  if (binary) pattern = { name: 'Binary search', time: 'O(log n)', space: 'O(1)', practice: 'Search boundaries', improve: 'Keep the interval rule consistent and check the final low/high boundary.' }
  else if (usesMap) pattern = { name: 'Hash-based lookup', time: 'O(n)', space: 'O(n)', practice: 'Hash maps', improve: 'Check that each key is inserted once and that the lookup handles missing values.' }
  else if (recursive) pattern = { name: 'Recursion', time: loops > 1 ? 'O(n²)' : 'O(n)', space: 'O(n)', practice: 'Base cases & memoization', improve: 'Trace a small input through the base case and look for repeated subproblems.' }
  else if (sorting) pattern = { name: 'Sort and scan', time: 'O(n log n)', space: 'O(1) approx.', practice: 'Sorting trade-offs', improve: 'After sorting, consider whether one pass can handle the remaining comparisons.' }
  else if (nested) pattern = { name: 'Nested traversal', time: 'O(n²)', space: 'O(1)', practice: 'Hash maps', improve: 'A lookup table may trade extra space for fewer repeated comparisons.' }
  else if (loops) pattern = { name: 'Linear traversal', time: 'O(n)', space: 'O(1)', practice: 'Single-pass patterns', improve: 'Track only the state needed for the next decision.' }
  if (!code) return null

  const issues = language === 'python' ? pythonIssue(code) : []
  const syntaxIssue = language === 'python' ? pythonSyntaxIssue(code) : null
  const output = language === 'python' ? simulatePythonOutput(code) : { supported: false, output: 'Output simulation is currently supported for selected Python patterns.' }
  const typeIssue = output.error === 'type' ? 'Potential error: this operation combines incompatible value types.' : output.error === 'syntax' ? 'Likely error: an expression appears incomplete or malformed.' : null
  if (syntaxIssue) issues.unshift(`Likely error: ${syntaxIssue}`)
  if (typeIssue) issues.unshift(typeIssue)
  const better = betterVersion(code, pattern, language)
  return {
    correctness: issues.length ? 'Needs review' : 'No obvious issues detected',
    issues,
    pattern,
    strengths: usesMap ? 'You are using direct lookups to avoid scanning for every match.' : loops ? 'Your solution has a clear traversal strategy.' : 'Your solution keeps the core operation easy to follow.',
    improvement: pattern.improve,
    output: output.output,
    outputSupported: output.supported,
    whatHappened: issues.length ? 'The analyzer found a possible issue in the visible code. Review the note above; other runtime behavior is not checked.' : output.supported ? 'This output is a prediction from supported Python patterns; the submitted code was not executed.' : 'The analyzer reviewed the visible structure. It does not execute code, and this pattern is outside the current output simulator.',
    betterVersion: better.code,
    betterExplanation: better.explanation,
    practice: pattern.practice,
  }
}
