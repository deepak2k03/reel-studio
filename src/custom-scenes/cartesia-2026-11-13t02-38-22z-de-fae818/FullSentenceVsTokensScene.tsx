import React from "react";
import { CheckCircle2, MessageSquare, Sparkles, XCircle } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 5: Generated Sentence & Debunking "All At Once"
 * Spoken: "LLM sirf ek word suggest karke rukta nahi. It can generate something like: 'I am going to the office because I have an important meeting today.' Lekin yahan interesting part ye hai ki LLM ye pura sentence ek sath nahi likhta."
 */
export const FullSentenceVsTokensScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  // Reveal myth & reality when narrator transitions to "Lekin yahan interesting part..."
  const interestingCueSec = resolveCueTime(transcript, sceneStartSec + 4.8, "interesting part", sceneStartSec);
  const interestingFrame = secToFrame(interestingCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const revealMythPop = spring({
    frame: Math.max(0, absFrame - interestingFrame),
    fps,
    config: { damping: 13, stiffness: 200, mass: 0.8 },
  });

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
          {scene.eyebrow ?? "HOW LLMS GENERATE"}
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
          {scene.title ?? "Not Generated At Once!"}
        </h1>
      </div>

      {/* Main Container Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 920,
          background: theme.colors.surface,
          borderRadius: 36,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 28px 60px rgba(30, 25, 21, 0.08)",
          padding: "38px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* ChatGPT Response Card */}
        <div
          style={{
            background: theme.colors.bgSecondary,
            borderRadius: 24,
            padding: "26px 28px",
            border: `1px solid ${theme.colors.surfaceBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={22} color={theme.colors.accent} />
              <span style={{ fontSize: 16, fontWeight: 700, color: theme.colors.muted }}>
                CHATGPT FULL RESPONSE:
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: theme.colors.accent,
                background: theme.colors.accentSoft,
                padding: "4px 12px",
                borderRadius: 8,
                fontFamily: theme.typography.monoFont,
              }}
            >
              OUTPUT
            </span>
          </div>

          <div
            style={{
              fontSize: 27,
              fontWeight: 600,
              lineHeight: 1.45,
              color: theme.colors.text,
              fontFamily: theme.typography.monoFont,
            }}
          >
            "I am going to the{" "}
            <span style={{ color: theme.colors.accent, fontWeight: 800 }}>
              office because I have an important meeting today.
            </span>
            "
          </div>
        </div>

        {/* The Crucial Insight: Myth vs Reality */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            opacity: interpolate(revealMythPop, [0, 1], [0.35, 1]),
            transform: `translateY(${interpolate(revealMythPop, [0, 1], [16, 0])}px)`,
          }}
        >
          {/* Myth: All at once */}
          <div
            style={{
              background: "#FFF1F2",
              border: `1.5px solid #FDA4AF`,
              borderRadius: 24,
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#E11D48" }}>
              <XCircle size={24} />
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.05em" }}>
                COMMON MYTH
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#881337", lineHeight: 1.35 }}>
              Writes the whole paragraph in one shot
            </div>
          </div>

          {/* Reality: One token at a time */}
          <div
            style={{
              background: "#F0FDF4",
              border: `1.5px solid #86EFAC`,
              borderRadius: 24,
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#059669" }}>
              <CheckCircle2 size={24} />
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.05em" }}>
                HOW IT WORKS
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#065F46", lineHeight: 1.35 }}>
              Predicts 1 Token at a time, sequentially!
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
