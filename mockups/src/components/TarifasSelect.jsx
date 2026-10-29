import { useEffect, useId, useRef, useState } from 'react'

export default function TarifasSelect({ id, label, value, options, onChange }) {
  const reactId = useId()
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const typeahead = useRef('')
  const typeaheadTimer = useRef()
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const labelId = `${id || reactId}-label`
  const listId = `${id || reactId}-listbox`
  const optionId = (index) => `${id || reactId}-option-${index}`

  useEffect(() => { setActiveIndex(selectedIndex) }, [selectedIndex])
  useEffect(() => {
    if (!open) return undefined
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])
  useEffect(() => () => clearTimeout(typeaheadTimer.current), [])

  const close = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => buttonRef.current?.focus())
  }
  const select = (index) => {
    onChange(options[index].value)
    setActiveIndex(index)
    close(true)
  }
  const move = (next) => {
    setOpen(true)
    setActiveIndex((current) => (next < 0 ? options.length - 1 : next >= options.length ? 0 : next ?? current))
  }
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); move(open ? activeIndex + 1 : selectedIndex + 1); return }
    if (event.key === 'ArrowUp') { event.preventDefault(); move(open ? activeIndex - 1 : selectedIndex - 1); return }
    if (event.key === 'Home') { event.preventDefault(); setOpen(true); setActiveIndex(0); return }
    if (event.key === 'End') { event.preventDefault(); setOpen(true); setActiveIndex(options.length - 1); return }
    if (event.key === 'Escape') { if (open) { event.preventDefault(); close(true) }; return }
    if (event.key === 'Tab') { setOpen(false); return }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) select(activeIndex)
      else { setActiveIndex(selectedIndex); setOpen(true) }
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      clearTimeout(typeaheadTimer.current)
      typeahead.current += event.key.toLocaleLowerCase('es')
      const match = options.findIndex((option) => option.label.toLocaleLowerCase('es').startsWith(typeahead.current))
      if (match >= 0) { event.preventDefault(); setOpen(true); setActiveIndex(match) }
      typeaheadTimer.current = setTimeout(() => { typeahead.current = '' }, 650)
    }
  }

  return (
    <div ref={rootRef} className={'tarifas-select' + (open ? ' open' : '')}>
      <span id={labelId} className="tarifas-select-label">{label}</span>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onClick={() => { setActiveIndex(selectedIndex); setOpen((current) => !current) }}
        onKeyDown={handleKeyDown}
      >
        <span>{options[selectedIndex].label}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && <ul ref={listRef} id={listId} role="listbox" aria-labelledby={labelId}>
        {options.map((option, index) => <li
          id={optionId(index)}
          key={option.value}
          role="option"
          aria-selected={option.value === value}
          className={index === activeIndex ? 'active' : ''}
          data-index={index}
          onPointerMove={() => setActiveIndex(index)}
          onClick={() => select(index)}
        ><span>{option.label}</span>{option.value === value && <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true"><path d="m5 10 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}</li>)}
      </ul>}
    </div>
  )
}
