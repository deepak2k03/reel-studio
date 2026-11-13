import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedServerRackProps extends BaseCsObjectProps {
  units?: number; // 1, 2, or 3 stacked rack units
  driveCount?: number;
  cpuLoad?: number; // 0 to 100
  showDetails?: boolean;
}

/**
 * Production-grade Animated Enterprise Server Chassis.
 * Renders realistic rackmount hardware: hot-swap drive caddies, active blinking SAS LEDs,
 * RJ45 Ethernet link/activity lights, cooling fan exhaust slots, and live load metering.
 */
export const AnimatedServerRack: React.FC<AnimatedServerRackProps> = ({
  theme,
  state = "active",
  label = "Backend Server",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  units = 2,
  driveCount = 6,
  cpuLoad,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#249CE4";
  const success = theme?.colors?.success ?? "#34D399";
  const danger = theme?.colors?.danger ?? "#FB7185";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";
  const isError = state === "error";

  // Deterministic cooling fan spin
  const fanRotation = (frame * (isBusy ? 14 : 4)) % 360;

  // Real server width & height in SVG units
  const width = 440;
  const unitHeight = 72;
  const height = units * unitHeight + 36;

  // Active CPU load calculation if not explicitly provided
  const activeLoad =
    cpuLoad ??
    Math.round(
      interpolate(Math.sin(frame * 0.08), [-1, 1], [35, isBusy ? 88 : 18])
    );

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
      {/* Chassis Top Annotation / Label */}
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
            {sublabel && (
              <span
                style={{
                  fontFamily: theme?.typography?.monoFont ?? "monospace",
                  fontSize: 13,
                  color: theme?.colors?.muted ?? "#94A3B8",
                }}
              >
                {sublabel}
              </span>
            )}
          </div>

          {metric ? (
            <span
              style={{
                fontFamily: theme?.typography?.monoFont ?? "monospace",
                fontSize: 13,
                fontWeight: 800,
                color: isError ? danger : isBusy ? accent : success,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                padding: "2px 8px",
                borderRadius: 6,
              }}
            >
              {metric}
            </span>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isError ? danger : isBusy ? success : accent,
                  boxShadow: glow
                    ? `0 0 10px ${isError ? danger : isBusy ? success : accent}`
                    : "none",
                }}
              />
              <span
                style={{
                  fontFamily: theme?.typography?.monoFont ?? "monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: isError ? danger : success,
                  textTransform: "uppercase",
                }}
              >
                {isError ? "ERR" : isBusy ? "ONLINE // 10GbE" : "STANDBY"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Realistic 2U/4U Rackmount SVG Chassis */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          filter: glow
            ? `drop-shadow(0 14px 28px rgba(0,0,0,0.5)) drop-shadow(0 0 20px ${
                isError ? "rgba(251,113,133,0.3)" : "rgba(36,156,228,0.25)"
              })`
            : "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
        }}
      >
        <defs>
          {/* Brushed metal body gradient */}
          <linearGradient id="serverBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#252D3D" />
            <stop offset="30%" stopColor="#171F2E" />
            <stop offset="70%" stopColor="#111724" />
            <stop offset="100%" stopColor="#0B0F19" />
          </linearGradient>

          {/* Drive caddy brushed texture */}
          <linearGradient id="caddyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E2738" />
            <stop offset="100%" stopColor="#121824" />
          </linearGradient>

          {/* Rackmount ears metallic gradient */}
          <linearGradient id="rackEarGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Rackmount Ears (Left & Right Flanges with Hex Screws) */}
        {/* Left Ear */}
        <rect x="0" y="4" width="22" height={height - 8} rx="4" fill="url(#rackEarGrad)" stroke="#0F172A" strokeWidth="1" />
        <circle cx="11" cy="18" r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
        <circle cx="11" cy={height - 18} r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />

        {/* Right Ear */}
        <rect x={width - 22} y="4" width="22" height={height - 8} rx="4" fill="url(#rackEarGrad)" stroke="#0F172A" strokeWidth="1" />
        <circle cx={width - 11} cy="18" r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
        <circle cx={width - 11} cy={height - 18} r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />

        {/* Main Chassis Enclosure */}
        <rect
          x="22"
          y="2"
          width={width - 44}
          height={height - 4}
          rx="8"
          fill="url(#serverBodyGrad)"
          stroke={isError ? danger : accent}
          strokeWidth="1.5"
          strokeOpacity={isBusy ? 0.75 : 0.35}
        />

        {/* Render Each Unit Slot in the Rack */}
        {Array.from({ length: units }).map((_, uIdx) => {
          const uY = 8 + uIdx * unitHeight;
          const uW = width - 56;
          const uH = unitHeight - 8;

          return (
            <g key={`unit-${uIdx}`} transform={`translate(28, ${uY})`}>
              {/* Unit Bezel Border */}
              <rect
                x="0"
                y="0"
                width={uW}
                height={uH}
                rx="6"
                fill="#0F1523"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />

              {/* 1. Hot-swap Hard Drive Bays (Left section) */}
              {Array.from({ length: Math.min(4, driveCount) }).map((_, dIdx) => {
                const caddyW = 38;
                const caddyH = uH - 12;
                const caddyX = 8 + dIdx * (caddyW + 5);
                const caddyY = 6;

                // Deterministic activity LED blink for each drive
                const driveActive = (Math.sin(frame * 0.4 + dIdx * 2.1) + 1) / 2 > 0.35;
                const ledColor = isError ? danger : driveActive ? success : accent;

                return (
                  <g key={`drive-${uIdx}-${dIdx}`}>
                    {/* Caddy Body */}
                    <rect
                      x={caddyX}
                      y={caddyY}
                      width={caddyW}
                      height={caddyH}
                      rx="4"
                      fill="url(#caddyGrad)"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    {/* Latch handle */}
                    <line
                      x1={caddyX + 6}
                      y1={caddyY + caddyH / 2}
                      x2={caddyX + caddyW - 6}
                      y2={caddyY + caddyH / 2}
                      stroke="#475569"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Activity LED */}
                    <circle
                      cx={caddyX + caddyW - 8}
                      cy={caddyY + 8}
                      r="2.5"
                      fill={ledColor}
                      opacity={driveActive ? 1 : 0.25}
                    />
                    {/* Power LED */}
                    <circle
                      cx={caddyX + caddyW - 8}
                      cy={caddyY + 16}
                      r="1.8"
                      fill={accent}
                      opacity={0.8}
                    />
                  </g>
                );
              })}

              {/* 2. Cooling Fan Exhaust Grille (Middle section) */}
              <g transform="translate(195, 8)">
                <rect x="0" y="0" width={78} height={uH - 16} rx="4" fill="#080C14" stroke="rgba(255,255,255,0.06)" />
                {/* Dual Mini Fan Icons Spinning */}
                <g transform="translate(20, 24)">
                  <circle cx="0" cy="0" r="14" fill="#111724" stroke="rgba(36,156,228,0.2)" strokeWidth="1" />
                  <g transform={`rotate(${fanRotation})`}>
                    <line x1="-10" y1="0" x2="10" y2="0" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="0" y1="-10" x2="0" y2="10" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                </g>
                <g transform="translate(58, 24)">
                  <circle cx="0" cy="0" r="14" fill="#111724" stroke="rgba(36,156,228,0.2)" strokeWidth="1" />
                  <g transform={`rotate(${-fanRotation})`}>
                    <line x1="-10" y1="0" x2="10" y2="0" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="0" y1="-10" x2="0" y2="10" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                </g>
              </g>

              {/* 3. RJ45 Gigabit Ethernet Ports + Live Link/Activity LEDs */}
              <g transform="translate(285, 10)">
                {[0, 1, 2, 3].map((pIdx) => {
                  const pX = pIdx * 19;
                  const portBlink = (Math.sin(frame * 0.6 + pIdx * 3.7) + 1) / 2 > 0.4;
                  return (
                    <g key={`port-${pIdx}`} transform={`translate(${pX}, 0)`}>
                      {/* Port Socket */}
                      <rect x="0" y="6" width="15" height="18" rx="2" fill="#05080F" stroke="#334155" strokeWidth="1" />
                      <rect x="3" y="14" width="9" height="7" rx="1" fill="#1E293B" />
                      {/* Link LED (Green) */}
                      <circle cx="4" cy="3" r="1.6" fill={success} opacity={0.9} />
                      {/* Activity LED (Amber/Cyan blinking) */}
                      <circle cx="11" cy="3" r="1.6" fill={accent} opacity={portBlink ? 1 : 0.15} />
                    </g>
                  );
                })}
              </g>

              {/* 4. Live System Display & Meter (Right section) */}
              <g transform="translate(370, 10)">
                <rect x="0" y="2" width="60" height="26" rx="4" fill="#05080E" stroke="rgba(36,156,228,0.3)" strokeWidth="1" />
                <text
                  x="6"
                  y="14"
                  fill={accent}
                  fontSize="8"
                  fontFamily={theme?.typography?.monoFont ?? "monospace"}
                  fontWeight="700"
                >
                  CPU {activeLoad}%
                </text>
                {/* Horizontal load bar */}
                <rect x="6" y="18" width="48" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
                <rect
                  x="6"
                  y="18"
                  width={(48 * activeLoad) / 100}
                  height="4"
                  rx="2"
                  fill={activeLoad > 80 ? danger : accent}
                />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Explanatory Architecture Callout */}
      {annotation && (
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            fontWeight: 700,
            color: theme?.colors?.muted ?? "#94A3B8",
            fontFamily: theme?.typography?.monoFont ?? "monospace",
            textAlign: "center",
          }}
        >
          {annotation}
        </div>
      )}
    </div>
  );
};

