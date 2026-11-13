import React from "react";
import { Bot, Keyboard, Smartphone, Sparkles, ArrowRight } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 1: Keyboard ↔ ChatGPT Analogy Hook
 * Spoken: "Agar main tumse kahun ki ChatGPT basically tumhare phone ke keyboard ka ek bahut hi advanced version hai... Thoda weird lagega na? But actually concept samajhne ke liye ye analogy kafi useful hai."
 */
export const KeyboardVsChatGptScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const chatGptCueSec = resolveCueTime(transcript, sceneStartSec + 1.6, "ChatGPT basically", sceneStartSec);
  const weirdCueSec = resolveCueTime(transcript, sceneStartSec + 6.6, "weird lagega", sceneStartSec);
  const analogyCueSec = resolveCueTime(transcript, sceneStartSec + 8.5, "analogy", sceneStartSec);

  const chatGptFrame = secToFrame(chatGptCueSec, fps);
  const weirdFrame = secToFrame(weirdCueSec, fps);
  const analogyFrame = secToFrame(analogyCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const chatGptPop = spring({
    frame: Math.max(0, absFrame - chatGptFrame),
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  const weirdBadgePop = spring({
    frame: Math.max(0, absFrame - weirdFrame),
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.7 },
  });

  const analogyBadgePop = spring({
    frame: Math.max(0, absFrame - analogyFrame),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.85 },
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
      {/* Eyebrow & Main Title */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
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
          {scene.eyebrow ?? "AI ANALOGY // 60 FPS"}
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
          {scene.title ?? "Phone Keyboard ↔ ChatGPT"}
        </h1>
      </div>

      {/* Main Comparison Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 920,
          background: theme.colors.surface,
          borderRadius: 36,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 28px 60px rgba(30, 25, 21, 0.08)",
          padding: "44px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 24,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left: Phone Keyboard */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "28px 20px",
              borderRadius: 24,
              background: theme.colors.bgSecondary,
              border: `1px solid ${theme.colors.surfaceBorder}`,
              gap: 14,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 22,
                background: theme.colors.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.text,
                boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              }}
            >
              <Smartphone size={40} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.text }}>
                Phone Keyboard
              </div>
              <div style={{ fontSize: 20, color: theme.colors.muted, marginTop: 4 }}>
                Local Autocomplete
              </div>
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.colors.muted,
                background: theme.colors.surface,
                padding: "6px 14px",
                borderRadius: 12,
                fontFamily: theme.typography.monoFont,
              }}
            >
              Predicts 1 Next Word
            </div>
          </div>

          {/* Center Connection Arrow */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: theme.colors.accentSoft,
                color: theme.colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${1 + Math.sin(frame * 0.12) * 0.08})`,
              }}
            >
              <ArrowRight size={26} strokeWidth={2.8} />
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: theme.colors.accent,
              }}
            >
              Same Idea
            </span>
          </div>

          {/* Right: ChatGPT LLM */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "28px 20px",
              borderRadius: 24,
              background: theme.colors.accentSoft,
              border: `1.5px solid ${theme.colors.accent}`,
              gap: 14,
              transform: `scale(${interpolate(chatGptPop, [0, 1], [0.85, 1])})`,
              opacity: interpolate(chatGptPop, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 22,
                background: theme.colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 10px 24px rgba(204, 84, 36, 0.3)",
              }}
            >
              <Sparkles size={40} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: theme.colors.accent }}>
                ChatGPT (LLM)
              </div>
              <div style={{ fontSize: 20, color: theme.colors.text, marginTop: 4 }}>
                Supercharged Brain
              </div>
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#FFFFFF",
                background: theme.colors.accent,
                padding: "6px 14px",
                borderRadius: 12,
                fontFamily: theme.typography.monoFont,
              }}
            >
              Predicts Next Token
            </div>
          </div>
        </div>

        {/* Dynamic Context Pills (Weird? -> Useful Analogy) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              opacity: interpolate(weirdBadgePop, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(weirdBadgePop, [0, 1], [16, 0])}px)`,
              background: theme.colors.bgSecondary,
              padding: "10px 20px",
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 600,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.surfaceBorder}`,
            }}
          >
            Sounds weird at first? 🤔
          </div>

          <div
            style={{
              opacity: interpolate(analogyBadgePop, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(analogyBadgePop, [0, 1], [16, 0])}px)`,
              background: theme.colors.accent,
              padding: "10px 24px",
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 700,
              color: "#FFFFFF",
              boxShadow: "0 8px 20px rgba(204, 84, 36, 0.25)",
            }}
          >
            Best Mental Model 💡
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

