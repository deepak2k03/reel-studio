import React from "react";
import { AlertCircle, CheckCircle2, Network, Shield, Split, XCircle } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 3: chroot Flaws ➔ Linux Namespaces Evolution
 * Spoken: "Par dikkat ye thi ki sirf files chhupti thi. Process list aur network sab shared tha, aur root user jail tod bhi sakta tha. Isliye aaye namespaces. Namespace ka matlab: process ko mil gaya uska apna khud ka partition, ek alag file system jahan wo sirf apni files manage kar sakta hai, aur baaki server se completely isolated."
 */
export const ChrootFlawsToNamespacesScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const flawsCueSec = resolveCueTime(transcript, sceneStartSec + 3.0, "Process list aur network", sceneStartSec);
  const namespacesCueSec = resolveCueTime(transcript, sceneStartSec + 7.5, "Isliye aaye namespaces", sceneStartSec);

  const flawsFrame = secToFrame(flawsCueSec, fps);
  const namespacesFrame = secToFrame(namespacesCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const namespacesPop = spring({
    frame: Math.max(0, absFrame - namespacesFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
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
          {scene.eyebrow ?? "ISOLATION EVOLUTION"}
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
          {scene.title ?? "chroot Flaws ➔ Namespaces"}
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
          {/* Left: chroot Flaws */}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.colors.danger }}>
              <XCircle size={22} />
              <span style={{ fontSize: 18, fontWeight: 800 }}>CHROOT FLAWS</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 15, color: theme.colors.muted }}>
                • Process List: <span style={{ color: theme.colors.danger, fontWeight: 700 }}>SHARED</span>
              </div>
              <div style={{ fontSize: 15, color: theme.colors.muted }}>
                • Network & IP: <span style={{ color: theme.colors.danger, fontWeight: 700 }}>SHARED</span>
              </div>
              <div style={{ fontSize: 15, color: theme.colors.muted }}>
                • Root Escape: <span style={{ color: theme.colors.danger, fontWeight: 700 }}>POSSIBLE</span>
              </div>
            </div>

            <div style={{ fontSize: 13, color: theme.colors.danger, background: "rgba(251, 113, 133, 0.1)", padding: "8px 12px", borderRadius: 8 }}>
              Only hid file paths, not the OS!
            </div>
          </div>

          {/* Right: Linux Namespaces */}
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
              opacity: interpolate(namespacesPop, [0, 1], [0.35, 1]),
              transform: `scale(${interpolate(namespacesPop, [0, 1], [0.94, 1])})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.colors.accent }}>
              <CheckCircle2 size={22} />
              <span style={{ fontSize: 18, fontWeight: 800 }}>LINUX NAMESPACES</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 15, color: theme.colors.text }}>
                • Process List: <span style={{ color: theme.colors.success, fontWeight: 700 }}>ISOLATED</span>
              </div>
              <div style={{ fontSize: 15, color: theme.colors.text }}>
                • Network & IP: <span style={{ color: theme.colors.success, fontWeight: 700 }}>VIRTUAL CARD</span>
              </div>
              <div style={{ fontSize: 15, color: theme.colors.text }}>
                • User Rights: <span style={{ color: theme.colors.success, fontWeight: 700 }}>MAPPED</span>
              </div>
            </div>

            <div style={{ fontSize: 13, color: theme.colors.accent, background: theme.colors.accentSoft, padding: "8px 12px", borderRadius: 8 }}>
              True multi-tenant kernel boundaries!
            </div>
          </div>
        </div>

        {/* Partition Definition Card */}
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
            opacity: interpolate(namespacesPop, [0, 1], [0.3, 1]),
          }}
        >
          <Split size={22} color={theme.colors.accent} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
            "Process ko mil gaya uska apna khud ka partition!" 📦
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

