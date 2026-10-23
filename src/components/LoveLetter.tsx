import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import "./LoveLetter.css";

const LETTER_PARAGRAPHS = [
  "Querida Ainoa,",
  "Dicen que tres meses es poco tiempo, pero la verdad es que la intensidad de lo que siento no entiende de calendarios. Mirando hacia atrás, no me cabe duda de que enviar ese primer mensaje fue la mejor decisión que pude tomar en mi vida; ese pequeño paso cambió mi camino por completo.",
  "Desde entonces, a pesar del poco tiempo, hemos construido una conexión verdaderamente única. Hay un momento que se me quedó grabado para siempre en el corazón: el día que te vi corriendo hacia mí. Verte llegar así marcó un antes y un después en mi vida, una de esas imágenes que no se borran jamás.",
  "Aunque la distancia a veces intente interponerse, la verdad es que nunca estás lejos, porque te llevo presente en mis pensamientos a cada segundo del día. Y cuando pienso en ti, no puedo evitar sonreír recordando cada detalle tuyo: tus ojos color café que me transmiten tanto, tu cabello negro y la dulzura de tu rostro que me tiene completamente fascinado.",
  "Gracias por estos tres meses tan especiales, por aparecer en mi vida y por hacerme sentir tan afortunado. Esto apenas empieza, pero ya te has vuelto indispensable para mí.",
  "Como escribió alguna vez Antoine de Saint-Exupéry:",
  "«El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección.»",
  "Y no importa los kilómetros que haya en medio, sé que hoy miramos hacia el mismo lugar.",
];

const PARAGRAPH_OFFSETS = LETTER_PARAGRAPHS.map((_, index) =>
  LETTER_PARAGRAPHS.slice(0, index).reduce((sum, paragraph) => sum + paragraph.length, 0),
);
const LETTER_LENGTH = LETTER_PARAGRAPHS.reduce((sum, paragraph) => sum + paragraph.length, 0);

const SPARKLES = Array.from({ length: 22 }, (_, index) => ({
  left: `${((index * 37 + 11) % 97) + 1}%`,
  duration: `${12 + ((index * 7) % 14)}s`,
  delay: `${-((index * 3.7) % 25)}s`,
  size: `${index % 4 === 0 ? 6 : index % 3 === 0 ? 4 : 2}px`,
  drift: `${(index % 2 === 0 ? 1 : -1) * (16 + (index % 5) * 9)}px`,
}));

/** Small inline vectors keep the frame crisp at every screen size. */
function BotanicalCorner({ position }: { position: string }) {
  return (
    <svg
      className={`letter-botanical letter-botanical--${position}`}
      viewBox="0 0 180 205"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 194C38 167 14 123 27 87C36 59 66 48 92 48C126 48 144 26 166 16" strokeWidth="1.4" />
        <path d="M18 185C47 158 35 126 39 97C43 74 62 60 83 62C101 65 104 86 89 90C78 93 72 81 80 76" strokeWidth="2.3" />
        <path d="M27 99C9 74 21 38 49 27C69 19 91 25 98 40C106 60 91 73 78 69C66 65 68 49 78 48C84 47 88 52 87 57" strokeWidth="2" />
        <path d="M40 41C47 28 67 27 74 36" strokeWidth=".9" />
        <path d="M55 55C43 47 42 32 47 17C56 29 60 42 55 55Z" fill="currentColor" fillOpacity=".72" strokeWidth=".6" />
        <path d="M40 66C26 59 23 44 25 32C38 40 45 52 40 66Z" fill="currentColor" fillOpacity=".8" strokeWidth=".6" />
        <path d="M39 117C50 104 63 101 73 104C65 117 53 123 39 117Z" fill="currentColor" fillOpacity=".76" strokeWidth=".6" />
        <path d="M31 143C14 135 11 119 15 106C27 117 34 130 31 143Z" fill="currentColor" fillOpacity=".65" strokeWidth=".6" />
        <path d="M33 162C45 147 60 145 71 148C63 161 48 169 33 162Z" fill="currentColor" fillOpacity=".7" strokeWidth=".6" />
        <path d="M101 47C105 30 118 18 131 17C128 33 116 44 101 47Z" fill="currentColor" fillOpacity=".65" strokeWidth=".6" />
        <path d="M126 40C142 43 152 36 159 26C144 22 131 26 126 40Z" fill="currentColor" fillOpacity=".75" strokeWidth=".6" />
        <path d="M49 151C57 136 58 125 53 116M116 38C117 25 124 16 135 12M25 85C17 81 11 80 7 82" strokeWidth=".8" />
      </g>
      <g fill="#b5a269">
        <path d="m119 66 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
        <path d="m17 19 1.6 4.7L23 25l-4.4 1.4L17 31l-1.4-4.6L11 25l4.6-1.3Z" />
        <path d="m68 179 1.4 4.3 4.6 1.4-4.6 1.3L68 190l-1.3-4.1-4.7-1.3 4.7-1.4Z" />
        <circle cx="13" cy="55" r="1.8" /><circle cx="17" cy="63" r="1.2" />
        <circle cx="112" cy="16" r="1.5" /><circle cx="120" cy="11" r="1" />
        <circle cx="49" cy="180" r="1.5" /><circle cx="46" cy="188" r="1" />
        <circle cx="140" cy="60" r="1.4" />
      </g>
    </svg>
  );
}

function Constellation() {
  return (
    <svg className="letter-constellation" viewBox="0 0 220 110" fill="none" aria-hidden="true" focusable="false">
      <path d="m26 71 39-28 34 18 42-36 38 22" stroke="currentColor" strokeWidth=".65" opacity=".5" />
      {[ [26, 71], [65, 43], [99, 61], [141, 25], [179, 47] ].map(([cx, cy]) => (
        <path key={`${cx}-${cy}`} d={`M${cx} ${cy - 3.5}l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9Z`} fill="currentColor" />
      ))}
      <path d="M186 78a13 13 0 0 1-15-17 14 14 0 1 0 15 17Z" fill="currentColor" opacity=".8" />
      <circle cx="45" cy="23" r=".9" fill="currentColor" /><circle cx="112" cy="88" r="1.3" fill="currentColor" />
      <circle cx="204" cy="27" r="1.2" fill="currentColor" /><circle cx="150" cy="92" r=".8" fill="currentColor" />
    </svg>
  );
}

export function LoveLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const revealedRef = useRef(0);
  const [revealed, setRevealed] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const visibleCharacters = reducedMotion ? LETTER_LENGTH : revealed;
  const complete = visibleCharacters >= LETTER_LENGTH;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => {
        setIsInView(true);
        setHasStarted(true);
      });
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    const headingObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasStarted(true);
        headingObserver.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(section);
    if (headingRef.current) headingObserver.observe(headingRef.current);
    return () => {
      observer.disconnect();
      headingObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => {
        revealedRef.current = LETTER_LENGTH;
        setRevealed(LETTER_LENGTH);
      });
      return () => cancelAnimationFrame(frame);
    }
    if (!hasStarted || !isInView || !pageVisible || animationsPaused || revealedRef.current >= LETTER_LENGTH) return;

    let frame = 0;
    let lastTime = performance.now();
    let progress = revealedRef.current;
    const tick = (time: number) => {
      // Cap the elapsed step so suspended browser frames never skip the letter.
      progress = Math.min(LETTER_LENGTH, progress + Math.min(time - lastTime, 80) * 0.082);
      lastTime = time;
      const next = Math.floor(progress);
      if (next > revealedRef.current) {
        revealedRef.current = next;
        setRevealed(next);
      }
      if (progress < LETTER_LENGTH && revealedRef.current < LETTER_LENGTH) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, isInView, pageVisible, reducedMotion, animationsPaused]);

  const finishLetter = () => {
    revealedRef.current = LETTER_LENGTH;
    setRevealed(LETTER_LENGTH);
  };

  return (
    <section
      id="carta"
      tabIndex={-1}
      ref={sectionRef}
      className="love-letter-section"
      aria-labelledby="love-letter-title"
      data-started={hasStarted || reducedMotion ? "true" : "false"}
      data-animated={isInView && pageVisible && !reducedMotion && !animationsPaused ? "true" : "false"}
    >
      <div className="letter-falling-stars" aria-hidden="true">
        {SPARKLES.map((sparkle, index) => (
          <span key={index} className={`letter-sparkle${index % 4 === 0 ? " letter-sparkle--cross" : ""}`} style={{
            "--sparkle-left": sparkle.left,
            "--sparkle-duration": sparkle.duration,
            "--sparkle-delay": sparkle.delay,
            "--sparkle-size": sparkle.size,
            "--sparkle-drift": sparkle.drift,
          } as CSSProperties} />
        ))}
      </div>

      <header className="love-letter-heading" ref={headingRef}>
        <span className="letter-eyebrow">Un pedacito de mi corazón</span>
        <h2 id="love-letter-title">Feliz 3 meses <em>Amor</em></h2>
        <div className="letter-heading-rule" aria-hidden="true"><span />✦<span /></div>
        <div className="letter-reading-controls" data-complete={complete ? "true" : "false"}>
          <button type="button" className="letter-read-button" onClick={finishLetter} disabled={complete} tabIndex={complete ? -1 : 0} aria-hidden={complete ? true : undefined}>
            Leer carta completa <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            className="letter-motion-button"
            onClick={() => setAnimationsPaused((paused) => !paused)}
            aria-label={animationsPaused ? "Reanudar animaciones de la carta" : "Pausar animaciones de la carta"}
            aria-pressed={animationsPaused}
            title={animationsPaused ? "Reanudar animaciones" : "Pausar animaciones"}
            disabled={Boolean(reducedMotion)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {animationsPaused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M8 5v14M16 5v14" />}
            </svg>
          </button>
        </div>
      </header>

      <article className="love-letter-paper" aria-label="Carta para Ainoa">
        <div className="letter-frame" aria-hidden="true" />
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />
        <Constellation />

        {/* A single complete accessible copy avoids announcing every typed character. */}
        <div className="love-letter-sr-only">
          {LETTER_PARAGRAPHS.map((paragraph, index) => (
            index === 6 ? <blockquote key={index}>{paragraph}</blockquote> : <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="letter-visual-copy" aria-hidden="true">
          {LETTER_PARAGRAPHS.map((paragraph, index) => {
            const visibleLength = Math.max(0, Math.min(paragraph.length, visibleCharacters - PARAGRAPH_OFFSETS[index]));
            const isCurrent = visibleLength > 0 && visibleLength < paragraph.length;
            const className = [
              "letter-paragraph",
              index === 0 ? "letter-salutation" : "",
              index === 5 ? "letter-quote-intro" : "",
              index === 6 ? "letter-quotation" : "",
              index === 7 ? "letter-closing" : "",
            ].filter(Boolean).join(" ");
            return (
              <p className={className} key={index}>
                <span className={isCurrent ? "letter-ink letter-ink--writing" : "letter-ink"}>{paragraph.slice(0, visibleLength)}</span>
                <span className="letter-unwritten">{paragraph.slice(visibleLength)}</span>
              </p>
            );
          })}
          <div className={`letter-endmark${complete ? " letter-endmark--visible" : ""}`}>♡</div>
        </div>

      </article>

      <p className="letter-final-note">Siempre, hacia el mismo lugar.</p>
    </section>
  );
}
