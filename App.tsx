import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { Dedication } from "./components/Dedication";
import { CouplePhoto } from "./components/CouplePhoto";
import { Scene } from "./components/Bouquet3D/Scene";
import { InteractionHint } from "./components/InteractionHint";
import { Controls } from "./components/Controls";
import { TEXTS } from "./config/photoConfig";

export const App: React.FC = () => {
  // Estado de protagonista: false = Ramo 3D, true = Foto de pareja
  const [isPhotoActive, setIsPhotoActive] = useState<boolean>(false);
  // Control de visibilidad del hint de deslizar
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  // Control de pausa del giro automático
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Ocultar hint de deslizar tras la primera interacción
  const handleFirstInteraction = useCallback(() => {
    setShowSwipeHint(false);
  }, []);

  // Alternar pausa/reanudación del giro
  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Alternar vista entre Ramo y Foto
  const handleSwapView = useCallback(() => {
    setIsPhotoActive((prev) => !prev);
    setShowSwipeHint(false);
  }, []);

  return (
    <main className="experience-container" role="main">
      {/* 1. Encabezado discreto */}
      <Header />

      {/* 2. Zona central protagonista con altura estable */}
      <section className="main-stage" aria-label="Espacio protagonista">
        <div className="hero-card">
          <AnimatePresence mode="wait">
            {!isPhotoActive ? (
              <motion.div
                key="bouquet-hero"
                className="hero-content"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
              >
                <Scene
                  onFirstInteraction={handleFirstInteraction}
                  isPausedExternal={isPaused}
                />
                <InteractionHint showSwipeHint={showSwipeHint} />
              </motion.div>
            ) : (
              <motion.div
                key="photo-hero"
                className="hero-content"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
              >
                <CouplePhoto isThumbnail={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Dedicatoria y firma - Totalmente libre de superposiciones */}
      <Dedication isPhotoActive={isPhotoActive} />

      {/* 4. Barra inferior de interacción simétrica y perfectamente equilibrada */}
      <footer className="bottom-dock">
        <button
          type="button"
          className="interactive-dock-btn"
          onClick={handleSwapView}
          aria-label={
            isPhotoActive
              ? "Volver a las flores amarillas en 3D"
              : "Ver nuestra foto de pareja juntos"
          }
        >
          {/* Miniatura en marco suave */}
          <div className="dock-thumbnail-box">
            <AnimatePresence mode="wait">
              {!isPhotoActive ? (
                <motion.div
                  key="thumb-photo"
                  className="dock-thumb-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CouplePhoto isThumbnail={true} />
                </motion.div>
              ) : (
                <motion.div
                  key="thumb-bouquet"
                  className="dock-thumb-inner dock-bouquet-mini"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-label="Miniatura de flores amarillas"
                >
                  <svg viewBox="0 0 40 40" width="32" height="32">
                    <circle cx="20" cy="20" r="4.5" fill="#D97706" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                      <ellipse
                        key={ang}
                        cx="20"
                        cy="11"
                        rx="3.5"
                        ry="6.5"
                        fill="#FFD53D"
                        transform={`rotate(${ang} 20 20)`}
                      />
                    ))}
                    <circle cx="20" cy="20" r="3.6" fill="#E07818" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Indicación de interacción */}
          <div className="dock-label-group">
            <span className="dock-label-text">
              <AnimatePresence mode="wait">
                <motion.span
                  key={isPhotoActive ? "back-text" : "photo-text"}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.28 }}
                >
                  {isPhotoActive ? TEXTS.hintBackToBouquet : TEXTS.hintPhotoTap}
                </motion.span>
              </AnimatePresence>
            </span>
            <svg
              className="dock-chevron"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </button>

        {/* 5. Control discreto de pausa para accesibilidad */}
        <Controls isPaused={isPaused} onTogglePause={handleTogglePause} />
      </footer>
    </main>
  );
};

export default App;
