import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedEventLoopProps extends BaseCsObjectProps {
  runtime?: "Node.js" | "V8 Engine" | "Browser";
  macrotaskCount?: number;
}

/**
 * Production-grade Animated Asynchronous Event Loop.
 * Renders the circular execution cycle (Timers -> I/O Polling -> Check/SetImmediate -> Microtasks)
 * with an orbital execution head and incoming event queue buffer.
 */
export const AnimatedEventLoop: React.FC<AnimatedEventLoopProps> = ({
  theme,
  state = "active",
  label = "Async Event Loop",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  runtime = "V8 / libuv",
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#06B6D4";
  const success = theme?.colors?.success ?? "#10B981";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Continuous orbital rotation angle (360 deg)
  const orbitAngle = (frame * (isBusy ? 5 : 1.5)) % 360;

  const width = 380;
  const height = 300;

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
              {runtime}
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
                background: isBusy ? success : "#64748B",
                boxShadow: `0 0 6px ${isBusy ? success : "#64748B"}`,
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
              {metric ?? "Non-Blocking I/O"}
            </span>
          </div>
        </div>
      )}

      {/* Main SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 380 300"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 28px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="eventLoopChassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <filter id="loopGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="10"
          y="10"
          width="360"
          height="280"
          rx="14"
          fill="url(#eventLoopChassis)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Circular Orbital Track */}
        <g transform="translate(190, 150)">
          {/* Outer Guide Ring */}
          <circle cx="0" cy="0" r="88" fill="none" stroke="#1E293B" strokeWidth="18" />
          <circle cx="0" cy="0" r="88" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 4" />

          {/* 4 Loop Phases (Timers, I/O Poll, Check, Microtask) */}
          {[
            { angle: 0, label: "POLL (I/O)", color: "#38BDF8" },
            { angle: 90, label: "CHECK", color: "#A855F7" },
            { angle: 180, label: "CLOSE", color: "#F43F5E" },
            { angle: 270, label: "TIMERS", color: "#FBBF24" },
          ].map((phase, i) => {
            const rad = (phase.angle * Math.PI) / 180;
            const px = Math.cos(rad) * 88;
            const py = Math.sin(rad) * 88;
            return (
              <g key={i} transform={`translate(${px}, ${py})`}>
                <circle cx="0" cy="0" r="14" fill="#090D16" stroke={phase.color} strokeWidth="2" />
                <circle cx="0" cy="0" r="5" fill={phase.color} />
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {phase.label}
                </text>
              </g>
            );
          })}

          {/* Orbiting Execution Needle / Photon Head */}
          <g transform={`rotate(${orbitAngle}, 0, 0)`}>
            <circle cx="88" cy="0" r="7" fill={accent} filter="url(#loopGlow)" />
            <circle cx="88" cy="0" r="3" fill="#FFFFFF" />
          </g>

          {/* Central Call Stack Core Hub */}
          <circle cx="0" cy="0" r="44" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
          <text x="0" y="-8" textAnchor="middle" fill="#CDD6F4" fontSize="9" fontFamily="monospace" fontWeight="bold">
            CALL STACK
          </text>
          <text x="0" y="8" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace">
            EXECUTING
          </text>
          <text x="0" y="20" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="monospace">
            microtask: 0
          </text>
        </g>
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

