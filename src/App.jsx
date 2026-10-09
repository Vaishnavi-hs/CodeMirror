import { useEffect, useState } from 'react'
import Navigation from './components/Navigation.jsx'
import VisualWorld from './components/VisualWorld.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Journey from './components/Journey.jsx'
import Analyzer from './components/Analyzer.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import './App.css'

export default function App() {
  const [activeWorld, setActiveWorld] = useState('home')
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const revealItems = [...document.querySelectorAll('.reveal-in')]
    const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' }) : null
    revealItems.forEach((item) => revealObserver ? revealObserver.observe(item) : item.classList.add('is-visible'))

    const sections = [...document.querySelectorAll('[data-world]')]
    const ratios = new Map(sections.map((section) => [section, 0]))
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const ratio = entry.isIntersecting ? entry.intersectionRatio : 0
        ratios.set(entry.target, ratio)
        entry.target.classList.toggle('scene-in-view', ratio > 0.08)
      })
      const current = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0]
      if (current && current[1] > 0) setActiveWorld(current[0].dataset.world)
    }, { threshold: [0, 0.08, 0.18, 0.32, 0.5], rootMargin: '-10% 0px -18% 0px' }) : null
    sections.forEach((section) => observer?.observe(section))
    if (!observer) sections.forEach((section) => section.classList.add('scene-in-view'))

    const journey = document.getElementById('how-it-works')
    let journeyFrame = 0
    const updateJourney = () => {
      if (!journey) return
      cancelAnimationFrame(journeyFrame)
      journeyFrame = requestAnimationFrame(() => {
        const rect = journey.getBoundingClientRect()
        const progress = Math.max(0, Math.min(0.999, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
        setActiveStep(Math.min(4, Math.floor(progress * 4) + 1))
      })
    }
    updateJourney()
    window.addEventListener('scroll', updateJourney, { passive: true })
    window.addEventListener('resize', updateJourney)

    return () => {
      revealObserver?.disconnect()
      observer?.disconnect()
      window.removeEventListener('scroll', updateJourney)
      window.removeEventListener('resize', updateJourney)
      cancelAnimationFrame(journeyFrame)
    }
  }, [])

  const goToAnalyzer = (focus = false) => {
    const section = document.getElementById('analyzer')
    const editor = document.getElementById('code-input')
    if (!section) return
    section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    if (focus) window.setTimeout(() => editor?.focus({ preventScroll: true }), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850)
  }

  return (
    <div className="site-shell" style={{ '--journey-progress': `${((activeStep - 1) / 3) * 100}` }}>
      <VisualWorld activeWorld={activeWorld} />
      <Navigation onTry={() => goToAnalyzer(true)} />
      <main>
        <Hero onAnalyze={() => goToAnalyzer(true)} />
        <Features />
        <Journey activeStep={activeStep} />
        <Analyzer />
        <FinalCTA onEnter={() => goToAnalyzer(true)} />
      </main>
      <footer className="site-footer"><a href="#home" className="footer-brand"><span className="brand-mark"><i /><i /><i /></span>codemirror</a><span>Built for curious minds, learning one solution at a time.</span><span>CODEMIRROR · 2026</span></footer>
    </div>
  )
}