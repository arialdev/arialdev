import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { education, experience } from '../../data/portfolio';
import { useEnhanced } from './useEnhanced';

export default function Career() {
  const enhanced = useEnhanced();
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const groups = [
    { name: 'Experience', entries: experience },
    { name: 'Education', entries: education },
  ];
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1
      : event.key === 'ArrowRight' ? (index + 1) % 2
        : event.key === 'ArrowLeft' ? (index + 1) % 2 : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }
  return (
    <div className="career">
      {enhanced && <div role="tablist" aria-label="Professional background" className="career-tabs">
        {groups.map((group, index) => <button key={group.name} type="button" role="tab"
          ref={(node) => { tabs.current[index] = node; }}
          id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`}
          aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
          onClick={() => setSelected(index)} onKeyDown={(event) => onKey(event, index)}>
          {group.name}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            {index === 0 ? <>
              <rect x="3" y="7" width="18" height="14" rx="2"/>
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0M10 12v3h4v-3"/>
            </> : <>
              <path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6M22 9v8"/>
            </>}
          </svg>
        </button>)}
      </div>}
      {groups.map((group, index) => <div key={group.name} id={`${id}-panel-${index}`}
        role={enhanced ? 'tabpanel' : undefined} aria-labelledby={enhanced ? `${id}-tab-${index}` : undefined}
        tabIndex={enhanced ? 0 : undefined} hidden={enhanced && selected !== index} className="career-panel">
        {!enhanced && <h3 className="fallback-heading">{group.name}</h3>}
        <ol className="timeline">
          {group.entries.map((entry) => <li key={entry.organization}>
            <div className="timeline-meta"><span className="eyebrow">{entry.period}</span><span>{entry.organization}</span></div>
            <h3>{entry.title}</h3><p>{entry.description}</p>
            {entry.highlights.length > 0 && <ul className="career-highlights">{entry.highlights.map((item) => <li key={item}>{item}</li>)}</ul>}
          </li>)}
        </ol>
      </div>)}
    </div>
  );
}
