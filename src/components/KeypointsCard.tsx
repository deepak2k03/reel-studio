import React from "react";
import { CheckCircle2 } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../lib/timing";
import type { KeypointsSceneConfig, StyleSpec, TranscriptData } from "../lib/types";

interface KeypointsCardProps {
  scene: KeypointsSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const KeypointsCard: React.FC<KeypointsCardProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absoluteFrame = sceneStartFrame + frame;
  const isDark = theme.meta?.isDark ?? true;

  const headerEnter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  return (
    <AbsoluteFill
      style={{
        paddingTop: theme.safeZone.top,
        paddingBottom: theme.safeZone.bottom,
        paddingLeft: theme.safeZone.left,
        paddingRight: theme.safeZone.right,
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          opacity: headerEnter,
          transform: `translateY(${interpolate(headerEnter, [0, 1], [24, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
        }}
      >
        {scene.eyebrow && (
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 20,
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
            fontSize: 50,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            color: theme.colors.text,
          }}
        >
          {scene.title}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {scene.items.map((item, idx) => {
          const itemFrame = item.cuePhrase
            ? secToFrame(
                resolveCueTime(
                  transcript,
                  sceneStartSec + (item.atOffset ?? idx * 0.6),
                  item.cuePhrase,
                ),
                fps,
              )
            : sceneStartFrame + secToFrame(item.atOffset ?? idx * 0.55, fps);

          const isVisible = absoluteFrame >= itemFrame;
          const itemSpring = spring({
            frame: Math.max(0, absoluteFrame - itemFrame),
            fps,
            config: {
              damping: theme.motion.springDamping,
              stiffness: theme.motion.springStiffness,
              mass: theme.motion.springMass,
            },
          });

          const isFocused = isVisible && absoluteFrame - itemFrame < fps * 2.5;

          return (
            <div
              key={`${item.label}-${idx}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                padding: "24px 28px",
                borderRadius: 24,
                backgroundColor: theme.colors.surface,
                border: `2px solid ${
                  isFocused ? theme.colors.accent : theme.colors.surfaceBorder
                }`,
                boxShadow: isDark
                  ? isFocused
                    ? `0 16px 40px ${theme.colors.accentSoft}`
                    : "0 14px 32px rgba(0,0,0,0.3)"
                  : "0 16px 42px rgba(45, 28, 12, 0.08)",
                opacity: isVisible ? itemSpring : 0.15,
                transform: `translateX(${
                  isVisible ? interpolate(itemSpring, [0, 1], [-22, 0]) : -10
                }px)`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: isVisible
                    ? theme.colors.accentSoft
                    : "rgba(148,163,184,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <CheckCircle2
                  size={26}
                  color={isVisible ? theme.colors.accent : theme.colors.muted}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: theme.colors.text,
                  }}
                >
                  {item.label}
                </span>
                {item.detail && (
                  <span
                    style={{
                      fontFamily: theme.typography.displayFont,
                      fontSize: 24,
                      lineHeight: 1.3,
                      color: theme.colors.muted,
                    }}
                  >
                    {item.detail}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

