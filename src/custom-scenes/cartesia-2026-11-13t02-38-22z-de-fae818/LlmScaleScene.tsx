import React from "react";
import { ArrowUpRight, Bot, Cpu, Layers, Sparkles } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 4: Scaling Up to Massive LLMs & ChatGPT Prompt
 * Spoken: "Exactly isi basic idea ko LLM bahut bade scale par use karta hai. Ab imagine karo, tum ChatGPT ko likhte ho: 'I am going to the...'"
 */
export const LlmScaleScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const llmCueSec = resolveCueTime(transcript, sceneStartSec + 1.2, "LLM bahut", sceneStartSec);
  const imagineCueSec = resolveCueTime(transcript, sceneStartSec + 5.2, "Ab imagine karo", sceneStartSec);

  const llmFrame = secToFrame(llmCueSec, fps);
  const imagineFrame = secToFrame(imagineCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const scalePop = spring({
    frame: Math.max(0, absFrame - llmFrame),
    fps,
    config: { damping: 14, stiffness: 190, mass: 0.8 },
  });

  const promptPop = spring({
    frame: Math.max(0, absFrame - imagineFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.75 },
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
          {scene.eyebrow ?? "THE SCALE UP"}
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
          {scene.title ?? "Same Idea, Giant Scale"}
        </h1>
      </div>

      {/* Comparison Scale Card */}
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
          gap: 26,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Scale comparison metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            opacity: interpolate(scalePop, [0, 1], [0, 1]),
          }}
        >
          {/* Phone Level */}
          <div
            style={{
              background: theme.colors.bgSecondary,
              borderRadius: 24,
              padding: "24px",
              border: `1px solid ${theme.colors.surfaceBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: theme.colors.muted }}>
                PHONE KEYBOARD
              </span>
              <Layers size={20} color={theme.colors.muted} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: theme.colors.text }}>
              ~10MB Model
            </div>
            <div style={{ fontSize: 16, color: theme.colors.muted }}>
              Checks previous 1-2 words only
            </div>
          </div>

          {/* LLM Level */}
          <div
            style={{
              background: theme.colors.accentSoft,
              borderRadius: 24,
              padding: "24px",
              border: `1.5px solid ${theme.colors.accent}`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: theme.colors.accent }}>
                MODERN LLM (GPT-4)
              </span>
              <Sparkles size={22} color={theme.colors.accent} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: theme.colors.accent }}>
              Trillions of Tokens
            </div>
            <div style={{ fontSize: 16, color: theme.colors.text }}>
              Understands entire book-length context
            </div>
          </div>
        </div>

        {/* ChatGPT Prompt Interface */}
        <div
          style={{
            opacity: interpolate(promptPop, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(promptPop, [0, 1], [16, 0])}px)`,
            background: theme.colors.bgSecondary,
            borderRadius: 22,
            padding: "24px 28px",
            border: `1px solid ${theme.colors.surfaceBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Bot size={22} color={theme.colors.accent} />
            <span style={{ fontSize: 15, fontWeight: 700, color: theme.colors.muted }}>
              YOU TYPE INTO CHATGPT:
            </span>
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: theme.typography.monoFont,
              color: theme.colors.text,
              background: theme.colors.surface,
              padding: "16px 20px",
              borderRadius: 14,
              border: `1px solid ${theme.colors.surfaceBorder}`,
            }}
          >
            "I am going to the..."
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

