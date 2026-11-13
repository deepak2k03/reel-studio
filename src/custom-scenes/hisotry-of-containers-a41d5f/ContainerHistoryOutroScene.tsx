import React from "react";
import { Award, Heart, Sparkles, ThumbsUp } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 7: Outro & The Real Heroes of Containers
 * Spoken: "Toh yaad rakhna: Docker hero lagta hai, par asli kahani chroot, namespaces aur cgroups se shuru hui thi! Video pasand aaye toh like aur subscribe karna."
 */
export const ContainerHistoryOutroScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const heroesCueSec = resolveCueTime(transcript, sceneStartSec + 2.5, "asli kahani chroot", sceneStartSec);
  const subscribeCueSec = resolveCueTime(transcript, sceneStartSec + 8.5, "like aur subscribe", sceneStartSec);

  const heroesFrame = secToFrame(heroesCueSec, fps);
  const subscribeFrame = secToFrame(subscribeCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const heroesPop = spring({
    frame: Math.max(0, absFrame - heroesFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.75 },
  });

  const subscribePop = spring({
    frame: Math.max(0, absFrame - subscribeFrame),
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.7 },
  });

  const milestones = [
    { year: "1979", name: "chroot", role: "File Root Jail" },
    { year: "2002", name: "Namespaces", role: "Process Isolation" },
    { year: "2006", name: "cgroups", role: "Resource Limits" },
    { year: "2013", name: "Docker", role: "Developer UX" },
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
          {scene.eyebrow ?? "THE REAL HEROES"}
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
          {scene.title ?? "The Evolution of Containers"}
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
          boxShadow: "0 28px 60px rgba(0, 0, 0, 0.45), 0 0 50px rgba(36, 156, 228, 0.2)",
          padding: "36px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Evolution Timeline Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 14,
            opacity: interpolate(heroesPop, [0, 1], [0.35, 1]),
          }}
        >
          {milestones.map((m, idx) => {
            const isDocker = m.name === "Docker";
            return (
              <div
                key={m.name}
                style={{
                  background: isDocker ? "rgba(36, 156, 228, 0.2)" : "rgba(14, 20, 35, 0.95)",
                  border: `1.5px solid ${isDocker ? theme.colors.accent : theme.colors.surfaceBorder}`,
                  borderRadius: 20,
                  padding: "20px 14px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: isDocker ? theme.colors.accent : theme.colors.muted,
                    fontFamily: theme.typography.monoFont,
                  }}
                >
                  {m.year}
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: isDocker ? "#FFFFFF" : theme.colors.text }}>
                  {m.name}
                </span>
                <span style={{ fontSize: 13, color: isDocker ? theme.colors.accent : theme.colors.muted }}>
                  {m.role}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subscribe Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(252, 84, 108, 0.25) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: "1.5px solid rgba(252, 84, 108, 0.4)",
            borderRadius: 24,
            padding: "22px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(subscribePop, [0, 1], [0.35, 1]),
            transform: `scale(${interpolate(subscribePop, [0, 1], [0.95, 1])})`,
            boxShadow: "0 10px 30px rgba(252, 84, 108, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: theme.colors.captionHighlight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 6px 18px rgba(252, 84, 108, 0.4)",
              }}
            >
              <ThumbsUp size={28} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: theme.colors.captionHighlight, letterSpacing: "0.12em" }}>
                LEARN MORE DEV TECH
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>
                Like & Subscribe! 🚀
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.1)",
              padding: "8px 18px",
              borderRadius: 10,
            }}
          >
            @the.stack.engineer
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

