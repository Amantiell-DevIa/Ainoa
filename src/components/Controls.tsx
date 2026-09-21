import React from "react";
import { Play, Pause } from "lucide-react";

interface ControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPaused,
  onTogglePause,
}) => {
  return (
    <div className="accessibility-bar" role="toolbar" aria-label="Controles de animación">
      <button
        type="button"
        className="icon-button"
        onClick={onTogglePause}
        aria-label={isPaused ? "Reanudar giro automático de las flores" : "Pausar giro automático de las flores"}
        title={isPaused ? "Reanudar giro automático" : "Pausar giro automático"}
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  );
};
