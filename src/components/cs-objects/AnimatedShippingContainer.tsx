import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedShippingContainerProps extends BaseCsObjectProps {
  imageName?: string; // e.g. "nginx:alpine", "node:20", "redis:7"
  portMapping?: string; // "8080:80"
  containerId?: string; // "c4d7e9b1"
  cgroupsLimit?: string; // "512MB / 1.0 CPU"
  showIsolationAura?: boolean;
}

/**
 * Production-grade Animated Corrugated ISO Shipping Container.
 * Renders realistic corrugated steel industrial cargo container with corner castings,
 * vertical door locking bars, and animated Linux Kernel namespace isolation forcefield
 * (cgroups, pid, net, mount namespaces) with health pulse.
 */
export const AnimatedShippingContainer: React.FC<AnimatedShippingContainerProps> = ({
  theme,
  state = "active",
  label = "Docker Container",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  imageName = "nginx:alpine",
  portMapping = "0.0.0.0:8080 ➔ :80",
  containerId = "c4d7e9b1",
  cgroupsLimit = "512MB • 1.0 CPU",
  showIsolationAura = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#0284C7"; // Docker blue
  const success = theme?.colors?.success ?? "#10B981";
  const danger = theme?.colors?.danger ?? "#EF4444";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";
  const isError = state === "error";

  // Isolation forcefield breathing pulse
  const auraPhase = (frame * 0.08) % (Math.PI * 2);
  const auraPulse = interpolate(Math.sin(auraPhase), [-1, 1], [0.15, 0.45]);

  const width = 420;
  const height = 260;

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
                background: `${accent}20`,
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              {imageName}
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
                background: isError ? danger : success,
                boxShadow: `0 0 6px ${isError ? danger : success}`,
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
              {metric ?? portMapping}
            </span>
          </div>
        </div>
      )}

      {/* ISO Container Assembly SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 420 260"
        style={{
          filter: glow
            ? `drop-shadow(0 12px 32px ${accent}28) drop-shadow(0 0 16px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Container Painted Steel Gradient */}
          <linearGradient id="containerHull" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="25%" stopColor="#0369A1" />
            <stop offset="70%" stopColor="#075985" />
            <stop offset="100%" stopColor="#0C4A6E" />
          </linearGradient>

          {/* Steel Corrugation Shadow Gradient */}
          <linearGradient id="ribShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </linearGradient>

          {/* Cast Iron Corner Fitting Gradient */}
          <linearGradient id="cornerCast" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Namespace Forcefield Glow */}
          <filter id="auraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Linux Kernel Namespace Isolation Forcefield (Glow Aura) */}
        {showIsolationAura && (
          <rect
            x="12"
            y="22"
            width="396"
            height="216"
            rx="20"
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeDasharray="16 8"
            strokeDashoffset={-frame * 1.5}
            filter="url(#auraGlow)"
            opacity={auraPulse}
          />
        )}

        {/* Main Corrugated Container Body (380x190) */}
        <rect
          x="20"
          y="30"
          width="380"
          height="190"
          rx="6"
          fill="url(#containerHull)"
          stroke="#075985"
          strokeWidth="2"
        />

        {/* Vertical Corrugation Ribs (Industrial Steel Ridges) */}
        {Array.from({ length: 15 }).map((_, i) => {
          const rx = 48 + i * 22;
          return (
            <rect
              key={i}
              x={rx}
              y="38"
              width="14"
              height="174"
              rx="2"
              fill="url(#ribShadow)"
              stroke="#0C4A6E"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Corner Castings (Twist-lock Steel Brackets) */}
        {[
          [20, 30],
          [376, 30],
          [20, 196],
          [376, 196],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <rect x={cx} y={cy} width="24" height="24" rx="2" fill="url(#cornerCast)" stroke="#94A3B8" strokeWidth="1" />
            {/* Twist lock oval aperture */}
            <ellipse cx={cx + 12} cy={cy + 12} rx="6" ry="4" fill="#0B132B" stroke="#475569" strokeWidth="1" />
          </g>
        ))}

        {/* Right End Door Frame & Locking Rods */}
        <line x1="376" y1="30" x2="376" y2="220" stroke="#082F49" strokeWidth="3" />
        {/* Dual Steel Vertical Lock Rods */}
        {[300, 335].map((lx, i) => (
          <g key={i}>
            <line x1={lx} y1="34" x2={lx} y2="216" stroke="#E2E8F0" strokeWidth="3" />
            {/* Top & Bottom Cam Keepers */}
            <rect x={lx - 4} y="32" width="8" height="10" rx="1" fill="#475569" stroke="#94A3B8" strokeWidth="0.8" />
            <rect x={lx - 4} y="208" width="8" height="10" rx="1" fill="#475569" stroke="#94A3B8" strokeWidth="0.8" />
            {/* Latch Handle */}
            <rect x={lx - 12} y="130" width="16" height="6" rx="1" fill="#E2E8F0" />
            <circle cx={lx - 8} cy="133" r="1.5" fill="#EF4444" />
          </g>
        ))}

        {/* Stenciled ISO Markings & Specs */}
        <g transform="translate(48, 54)">
          <rect x="0" y="0" width="130" height="42" rx="4" fill="rgba(11, 19, 43, 0.65)" stroke="#38BDF8" strokeWidth="0.8" />
          <text x="10" y="16" fill="#F0F9FF" fontSize="11" fontFamily="monospace" fontWeight="900" letterSpacing="1px">
            ID: {containerId.toUpperCase()}
          </text>
          <text x="10" y="32" fill="#BAE6FD" fontSize="9" fontFamily="monospace">
            {cgroupsLimit}
          </text>
        </g>

        {/* Linux Kernel Namespace Badges (Bottom Front) */}
        <g transform="translate(48, 172)">
          {["pid", "net", "ipc", "mnt", "uts"].map((ns, idx) => (
            <g key={ns} transform={`translate(${idx * 44}, 0)`}>
              <rect x="0" y="0" width="38" height="18" rx="3" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1" />
              <text x="19" y="12" textAnchor="middle" fill="#E0F2FE" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {ns.toUpperCase()}
              </text>
            </g>
          ))}
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

