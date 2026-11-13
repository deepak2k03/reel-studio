import React from "react";
import { Cpu, HelpCircle, Layers, Server, Zap } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 4: Virtual Machine vs Docker Containers
 * Spoken: "Ye toh virtual machine jaisa hai? Nahi, VM mein har app ke liye pura alag OS chalta hai — bhaari aur slow. Docker containers host ka kernel share karte hain, isliye halke hain aur seconds mein start hote hain. Ye namespaces aur cgroups ka kamaal hai."
 */
export const VmVsContainersScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const vmQuestionCueSec = resolveCueTime(transcript, sceneStartSec + 0.8, "virtual machine jaisa", sceneStartSec);
  const slowCueSec = resolveCueTime(transcript, sceneStartSec + 3.4, "bhaari aur slow", sceneStartSec);
  const kernelCueSec = resolveCueTime(transcript, sceneStartSec + 6.2, "kernel share karte hain", sceneStartSec);
  const namespacesCueSec = resolveCueTime(transcript, sceneStartSec + 10.5, "namespaces aur cgroups", sceneStartSec);

  const vmQuestionFrame = secToFrame(vmQuestionCueSec, fps);
  const slowFrame = secToFrame(slowCueSec, fps);
  const kernelFrame = secToFrame(kernelCueSec, fps);
  const namespacesFrame = secToFrame(namespacesCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const kernelPop = spring({
    frame: Math.max(0, absFrame - kernelFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.8 },
  });

  const techPop = spring({
    frame: Math.max(0, absFrame - namespacesFrame),
    fps,
    config: { damping: 12, stiffness: 230, mass: 0.75 },
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
          {scene.eyebrow ?? "ARCHITECTURE DEEP DIVE"}
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
          {scene.title ?? "VMs vs Docker Containers"}
        </h1>
      </div>

      {/* Main Container */}
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
          gap: 22,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Comparison Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {/* Virtual Machine */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: "1.5px solid rgba(251, 113, 133, 0.4)",
              borderRadius: 24,
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: theme.colors.danger }}>
                VIRTUAL MACHINE
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.colors.danger,
                  background: "rgba(251, 113, 133, 0.12)",
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                HEAVY
              </span>
            </div>

            {/* Architecture Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ background: "rgba(255,255,255,0.06)", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: 700, color: theme.colors.text }}>
                Application 1
              </div>
              <div style={{ background: "rgba(251, 113, 133, 0.2)", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: 800, color: theme.colors.danger }}>
                Full Guest OS (15 GB)
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 14, color: theme.colors.muted }}>
                Hypervisor
              </div>
            </div>

            <div style={{ fontSize: 14, color: theme.colors.muted, textAlign: "center" }}>
              Slow boot (minutes) • Gigabytes of RAM
            </div>
          </div>

          {/* Docker Container */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: `1.5px solid ${theme.colors.accent}`,
              boxShadow: "0 10px 30px rgba(36, 156, 228, 0.2)",
              borderRadius: 24,
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              transform: `scale(${interpolate(kernelPop, [0, 1], [0.96, 1])})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: theme.colors.accent }}>
                DOCKER CONTAINER
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.colors.success,
                  background: "rgba(52, 211, 153, 0.15)",
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                LIGHTWEIGHT
              </span>
            </div>

            {/* Architecture Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ background: "rgba(36, 156, 228, 0.2)", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: 800, color: theme.colors.accent }}>
                App + Dependencies
              </div>
              <div style={{ background: "rgba(36, 156, 228, 0.35)", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>
                Docker Engine
              </div>
              <div style={{ background: "rgba(52, 211, 153, 0.2)", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: 700, color: theme.colors.success }}>
                Shared Host Kernel ✓
              </div>
            </div>

            <div style={{ fontSize: 14, color: theme.colors.success, fontWeight: 600, textAlign: "center" }}>
              Starts in milliseconds • Ultra-light MBs
            </div>
          </div>
        </div>

        {/* Linux Namespaces & cgroups Secret Sauce Banner */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: `1px solid ${theme.colors.surfaceBorder}`,
            borderRadius: 20,
            padding: "16px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(techPop, [0, 1], [0.35, 1]),
            transform: `translateY(${interpolate(techPop, [0, 1], [10, 0])}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Cpu size={24} color={theme.colors.accent} />
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
                Under the Hood: Linux Magic
              </span>
              <div style={{ fontSize: 13, color: theme.colors.muted }}>
                Isolation & resource allocation
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: theme.colors.accent,
                fontFamily: theme.typography.monoFont,
                background: theme.colors.accentSoft,
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              namespaces
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: theme.colors.success,
                fontFamily: theme.typography.monoFont,
                background: "rgba(52, 211, 153, 0.12)",
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              cgroups
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

