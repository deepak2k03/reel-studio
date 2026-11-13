import React from "react";
import { AlertTriangle, Lock, ShieldAlert, Terminal, XCircle } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 2: The First Jail: chroot (1979)
 * Spoken: "Server pe koi third-party process jaise FTP hack ho jaaye, toh attacker poora file system dekh sakta tha. Isko rokne ke liye aaya ek command: chroot. chroot ka matlab: change root. Command likho: chroot jail /bin/bash. Ab us process ke liye jail hi uska root ban gaya. Wo cd karke bhi bahar nahi nikal sakta, kyunki uske liye upar kuch hai hi nahi."
 */
export const ChrootJailScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const chrootCmdCueSec = resolveCueTime(transcript, sceneStartSec + 6.0, "aaya ek command chroot", sceneStartSec);
  const bashCmdCueSec = resolveCueTime(transcript, sceneStartSec + 8.4, "chroot jail bin bash", sceneStartSec);
  const jailLockCueSec = resolveCueTime(transcript, sceneStartSec + 11.6, "jail hi uska root ban gaya", sceneStartSec);

  const chrootCmdFrame = secToFrame(chrootCmdCueSec, fps);
  const bashCmdFrame = secToFrame(bashCmdCueSec, fps);
  const jailLockFrame = secToFrame(jailLockCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const cmdPop = spring({
    frame: Math.max(0, absFrame - chrootCmdFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.75 },
  });

  const lockPop = spring({
    frame: Math.max(0, absFrame - jailLockFrame),
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.7 },
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
          {scene.eyebrow ?? "YEAR 1979 // UNIX"}
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
          {scene.title ?? "The First Jail: chroot"}
        </h1>
      </div>

      {/* Main Terminal & Jail Container */}
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
        {/* Terminal Header */}
        <div
          style={{
            background: "#080E1E",
            border: `1px solid ${theme.colors.surfaceBorder}`,
            borderRadius: 22,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            opacity: interpolate(cmdPop, [0, 1], [0.35, 1]),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
            <span style={{ fontSize: 13, color: theme.colors.muted, marginLeft: 8, fontFamily: theme.typography.monoFont }}>
              root@server: ~
            </span>
          </div>

          <div
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 24,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            <span style={{ color: theme.colors.success }}>$</span>{" "}
            chroot /jail /bin/bash
          </div>
        </div>

        {/* The Jail Container Box */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: "2px solid rgba(251, 113, 133, 0.5)",
            borderRadius: 24,
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow: "0 10px 30px rgba(251, 113, 133, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Lock size={24} color={theme.colors.danger} />
              <span style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text }}>
                /jail (New Virtual Root)
              </span>
            </div>

            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: theme.colors.danger,
                background: "rgba(251, 113, 133, 0.15)",
                padding: "6px 14px",
                borderRadius: 8,
                fontFamily: theme.typography.monoFont,
              }}
            >
              CANNOT "cd .."
            </span>
          </div>

          {/* Files Inside the Jail */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              fontFamily: theme.typography.monoFont,
              fontSize: 15,
            }}
          >
            <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: 10, textAlign: "center", color: theme.colors.muted }}>
              📁 /bin/bash
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: 10, textAlign: "center", color: theme.colors.muted }}>
              📁 /lib64
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: 10, textAlign: "center", color: theme.colors.muted }}>
              📁 /app/ftp
            </div>
          </div>
        </div>

        {/* Insight Pill */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: `1px solid ${theme.colors.surfaceBorder}`,
            borderRadius: 20,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: interpolate(lockPop, [0, 1], [0.35, 1]),
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
            "Us process ke liye jail hi uska root ban gaya — upar kuch hai hi nahi!" 🔒
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

