import React, { useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Bouquet } from "./Bouquet";
import { FallbackIllustration } from "./FallbackIllustration";

interface SceneProps {
  onFirstInteraction?: () => void;
  isPausedExternal?: boolean;
  onTogglePause?: () => void;
}

export const Scene: React.FC<SceneProps> = ({
  onFirstInteraction,
  isPausedExternal = false,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasInteractedRef = useRef<boolean>(false);

  // Comprobar soporte WebGL
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Comprobar preferencia de movimiento reducido
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Pausar render cuando la pestaña no está visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Manejo de interacción de usuario (toque vs arrastre)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const dist = Math.hypot(
        e.clientX - pointerStartPos.current.x,
        e.clientY - pointerStartPos.current.y
      );

      if (dist > 5 && !isInteracting) {
        setIsInteracting(true);
        if (!hasInteractedRef.current) {
          hasInteractedRef.current = true;
          onFirstInteraction?.();
        }
      }
    },
    [isInteracting, onFirstInteraction]
  );

  const handlePointerUp = useCallback(() => {
    if (isInteracting) {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 3000);
    }
  }, [isInteracting]);

  // Controles por teclado para accesibilidad (flechas izquierda/derecha)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!controlsRef.current) return;
      if (e.key === "ArrowLeft") {
        controlsRef.current.setAzimuthalAngle(
          controlsRef.current.getAzimuthalAngle() - 0.15
        );
        controlsRef.current.update();
        onFirstInteraction?.();
      } else if (e.key === "ArrowRight") {
        controlsRef.current.setAzimuthalAngle(
          controlsRef.current.getAzimuthalAngle() + 0.15
        );
        controlsRef.current.update();
        onFirstInteraction?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFirstInteraction]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  if (!hasWebGL) {
    return <FallbackIllustration />;
  }

  const isPaused = isPausedExternal || prefersReducedMotion || !isTabVisible;

  return (
    <div
      className="bouquet-canvas-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-label="Ramo de flores amarillas interactivo en 3D. Usa el ratón, pantalla táctil o flechas del teclado para explorar."
      tabIndex={0}
    >
      <Canvas
        camera={{
          // Cámara con encuadre de seguridad del 45% libre para imposibilitar matemáticamente cualquier recorte
          position: [0, 0.95, 3.6],
          fov: 46,
        }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 1.8)]}
        frameloop={isTabVisible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Iluminación cálida y suave de ilustración mate */}
        <ambientLight intensity={1.4} color="#FFF5E4" />

        {/* Luz principal cálida */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.9}
          color="#FFF8ED"
          castShadow={false}
        />

        {/* Luz de relleno suave */}
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.9}
          color="#FCE6C4"
        />

        {/* Rim light superior/trasero para perfilar pétalos */}
        <directionalLight
          position={[0, 4, -4]}
          intensity={1.1}
          color="#FFEAA7"
        />

        {/* El ramo de flores tridimensional perfectamente centrado en [0, 0, 0] */}
        <Bouquet
          isInteracting={isInteracting}
          isPaused={isPaused}
          autoRotateSpeed={(Math.PI * 2) / 38}
        />

        {/* OrbitControls anclado al centro geométrico exacto [0, 0, 0] */}
        <OrbitControls
          ref={controlsRef}
          target={[0, 0, 0]}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3.2} // ~56 grados (impide vistas cenitales que acerquen los pétalos al borde)
          maxPolarAngle={Math.PI / 2.2} // ~81 grados (impide vistas desde abajo)
          rotateSpeed={0.8}
          dampingFactor={0.08}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
};
