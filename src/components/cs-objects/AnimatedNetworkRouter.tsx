import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedNetworkRouterProps extends BaseCsObjectProps {
  portCount?: number;
  throughputGbps?: number;
  isWireless?: boolean;
  routingProtocol?: string; // "BGP", "OSPF", "NAT / CIDR"
  queueDepth?: number;
}

/**
 * Production-grade Animated Enterprise Router / Core Switch.
 * Renders rackmount chassis with RJ45 10GbE patch ports, SFP+ optical fiber cages,
 * live FIFO packet routing queue buffer, and deterministic Wi-Fi / antenna wave emissions.
 */
export const AnimatedNetworkRouter: React.FC<AnimatedNetworkRouterProps> = ({
  theme,
  state = "active",
  label = "Core Gateway Router",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  portCount = 8,
  throughputGbps = 10,
  isWireless = false,
  routingProtocol = "BGP / NAT",
  queueDepth = 5,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#10B981"; // router emerald/green
  const linkGreen = "#22C55E";
  const danger = theme?.colors?.danger ?? "#FB7185";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Wi-Fi wave propagation phase
  const wavePhase = (frame * 0.15) % 1;

  // Packet FIFO buffer shifting
  const packetPos = (frame * 4) % 120;

  const width = 420;
  const height = 150;

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
      {/* Top Header Label */}
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
                background: `${accent}1A`,
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              {routingProtocol}
            </span>
            {sublabel && (
              <span
                style={{
                  fontFamily: theme?.typography?.monoFont ?? "monospace",
                  fontSize: 12,
                  color: theme?.colors?.muted ?? "#94A3B8",
                }}
              >
                {sublabel}
              </span>
            )}
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
                background: isBusy ? linkGreen : "#64748B",
                boxShadow: `0 0 6px ${linkGreen}`,
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
              {metric ?? `${throughputGbps} Gbps • 0% DROP`}
            </span>
          </div>
        </div>
      )}

      {/* Main Router Chassis SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 420 150"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 24px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="routerChassis" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <filter id="routerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rackmount Ears Left & Right */}
        <rect x="2" y="30" width="18" height="90" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <circle cx="11" cy="45" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1" />
        <circle cx="11" cy="105" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1" />

        <rect x="400" y="30" width="18" height="90" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <circle cx="409" cy="45" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1" />
        <circle cx="409" cy="105" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1" />

        {/* Main 1U Router Chassis Body */}
        <rect
          x="20"
          y="25"
          width="380"
          height="100"
          rx="6"
          fill="url(#routerChassis)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Hex Cooling Grille (Left Side) */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={36 + col * 9}
              cy={45 + row * 12}
              r="2.2"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="0.8"
            />
          ))
        )}

        {/* 8x RJ45 Ethernet Patch Ports */}
        {Array.from({ length: portCount }).map((_, i) => {
          const px = 100 + i * 28;
          // Deterministic link & activity blink
          const linkActive = true;
          const rxBlink = isBusy && (Math.sin(frame * 0.4 + i * 1.5) > 0.1);

          return (
            <g key={i} transform={`translate(${px}, 42)`}>
              {/* Port Socket Housing */}
              <rect x="0" y="0" width="22" height="28" rx="2" fill="#090D16" stroke="#475569" strokeWidth="1" />
              {/* RJ45 Key Cutout */}
              <rect x="4" y="16" width="14" height="10" rx="1" fill="#1E293B" />
              {/* 8 Gold Pin Terminals */}
              <line x1="6" y1="2" x2="16" y2="2" stroke="#FBBF24" strokeWidth="1" strokeDasharray="1.2 0.8" />

              {/* Top Left Link LED (Solid Green) */}
              <circle cx="5" cy="-5" r="1.8" fill={linkActive ? linkGreen : "#334155"} />
              {/* Top Right Activity LED (Blinking Cyan) */}
              <circle
                cx="17"
                cy="-5"
                r="1.8"
                fill={rxBlink ? "#38BDF8" : "#1E293B"}
                filter={rxBlink ? "url(#routerGlow)" : "none"}
              />
            </g>
          );
        })}

        {/* 2x SFP+ 10GbE Optical Transceiver Cages (Right Side) */}
        {[332, 362].map((sx, i) => (
          <g key={i} transform={`translate(${sx}, 40)`}>
            <rect x="0" y="0" width="24" height="32" rx="2" fill="#0B132B" stroke="#64748B" strokeWidth="1.2" />
            <rect x="4" y="6" width="16" height="20" rx="1" fill="#1C2541" />
            {/* Duplex LC optical apertures */}
            <circle cx="8" cy="16" r="3" fill="#0F172A" stroke="#00F0FF" strokeWidth="1" />
            <circle cx="16" cy="16" r="3" fill="#0F172A" stroke="#00F0FF" strokeWidth="1" />
            <text x="12" y="-4" textAnchor="middle" fill="#94A3B8" fontSize="6" fontFamily="monospace">
              10G-SFP
            </text>
          </g>
        ))}

        {/* Real-Time FIFO Packet Buffer Queue Bar (Chassis Lower Strip) */}
        <g transform="translate(36, 88)">
          <rect x="0" y="0" width="348" height="24" rx="4" fill="#090D16" stroke="#1E293B" strokeWidth="1" />
          <text x="8" y="15" fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">
            FIFO QUEUE:
          </text>

          {/* Traveling Packet Envelopes */}
          {[0, 1, 2, 3, 4].map((idx) => {
            const offset = (packetPos + idx * 60) % 270;
            return (
              <g key={idx} transform={`translate(${75 + offset}, 4)`}>
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="16"
                  rx="3"
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke={accent}
                  strokeWidth="1"
                />
                <text
                  x="22"
                  y="11"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="7"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {idx % 2 === 0 ? "IP:TCP" : "IP:UDP"}
                </text>
              </g>
            );
          })}
        </g>

        {/* Optional Wireless Wave Emissions */}
        {isWireless && (
          <g transform="translate(210, 15)">
            {[1, 2, 3].map((ring) => {
              const r = 12 + ring * 14 + wavePhase * 10;
              const op = Math.max(0, 1 - r / 55);
              return (
                <path
                  key={ring}
                  d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`}
                  fill="none"
                  stroke={accent}
                  strokeWidth="2"
                  opacity={op}
                />
              );
            })}
          </g>
        )}
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

