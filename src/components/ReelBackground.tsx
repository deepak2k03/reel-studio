import React from "react";
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { StyleSpec } from "../lib/types";

interface ReelBackgroundProps {
  theme: StyleSpec;
  showSafeZones?: boolean;
}

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  baseX: ((i * 73 + 19) % 92) + 4,
  baseY: ((i * 47 + 11) % 86) + 7,
  size: (i % 3) + 2,
  speed: 0.008 + (i % 4) * 0.003,
}));

export const ReelBackground: React.FC<ReelBackgroundProps> = ({
  theme,
  showSafeZones = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const driftX = interpolate(frame, [0, durationInFrames], [-32, 32]);
  const driftY = interpolate(frame, [0, durationInFrames], [-24, 24]);
  const isDark = theme.meta?.isDark ?? true;
  const progressPct = Math.min(100, Math.max(0, (frame / Math.max(1, durationInFrames - 1)) * 100));

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${theme.colors.bg} 0%, ${theme.colors.bgSecondary} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Crisp subtle dot-matrix canvas (dark themes) or soft editorial warm glow (light themes) */}
      {isDark ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(rgba(148, 163, 184, 0.16) 1.2px, transparent 1.2px)",
            backgroundSize: "40px 40px",
            transform: `translate(${driftX * 0.25}px, ${driftY * 0.25}px)`,
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "36%",
            width: 820,
            height: 820,
            transform: `translate(calc(-50% + ${driftX * 0.35}px), calc(-50% + ${driftY * 0.35}px))`,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.82) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
      )}

      {/* Centered optical spotlight behind the focal stage */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",
          width: 920,
          height: 920,
          transform: `translate(calc(-50% + ${driftX * 0.5}px), calc(-50% + ${driftY * 0.5}px))`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.accentSoft} 0%, transparent 66%)`,
          opacity: isDark ? 1 : 0.35,
          filter: "blur(36px)",
        }}
      />

      {/* Secondary ambient accent bloom */}
      <div
        style={{
          position: "absolute",
          bottom: -160,
          left: "50%",
          width: 780,
          height: 520,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.accentSoft} 0%, transparent 70%)`,
          opacity: 0.55,
          filter: "blur(45px)",
        }}
      />

      {/* Deterministic organic floating micro-particles */}
      {isDark &&
        PARTICLES.map((p) => {
          const nx = noise2D(`px-${p.id}`, frame * p.speed, 0) * 2.2;
          const ny = noise2D(`py-${p.id}`, 0, frame * p.speed) * 2.2;
          const alpha = 0.16 + Math.abs(noise2D(`pa-${p.id}`, frame * 0.015, p.id)) * 0.34;
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.baseX + nx}%`,
                top: `${p.baseY + ny}%`,
                width: p.size * 2,
                height: p.size * 2,
                borderRadius: "50%",
                backgroundColor: p.id % 3 === 0 ? theme.colors.captionHighlight : theme.colors.accent,
                opacity: alpha,
              }}
            />
          );
        })}

      {/* Subtle edge vignette for depth */}
      {isDark && (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.48) 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Editorial hairline progress bar along the bottom edge */}
      {!isDark && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: `${progressPct}%`,
            height: 6,
            backgroundColor: theme.colors.accent,
          }}
        />
      )}

      {showSafeZones && (
        <AbsoluteFill
          style={{
            borderTop: `${theme.safeZone.top}px solid rgba(248, 113, 113, 0.14)`,
            borderBottom: `${theme.safeZone.bottom}px solid rgba(248, 113, 113, 0.14)`,
            borderLeft: `${theme.safeZone.left}px solid rgba(248, 113, 113, 0.14)`,
            borderRight: `${theme.safeZone.right}px solid rgba(248, 113, 113, 0.14)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
