import React from "react";
import { AlertOctagon, Cpu, Database, Gauge, HardDrive, ShieldAlert, Zap } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 5: Google cgroups (Resource Limits)
 * Spoken: "Isolation mil gaya, par agar ek process pagal ho jaaye aur poori CPU aur RAM kha jaaye, toh baaki sab process bhookhe mar jayenge. Isliye Google ne banaye cgroups, matlab Control Groups. Ye process pe CPU aur RAM ka limit lagate hain. Jaise tum bol do: 'Tu sirf 1 core aur 512MB RAM use karega, bas!' Limit cross ki, toh process ya toh slow ho jayega, ya kill."
 */
export const CgroupsResourceLimitScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const cgroupsCueSec = resolveCueTime(transcript, sceneStartSec + 5.5, "Google ne banaye cgroups", sceneStartSec);
  const limitCueSec = resolveCueTime(transcript, sceneStartSec + 11.5, "sirf 1 core aur 512MB", sceneStartSec);
  const killCueSec = resolveCueTime(transcript, sceneStartSec + 15.5, "ya toh slow ho jayega ya kill", sceneStartSec);

  const cgroupsFrame = secToFrame(cgroupsCueSec, fps);
  const limitFrame = secToFrame(limitCueSec, fps);
  const killFrame = secToFrame(killCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const cgroupsPop = spring({
    frame: Math.max(0, absFrame - cgroupsFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.75 },
  });

  const limitPop = spring({
    frame: Math.max(0, absFrame - limitFrame),
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
          {scene.eyebrow ?? "RESOURCE CONTROL // GOOGLE"}
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
          {scene.title ?? "Google cgroups: Hard Limits"}
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
          gap: 22,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Google cgroups Badge */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: `1.5px solid ${theme.colors.accent}`,
            borderRadius: 22,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(cgroupsPop, [0, 1], [0.35, 1]),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Gauge size={26} color={theme.colors.accent} />
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>
                cgroups (Control Groups)
              </span>
              <div style={{ fontSize: 14, color: theme.colors.muted }}>
                Invented by Google engineers for Linux
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: theme.colors.accent,
              background: theme.colors.accentSoft,
              padding: "6px 14px",
              borderRadius: 8,
              fontFamily: theme.typography.monoFont,
            }}
          >
            KERNEL THROTTLE
          </span>
        </div>

        {/* 2 Hardware Limits (CPU & RAM) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          {/* CPU Limit */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: `1px solid ${theme.colors.surfaceBorder}`,
              borderRadius: 22,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: theme.colors.muted }}>
                CPU LIMIT
              </span>
              <Cpu size={20} color={theme.colors.accent} />
            </div>

            <div style={{ fontSize: 32, fontWeight: 800, color: theme.colors.text }}>
              1 Core Max
            </div>

            {/* Progress bar capped */}
            <div style={{ height: 12, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "40%", background: theme.colors.accent, borderRadius: 6 }} />
            </div>

            <span style={{ fontSize: 13, color: theme.colors.muted }}>
              CFS Bandwidth Throttled
            </span>
          </div>

          {/* RAM Limit */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: "1px solid rgba(251, 113, 133, 0.4)",
              borderRadius: 22,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: theme.colors.danger }}>
                RAM LIMIT
              </span>
              <HardDrive size={20} color={theme.colors.danger} />
            </div>

            <div style={{ fontSize: 32, fontWeight: 800, color: theme.colors.danger }}>
              512 MB Capped
            </div>

            {/* Progress bar hitting ceiling */}
            <div style={{ height: 12, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "95%", background: theme.colors.danger, borderRadius: 6 }} />
            </div>

            <span style={{ fontSize: 13, color: theme.colors.danger }}>
              Exceed ➔ OOM Killer triggered!
            </span>
          </div>
        </div>

        {/* Consequence Card */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(251, 113, 133, 0.15) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: "1.5px solid rgba(251, 113, 133, 0.4)",
            borderRadius: 20,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: interpolate(limitPop, [0, 1], [0.35, 1]),
          }}
        >
          <AlertOctagon size={22} color={theme.colors.danger} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
            "Limit cross ki, toh process ya toh slow ho jayega, ya KILL!" 🛑
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

