import { useEffect, useMemo, useRef, useState } from 'react'
import { analyzeCode } from '../lib/analyzer.js'
import { getAnalysisStatus } from '../lib/analysisStatus.js'

const languages = {
  python: { name: 'solution.py', glyph: 'PY', example: 'def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []' },
  c: { name: 'solution.c', glyph: 'C', example: '#include <stdio.h>\n\nint sum(int a, int b) {\n    return a + b;\n}' },
  cpp: { name: 'solution.cpp', glyph: 'C++', example: '#include <vector>\n\nint sum(const std::vector<int>& values) {\n    int total = 0;\n    for (int value : values) total += value;\n    return total;\n}' },
  java: { name: 'Solution.java', glyph: 'J', example: 'class Solution {\n    int sum(int[] values) {\n        int total = 0;\n        for (int value : values) total += value;\n        return total;\n    }\n}' },
  javascript: { name: 'solution.js', glyph: 'JS', example: 'function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) return [seen.get(complement), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}' },
}
const loadingSteps = ['Reading the shape of your solution…', 'Tracing patterns and trade-offs…', 'Preparing a useful next step…']

export default function Analyzer() {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [lastAnalyzedCode, setLastAnalyzedCode] = useState(null)
  const [lastAnalyzedLanguage, setLastAnalyzedLanguage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [notice, setNotice] = useState('')
  const textarea = useRef(null)
  const gutter = useRef(null)
  const timer = useRef([])
  const lineCount = useMemo(() => Math.max(1, code.split('\n').length), [code])
  const editorStatus = getAnalysisStatus({ code, language, loading, lastAnalyzedCode, lastAnalyzedLanguage })
  const changed = editorStatus.isStale

  useEffect(() => () => timer.current.forEach(window.clearTimeout), [])

  const handleChange = (event) => {
    const next = event.target.value
    setCode(next)
    setNotice('')
  }
  const run = () => {
    if (!code.trim() || loading) {
      if (!code.trim()) { setNotice('Add a few lines first, then we can reflect on them.'); textarea.current?.focus() }
      return
    }
    timer.current.forEach(window.clearTimeout)
    setLoading(true)
    setNotice('')
    setLoadingIndex(0)
    const data = analyzeCode(code, language)
    timer.current = [
      window.setTimeout(() => setLoadingIndex(1), 430),
      window.setTimeout(() => setLoadingIndex(2), 860),
      window.setTimeout(() => {
        setResult(data)
        setLastAnalyzedCode(code)
        setLastAnalyzedLanguage(language)
        setLoading(false)
      }, 1320),
    ]
  }
  const tryExample = () => {
    if (loading) return
    const sample = languages[language].example
    setCode(sample)
    setResult(null)
    setLastAnalyzedCode(null)
    setLastAnalyzedLanguage(null)
    setNotice('Example added. Run Analyze Code when you’re ready.')
    requestAnimationFrame(() => textarea.current?.focus())
  }
  const clear = () => {
    timer.current.forEach(window.clearTimeout)
    setLoading(false)
    setCode('')
    setResult(null)
    setLastAnalyzedCode(null)
    setLastAnalyzedLanguage(null)
    setNotice('')
    textarea.current?.focus()
  }
  const updateLanguage = (event) => {
    setLanguage(event.target.value)
  }
  const handleKeys = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const start = event.currentTarget.selectionStart
      const end = event.currentTarget.selectionEnd
      const next = `${code.slice(0, start)}    ${code.slice(end)}`
      setCode(next)
      const target = event.currentTarget
      requestAnimationFrame(() => { target.selectionStart = target.selectionEnd = start + 4 })
    }
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); run() }
  }

  return (
    <section className="analyzer-section section content-wrap" id="analyzer" data-world="analyzer">
      <div className="section-eyebrow reveal-in"><span>03</span><i /> INSIDE THE REFLECTION ENGINE</div>
      <div className="analyzer-heading reveal-in"><div><p className="eyebrow-soft">Your thinking, in focus</p><h2>A space to see<br />what your code <em>reveals.</em></h2></div><p>Paste a solution. Get a thoughtful first-pass reflection on the choices inside it.</p></div>
      <div className="workspace-shell reveal-in">
        <div className="workspace-label"><span><i /> CODEMIRROR / LIVE WORKSPACE</span><span>LOCAL PROTOTYPE&nbsp; · &nbsp;V1</span></div>
        <div className="analyzer-grid">
          <section className="editor-panel" aria-label="Code editor">
            <div className="editor-header"><div className="editor-file"><span className="file-glyph">{languages[language].glyph}</span><strong>{languages[language].name}</strong><i className={code ? 'unsaved-dot visible' : 'unsaved-dot'} /></div><label className="language-control"><span>LANGUAGE</span><select value={language} onChange={updateLanguage} aria-label="Programming language">{Object.entries(languages).map(([key, item]) => <option key={key} value={key}>{item.name === 'solution.py' ? 'Python' : item.name === 'solution.js' ? 'JavaScript' : item.name === 'solution.cpp' ? 'C++' : item.name === 'solution.c' ? 'C' : 'Java'}</option>)}</select></label></div>
            <div className="code-entry"><div className="line-numbers" ref={gutter} aria-hidden="true">{Array.from({ length: lineCount }, (_, i) => <span key={i}>{String(i + 1).padStart(2, '0')}</span>)}</div><textarea ref={textarea} id="code-input" value={code} onChange={handleChange} onKeyDown={handleKeys} onScroll={(event) => { if (gutter.current) gutter.current.scrollTop = event.currentTarget.scrollTop }} spellCheck="false" autoCapitalize="off" autoComplete="off" autoCorrect="off" aria-label="Paste or write your code here" placeholder="Paste or write your code here..." /></div>
            <div className="editor-toolbar"><div className="editor-meta"><span className={`editor-status ${changed ? 'is-stale' : ''} ${loading ? 'is-loading' : ''}`}><i />{editorStatus.label}</span><span>Characters: {code.length}</span></div><div className="editor-actions"><button className="text-button example-action" type="button" onClick={tryExample} disabled={loading}>Try an Example</button><button className="text-button clear-action" type="button" onClick={clear} disabled={loading}>Clear</button><button className="button button-primary analyze-action" type="button" onClick={run} disabled={loading}>{loading ? 'Reading…' : 'Analyze Code'} <span>↗</span></button></div></div>
            <div className="editor-foot"><span>⌘ / CTRL + ENTER TO REFLECT</span><span>YOUR CODE STAYS IN THIS BROWSER</span></div>
          </section>
          <section className={`reflection-panel ${changed ? 'is-outdated' : ''}`} aria-live="polite" aria-label="Code reflection">
            <div className="reflection-top"><div><small>REFLECTION / 01</small><h3>Your insights</h3></div><span className={loading ? 'reflection-indicator is-scanning' : 'reflection-indicator'} /></div>
            {!result && !loading && <div className="reflection-empty"><div className="empty-orbit">{'{'}<i>·</i>{'}'}</div><h4>Good thinking starts<br />with a first line.</h4><p>Write or paste some code, then run Analyze Code.</p>{notice && <span className="analyzer-notice">{notice}</span>}<small>NO CODE IS SENT OR STORED</small></div>}
            {loading && <div className="reflection-loading"><div className="loading-rings"><i /><i /><i /><b /></div><small>REFLECTION ENGINE</small><h4>{loadingSteps[loadingIndex]}</h4><div className="loading-track"><i style={{ width: `${(loadingIndex + 1) * 33.33}%` }} /></div><span>READING BETWEEN THE LINES</span></div>}
            {result && !loading && <div className="reflection-results">
              <section className="analysis-card"><h4>Analysis</h4>
                <div className={`result-correctness ${result.issues.length ? 'has-issues' : ''}`}><span className="result-icon">{result.issues.length ? '!' : '✓'}</span><div><small>CORRECTNESS / FIRST PASS</small><strong>{result.correctness}</strong></div><span className="result-chip">{result.issues.length ? 'REVIEW' : 'NO FLAGS'}</span></div>
                <div className="complexity-pair"><article><small>TIME COMPLEXITY</small><strong>{result.pattern.time}</strong><span>estimated from visible structure</span></article><article><small>SPACE COMPLEXITY</small><strong>{result.pattern.space}</strong><span>estimated from visible structure</span></article></div>
                <div className="result-line"><span className="result-line-icon">⌘</span><div><small>CODING PATTERN</small><strong>{result.pattern.name}</strong></div><span className="mini-signal">▂▅▃▇</span></div>
                <div className="reflection-note"><small>STRENGTH TO KEEP</small><p>{result.strengths}</p></div>
              </section>
              {result.issues.length > 0 && <section className="analysis-card error-card"><h4>Error</h4>{result.issues.map((issue) => <p key={issue}>{issue}</p>)}</section>}
              <section className="analysis-card"><h4>Output</h4><pre className="analysis-output">{result.output}</pre><small className="analysis-disclaimer">{result.outputSupported ? 'Predicted from supported patterns; code was not executed.' : 'No user code is executed by this analyzer.'}</small></section>
              <section className="analysis-card"><h4>What happened?</h4><p>{result.whatHappened}</p></section>
              <section className="analysis-card"><h4>Better Version</h4>{result.betterVersion ? <pre className="analysis-code">{result.betterVersion}</pre> : <p>{result.betterExplanation}</p>}</section>
              <section className="analysis-card"><h4>Why is this better?</h4><p>{result.betterExplanation}</p></section>
              <section className="analysis-card"><h4>Practice suggestion</h4><p>{result.practice}</p></section>
              <p className="analysis-caveat">A heuristic reflection, not a proof of correctness. Validate complexity and test edge cases for your specific problem.</p>
            </div>}
          </section>
        </div>
      </div>
      <div className="analyzer-aside"><span>01 / ANALYZE THE SHAPE</span><i /><span>02 / KEEP THE INSIGHT</span><i /><span>03 / TRY A NEW ANGLE</span></div>
    </section>
  )
}
