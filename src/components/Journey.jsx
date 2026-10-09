const steps = [
  { n: '01', short: 'WRITE', title: 'Start with your approach', text: 'Bring the code you wrote for a problem and choose the language you are working in.' },
  { n: '02', short: 'ANALYZE', title: 'See the shape of it', text: 'Surface patterns, complexity, and possible issues without losing sight of how you got there.' },
  { n: '03', short: 'UNDERSTAND', title: 'Connect action to outcome', text: 'Read the trade-offs behind your choices and recognize the habits that are taking shape.' },
  { n: '04', short: 'IMPROVE', title: 'Choose a next step', text: 'Leave with a practical concept to try, so each solution gives you something to build on.' },
]

export default function Journey({ activeStep }) {
  return (
    <section className="journey-section section content-wrap" id="how-it-works" data-world="how-it-works">
      <div className="section-visual journey-scene" aria-hidden="true">
        <span className="journey-fragment fragment-one">for choice in solution:</span>
        <span className="journey-fragment fragment-two">pattern → practice</span>
        <i className="journey-orb orb-one" /><i className="journey-orb orb-two" />
      </div>
      <div className="section-eyebrow reveal-in"><span>02</span><i /> A PRACTICE THAT BUILDS</div>
      <div className="journey-heading reveal-in"><div><p className="eyebrow-soft">A small loop, a bigger perspective</p><h2>From first draft<br />to <em>next instinct.</em></h2></div><p>Progress rarely happens in one leap.<br />It happens when you can see what changed.</p></div>
      <div className="journey-track-wrap" aria-hidden="true">
        <svg viewBox="0 0 1000 110" preserveAspectRatio="none">
          <path className="journey-path-base" d="M48 72 C155 72 183 35 290 35 S430 75 535 75 S680 34 785 34 S900 60 952 60" />
          <path className="journey-path-progress" pathLength="100" d="M48 72 C155 72 183 35 290 35 S430 75 535 75 S680 34 785 34 S900 60 952 60" />
          <circle className="journey-runner" r="4"><animateMotion dur="9s" repeatCount="indefinite" path="M48 72 C155 72 183 35 290 35 S430 75 535 75 S680 34 785 34 S900 60 952 60" /></circle>
        </svg>
        {steps.map((step, index) => <span key={step.n} className={`journey-node journey-node-${index + 1} ${activeStep >= index + 1 ? 'node-passed' : ''} ${activeStep === index + 1 ? 'node-current' : ''}`}><b>{step.n}</b><i /></span>)}
      </div>
      <div className="journey-stops">{steps.map((step, index) => <article key={step.n} data-step={index + 1} className={`journey-step ${activeStep >= index + 1 ? 'step-passed' : ''} ${activeStep === index + 1 ? 'step-current' : ''}`}>
        <small><span>{step.n}</span> / {step.short}</small><h3>{step.title}</h3><p>{step.text}</p>
      </article>)}</div>
      <div className="journey-footer"><span>WRITE A LITTLE</span><i /><span>NOTICE A LOT</span><i /><span>REPEAT WITH INTENTION</span></div>
    </section>
  )
}