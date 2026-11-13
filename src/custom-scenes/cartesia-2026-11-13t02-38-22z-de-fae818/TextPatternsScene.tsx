import React from "react";
import { BrainCircuit, Database, Network, TrendingUp } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 3: Text Patterns & Probability Tree
 * Spoken: "Keyboard ko kaise pata ki next word kya ho sakta hai? Usne bahut saare text patterns se ye seekha hota hai ki kis word ke baad usually kya aata hai."
 */
export const TextPatternsScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const patternsCueSec = resolveCueTime(transcript, sceneStartSec + 2.7, "text patterns", sceneStartSec);
  const seekhaCueSec = resolveCueTime(transcript, sceneStartSec + 4.2, "seekha hota hai", sceneStartSec);
  const usuallyCueSec = resolveCueTime(transcript, sceneStartSec + 6.0, "usually", sceneStartSec);

  const patternsFrame = secToFrame(patternsCueSec, fps);
  const seekhaFrame = secToFrame(seekhaCueSec, fps);
  const usuallyFrame = secToFrame(usuallyCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const branchAnim = spring({
    frame: Math.max(0, absFrame - patternsFrame),
    fps,
    config: { damping: 14, stiffness: 190, mass: 0.8 },
  });

  const barsAnim = spring({
    frame: Math.max(0, absFrame - seekhaFrame),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.85 },
  });

  const branches = [
    { word: "office", prob: 46, tag: "Common Habit", accent: true },
    { word: "market", prob: 31, tag: "Weekend / Evening", accent: false },
    { word: "gym", prob: 17, tag: "Morning Routine", accent: false },
    { word: "home", prob: 6, tag: "Other", accent: false },
  ];

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
        fontFamily: theme.typography.displayFont,
      }}
    >
      {/* Eyebrow & Title */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: theme.colors.accent,
            background: theme.colors.accentSoft,
            padding: "8px 24px",
            borderRadius: 999,
          }}
        >
          {scene.eyebrow ?? "STATISTICAL PATTERNS"}
        </span>
        <h1
          style={{
            fontSize: theme.typography.titleSize,
            fontWeight: 800,
            color: theme.colors.text,
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {scene.title ?? "How Does It Know?"}
        </h1>
      </div>

      {/* Probability Tree Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 920,
          background: theme.colors.surface,
          borderRadius: 36,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 28px 60px rgba(30, 25, 21, 0.08)",
          padding: "36px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Source Prefix */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: theme.colors.bgSecondary,
            padding: "18px 24px",
            borderRadius: 20,
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: theme.colors.muted }}>
              PREVIOUS WORDS:
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: theme.colors.text,
                fontFamily: theme.typography.monoFont,
              }}
            >
              "going to the"
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: theme.colors.accent,
              background: theme.colors.accentSoft,
              padding: "6px 14px",
              borderRadius: 10,
            }}
          >
            N-GRAM PROBABILITY
          </span>
        </div>

        {/* Probability Bars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: interpolate(branchAnim, [0, 1], [0, 1]),
          }}
        >
          {branches.map((b, i) => {
            const barWidth = interpolate(barsAnim, [0, 1], [0, b.prob]);
            return (
              <div
                key={b.word}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        fontFamily: theme.typography.monoFont,
                        fontSize: 22,
                        fontWeight: 700,
                        color: b.accent ? theme.colors.accent : theme.colors.text,
                      }}
                    >
                      → "{b.word}"
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: theme.colors.muted,
                        fontWeight: 600,
                      }}
                    >
                      ({b.tag})
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: theme.typography.monoFont,
                      fontSize: 20,
                      fontWeight: 800,
                      color: b.accent ? theme.colors.accent : theme.colors.text,
                    }}
                  >
                    {Math.round(barWidth)}%
                  </span>
                </div>

                {/* Progress bar container */}
                <div
                  style={{
                    height: 14,
                    width: "100%",
                    background: theme.colors.bgSecondary,
                    borderRadius: 7,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${barWidth}%`,
                      background: b.accent ? theme.colors.accent : theme.colors.muted,
                      borderRadius: 7,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Insight Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: theme.colors.bgSecondary,
            padding: "14px 20px",
            borderRadius: 16,
            fontSize: 18,
            fontWeight: 600,
            color: theme.colors.text,
          }}
        >
          <BrainCircuit size={22} color={theme.colors.accent} />
          <span>Learned from millions of text patterns</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

