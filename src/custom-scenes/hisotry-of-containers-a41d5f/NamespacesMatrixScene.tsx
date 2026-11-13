import React from "react";
import { Cpu, Eye, Globe, Network, Shield, UserCheck } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 4: The 4 Namespaces & The Matrix Illusion
 * Spoken: "Sirf file system hi nahi: PID namespace mein wo khud ko PID 1 samajhta hai, jabki host pe uska number 4523 hai. Network namespace mein uska apna IP aur network card. User namespace mein andar wo root hai, bahar normal user. Bilkul Matrix jaisa! Lekin ek problem abhi bhi baaki thi."
 */
export const NamespacesMatrixScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const pidCueSec = resolveCueTime(transcript, sceneStartSec + 3.2, "PID 1 samajhta hai", sceneStartSec);
  const netCueSec = resolveCueTime(transcript, sceneStartSec + 6.8, "Network namespace mein", sceneStartSec);
  const userCueSec = resolveCueTime(transcript, sceneStartSec + 10.2, "User namespace mein", sceneStartSec);
  const matrixCueSec = resolveCueTime(transcript, sceneStartSec + 13.5, "Bilkul Matrix jaisa", sceneStartSec);

  const pidFrame = secToFrame(pidCueSec, fps);
  const netFrame = secToFrame(netCueSec, fps);
  const userFrame = secToFrame(userCueSec, fps);
  const matrixFrame = secToFrame(matrixCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const matrixPop = spring({
    frame: Math.max(0, absFrame - matrixFrame),
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.7 },
  });

  const nsItems = [
    {
      name: "PID Namespace",
      inside: "PID 1 (init)",
      outside: "PID 4523 (host)",
      icon: Cpu,
    },
    {
      name: "Network Namespace",
      inside: "eth0 (172.17.0.2)",
      outside: "veth9a2f (host bridge)",
      icon: Network,
    },
    {
      name: "User Namespace",
      inside: "root (uid 0)",
      outside: "deepak (uid 1000)",
      icon: UserCheck,
    },
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
          {scene.eyebrow ?? "THE MATRIX ILLUSION"}
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
          {scene.title ?? "Inside vs Outside Host"}
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
          boxShadow: "0 28px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(36, 156, 228, 0.12)",
          padding: "36px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: 12,
            padding: "0 16px",
            fontSize: 13,
            fontWeight: 800,
            color: theme.colors.muted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <span>Linux Namespace</span>
          <span style={{ color: theme.colors.accent }}>Inside Container</span>
          <span style={{ color: theme.colors.success }}>Outside Host</span>
        </div>

        {/* 3 Namespaces Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {nsItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                style={{
                  background: "rgba(14, 20, 35, 0.95)",
                  border: `1px solid ${theme.colors.surfaceBorder}`,
                  borderRadius: 18,
                  padding: "18px 20px",
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "rgba(36, 156, 228, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.colors.accent,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 700, color: theme.colors.text }}>
                    {item.name}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 16,
                    fontWeight: 800,
                    color: theme.colors.accent,
                  }}
                >
                  {item.inside}
                </span>

                <span
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 16,
                    fontWeight: 700,
                    color: theme.colors.success,
                  }}
                >
                  {item.outside}
                </span>
              </div>
            );
          })}
        </div>

        {/* Matrix Illusion Slogan */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: "1.5px solid rgba(34, 197, 94, 0.4)",
            borderRadius: 20,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: interpolate(matrixPop, [0, 1], [0.35, 1]),
            transform: `scale(${interpolate(matrixPop, [0, 1], [0.95, 1])})`,
          }}
        >
          <Eye size={22} color={theme.colors.success} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>
            "Bilkul Matrix jaisa — process thinks it owns the entire machine!" 🕶️
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

