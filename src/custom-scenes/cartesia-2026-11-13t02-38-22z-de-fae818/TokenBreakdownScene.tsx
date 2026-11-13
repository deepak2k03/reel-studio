import React from "react";
import { ArrowRight, Box, Code, Sparkles, Type } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 6: What is a Token? Words, Subwords & Punctuation
 * Spoken: "Ye next token predict karta hai. Phir uske baad next token... phir next... Aur token kya hota hai? Token ek word, word ka part, ya punctuation bhi ho sakta hai."
 */
export const TokenBreakdownScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const nextTokenCueSec = resolveCueTime(transcript, sceneStartSec + 1.2, "next token predict", sceneStartSec);
  const whatIsTokenCueSec = resolveCueTime(transcript, sceneStartSec + 4.0, "token kya hota hai", sceneStartSec);
  const wordPartCueSec = resolveCueTime(transcript, sceneStartSec + 6.2, "word ka part", sceneStartSec);

  const nextTokenFrame = secToFrame(nextTokenCueSec, fps);
  const whatIsTokenFrame = secToFrame(whatIsTokenCueSec, fps);
  const wordPartFrame = secToFrame(wordPartCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const cardsPop = spring({
    frame: Math.max(0, absFrame - whatIsTokenFrame),
    fps,
    config: { damping: 13, stiffness: 200, mass: 0.8 },
  });

  // Highlight scanning through tokens
  const tokens = [
    { text: "I", type: "word", color: "#FDE68A" },
    { text: "am", type: "word", color: "#FDE68A" },
    { text: "go", type: "subword", color: "#FECDD3" },
    { text: "ing", type: "subword", color: "#FECDD3" },
    { text: "to", type: "word", color: "#FDE68A" },
    { text: "the", type: "word", color: "#FDE68A" },
    { text: "office", type: "word", color: "#BAE6FD" },
    { text: ".", type: "punct", color: "#BBF7D0" },
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
          {scene.eyebrow ?? "DEEP DIVE"}
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
          {scene.title ?? "What is a Token?"}
        </h1>
      </div>

      {/* Main Breakdown Card */}
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
        {/* Token Stream Pills */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: theme.colors.muted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            How LLM Sees Text (Token Stream):
          </span>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              background: theme.colors.bgSecondary,
              padding: "18px 20px",
              borderRadius: 20,
              border: `1px solid ${theme.colors.surfaceBorder}`,
            }}
          >
            {tokens.map((t, idx) => {
              const active = Math.floor((frame / 8) % tokens.length) === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: active ? theme.colors.accent : theme.colors.surface,
                    color: active ? "#FFFFFF" : theme.colors.text,
                    border: `1.5px solid ${active ? theme.colors.accent : theme.colors.surfaceBorder}`,
                    padding: "10px 18px",
                    borderRadius: 12,
                    fontFamily: theme.typography.monoFont,
                    fontSize: 24,
                    fontWeight: 700,
                    boxShadow: active ? "0 6px 16px rgba(204, 84, 36, 0.3)" : "none",
                    transform: `scale(${active ? 1.08 : 1})`,
                  }}
                >
                  {t.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Categories: Word, Subword, Punctuation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            opacity: interpolate(cardsPop, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(cardsPop, [0, 1], [16, 0])}px)`,
          }}
        >
          {/* 1. Full Word */}
          <div
            style={{
              background: theme.colors.bgSecondary,
              borderRadius: 20,
              padding: "20px 16px",
              border: `1px solid ${theme.colors.surfaceBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: theme.colors.accent }}>
              1. WHOLE WORD
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: theme.colors.text,
                fontFamily: theme.typography.monoFont,
              }}
            >
              "office"
            </span>
            <span style={{ fontSize: 14, color: theme.colors.muted }}>Standard word</span>
          </div>

          {/* 2. Subword Part */}
          <div
            style={{
              background: theme.colors.accentSoft,
              borderRadius: 20,
              padding: "20px 16px",
              border: `1.5px solid ${theme.colors.accent}`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: theme.colors.accent }}>
              2. SUBWORD PART
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: theme.colors.accent,
                fontFamily: theme.typography.monoFont,
              }}
            >
              "go" + "ing"
            </span>
            <span style={{ fontSize: 14, color: theme.colors.text }}>Parts of a word</span>
          </div>

          {/* 3. Punctuation */}
          <div
            style={{
              background: theme.colors.bgSecondary,
              borderRadius: 20,
              padding: "20px 16px",
              border: `1px solid ${theme.colors.surfaceBorder}`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: theme.colors.accent }}>
              3. PUNCTUATION
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: theme.colors.text,
                fontFamily: theme.typography.monoFont,
              }}
            >
              "." or "?"
            </span>
            <span style={{ fontSize: 14, color: theme.colors.muted }}>Symbols & spaces</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

