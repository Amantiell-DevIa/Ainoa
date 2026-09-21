import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEXTS } from "../config/photoConfig";

interface InteractionHintProps {
  showSwipeHint: boolean;
}

export const InteractionHint: React.FC<InteractionHintProps> = ({
  showSwipeHint,
}) => {
  return (
    <AnimatePresence>
      {showSwipeHint && (
        <motion.div
          className="swipe-hint"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.85, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
          role="status"
          aria-live="polite"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span>{TEXTS.hintBouquetSwipe}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
