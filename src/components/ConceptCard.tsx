import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ConceptSceneConfig, StyleSpec } from "../lib/types";

interface ConceptCardProps {
  scene: ConceptSceneConfig;
  theme: StyleSpec;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ scene, theme }) => {
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

  const accentColor =
    scene.variant === "alert"
      ? theme.colors.danger
      : scene.variant === "success"
        ? theme.colors.success
        : theme.colors.accent;

  const yOffset = interpolate(enter, [0, 1], [48, 0]);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill
      style={{
        paddingTop: theme.safeZone.top,
        paddingBottom: theme.safeZone.bottom,
        paddingLeft: theme.safeZone.left,
        paddingRight: theme.safeZone.right,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          borderRadius: 32,
          padding: "54px 46px",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.45)",
          transform: `translateY(${yOffset}px) scale(${scale})`,
          opacity: enter,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {(scene.eyebrow || scene.badge) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {scene.eyebrow && (
              <span
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: accentColor,
                }}
              >
                {scene.eyebrow}
              </span>
            )}
            {scene.badge && (
              <span
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 20,
                  fontWeight: 700,
                  color: accentColor,
                  backgroundColor: `${accentColor}1f`,
                  border: `1px solid ${accentColor}55`,
                  padding: "8px 16px",
                  borderRadius: 999,
                }}
              >
                {scene.badge}
              </span>
            )}
          </div>
        )}

        <h1
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: theme.typography.titleSize,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: theme.colors.text,
          }}
        >
          {scene.title}
        </h1>

        {scene.subtitle && (
          <p
            style={{
              margin: 0,
              fontFamily: theme.typography.displayFont,
              fontSize: theme.typography.bodySize,
              fontWeight: 500,
              lineHeight: 1.38,
              color: theme.colors.muted,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

