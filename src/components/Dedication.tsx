import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEXTS } from "../config/photoConfig";

interface DedicationProps {
  isPhotoActive: boolean;
}

export const Dedication: React.FC<DedicationProps> = ({ isPhotoActive }) => {
  const currentText = isPhotoActive
    ? TEXTS.dedicationPhoto
    : TEXTS.dedicationBouquet;

  return (
    <section className="dedication-section" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.p
          key={isPhotoActive ? "photo-text" : "bouquet-text"}
          className="dedication-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
        >
          “{currentText}”
        </motion.p>
      </AnimatePresence>

      <span className="signature-text">{TEXTS.signature}</span>
    </section>
  );
};
