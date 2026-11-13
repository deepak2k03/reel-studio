import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedSecurityLockProps extends BaseCsObjectProps {
  algorithm?: "AES-256" | "TLS 1.3" | "Mutex Lock" | "RSA-4096";
  isLocked?: boolean;
}

/**
 * Production-grade Animated Cryptographic Cipher & Mutex Padlock.
 * Renders hardened steel shackle, mechanical locking tumblers, rotating cipher rings,
 * and key exchange validation aura.
 */
export const AnimatedSecurityLock: React.FC<AnimatedSecurityLockProps> = ({
  theme,
  state = "active",
  label = "Cryptographic Mutex",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  algorithm = "TLS 1.3 / AES-GCM",
  isLocked = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#EAB308"; // Gold for security/keys
  const success = theme?.colors?.success ?? "#10B981";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Rotating cipher ring angle
  const cipherAngle = (frame * (isBusy ? 4 : 1)) % 360;

  const width = 360;
  const height = 280;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {/* Header */}
      {(label || metric) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: width,
            marginBottom: 8,
            padding: "0 6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontFamily: theme?.typography?.displayFont ?? "system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: theme?.colors?.text ?? "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: theme?.typography?.monoFont ?? "monospace",
                fontSize: 12,
                color: accent,
                background: `${accent}20`,
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              {algorithm}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(15, 23, 42, 0.75)",
              border: `1px solid ${accent}33`,
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isLocked ? accent : success,
                boxShadow: `0 0 6px ${isLocked ? accent : success}`,
              }}
            />
            <span
              style={{
                fontFamily: theme?.typography?.monoFont ?? "monospace",
                fontSize: 11,
                fontWeight: 700,
                color: isDark ? "#E2E8F0" : "#0F172A",
              }}
            >
              {metric ?? (isLocked ? "LOCKED (SYNC)" : "ACQUIRED")}
            </span>
          </div>
        </div>
      )}

      {/* Main SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 280"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 28px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="lockBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#713F12" />
            <stop offset="30%" stopColor="#A16207" />
            <stop offset="70%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>

          <linearGradient id="shackleMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Hardened Steel Arch Shackle */}
        <path
          d="M 120 120 V 70 C 120 30, 240 30, 240 70 V 120"
          fill="none"
          stroke="url(#shackleMetal)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Heavy Brass / Titanium Padlock Body (200x140) */}
        <rect
          x="80"
          y="110"
          width="200"
          height="140"
          rx="18"
          fill="url(#lockBody)"
          stroke="#FEF08A"
          strokeWidth="2"
        />

        {/* Rotating Cryptographic Cipher Ring in Center */}
        <g transform="translate(180, 175)">
          <circle cx="0" cy="0" r="34" fill="#090D16" stroke="#FEF08A" strokeWidth="2" />

          {/* Tumbler Teeth (Rotate) */}
          <g transform={`rotate(${cipherAngle}, 0, 0)`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="0"
                y1="22"
                x2="0"
                y2="30"
                stroke="#FACC15"
                strokeWidth="2"
                transform={`rotate(${deg}, 0, 0)`}
              />
            ))}
          </g>

          {/* Keyhole */}
          <circle cx="0" cy="-4" r="8" fill="#1E293B" />
          <polygon points="-5,-4 5,-4 3,14 -3,14" fill="#1E293B" />
        </g>

        {/* Security Specs Stencil */}
        <text x="180" y="238" textAnchor="middle" fill="#FEF08A" fontSize="8" fontFamily="monospace" fontWeight="bold">
          256-BIT ATOMIC MUTEX
        </text>
      </svg>

      {/* Annotation */}
      {annotation && (
        <div
          style={{
            marginTop: 8,
            padding: "4px 12px",
            background: "rgba(15, 23, 42, 0.8)",
            border: `1px solid ${accent}44`,
            borderRadius: 6,
            fontFamily: theme?.typography?.monoFont ?? "monospace",
            fontSize: 12,
            color: accent,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
          {annotation}
        </div>
      )}
    </div>
  );
};

