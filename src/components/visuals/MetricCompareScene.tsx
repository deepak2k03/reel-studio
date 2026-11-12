import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { MetricCompareSceneConfig, MetricSide, StyleSpec } from "../../lib/types";
import { TechIcon } from "../TechIcon";

interface MetricCompareSceneProps {
  scene: MetricCompareSceneConfig;
  theme: StyleSpec;
}

function getToneColor(tone: MetricSide["tone"], theme: StyleSpec): string {
  switch (tone) {
    case "success":
      return theme.colors.success;
    case "danger":
      return theme.colors.danger;
    case "neutral":
      return theme.colors.muted;
    default:
      return theme.colors.accent;
  }
}

export const MetricCompareScene: React.FC<MetricCompareSceneProps> = ({
  scene,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  const leftSpring = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.8 },
  });

  const rightSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.8 },
  });

  const isDark = theme.meta?.isDark ?? true;
  const leftColor = getToneColor(scene.left.tone, theme);
  const rightColor = getToneColor(scene.right.tone, theme);
  const packetCycle = (frame % 60) / 60;

  const renderSideCard = (side: MetricSide, color: string, anim: number) => {
    const pct = side.gaugePercent !== undefined ? Math.max(5, Math.min(100, side.gaugePercent)) : null;
    const animatedProgress = pct !== null ? (pct / 100) * anim : 0;

    return (
      <div
        style={{
          flex: 1,
          padding: "32px 24px",
          borderRadius: 28,
          backgroundColor: theme.colors.surface,
          border: `2px solid ${color}88`,
          boxShadow: isDark
            ? `0 22px 54px rgba(0,0,0,0.4), 0 0 32px ${color}22`
            : "0 18px 46px rgba(45, 28, 12, 0.09)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 18,
          transform: `scale(${interpolate(anim, [0, 1], [0.85, 1])})`,
          opacity: anim,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 124,
            height: 124,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pct !== null && (() => {
            const r = 55;
            const circ = 2 * Math.PI * r;
            const offset = circ * (1 - animatedProgress);
            return (
              <svg
                width={124}
                height={124}
                viewBox="0 0 124 124"
                style={{ position: "absolute", inset: 0 }}
              >
                <circle
                  cx={62}
                  cy={62}
                  r={r}
                  fill="none"
                  stroke={`${color}26`}
                  strokeWidth={7}
                />
                <circle
                  cx={62}
                  cy={62}
                  r={r}
                  fill="none"
                  stroke={color}
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  transform="rotate(-90 62 62)"
                />
              </svg>
            );
          })()}
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 24,
              backgroundColor: `${color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TechIcon name={side.icon} size={46} color={color} />
          </div>
        </div>

        <div
          style={{
            fontFamily: theme.typography.displayFont,
            fontSize: 32,
            fontWeight: 800,
            color: theme.colors.text,
            lineHeight: 1.15,
          }}
        >
          {side.label}
        </div>

        {side.valueText && (
          <div
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 28,
              fontWeight: 800,
              color,
            }}
          >
            {side.valueText}
          </div>
        )}

        {side.sublabel && (
          <div
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 19,
              color: theme.colors.muted,
            }}
          >
            {side.sublabel}
          </div>
        )}
      </div>
    );
  };

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
        gap: 32,
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
          transform: `translateY(${interpolate(enter, [0, 1], [-16, 0])}px)`,
        }}
      >
        {scene.eyebrow && (
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.colors.accent,
              backgroundColor: theme.colors.accentSoft,
              border: `1px solid ${theme.colors.accent}44`,
              padding: "6px 16px",
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
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            color: theme.colors.text,
          }}
        >
          {scene.title}
        </h2>
      </div>

      {/* Centered Split Cards + Bridge/VS Badge */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 880,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {scene.variant === "bridge" && (
          <div
            style={{
              position: "relative",
              width: "70%",
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: 5,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${leftColor}, ${theme.colors.captionHighlight}, ${rightColor})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${packetCycle * 100}%`,
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: theme.colors.captionHighlight,
                boxShadow: `0 0 18px ${theme.colors.captionHighlight}`,
                transform: "translateX(-50%)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: theme.colors.captionHighlight,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 22,
                fontWeight: 800,
                boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
              }}
            >
              {scene.centerIcon && (
                <TechIcon name={scene.centerIcon} size={24} color={theme.colors.bg} useBrandColor={false} />
              )}
              {scene.centerLabel ?? "BRIDGE"}
            </div>
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "center",
            gap: 22,
          }}
        >
          {renderSideCard(scene.left, leftColor, leftSpring)}
          {renderSideCard(scene.right, rightColor, rightSpring)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
