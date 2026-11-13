import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedLoadBalancerProps extends BaseCsObjectProps {
  algorithm?: "Round Robin" | "Least Connections" | "Consistent Hashing";
  workerCount?: number;
  requestsPerSec?: number;
}

/**
 * Production-grade Animated Reverse Proxy & Load Balancer.
 * Renders an incoming request ingress conduit, rotating round-robin distributor rotor,
 * and deterministic packet distribution across backend worker nodes.
 */
export const AnimatedLoadBalancer: React.FC<AnimatedLoadBalancerProps> = ({
  theme,
  state = "active",
  label = "Load Balancer",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  algorithm = "Round Robin",
  workerCount = 3,
  requestsPerSec = 45000,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#38BDF8";
  const success = theme?.colors?.success ?? "#34D399";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Rotating distribution rotor angle
  const rotorAngle = (frame * (isBusy ? 6 : 1.5)) % 360;

  // Active target worker index (cycles 0 -> 1 -> 2)
  const targetWorker = Math.floor(frame / 16) % workerCount;

  const width = 420;
  const height = 240;

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
      {/* Top Header */}
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
              {metric ?? `${(requestsPerSec / 1000).toFixed(0)}k RPS`}
            </span>
          </div>
        </div>
      )}

      {/* Main Load Balancer Diagram */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 420 240"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 28px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="lbChassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <filter id="lbGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Balancer Housing */}
        <rect
          x="10"
          y="10"
          width="400"
          height="220"
          rx="14"
          fill="url(#lbChassis)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Ingress Pipeline (Left) */}
        <g transform="translate(24, 110)">
          <rect x="0" y="-14" width="70" height="28" rx="6" fill="#090D16" stroke="#475569" strokeWidth="1" />
          <text x="35" y="4" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            INGRESS
          </text>
          {/* Moving ingress packets */}
          {isBusy && (
            <circle
              cx={interpolate(frame % 30, [0, 30], [5, 65])}
              cy="0"
              r="4"
              fill={accent}
              filter="url(#lbGlow)"
            />
          )}
        </g>

        {/* Central Rotating Distribution Core (Ingress -> Rotor) */}
        <line x1="94" y1="110" x2="150" y2="110" stroke="#334155" strokeWidth="3" strokeDasharray="4 3" />

        <g transform="translate(180, 110)">
          {/* Outer Stator Ring */}
          <circle cx="0" cy="0" r="38" fill="#090D16" stroke="#475569" strokeWidth="2" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />

          {/* Rotating Selector Needle / Rotor */}
          <g transform={`rotate(${rotorAngle}, 0, 0)`}>
            <line x1="0" y1="0" x2="26" y2="0" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="26" cy="0" r="5" fill={accent} filter="url(#lbGlow)" />
          </g>

          {/* Central Bearing */}
          <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#E2E8F0" />
        </g>

        {/* Distribution Channels to 3 Backend Nodes */}
        {[0, 1, 2].map((idx) => {
          const targetY = 50 + idx * 60;
          const isSelected = idx === targetWorker && isBusy;

          return (
            <g key={idx}>
              {/* Connector Conduit Line from Rotor to Worker */}
              <path
                d={`M 218 110 C 250 110, 260 ${targetY}, 290 ${targetY}`}
                fill="none"
                stroke={isSelected ? accent : "#334155"}
                strokeWidth={isSelected ? 2.5 : 1.2}
                strokeDasharray={isSelected ? "6 3" : undefined}
              />

              {/* Backend Target Node Chassis */}
              <g transform={`translate(290, ${targetY - 20})`}>
                <rect
                  x="0"
                  y="0"
                  width="104"
                  height="40"
                  rx="6"
                  fill={isSelected ? "rgba(56, 189, 248, 0.15)" : "#090D16"}
                  stroke={isSelected ? accent : "#334155"}
                  strokeWidth="1.5"
                />
                <circle
                  cx="12"
                  cy="20"
                  r="4"
                  fill={isSelected ? success : "#475569"}
                  filter={isSelected ? "url(#lbGlow)" : "none"}
                />
                <text
                  x="24"
                  y="18"
                  fill="#E2E8F0"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  NODE #{idx + 1}
                </text>
                <text
                  x="24"
                  y="30"
                  fill={isSelected ? accent : "#64748B"}
                  fontSize="7.5"
                  fontFamily="monospace"
                >
                  {isSelected ? "HANDLING REQ" : "HEALTHY (UP)"}
                </text>
              </g>
            </g>
          );
        })}
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
