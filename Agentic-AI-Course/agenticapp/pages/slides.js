import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import slides from '../data/slides';
import s from '../styles/Slides.module.css';

function SlideContent({ slide }) {
  if (slide.type === 'title') {
    return (
      <div className={`${s.slide} ${s.slideTitle}`}>
        <h1 className={s.slideTitleH1}>{slide.title}</h1>
        <p className={s.slideTitleSub}>{slide.subtitle}</p>
        <p className={s.slideTitleMeta}>{slide.meta}</p>
      </div>
    );
  }

  if (slide.type === 'end') {
    return (
      <div className={`${s.slide} ${s.slideEnd}`}>
        <h2 className={s.slideEndH2}>{slide.title}</h2>
        <p className={s.slideEndSub}>{slide.subtitle}</p>
        <p className={s.slideEndMeta}>{slide.meta}</p>
      </div>
    );
  }

  // Content slide
  return (
    <div className={`${s.slide} ${s.slideContent}`}>
      <h2 className={s.heading}>{slide.heading}</h2>

      {slide.paragraphs?.map((p, i) => (
        <p key={i} className={s.paragraph} dangerouslySetInnerHTML={{ __html: p }} />
      ))}

      {slide.diagram && (
        <div className={s.diagram}>
          {slide.diagram.map((item, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <span className={s.diagramArrow}>&rarr;</span>}
              <div className={`${s.diagramBox} ${item.accent ? s.diagramBoxAccent : ''}`}>
                {item.label}
                <small className={s.diagramSub}>{item.sub}</small>
              </div>
            </span>
          ))}
        </div>
      )}

      {slide.columns && (
        <div className={s.twoCol}>
          {slide.columns.map((col, i) => (
            <div key={i}>
              <h3 className={s.colTitle}>{col.title}</h3>
              <ul className={s.colList}>
                {col.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {slide.tableHeaders && (
        <table className={s.table}>
          <thead>
            <tr>
              {slide.tableHeaders.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slide.tableRows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} dangerouslySetInnerHTML={{ __html: j === 0 ? `<strong>${cell}</strong>` : cell }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {slide.bullets && (
        <ul className={s.bullets}>
          {slide.bullets.map((b, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
          ))}
        </ul>
      )}

      {slide.highlightBox && (
        <div className={s.highlightBox} dangerouslySetInnerHTML={{ __html: slide.highlightBox }} />
      )}
    </div>
  );
}

export default function Slides() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const progress = ((current + 1) / total) * 100;

  return (
    <>
      <Head>
        <title>Scwripts — Agentic AI Course</title>
      </Head>

      <div className={s.progressBar} style={{ width: `${progress}%` }} />

      <Link href="/" className={s.backLink}>
        &larr; Scwripts
      </Link>

      <div className={s.wrapper}>
        <SlideContent slide={slides[current]} />
      </div>

      <div className={s.nav}>
        <button className={s.navBtn} onClick={prev} disabled={current === 0}>
          &#9664; Prev
        </button>
        <button className={s.navBtn} onClick={next} disabled={current === total - 1}>
          Next &#9654;
        </button>
      </div>

      <div className={s.counter}>
        {current + 1} / {total}
      </div>
    </>
  );
}
