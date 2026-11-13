import React from "react";
import { Box, Layers, ShieldAlert, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 1: Docker is Just a Wrapper (Origin Hook)
 * Spoken: "Jis Docker ko aaj poori duniya apps deploy karne ke liye use karti hai, wo sirf ek wrapper hai, ek bahut badi technology ka: Linux containers. Aur sabse mazedaar baat? Containers deployment ke liye bane hi nahi the!"
 */
export const DockerWrapperScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const wrapperCueSec = resolveCueTime(transcript, sceneStartSec + 3.8, "sirf ek wrapper hai", sceneStartSec);
  const linuxCueSec = resolveCueTime(transcript, sceneStartSec + 6.8, "Linux containers", sceneStartSec);
  const securityCueSec = resolveCueTime(transcript, sceneStartSec + 9.5, "bane hi nahi the", sceneStartSec);

  const wrapperFrame = secToFrame(wrapperCueSec, fps);
  const linuxFrame = secToFrame(linuxCueSec, fps);
  const securityFrame = secToFrame(securityCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const wrapperPop = spring({
    frame: Math.max(0, absFrame - wrapperFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.75 },
  });

  const linuxPop = spring({
    frame: Math.max(0, absFrame - linuxFrame),
    fps,
    config: { damping: 14, stiffness: 190, mass: 0.8 },
  });

  const securityPop = spring({
    frame: Math.max(0, absFrame - securityFrame),
    fps,
    config: { damping: 12, stiffness: 230, mass: 0.7 },
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
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          {scene.eyebrow ?? "THE UNTOLD ORIGIN // 60 FPS"}
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
          {scene.title ?? "Docker is Just a Wrapper"}
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
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 26,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Layer 1: Outer Shell (Docker) */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: `1.5px solid ${theme.colors.accent}`,
            borderRadius: 24,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(36, 156, 228, 0.18)",
            opacity: interpolate(wrapperPop, [0, 1], [0.4, 1]),
            transform: `scale(${interpolate(wrapperPop, [0, 1], [0.95, 1])})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
                boxShadow: "0 8px 20px rgba(36, 156, 228, 0.4)",
              }}
            >
              <Terminal size={30} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>
                Docker CLI & Daemon
              </div>
              <div style={{ fontSize: 16, color: theme.colors.accent, fontWeight: 600 }}>
                The Outer User-Friendly Wrapper
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#FFFFFF",
              background: theme.colors.accent,
              padding: "6px 16px",
              borderRadius: 10,
              fontFamily: theme.typography.monoFont,
            }}
          >
            WRAPPER
          </span>
        </div>

        {/* Layer 2: The Core Engine (Linux Containers) */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: "1.5px solid rgba(52, 211, 153, 0.4)",
            borderRadius: 24,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(linuxPop, [0, 1], [0.4, 1]),
            transform: `scale(${interpolate(linuxPop, [0, 1], [0.95, 1])})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(52, 211, 153, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.success,
              }}
            >
              <Layers size={30} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: theme.colors.text }}>
                Linux Kernel Primitives
              </div>
              <div style={{ fontSize: 15, color: theme.colors.muted }}>
                Namespaces • cgroups • chroot
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: theme.colors.success,
              background: "rgba(52, 211, 153, 0.15)",
              padding: "6px 16px",
              borderRadius: 10,
              fontFamily: theme.typography.monoFont,
            }}
          >
            REAL ENGINE
          </span>
        </div>

        {/* Big Hook Pill: Security, NOT Deployment */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(252, 84, 108, 0.2) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: "1.5px solid rgba(252, 84, 108, 0.5)",
            borderRadius: 22,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            opacity: interpolate(securityPop, [0, 1], [0.25, 1]),
            transform: `scale(${interpolate(securityPop, [0, 1], [0.92, 1])})`,
            boxShadow: "0 10px 30px rgba(252, 84, 108, 0.18)",
          }}
        >
          <ShieldAlert size={26} color={theme.colors.captionHighlight} />
          <span style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>
            "Containers were originally built for SECURITY, not deployment!" 🛡️
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

