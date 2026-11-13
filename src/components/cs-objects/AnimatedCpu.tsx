import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedCpuProps extends BaseCsObjectProps {
  architecture?: string; // "ARM64", "x86-64", "RISC-V"
  coreCount?: number;
  clockGhz?: number;
  temperature?: number;
  showDieCutaway?: boolean;
}

/**
 * Production-grade Animated Microprocessor (CPU) Silicon Die.
 * Renders realistic LGA/BGA semiconductor packaging:
 * Gold corner alignment triangle, substrate address buses, gold perimeter pins,
 * Core ALU instruction execution pulses, L1/L2/L3 cache data hits,
 * and deterministic clock cycle frequency ripples.
 */
export const AnimatedCpu: React.FC<AnimatedCpuProps> = ({
  theme,
  state = "active",
  label = "Central Processing Unit",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  architecture = "ARM64 / x86-64",
  coreCount = 8,
  clockGhz = 4.6,
  temperature = 58,
  showDieCutaway = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#06B6D4";
  const success = theme?.colors?.success ?? "#10B981";
  const warning = "#F59E0B";
  const danger = theme?.colors?.danger ?? "#EF4444";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";
  const isError = state === "error";

  // Clock cycle frequency oscillation (4.6 GHz deterministic representation)
  const clockPhase = (frame * (isBusy ? 0.35 : 0.1)) % (Math.PI * 2);
  const clockPulse = Math.sin(clockPhase);

  // Active temperature calculation
  const currentTemp =
    temperature + (isBusy ? Math.round(interpolate(clockPulse, [-1, 1], [4, 18])) : 0);

  const width = 360;
  const height = 360;

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
      {/* Header with Title and Architecture */}
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
                background: `${accent}18`,
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              {architecture}
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
                background: currentTemp > 75 ? danger : currentTemp > 65 ? warning : success,
                boxShadow: `0 0 6px ${currentTemp > 75 ? danger : accent}`,
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
              {metric ?? `${clockGhz} GHz • ${currentTemp}°C`}
            </span>
          </div>
        </div>
      )}

      {/* Main CPU Die SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 360"
        style={{
          filter: glow
            ? `drop-shadow(0 12px 32px ${accent}25) drop-shadow(0 0 16px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Substrate Green/Dark PCB Gradient */}
          <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="60%" stopColor="#022C22" />
            <stop offset="100%" stopColor="#011812" />
          </linearGradient>

          {/* Metal Heat Spreader (IHS) Brushed Aluminum */}
          <linearGradient id="ihsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="30%" stopColor="#334155" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Silicon Die Mirror Surface */}
          <linearGradient id="siliconDie" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1E2E" />
            <stop offset="50%" stopColor="#11111B" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          {/* Core Glow Filter */}
          <filter id="cpuGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer PCB Substrate Carrier (340x340) */}
        <rect
          x="10"
          y="10"
          width="340"
          height="340"
          rx="12"
          fill="url(#pcbGrad)"
          stroke="#059669"
          strokeWidth="2"
        />

        {/* Gold Alignment Triangle (Pin 1 Indicator) */}
        <polygon points="18,18 36,18 18,36" fill="#FBBF24" />

        {/* Perimeter Contact Pins (LGA pads simulating CPU socket contact) */}
        {/* Top & Bottom Pins */}
        {Array.from({ length: 24 }).map((_, i) => {
          const x = 34 + i * 12.5;
          return (
            <React.Fragment key={`tb-${i}`}>
              <rect x={x} y="13" width="7" height="9" rx="1.5" fill="#FBBF24" opacity="0.8" />
              <rect x={x} y="338" width="7" height="9" rx="1.5" fill="#FBBF24" opacity="0.8" />
            </React.Fragment>
          );
        })}
        {/* Left & Right Pins */}
        {Array.from({ length: 24 }).map((_, i) => {
          const y = 34 + i * 12.5;
          return (
            <React.Fragment key={`lr-${i}`}>
              <rect x="13" y={y} width="9" height="7" rx="1.5" fill="#FBBF24" opacity="0.8" />
              <rect x="338" y={y} width="9" height="7" rx="1.5" fill="#FBBF24" opacity="0.8" />
            </React.Fragment>
          );
        })}

        {/* Substrate Copper Trace Bus Lines */}
        {[55, 95, 135, 225, 265, 305].map((coord, i) => (
          <React.Fragment key={`bus-${i}`}>
            <line x1="28" y1={coord} x2="60" y2={coord} stroke="#059669" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1={coord} y1="28" x2={coord} y2="60" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="300" y1={coord} x2="332" y2={coord} stroke="#059669" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1={coord} y1="300" x2={coord} y2="332" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 3" />
          </React.Fragment>
        ))}

        {/* Nickel-Plated Copper Heat Spreader (IHS) Rim */}
        <rect
          x="50"
          y="50"
          width="260"
          height="260"
          rx="10"
          fill="url(#ihsGrad)"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {showDieCutaway ? (
          /* Silicon Die Cutaway Architectural View */
          <g transform="translate(70, 70)">
            {/* Silicon Die Substrate (220x220) */}
            <rect
              x="0"
              y="0"
              width="220"
              height="220"
              rx="6"
              fill="url(#siliconDie)"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Central Clock Cycle Frequency Pulse Ring */}
            <circle
              cx="110"
              cy="110"
              r={interpolate(clockPulse, [-1, 1], [18, 48])}
              fill="none"
              stroke={accent}
              strokeWidth="1.5"
              opacity={interpolate(clockPulse, [-1, 1], [0.6, 0.1])}
            />

            {/* 8 Compute Cores Grid (2 rows x 4 cols) */}
            {Array.from({ length: 8 }).map((_, idx) => {
              const col = idx % 4;
              const row = Math.floor(idx / 4);
              const cx = 14 + col * 48;
              const cy = row === 0 ? 14 : 142;
              const isActive = (frame + idx * 7) % 24 < 14 && isBusy;

              return (
                <g key={idx} transform={`translate(${cx}, ${cy})`}>
                  {/* Core Housing */}
                  <rect
                    x="0"
                    y="0"
                    width="44"
                    height="64"
                    rx="4"
                    fill={isActive ? "rgba(6, 182, 212, 0.12)" : "#181825"}
                    stroke={isActive ? accent : "#313244"}
                    strokeWidth="1.2"
                  />
                  {/* ALU execution indicator */}
                  <rect
                    x="4"
                    y="4"
                    width="36"
                    height="18"
                    rx="2"
                    fill={isActive ? accent : "#313244"}
                    opacity={isActive ? 0.8 : 0.4}
                  />
                  <text
                    x="22"
                    y="16"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ALU
                  </text>
                  {/* L1 Cache */}
                  <rect x="4" y="26" width="36" height="12" rx="2" fill="#1E1E2E" stroke="#45475A" strokeWidth="0.8" />
                  <text x="22" y="35" textAnchor="middle" fill="#A6ADC8" fontSize="6.5" fontFamily="monospace">
                    L1$: 64K
                  </text>
                  {/* L2 Cache */}
                  <rect x="4" y="42" width="36" height="16" rx="2" fill="#11111B" stroke="#45475A" strokeWidth="0.8" />
                  <text x="22" y="53" textAnchor="middle" fill="#CDD6F4" fontSize="6.5" fontFamily="monospace">
                    CORE {idx}
                  </text>
                </g>
              );
            })}

            {/* Unified L3 Shared Cache & Memory Controller (Middle Band) */}
            <g transform="translate(14, 84)">
              <rect
                x="0"
                y="0"
                width="192"
                height="52"
                rx="4"
                fill="#181825"
                stroke="#45475A"
                strokeWidth="1.2"
              />
              <text
                x="96"
                y="18"
                textAnchor="middle"
                fill="#CDD6F4"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1px"
              >
                SHARED L3 CACHE (32 MB)
              </text>

              {/* Memory bus pulses passing between cores */}
              <div style={{ display: "none" }} />
              {Array.from({ length: 8 }).map((_, i) => {
                const bx = 16 + i * 22;
                const busActive = (Math.floor(frame / 6) + i) % 3 === 0 && isBusy;
                return (
                  <rect
                    key={i}
                    x={bx}
                    y="26"
                    width="14"
                    height="18"
                    rx="2"
                    fill={busActive ? accent : "#313244"}
                    opacity={busActive ? 0.9 : 0.3}
                  />
                );
              })}
            </g>
          </g>
        ) : (
          /* Laser-Etched IHS Metal Cover */
          <g transform="translate(70, 70)">
            <text x="110" y="80" textAnchor="middle" fill="#94A3B8" fontSize="16" fontFamily="sans-serif" fontWeight="800">
              ANTIGRAVITY CORE
            </text>
            <text x="110" y="110" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="monospace">
              {architecture} • 8-CORE
            </text>
            <text x="110" y="130" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
              DIFFUSION FABRICATION 3NM
            </text>
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
