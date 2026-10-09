export default function FinalCTA({ onEnter }) {
  return (
    <section className="final-section section content-wrap" id="final-cta" data-world="final-cta">
      <div className="section-eyebrow reveal-in"><span>04</span><i /> YOUR NEXT PERSPECTIVE</div>
      <div className="final-copy reveal-in"><span className="final-sigil">{'{'} <i>↗</i> {'}'}</span><p className="eyebrow-soft">Keep the curiosity. Change the angle.</p><h2>Stop guessing.<br />Start <em>understanding</em><br />your code.</h2><button type="button" className="button button-primary" onClick={onEnter}>Enter CodeMirror <span>↗</span></button><p className="final-caption">One solution is all it takes to begin.</p></div>
      <span className="final-index index-left">CM — 001&nbsp; / &nbsp;REFLECT</span><span className="final-index index-right">A CLEARER WAY FORWARD</span>
    </section>
  )
}