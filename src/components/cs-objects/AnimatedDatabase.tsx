import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedDatabaseProps extends BaseCsObjectProps {
  platterCount?: number;
  iops?: number;
  engine?: string; // "PostgreSQL", "MySQL", "Redis", "MongoDB", "Cassandra"
  showArm?: boolean;
  showBufferPool?: boolean;
}

/**
 * Production-grade Animated Database Engine.
 * Renders realistic magnetic storage platters with swinging read/write actuator arm,
 * rotating magnetic spindle, glowing read sectors, WAL (Write-Ahead Log) queue,
 * and deterministic transaction commit pulses.
 */
export const AnimatedDatabase: React.FC<AnimatedDatabaseProps> = ({
  theme,
  state = "active",
  label = "Relational DB",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  platterCount = 3,
  iops,
  engine = "PostgreSQL",
  showArm = true,
  showBufferPool = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#38BDF8";
  const success = theme?.colors?.success ?? "#34D399";
  const warning = "#FBBF24";
  const danger = theme?.colors?.danger ?? "#FB7185";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";
  const isError = state === "error";

  // Deterministic platter spindle rotation angle
  const spindleAngle = (frame * (isBusy ? 8 : 2)) % 360;

  // Read/write actuator arm sweep angle (swings across platter radius)
  const armCycle = (frame * 0.12) % (Math.PI * 2);
  const armAngle = interpolate(
    Math.sin(armCycle) * Math.cos(armCycle * 0.5),
    [-1, 1],
    [-18, 22]
  );

  // Read/write head active glowing pulse
  const headPulse = Math.sin(frame * 0.4) > 0.2;

  // Active IOPS calculation
  const liveIops =
    iops ??
    Math.round(
      interpolate(Math.sin(frame * 0.09), [-1, 1], [4200, isBusy ? 14800 : 1200])
    );

  // WAL commit buffer tick
  const walIndex = Math.floor(frame / 12) % 4;

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
      {/* Top Header Label & IOPS Metric */}
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
              {engine}
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
                background: isError ? danger : isBusy ? success : accent,
                boxShadow: `0 0 6px ${isError ? danger : isBusy ? success : accent}`,
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
              {metric ?? `${liveIops.toLocaleString()} IOPS`}
            </span>
          </div>
        </div>
      )}

      {/* Main Database Assembly SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 380 300"
        style={{
          filter: glow
            ? `drop-shadow(0 12px 32px ${accent}22) drop-shadow(0 0 16px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Chassis outer gradient */}
          <linearGradient id="dbChassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Magnetic Platter Mirror Gradient */}
          <radialGradient id="platterSurface" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="45%" stopColor="#334155" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="95%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>

          {/* Platter Specular Sheen (Reflecting Light) */}
          <linearGradient id="platterSheen" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="48%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.35)" />
            <stop offset="52%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Spindle Hub Gradient */}
          <radialGradient id="spindleHub" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="40%" stopColor="#94A3B8" />
            <stop offset="85%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>

          {/* Actuator Arm Metallic Gradient */}
          <linearGradient id="armMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Read/Write Laser Glow Filter */}
          <filter id="rwGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Drive Enclosure Baseplate */}
        <rect
          x="10"
          y="10"
          width="360"
          height="280"
          rx="18"
          fill="url(#dbChassisGrad)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Chassis Hex Mounting Screws */}
        {[
          [24, 24],
          [356, 24],
          [24, 276],
          [356, 276],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} stroke="#64748B" strokeWidth="1" />
          </g>
        ))}

        {/* Recessed Platter Bay Well */}
        <circle
          cx="170"
          cy="150"
          r="116"
          fill="#090D16"
          stroke="#1E293B"
          strokeWidth="3"
        />

        {/* Concentric Platter Stack (Simulating 3D Stacked Platters) */}
        {Array.from({ length: platterCount }).map((_, idx) => {
          const offset = (platterCount - 1 - idx) * 3;
          return (
            <g key={idx} transform={`translate(0, ${-offset})`}>
              {/* Platter Disc Rim */}
              <circle
                cx="170"
                cy="150"
                r="108"
                fill="url(#platterSurface)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Data Tracks (Concentric Circular Cylinders) */}
              {[88, 72, 56, 42].map((r, trackIdx) => (
                <circle
                  key={trackIdx}
                  cx="170"
                  cy="150"
                  r={r}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeDasharray={`${6 + trackIdx * 2} ${4 + trackIdx}`}
                  strokeWidth="1"
                />
              ))}

              {/* Platter Dynamic Light Sheen (Spins with spindle) */}
              <circle
                cx="170"
                cy="150"
                r="108"
                fill="url(#platterSheen)"
                transform={`rotate(${spindleAngle}, 170, 150)`}
                style={{ mixBlendMode: "screen", pointerEvents: "none" }}
              />
            </g>
          );
        })}

        {/* Active Read/Write Sector Glow Arc on current track */}
        {isBusy && (
          <circle
            cx="170"
            cy="150"
            r="72"
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeDasharray="35 300"
            strokeDashoffset={-frame * 7}
            filter="url(#rwGlow)"
            opacity="0.85"
          />
        )}

        {/* Central Spindle Motor Hub & Clamping Ring */}
        <circle cx="170" cy="150" r="28" fill="url(#spindleHub)" stroke="#64748B" strokeWidth="2" />
        <circle cx="170" cy="150" r="14" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        {/* Spindle Clamping Screws (Rotate with motor) */}
        <g transform={`rotate(${spindleAngle}, 170, 150)`}>
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const sx = 170 + Math.cos(rad) * 20;
            const sy = 150 + Math.sin(rad) * 20;
            return <circle key={deg} cx={sx} cy={sy} r="2" fill="#E2E8F0" />;
          })}
        </g>

        {/* Actuator Voice-Coil Motor (VCM) & Swinging Arm Assembly */}
        {showArm && (
          <g>
            {/* VCM Magnet Base Plate */}
            <path
              d="M 285 65 C 315 75, 330 110, 320 140 C 312 165, 290 175, 275 165 Z"
              fill="#1E293B"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Actuator Pivot Bearing */}
            <circle cx="280" cy="115" r="16" fill="url(#spindleHub)" stroke="#64748B" strokeWidth="2" />
            <circle cx="280" cy="115" r="7" fill="#0F172A" />

            {/* Actuator Arm Body (Rotates around pivot 280, 115) */}
            <g transform={`rotate(${armAngle}, 280, 115)`}>
              {/* Aluminum Arm Beam */}
              <polygon
                points="280,110 180,146 172,150 180,154 280,120"
                fill="url(#armMetal)"
                stroke="#64748B"
                strokeWidth="1"
              />
              {/* Thin Gimbal Suspension Spring */}
              <line x1="180" y1="150" x2="162" y2="150" stroke="#94A3B8" strokeWidth="1.8" />
              {/* Read/Write Slider Head */}
              <rect x="156" y="147" width="7" height="6" rx="1" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />

              {/* Magnetic Flux / Optical Read Glowing Tip */}
              {isBusy && (
                <circle
                  cx="156"
                  cy="150"
                  r={headPulse ? 3.5 : 2}
                  fill={isError ? danger : accent}
                  filter="url(#rwGlow)"
                  opacity={headPulse ? 1 : 0.6}
                />
              )}
            </g>
          </g>
        )}

        {/* Write-Ahead Log (WAL) & Buffer Pool Status Panel (Right Side) */}
        {showBufferPool && (
          <g transform="translate(300, 175)">
            <rect
              x="0"
              y="0"
              width="62"
              height="95"
              rx="6"
              fill="rgba(15, 23, 42, 0.9)"
              stroke="#334155"
              strokeWidth="1"
            />
            <text
              x="31"
              y="14"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              WAL LOG
            </text>

            {/* 4 WAL Log Buffer Slots */}
            {[0, 1, 2, 3].map((slot) => {
              const isActive = slot === walIndex && isBusy;
              return (
                <g key={slot} transform={`translate(6, ${22 + slot * 16})`}>
                  <rect
                    x="0"
                    y="0"
                    width="50"
                    height="12"
                    rx="3"
                    fill={isActive ? `${accent}33` : "#1E293B"}
                    stroke={isActive ? accent : "#334155"}
                    strokeWidth="1"
                  />
                  <text
                    x="25"
                    y="9"
                    textAnchor="middle"
                    fill={isActive ? "#FFFFFF" : "#64748B"}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight={isActive ? "bold" : "normal"}
                  >
                    {isActive ? "COMMIT" : `TX-0${slot + 1}`}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Drive Controller Interface Connectors (SATA / SAS Pins at Bottom) */}
        <g transform="translate(60, 276)">
          {/* Data connector */}
          <rect x="0" y="0" width="48" height="6" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          {[4, 10, 16, 22, 28, 34, 40].map((x) => (
            <rect key={x} x={x} y="1" width="3" height="4" fill="#FBBF24" />
          ))}
          {/* Power connector */}
          <rect x="56" y="0" width="80" height="6" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          {[60, 68, 76, 84, 92, 100, 108, 116, 124].map((x) => (
            <rect key={x} x={x} y="1" width="4" height="4" fill="#FBBF24" />
          ))}
        </g>
      </svg>

      {/* Explainer Annotation Pill */}
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
