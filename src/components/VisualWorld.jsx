const scenes = ['home', 'features', 'how-it-works', 'analyzer', 'final-cta']
const starStyle = (i) => ({ '--x': ((i * 37 + 4) % 96) + '%', '--y': ((i * 29 + 8) % 88) + '%' })

function CodeWindow({ className, file, children }) {
  return <div className={'world-window ' + className}><div className="window-bar"><span /><span /><span /><small>{file}</small></div><div className="window-code">{children}</div></div>
}
function HeroEnvironment() {
  return <div className="hero-objects"><div className="hero-planet"><i /><b /><span /></div>
    <CodeWindow className="window-far" file="reflection.js"><em>const</em> analyze = <b>(code)</b> =&gt; {'{'}<br />&nbsp;&nbsp;return reflect(code)<br />{' }'}</CodeWindow>
    <CodeWindow className="window-near" file="solution.py"><em>def</em> solve(data):<br />&nbsp;&nbsp;for item in data:<br />&nbsp;&nbsp;&nbsp;&nbsp;inspect(item)</CodeWindow>
    <span className="float-token token-braces">{'{ }'}</span><span className="float-token token-complexity">O(n²)</span><span className="float-token token-hash">HashMap</span>
    <div className="hero-stars">{Array.from({ length: 16 }, (_, i) => <i key={i} style={starStyle(i)} />)}</div>
  </div>
}
function AnalyzerEnvironment() {
  return <div className="analyzer-atmosphere">
    <div className="terminal-fragment terminal-left"><small><i /> ANALYSIS.ENGINE <b>ONLINE</b></small><code>&gt; parse(source)<br />&gt; map.patterns()<br />&gt; reflect(&amp;you)</code><span>LATENCY&nbsp; 14ms</span></div>
    <div className="terminal-fragment terminal-right"><small><i /> COMPLEXITY <b>READY</b></small><strong>O(n <em>log n</em>)</strong><div className="terminal-bars">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--bar-height': (20 + ((i * 31) % 72)) + '%' }} />)}</div><span>PATTERN.SCAN // ACTIVE</span></div>
    <div className="analysis-dots">{Array.from({ length: 13 }, (_, i) => <i key={i} style={starStyle(i)} />)}</div>
  </div>
}
function CTAEnvironment() {
  return <div className="final-orbit"><div className="orbit-core" /><i className="orbit-ring ring-a" /><i className="orbit-ring ring-b" /><i className="orbit-ring ring-c" /><span className="orbit-point point-a" /><span className="orbit-point point-b" /><div className="final-stars">{Array.from({ length: 14 }, (_, i) => <i key={i} style={starStyle(i)} />)}</div><span className="final-code code-a">{'{'}</span><span className="final-code code-b">{' }'}</span></div>
}
export default function VisualWorld({ activeWorld }) {
  const environments = {
    home: <HeroEnvironment />,
    features: <div className="ambient-field" />,
    'how-it-works': <div className="ambient-field" />,
    analyzer: <AnalyzerEnvironment />,
    'final-cta': <CTAEnvironment />,
  }
  return <div className={'visual-world world-' + activeWorld} aria-hidden="true">{scenes.map((scene) => <section key={scene} className={'world-scene scene-' + scene + (activeWorld === scene ? ' is-active' : '')}>{environments[scene]}</section>)}</div>
}