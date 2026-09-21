import React, { useState } from "react";
import { COUPLE_PHOTO_URL, COUPLE_PHOTO_ALT, TEXTS } from "../config/photoConfig";

interface CouplePhotoProps {
  isThumbnail?: boolean;
}

export const CouplePhoto: React.FC<CouplePhotoProps> = ({ isThumbnail = false }) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // Modo miniatura para el botón del dock inferior
  if (isThumbnail) {
    return (
      <div className="mini-photo-container">
        {!imageError ? (
          <img
            src={COUPLE_PHOTO_URL}
            alt={COUPLE_PHOTO_ALT}
            className="mini-photo-image"
            onError={() => setImageError(true)}
            loading="eager"
          />
        ) : (
          <div className="mini-photo-placeholder" aria-label="Miniatura de foto">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  // Modo protagonista grande
  return (
    <div className="photo-hero-card">
      {!imageError ? (
        <img
          src={COUPLE_PHOTO_URL}
          alt={COUPLE_PHOTO_ALT}
          className="photo-hero-image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="photo-placeholder">
          <svg
            className="photo-placeholder-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="4" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <p className="photo-placeholder-text">{TEXTS.placeholderText}</p>
          <span className="photo-placeholder-subtext">
            Guarda tu foto en <code>public/images/ainoayyo.jpg</code>
          </span>
        </div>
      )}
    </div>
  );
};
