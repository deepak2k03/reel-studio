import React from "react";
import { ArrowRight, Award, Bot, RefreshCw, Sparkles } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 7: The Autoregressive Loop & World's Most Powerful Autocomplete
 * Spoken: "Toh simple language mein, LLM basically next token predict karta rehta hai, one after another, aur isi process se pura response generate ho jata hai. Isiliye main LLM ko kehta hoon: 'The world's most powerful autocomplete'."
 */
export const AutocompleteLoopScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const loopCueSec = resolveCueTime(transcript, sceneStartSec + 2.0, "one after another", sceneStartSec);
  const titleCueSec = resolveCueTime(transcript, sceneStartSec + 5.5, "The world's most powerful autocomplete", sceneStartSec);

  const loopFrame = secToFrame(loopCueSec, fps);
  const titleFrame = secToFrame(titleCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const trophyPop = spring({
    frame: Math.max(0, absFrame - titleFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.8 },
  });

  const stepHighlight = Math.floor((frame / 20) % 3);

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
          {scene.eyebrow ?? "AUTOREGRESSIVE LOOP"}
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
          {scene.title ?? "The Token Prediction Loop"}
        </h1>
      </div>

      {/* Main Card */}
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
          gap: 24,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* The 3-Step Cyclical Flow */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              background: stepHighlight === 0 ? theme.colors.accentSoft : theme.colors.bgSecondary,
              border: `1.5px solid ${stepHighlight === 0 ? theme.colors.accent : theme.colors.surfaceBorder}`,
              borderRadius: 20,
              padding: "20px 14px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              transform: `scale(${stepHighlight === 0 ? 1.04 : 1})`,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: stepHighlight === 0 ? theme.colors.accent : theme.colors.muted,
              }}
            >
              STEP 1
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: stepHighlight === 0 ? theme.colors.accent : theme.colors.text,
              }}
            >
              Read Context
            </span>
          </div>

          <ArrowRight size={22} color={theme.colors.muted} />

          {/* Step 2 */}
          <div
            style={{
              background: stepHighlight === 1 ? theme.colors.accentSoft : theme.colors.bgSecondary,
              border: `1.5px solid ${stepHighlight === 1 ? theme.colors.accent : theme.colors.surfaceBorder}`,
              borderRadius: 20,
              padding: "20px 14px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              transform: `scale(${stepHighlight === 1 ? 1.04 : 1})`,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: stepHighlight === 1 ? theme.colors.accent : theme.colors.muted,
              }}
            >
              STEP 2
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: stepHighlight === 1 ? theme.colors.accent : theme.colors.text,
              }}
            >
              Predict 1 Token
            </span>
          </div>

          <ArrowRight size={22} color={theme.colors.muted} />

          {/* Step 3 */}
          <div
            style={{
              background: stepHighlight === 2 ? theme.colors.accentSoft : theme.colors.bgSecondary,
              border: `1.5px solid ${stepHighlight === 2 ? theme.colors.accent : theme.colors.surfaceBorder}`,
              borderRadius: 20,
              padding: "20px 14px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              transform: `scale(${stepHighlight === 2 ? 1.04 : 1})`,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: stepHighlight === 2 ? theme.colors.accent : theme.colors.muted,
              }}
            >
              STEP 3
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: stepHighlight === 2 ? theme.colors.accent : theme.colors.text,
              }}
            >
              Append & Repeat ↺
            </span>
          </div>
        </div>

        {/* Big Climax Banner: The World's Most Powerful Autocomplete */}
        <div
          style={{
            background: "linear-gradient(135deg, #CC5424 0%, #A83E15 100%)",
            color: "#FFFFFF",
            borderRadius: 26,
            padding: "28px 26px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            boxShadow: "0 18px 40px rgba(204, 84, 36, 0.35)",
            opacity: interpolate(trophyPop, [0, 1], [0.4, 1]),
            transform: `scale(${interpolate(trophyPop, [0, 1], [0.95, 1])})`,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#FFFFFF",
            }}
          >
            <Award size={40} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FEE2E2",
              }}
            >
              THE BIG REVELATION
            </span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
              }}
            >
              "The World's Most Powerful Autocomplete"
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
