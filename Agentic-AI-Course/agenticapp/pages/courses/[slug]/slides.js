import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSlides } from '../../../lib/api';
import staticSlides from '../../../data/slides';
import EngagementTracker from '../../../components/EngagementTracker';
import s from '../../../styles/Slides.module.css';

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

function transformApiSlide(apiSlide) {
  const content = typeof apiSlide.content === 'string'
    ? JSON.parse(apiSlide.content)
    : apiSlide.content;

  const slideType = apiSlide.slide_type || content.type || 'content';

  if (slideType === 'title' || slideType === 'end') {
    return {
      type: slideType,
      title: content.title || '',
      subtitle: content.subtitle || '',
      meta: content.meta || '',
    };
  }

  return {
    type: 'content',
    heading: content.heading || content.title || '',
    paragraphs: content.paragraphs || [],
    bullets: content.bullets || [],
    diagram: content.diagram || null,
    columns: content.columns || null,
    tableHeaders: content.tableHeaders || content.table_headers || null,
    tableRows: content.tableRows || content.table_rows || null,
    highlightBox: content.highlightBox || content.highlight_box || null,
  };
}

export default function CourseSlides() {
  const router = useRouter();
  const { slug } = router.query;

  const [slides, setSlides] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getSlides(slug)
      .then((data) => {
        const slideArray = Array.isArray(data) ? data : data.results || data.slides || [];
        if (slideArray.length > 0) {
          const transformed = slideArray.map(transformApiSlide);
          setSlides(transformed);
        } else {
          setSlides(staticSlides);
        }
      })
      .catch(() => {
        setSlides(staticSlides);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const total = slides ? slides.length : 0;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  useEffect(() => {
    if (!slides) return;
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
  }, [next, prev, slides]);

  if (loading || !slides) {
    return (
      <>
        <Head>
          <title>Loading Slides... — Scwripts</title>
        </Head>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#94a3b8',
          fontSize: '1.2rem',
        }}>
          Loading slides...
        </div>
      </>
    );
  }

  const progress = ((current + 1) / total) * 100;

  return (
    <>
      <Head>
        <title>Slides — Scwripts</title>
      </Head>

      {slug && <EngagementTracker courseSlug={slug} />}

      <div className={s.progressBar} style={{ width: `${progress}%` }} />

      <Link href={`/courses/${slug}`} className={s.backLink}>
        &larr; Back to Course
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
