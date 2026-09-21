import React from "react";

export const FallbackIllustration: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, rgba(255,248,235,0.9) 0%, rgba(250,225,162,0.6) 100%)",
        borderRadius: "24px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        style={{ width: "160px", height: "160px", filter: "drop-shadow(0 8px 16px rgba(120,60,15,0.15))" }}
      >
        {/* Tallos agrupados */}
        <path d="M 95 180 Q 98 130 96 90" stroke="#526F3B" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 105 180 Q 102 130 104 90" stroke="#526F3B" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 100 180 Q 88 135 70 100" stroke="#526F3B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M 100 180 Q 112 135 130 100" stroke="#526F3B" strokeWidth="4.5" fill="none" strokeLinecap="round" />

        {/* Lazo */}
        <circle cx="100" cy="155" r="8" fill="#F4B8C5" />
        <ellipse cx="88" cy="153" rx="10" ry="6" fill="#F4B8C5" transform="rotate(-15 88 153)" />
        <ellipse cx="112" cy="153" rx="10" ry="6" fill="#F4B8C5" transform="rotate(15 112 153)" />

        {/* Flor izquierda */}
        <g transform="translate(68, 95) scale(0.7)">
          <circle cx="0" cy="0" r="14" fill="#D97706" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-24"
              rx="9"
              ry="16"
              fill="#FFD53D"
              transform={`rotate(${angle} 0 0)`}
            />
          ))}
          <circle cx="0" cy="0" r="12" fill="#E07818" />
        </g>

        {/* Flor derecha */}
        <g transform="translate(132, 95) scale(0.7)">
          <circle cx="0" cy="0" r="14" fill="#D97706" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-24"
              rx="9"
              ry="16"
              fill="#FFD53D"
              transform={`rotate(${angle} 0 0)`}
            />
          ))}
          <circle cx="0" cy="0" r="12" fill="#E07818" />
        </g>

        {/* Flor central (dominante) */}
        <g transform="translate(100, 75)">
          <circle cx="0" cy="0" r="18" fill="#D97706" />
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-30"
              rx="11"
              ry="20"
              fill="#FFD53D"
              transform={`rotate(${angle} 0 0)`}
            />
          ))}
          <circle cx="0" cy="0" r="16" fill="#E07818" />
        </g>
      </svg>
      <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "#5e3b22", fontFamily: "var(--font-serif)" }}>
        Flores amarillas para ti
      </p>
    </div>
  );
};
