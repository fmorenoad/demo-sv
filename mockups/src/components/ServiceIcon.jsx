// Consistent line illustrations for the six customer services.
export default function ServiceIcon({ type }) {
  const drawings = {
    roadworks: <><path d="M15 44 24 10h8l9 34M10 48h36M15 44h26" /><path className="service-icon-accent" d="M21 21h14M18 32h20" /></>,
    calculator: <><rect x="12" y="6" width="32" height="44" rx="4" /><path className="service-icon-accent" d="M19 14h18v9H19z" /><path d="M20 31h2m12 0h2m-16 7h2m12 0h2m-16 7h2m12 0h2" /></>,
    account: <><rect x="5" y="9" width="46" height="33" rx="4" /><path d="M5 17h46M21 42v7m14-7v7m-19 0h24" /><g className="service-icon-accent"><circle cx="28" cy="26" r="4" /><path d="M20 37c0-7 16-7 16 0" /></g></>,
    tag: <><rect x="7" y="20" width="38" height="25" rx="4" /><path d="M14 28h12m-12 7h7" /><g className="service-icon-accent"><path d="M34 11a15 15 0 0 1 15 15M34 17a9 9 0 0 1 9 9" /><circle cx="34" cy="26" r="2" /></g></>,
    status: <><rect x="8" y="12" width="33" height="32" rx="4" /><path d="M15 21h12m-12 7h7" /><g className="service-icon-accent"><circle cx="39" cy="38" r="11" /><path d="m34 38 3 3 6-7" /></g></>,
    balance: <><rect x="7" y="14" width="40" height="29" rx="4" /><path d="M7 23h40m-32 12h8" /><g className="service-icon-accent"><path d="M35 29a7 7 0 0 1 0 10m4-13a11 11 0 0 1 0 16" /></g></>,
    bill: <><path d="M13 7h25l6 6v35l-5-3-5 3-5-3-5 3-5-3-6 3V7Z" /><path d="M35 7v9h9m-24 8h16m-16 6h10" /><path className="service-icon-accent" d="M20 38h16" /></>,
    calendar: <><rect x="8" y="12" width="40" height="36" rx="4" /><path d="M8 22h40M18 7v10M38 7v10" /><path d="M17 30h6m5 0h6m5 0h2M17 38h6m5 0h6" /><path className="service-icon-accent" d="M39 36v5h-5" /></>,
    payment: <><rect x="6" y="11" width="35" height="26" rx="4" /><path d="M6 20h35m-27 9h8" /><g className="service-icon-accent"><circle cx="39" cy="38" r="11" /><path d="M42 33h-4a2.5 2.5 0 0 0 0 5h2a2.5 2.5 0 0 1 0 5h-4m3-12v14" /></g></>,
    map: <><path d="m6 16 14-5 15 5 15-5v32l-15 5-15-5-14 5V16Zm14-5v32m15-27v32" /><g className="service-icon-accent"><path d="M39 16c0 6-7 12-7 12s-7-6-7-12a7 7 0 1 1 14 0Z" /><circle cx="32" cy="16" r="2" /></g></>,
    route: <><circle cx="14" cy="14" r="5" /><circle cx="42" cy="42" r="5" /><path d="M14 19v7c0 5 4 8 9 8h10c5 0 9 3 9 8" /><path className="service-icon-accent" d="M14 12v4m-2-2h4M40 42h4" /></>,
    car: <><path d="m10 36 5-17h26l5 17v10h-6v-5H16v5h-6V36Z" /><path d="M16 32h24M19 19l3-8h12l3 8" /><g className="service-icon-accent"><circle cx="18" cy="37" r="3" /><circle cx="38" cy="37" r="3" /></g></>,
    shield: <><path d="M28 6 12 13v12c0 12 7 20 16 25 9-5 16-13 16-25V13L28 6Z" /><path className="service-icon-accent" d="m20 28 5 5 11-12" /></>,
  }
  return <svg className="service-icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[type]}</svg>
}


