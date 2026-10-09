const observations = [
  { id: 'complexity', num: '01', label: 'TIME COMPLEXITY', title: 'Make the cost visible', text: 'See how a second loop changes the shape of the work.', value: 'O(n²)', tone: 'mint' },
  { id: 'patterns', num: '02', label: 'CODING PATTERNS', title: 'Name your instincts', text: 'Notice the approaches you reach for and when they fit.', value: 'Nested traversal', tone: 'lilac' },
  { id: 'correctness', num: '03', label: 'CORRECTNESS', title: 'Notice a possible issue', text: 'Spot a name or structure that deserves another look.', value: 'Review a signal', tone: 'mint' },
  { id: 'weaknesses', num: '04', label: 'AREAS TO IMPROVE', title: 'Find a trade-off', text: 'Identify where another approach may simplify the work.', value: 'Repeated scan', tone: 'lilac' },
  { id: 'practice', num: '05', label: 'NEXT PRACTICE', title: 'Find a way forward', text: 'Turn a suggestion into a concrete concept to explore.', value: 'Hash Maps', tone: 'peach' },
]

const mapSignals = [
  { className: 'map-signal map-source', icon: '</>', label: 'SOURCE CODE', index: '01' },
  { className: 'map-signal map-pattern', icon: '↗', label: 'PATTERN', index: '02' },
  { className: 'map-signal map-complexity', icon: 'O(n)', label: 'COMPLEXITY', index: '03' },
  { className: 'map-signal map-insight', icon: '✳', label: 'INSIGHT', index: '04' },
]

export default function Features() {
  return (
    <section className="features-section section content-wrap" id="features" data-world="features">
      <div className="section-visual feature-scene" aria-hidden="true">
        <svg viewBox="0 0 1200 760" preserveAspectRatio="none">
          <path d="M0 250 C170 250 210 335 350 335 M850 375 C1010 375 1020 280 1200 280" />
          <path d="M0 570 C170 570 210 480 345 480 M855 465 C1010 465 1035 565 1200 565" />
          <circle cx="105" cy="250" r="3" /><circle cx="1088" cy="280" r="3" />
          <circle cx="115" cy="570" r="3" /><circle cx="1080" cy="565" r="3" />
        </svg>
        <span className="scene-index scene-index-left">SIGNAL MAP / 01</span>
        <span className="scene-index scene-index-right">READING THE SHAPE</span>
      </div>
      <div className="section-eyebrow reveal-in"><span>01</span><i /> FROM CODE TO CLARITY</div>
      <div className="features-heading reveal-in">
        <div><p className="eyebrow-soft">More than a green check</p><h2>Your code is a map<br />of how you <em>think.</em></h2></div>
        <p>CodeMirror reads your solution as a set of choices. The loops you reach for. The trade-offs you make. The patterns you repeat.</p>
      </div>
      <div className="signal-board reveal-in">
        <div className="signal-board-top"><span><i /> SIGNALS / 05</span><span>CODE <b>→</b> PATTERN <b>→</b> INSIGHT</span></div>
        <div className="signal-map" aria-label="A map connecting source code to patterns, complexity, and insights">
          <svg viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true">
            <path d="M72 91 C178 91 196 38 318 43 S453 134 560 126 S713 45 830 54 S912 90 946 90" />
            <path className="signal-secondary" d="M72 91 C183 91 214 144 326 138 S459 57 560 62 S715 140 830 130 S910 91 946 90" />
            <circle className="signal-runner" r="4"><animateMotion dur="8s" repeatCount="indefinite" path="M72 91 C178 91 196 38 318 43 S453 134 560 126 S713 45 830 54 S912 90 946 90" /></circle>
          </svg>
          {mapSignals.map((signal) => <div className={signal.className} key={signal.index}><span>{signal.icon}</span><small>{signal.label}<b>{signal.index}</b></small></div>)}
          <div className="map-center-note"><i /> READING THE STRUCTURE <span>rather than just the output</span></div>
        </div>
        <div className="signal-cards">{observations.map((item) => <article className={`signal-card card-${item.tone}`} key={item.id}>
          <span className="signal-card-label">{item.label}<b>{item.num}</b></span><strong>{item.value}</strong><p>{item.text}</p><span className="signal-card-trace">{item.title} <i>↗</i></span>
        </article>)}</div>
        <div className="signal-board-foot"><span>STRUCTURE, NOT JUST OUTPUT</span><i /><span>REFLECTION IN MOTION</span></div>
      </div>
    </section>
  )
}