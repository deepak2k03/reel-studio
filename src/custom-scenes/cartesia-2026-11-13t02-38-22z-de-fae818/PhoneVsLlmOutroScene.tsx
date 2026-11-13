import React from "react";
import { ArrowRight, Bot, MessageSquare, Smartphone, Sparkles } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 8: Phone vs LLM Comparison & Outro Teaser
 * Spoken: "Bas difference ye hai ki tumhare phone ka autocomplete ek-do words suggest karta hai, aur LLM usi idea ko use karke puri conversation generate kar sakta hai. Aur next reel mein dekhenge ki ye token kya hota hai."
 */
export const PhoneVsLlmOutroScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  // Pop the Next Reel teaser smoothly
  const nextReelCueSec = resolveCueTime(transcript, sceneStartSec + 4.0, "next reel", sceneStartSec);
  const nextReelFrame = secToFrame(nextReelCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const nextReelPop = spring({
    frame: Math.max(0, absFrame - nextReelFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.8 },
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
          {scene.eyebrow ?? "SUMMARY & NEXT REEL"}
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
          {scene.title ?? "Key Difference"}
        </h1>
      </div>

      {/* Main Comparison Grid */}
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
          gap: 22,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Row 1: Phone */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: theme.colors.bgSecondary,
            padding: "20px 24px",
            borderRadius: 22,
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: theme.colors.surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.text,
              flexShrink: 0,
            }}
          >
            <Smartphone size={30} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
              Phone Autocomplete
            </span>
            <span style={{ fontSize: 17, color: theme.colors.muted }}>
              Suggests 1-2 words from basic typing habits
            </span>
          </div>
        </div>

        {/* Row 2: LLM */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: theme.colors.accentSoft,
            padding: "20px 24px",
            borderRadius: 22,
            border: `1.5px solid ${theme.colors.accent}`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: theme.colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            <Sparkles size={30} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: theme.colors.accent }}>
              LLM Autocomplete
            </span>
            <span style={{ fontSize: 17, color: theme.colors.text }}>
              Generates whole coherent dialogues, code & explanations
            </span>
          </div>
        </div>

        {/* Next Reel Banner */}
        <div
          style={{
            background: theme.colors.text,
            color: "#FFFFFF",
            borderRadius: 22,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(nextReelPop, [0, 1], [0.3, 1]),
            transform: `translateY(${interpolate(nextReelPop, [0, 1], [14, 0])}px)`,
            boxShadow: "0 12px 30px rgba(30, 25, 21, 0.2)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: theme.colors.captionHighlight,
              }}
            >
              UPCOMING NEXT REEL
            </span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>
              Deep Dive: What really is a Token?
            </span>
          </div>

          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRight size={24} color="#FFFFFF" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
