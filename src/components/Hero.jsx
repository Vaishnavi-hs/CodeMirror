export default function Hero({ onAnalyze }) {
  return (
    <section className="hero section content-wrap" id="home" data-world="home">
      <div className="hero-copy reveal-in">
        <span className="product-kicker"><i /> CODEMIRROR / REFLECTION ENGINE</span>
        <p className="hero-badge"><span className="badge-spark">✳</span> AI-powered coding reflection</p>
        <h1>Understand<br />the way you <em>code.</em></h1>
        <p className="hero-description">Turn every solution into a clearer picture of your patterns, complexity, and next steps.</p>
        <div className="hero-actions"><button type="button" className="button button-primary" onClick={onAnalyze}>Analyze My Code <span>↗</span></button><a className="button button-secondary" href="#how-it-works"><span className="play-glyph">▷</span> See How It Works</a></div>
        <div className="hero-caption"><span className="caption-line" /> A little less guessing. A lot more understanding.</div>
      </div>
      <div className="hero-product reveal-in" aria-label="CodeMirror reflection preview">
        <div className="preview-orbit preview-orbit-one" /><div className="preview-orbit preview-orbit-two" />
        <div className="preview-editor">
          <div className="preview-top"><div className="window-dots"><i /><i /><i /></div><span><b>JS</b> two-sum.js</span><small><i /> Saved</small></div>
          <div className="preview-code"><div><small>01</small><code><em>function</em> twoSum(nums, target) {'{'}</code></div><div><small>02</small><code>&nbsp;&nbsp;<em>for</em> (<em>let</em> i = 0; i &lt; nums.length; i++) {'{'}</code></div><div className="preview-active"><small>03</small><code>&nbsp;&nbsp;&nbsp;&nbsp;<em>if</em> (seen.has(target - nums[i])) {'{'}</code></div><div><small>04</small><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>return</em> [seen.get(target - nums[i]), i]</code></div><div><small>05</small><code>&nbsp;&nbsp;{'}'}</code></div><div><small>06</small><code>{'}'}</code></div></div>
          <div className="preview-footer"><span>◉&nbsp; main</span><span>JavaScript&nbsp; · &nbsp;UTF-8</span></div>
        </div>
        <div className="preview-insight"><div className="insight-heading"><div><small>CODE REFLECTION / 01</small><h3>A sharper path</h3></div><span className="insight-index">01<small>/ 04</small></span></div>
          <div className="preview-metrics"><div><small>TIME</small><strong>O(n)</strong></div><div><small>SPACE</small><strong>O(n)</strong></div></div>
          <div className="preview-pattern"><span className="pattern-glyph">⌘</span><div><small>YOUR PATTERN</small><strong>Hash-based lookup</strong></div><span className="pattern-spark">▂▅▃▇</span></div>
          <div className="preview-suggestion"><span>↗</span><p>Trade a little extra space to avoid a second pass.</p></div>
        </div>
        <span className="preview-float float-feedback">✳&nbsp; One useful next step</span><span className="preview-float float-signal">PATTERN FOUND&nbsp; <b>+01</b></span>
        <div className="preview-annotation"><span>01 / REFLECT</span><a href="#features">A BETTER KIND OF CODE REVIEW&nbsp; ↗</a></div>
      </div>
      <a className="scroll-discover" href="#features"><span /> SCROLL TO DISCOVER</a>
    </section>
  )
}