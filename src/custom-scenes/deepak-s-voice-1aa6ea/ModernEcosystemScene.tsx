import React from "react";
import { BarChart3, Cloud, Cpu, CreditCard, KeyRound, MapPin, Webhook } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Beat 6: Closing radial hub diagram summarizing API as the universal interface powering modern apps.
 */
export const ModernEcosystemScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? false;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const p = (scene.props ?? {}) as { modernCue?: string };
  const modernFrame = p.modernCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 8.0, p.modernCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 8.0, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });
  const ecosystemBoost = spring({
    frame: Math.max(0, absFrame - modernFrame),
    fps,
    config: { damping: 14, stiffness: 190, mass: 0.8 },
  });

  const cx = 420;
  const cy = 285;
  const radius = 195;

  const nodes = [
    { label: "Auth", icon: KeyRound, angleDeg: -90 },
    { label: "Maps", icon: MapPin, angleDeg: -30 },
    { label: "Pay", icon: CreditCard, angleDeg: 30 },
    { label: "Cloud", icon: Cloud, angleDeg: 90 },
    { label: "AI", icon: Cpu, angleDeg: 150 },
    { label: "Stats", icon: BarChart3, angleDeg: 210 },
  ];

  const dashOffset = -(frame * 2.0);

  return (
    <AbsoluteFill
      style={{
        paddingTop: theme.safeZone.top,
        paddingBottom: theme.safeZone.bottom,
        paddingLeft: theme.safeZone.left,
        paddingRight: theme.safeZone.right,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: enter,
        }}
      >
        {scene.eyebrow && (
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.colors.accent,
              backgroundColor: theme.colors.accentSoft,
              border: `1px solid ${theme.colors.accent}44`,
              padding: "6px 18px",
              borderRadius: 999,
            }}
          >
            {scene.eyebrow}
          </span>
        )}
        <h2
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: 50,
            fontWeight: 800,
            color: theme.colors.text,
            letterSpacing: "-0.025em",
          }}
        >
          {scene.title ?? "Universal API Interface"}
        </h2>
      </div>

      {/* Radial Ecosystem Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 840,
          height: 570,
          borderRadius: 34,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          opacity: enter,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 840 570"
          style={{ position: "absolute", inset: 0 }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={theme.colors.surfaceBorder}
            strokeWidth={2}
            strokeDasharray="8 10"
          />
          {nodes.map((n, i) => {
            const rad = (n.angleDeg * Math.PI) / 180;
            const nx = cx + Math.cos(rad) * radius;
            const ny = cy + Math.sin(rad) * radius;
            const pulseT = ((frame + i * 15) % 90) / 90;
            return (
              <g key={`spoke-${n.label}`}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={nx}
                  y2={ny}
                  stroke={theme.colors.accent}
                  strokeWidth={3}
                  strokeOpacity={0.55 + 0.35 * ecosystemBoost}
                  strokeDasharray="8 8"
                  strokeDashoffset={dashOffset}
                />
                <circle
                  cx={interpolate(pulseT, [0, 1], [cx, nx])}
                  cy={interpolate(pulseT, [0, 1], [cy, ny])}
                  r={5}
                  fill={i % 2 === 0 ? theme.colors.accent : theme.colors.success}
                />
              </g>
            );
          })}
        </svg>

        {/* Outer Modern App Capability Nodes */}
        {nodes.map((n, i) => {
          const Icon = n.icon;
          const rad = (n.angleDeg * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * radius;
          const ny = cy + Math.sin(rad) * radius;
          const nodePop = spring({
            frame: Math.max(0, frame - i * 6),
            fps,
            config: { damping: 14, stiffness: 200, mass: 0.78 },
          });
          const activeColor = i % 2 === 0 ? theme.colors.accent : theme.colors.success;

          return (
            <div
              key={n.label}
              style={{
                position: "absolute",
                left: `${(nx / 840) * 100}%`,
                top: `${(ny / 570) * 100}%`,
                transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * nodePop})`,
                width: 112,
                height: 112,
                borderRadius: 26,
                backgroundColor: isDark ? "#0F172A" : "#FAF5ED",
                border: `2px solid ${activeColor}`,
                boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Icon size={32} color={activeColor} />
              <span
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 17,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                {n.label}
              </span>
            </div>
          );
        })}

        {/* Center API Interface Core */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${1 + 0.05 * ecosystemBoost})`,
            width: 174,
            height: 174,
            borderRadius: "50%",
            backgroundColor: theme.colors.accent,
            boxShadow: `0 18px 46px ${theme.colors.accentSoft}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            color: "#FFFFFF",
          }}
        >
          <Webhook size={46} color="#FFFFFF" />
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            API
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

