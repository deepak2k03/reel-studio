import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedRamModuleProps extends BaseCsObjectProps {
  generation?: string; // "DDR5", "DDR4", "LPDDR5X"
  capacity?: string; // "32 GB", "64 GB"
  speedMt?: number; // 6400
  orientation?: "horizontal" | "vertical";
  activeChipIndex?: number;
}

/**
 * Production-grade Animated DDR5 Memory DIMM Stick.
 * Renders realistic surface-mount DRAM integrated circuits, SPD EEPROM hub,
 * gold edge connector contacts with mechanical key notch, and dynamic
 * Row/Column Address Strobe (RAS/CAS) read-write memory bus strobes.
 */
export const AnimatedRamModule: React.FC<AnimatedRamModuleProps> = ({
  theme,
  state = "active",
  label = "DDR5 Synchronous DRAM",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  generation = "DDR5",
  capacity = "32 GB",
  speedMt = 6400,
  orientation = "horizontal",
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#A855F7";
  const success = theme?.colors?.success ?? "#34D399";
  const warning = "#FBBF24";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Memory strobe strobe cycle (addresses cycling across 8 DRAM chips)
  const activeChip = Math.floor(frame / 8) % 8;

  // Bandwidth calculation
  const liveBandwidth = Math.round(
    interpolate(Math.sin(frame * 0.1), [-1, 1], [38, isBusy ? 94 : 12])
  );

  const width = 420;
  const height = 140;

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
      {/* Header Label and Bandwidth */}
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
              {capacity} • {generation}-{speedMt}
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
                background: isBusy ? accent : "#64748B",
                boxShadow: `0 0 6px ${accent}`,
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
              {metric ?? `${liveBandwidth} GB/s • CL30`}
            </span>
          </div>
        </div>
      )}

      {/* DIMM Stick Assembly SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 420 140"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 24px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="dimmPcb" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E1E2E" />
            <stop offset="60%" stopColor="#11111B" />
            <stop offset="100%" stopColor="#0B0B10" />
          </linearGradient>

          <linearGradient id="heatShield" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E3440" />
            <stop offset="50%" stopColor="#434C5E" />
            <stop offset="100%" stopColor="#2E3440" />
          </linearGradient>

          <filter id="ramGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* PCB Main Substrate Board with side mounting lock notches */}
        <path
          d="
            M 14,14
            H 406
            V 108
            H 240
            V 116
            H 230
            V 108
            H 14
            Z
          "
          fill="url(#dimmPcb)"
          stroke="#45475A"
          strokeWidth="1.5"
        />

        {/* Heat Spreader Top Armored Ridge */}
        <rect x="14" y="14" width="392" height="24" rx="2" fill="url(#heatShield)" stroke="#4C566A" strokeWidth="1" />
        {/* Heat spreader cooling fin vents */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={30 + i * 20}
            y1="18"
            x2={38 + i * 20}
            y2="32"
            stroke="#1E1E2E"
            strokeWidth="2"
          />
        ))}

        {/* 8 Surface-Mounted DRAM Silicon IC Chips */}
        {Array.from({ length: 8 }).map((_, i) => {
          const cx = 26 + i * 46;
          const isStrobing = i === activeChip && isBusy;

          return (
            <g key={i} transform={`translate(${cx}, 46)`}>
              {/* DRAM IC Package */}
              <rect
                x="0"
                y="0"
                width="38"
                height="46"
                rx="3"
                fill={isStrobing ? "rgba(168, 85, 247, 0.2)" : "#181825"}
                stroke={isStrobing ? accent : "#313244"}
                strokeWidth={isStrobing ? "1.8" : "1"}
              />

              {/* Laser-Etched DRAM Markings */}
              <circle cx="6" cy="6" r="1.5" fill="#6C7086" />
              <text x="19" y="18" textAnchor="middle" fill="#CDD6F4" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                DRAM
              </text>
              <text x="19" y="28" textAnchor="middle" fill="#A6ADC8" fontSize="6" fontFamily="monospace">
                4GB-IC
              </text>
              <text
                x="19"
                y="38"
                textAnchor="middle"
                fill={isStrobing ? accent : "#6C7086"}
                fontSize="6"
                fontFamily="monospace"
                fontWeight={isStrobing ? "bold" : "normal"}
              >
                {isStrobing ? "ACTIVE" : `CH-${i}`}
              </text>

              {/* Data bus trace lines under each chip */}
              <line x1="10" y1="46" x2="10" y2="58" stroke={isStrobing ? accent : "#45475A"} strokeWidth="1" />
              <line x1="19" y1="46" x2="19" y2="58" stroke={isStrobing ? accent : "#45475A"} strokeWidth="1" />
              <line x1="28" y1="46" x2="28" y2="58" stroke={isStrobing ? accent : "#45475A"} strokeWidth="1" />
            </g>
          );
        })}

        {/* Gold Edge Connector Fingers (Pins at bottom with mechanical key notch) */}
        {/* Left Pin Bank (Pins 1 to 140) */}
        {Array.from({ length: 30 }).map((_, i) => (
          <rect
            key={`lp-${i}`}
            x={20 + i * 6.8}
            y="108"
            width="3.5"
            height="18"
            rx="0.5"
            fill="#FBBF24"
            opacity="0.85"
          />
        ))}
        {/* Mechanical Key Notch between x=228 and x=242 */}
        <rect x="228" y="108" width="14" height="20" fill="#0B0B10" />

        {/* Right Pin Bank (Pins 141 to 288) */}
        {Array.from({ length: 22 }).map((_, i) => (
          <rect
            key={`rp-${i}`}
            x={246 + i * 6.8}
            y="108"
            width="3.5"
            height="18"
            rx="0.5"
            fill="#FBBF24"
            opacity="0.85"
          />
        ))}
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
