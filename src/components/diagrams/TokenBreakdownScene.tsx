import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../../lib/timing";
import type { StyleSpec, TokenBreakdownSceneConfig, TranscriptData } from "../../lib/types";

interface TokenBreakdownSceneProps {
  scene: TokenBreakdownSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const TokenBreakdownScene: React.FC<TokenBreakdownSceneProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? true;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(2.0, scene.end - sceneStartSec);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absFrame = sceneStartFrame + frame;

  const headerEnter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  const itemCount = Math.max(1, scene.items.length);
  const maxTokenLen = Math.max(1, ...scene.items.map((it) => it.token.length));
  const tileHeight = itemCount >= 4 ? 104 : 124;
  const tileMinWidth = maxTokenLen > 2 ? 128 : itemCount >= 4 ? 104 : 124;
  const tileFontSize = maxTokenLen >= 4 ? 36 : itemCount >= 4 ? 46 : 56;
  const tileGap = itemCount >= 4 ? 16 : 24;

  const itemFrames = scene.items.map((item, idx) => {
    const defaultOffset = (idx / itemCount) * Math.min(sceneSpanSec * 0.68, itemCount * 0.85);
    return item.cuePhrase
      ? secToFrame(
          resolveCueTime(
            transcript,
            sceneStartSec + (item.atOffset ?? defaultOffset),
            item.cuePhrase,
            sceneStartSec,
          ),
          fps,
        )
      : sceneStartFrame + secToFrame(item.atOffset ?? defaultOffset, fps);
  });

  let activeIdx = 0;
  for (let i = 0; i < itemFrames.length; i++) {
    if (absFrame >= itemFrames[i]) activeIdx = i;
  }

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
        gap: 30,
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: headerEnter,
          transform: `translateY(${interpolate(headerEnter, [0, 1], [-16, 0])}px)`,
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
          {scene.title}
        </h2>
      </div>

      {/* Main Precision Tile Stage Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          padding: "42px 34px",
          borderRadius: 32,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
          opacity: headerEnter,
          transform: `scale(${interpolate(headerEnter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Interactive Letter / Token Tiles Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: tileGap,
            width: "100%",
          }}
        >
          {scene.items.map((item, idx) => {
            const unlocked = absFrame >= itemFrames[idx];
            const isCurrent = idx === activeIdx && unlocked;
            const tileSpring = spring({
              frame: Math.max(0, absFrame - itemFrames[idx]),
              fps,
              config: { damping: 13, stiffness: 220, mass: 0.72 },
            });

            return (
              <div
                key={`${item.token}-${idx}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    minWidth: tileMinWidth,
                    height: tileHeight,
                    padding: maxTokenLen > 2 ? "0 18px" : "0 10px",
                    borderRadius: 26,
                    backgroundColor: isCurrent
                      ? theme.colors.accent
                      : unlocked
                        ? theme.colors.accentSoft
                        : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "#F5EFE6",
                    border: `2.5px solid ${
                      isCurrent
                        ? theme.colors.accent
                        : unlocked
                          ? `${theme.colors.accent}88`
                          : theme.colors.surfaceBorder
                    }`,
                    color: isCurrent
                      ? isDark
                        ? theme.colors.bg
                        : "#FFFFFF"
                      : unlocked
                        ? theme.colors.accent
                        : theme.colors.muted,
                    fontFamily: theme.typography.monoFont,
                    fontSize: tileFontSize,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `translateY(${isCurrent ? -8 * tileSpring : 0}px) scale(${
                      isCurrent ? 1 + 0.08 * tileSpring : 1
                    })`,
                    boxShadow: isCurrent
                      ? `0 16px 36px ${theme.colors.accentSoft}`
                      : "none",
                  }}
                >
                  {item.token}
                </div>

                {/* Underline progress track like reference ref_03 */}
                <div
                  style={{
                    width: Math.max(68, tileMinWidth - 24),
                    height: 5,
                    borderRadius: 999,
                    backgroundColor: unlocked
                      ? theme.colors.accent
                      : isDark
                        ? "rgba(255,255,255,0.08)"
                        : "#EDE4D8",
                    transform: `scaleX(${unlocked ? tileSpring : 0.4})`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Expanded Meaning Callouts */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {scene.items.map((item, idx) => {
            const unlocked = absFrame >= itemFrames[idx];
            const isCurrent = idx === activeIdx && unlocked;
            const rowSpring = spring({
              frame: Math.max(0, absFrame - itemFrames[idx]),
              fps,
              config: { damping: 16, stiffness: 200, mass: 0.8 },
            });

            return (
              <div
                key={`row-${item.token}-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 24px",
                  borderRadius: 18,
                  backgroundColor: isCurrent
                    ? theme.colors.accentSoft
                    : isDark
                      ? "rgba(255,255,255,0.03)"
                      : "#FAF6F0",
                  border: `1.5px dashed ${
                    isCurrent ? theme.colors.accent : theme.colors.surfaceBorder
                  }`,
                  opacity: unlocked ? 0.35 + 0.65 * rowSpring : 0.25,
                  transform: `translateX(${unlocked ? interpolate(rowSpring, [0, 1], [-14, 0]) : 0}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span
                    style={{
                      fontFamily: theme.typography.monoFont,
                      fontSize: 22,
                      fontWeight: 800,
                      color: theme.colors.accent,
                      width: 34,
                    }}
                  >
                    {item.token}
                  </span>
                  <span
                    style={{
                      fontFamily: theme.typography.displayFont,
                      fontSize: 32,
                      fontWeight: 800,
                      color: theme.colors.text,
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 21,
                    fontWeight: 700,
                    color: isCurrent ? theme.colors.accent : theme.colors.muted,
                  }}
                >
                  {item.detail}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

