import { useState } from 'react'

export default function Navigation({ onTry }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="site-header">
      <a href="#home" className="brand" aria-label="CodeMirror home" onClick={close}>
        <span className="brand-mark"><i /><i /><i /></span><span>code<span className="brand-soft">mirror</span></span>
      </a>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
      <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#features" onClick={close}>Features</a><a href="#how-it-works" onClick={close}>How it works</a><a href="#analyzer" onClick={close}>Analyzer</a>
      </nav>
      <button className="nav-cta" type="button" onClick={() => { close(); onTry() }}>Try CodeMirror <span>↗</span></button>
    </header>
  )
}