import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { projects } from '../../data/portfolio';
import type { Project } from '../../data/portfolio';
import { useEnhanced } from './useEnhanced';

function Artwork({ id }: { id: string }) {
  return <div className={`project-art art-${id}`} aria-hidden="true">
    {id === 'sre-agent' ? <>
      <div className="art-window"><span/><span/><span/><span className="art-window-label">system / intelligence</span></div>
      <div className="signal-line"><svg viewBox="0 0 300 60" fill="none"><path d="M0 32H55L65 23L76 40L89 9L104 51L119 23L131 32H300" stroke="currentColor" strokeWidth="2"/></svg></div>
      <div className="art-pipeline"><span>Signal</span><i>→</i><span>Context</span><i>→</i><span>Action</span></div>
      <div className="art-caption"><span className="status-dot"/>Making sense of the unexpected</div>
    </> : id === 'vocabulaire' ? <>
      <span className="word word-one">bonjour<span>hello</span></span>
      <span className="word word-two">apprendre<span>to learn</span></span>
      <span className="word word-three">explore.</span>
      <span className="art-small">A little more fluent, every day.</span>
    </> : <>
      <div className="film-stripe"/><div className="award-mark">✳</div>
      <span className="award-type">And the<br/><em>winner is…</em></span><span className="art-small">A love of cinema. A little code.</span>
    </>}
  </div>;
}

export default function Projects() {
  const enhanced = useEnhanced();
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (selected && dialog.current) {
      dialog.current.showModal();
      dialog.current.querySelector<HTMLButtonElement>('button')?.focus();
    }
  }, [selected]);
  function onClose() { setSelected(null); trigger.current?.focus(); }
  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
    const first = controls?.[0];
    const last = controls?.[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <>
    <div className="project-grid">{projects.map((project) => <article className="project-card" key={project.id}>
      <div className="project-image"><Artwork id={project.id}/>
        {enhanced && <button type="button" className="project-image-button" aria-label={`View project: ${project.name}`}
          aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setSelected(project); }}/>}
      </div>
      <div className="project-copy"><div className="project-category"><span>{project.category}</span><span>{project.number}</span></div>
        <h3>{project.name}</h3><p>{project.summary}</p>
        <ul className="tags" aria-label={`${project.name} technologies`}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        <details className="project-fallback" hidden={enhanced}><summary>Project details</summary><p>{project.detail}</p></details>
        <div className="project-actions"><a href={project.url}>{project.linkLabel}</a></div>
      </div>
    </article>)}</div>
    {selected && <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onClose={onClose} onKeyDown={containFocus}>
      <button type="button" className="dialog-close" aria-label="Close project details" onClick={() => dialog.current?.close()}>×</button>
      <span className="eyebrow">{selected.category}</span><h2 id="project-dialog-title">{selected.name}</h2>
      <p>{selected.detail}</p><ul className="tags">{selected.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      <a className="button button-primary" href={selected.url}>{selected.linkLabel}</a>
    </dialog>}
  </>;
}
