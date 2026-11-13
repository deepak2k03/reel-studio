import React from "react";
import { Cloud, Globe, Laptop, Server, Sparkles, Terminal } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 5: The Golden Slogan: Build Once, Run Anywhere!
 * Spoken: "Toh yaad rakhna: Docker ka matlab hai ek baar banao, kahin bhi chalao!"
 */
export const BuildOnceRunAnywhereScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const bannerPop = spring({
    frame: Math.max(0, absFrame - secToFrame(sceneStartSec + 0.8, fps)),
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.7 },
  });

  const targets = [
    { label: "Mac / Windows", icon: Laptop },
    { label: "Cloud (AWS / GCP)", icon: Cloud },
    { label: "Linux Servers", icon: Server },
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
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          {scene.eyebrow ?? "THE GOLDEN RULE"}
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
          {scene.title ?? "Build Once, Run Anywhere"}
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
          boxShadow: "0 28px 60px rgba(0, 0, 0, 0.45), 0 0 50px rgba(36, 156, 228, 0.2)",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 26,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Central Glowing Slogan Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(36, 156, 228, 0.3) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: `2px solid ${theme.colors.accent}`,
            borderRadius: 26,
            padding: "32px 28px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            boxShadow: "0 16px 40px rgba(36, 156, 228, 0.3)",
            opacity: interpolate(bannerPop, [0, 1], [0.4, 1]),
            transform: `scale(${interpolate(bannerPop, [0, 1], [0.94, 1])})`,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: theme.colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(36, 156, 228, 0.4)",
            }}
          >
            <Sparkles size={42} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: theme.colors.accent,
              }}
            >
              TAKEAWAY // DOCKER
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
              }}
            >
              "Ek Baar Banao, Kahin Bhi Chalao!" 🚀
            </span>
          </div>
        </div>

        {/* 3 Deployment Targets */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          {targets.map((tgt) => {
            const Icon = tgt.icon;
            return (
              <div
                key={tgt.label}
                style={{
                  background: "rgba(14, 20, 35, 0.95)",
                  border: `1px solid ${theme.colors.surfaceBorder}`,
                  borderRadius: 20,
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(36, 156, 228, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.colors.accent,
                  }}
                >
                  <Icon size={24} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: theme.colors.text }}>
                  {tgt.label}
                </span>
                <span style={{ fontSize: 13, color: theme.colors.success, fontWeight: 600 }}>
                  ✓ Identical Behavior
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

