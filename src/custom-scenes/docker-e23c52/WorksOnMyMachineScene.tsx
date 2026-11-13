import React from "react";
import { AlertTriangle, CheckCircle2, Laptop, Sparkles, XCircle } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 1: "It Works On My Machine" Conflict & Docker Hook
 * Spoken: "Kabhi aisa hua hai ki project tumhare laptop pe mast chal raha hai, aur dost ke laptop pe daalte hi error pe error? Ise kehte hain 'It works on my machine' problem, aur isi ka solution hai Docker."
 */
export const WorksOnMyMachineScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const errorCueSec = resolveCueTime(transcript, sceneStartSec + 3.2, "dost ke laptop", sceneStartSec);
  const problemCueSec = resolveCueTime(transcript, sceneStartSec + 5.8, "It works on my machine", sceneStartSec);
  const dockerCueSec = resolveCueTime(transcript, sceneStartSec + 8.2, "solution hai Docker", sceneStartSec);

  const errorFrame = secToFrame(errorCueSec, fps);
  const problemFrame = secToFrame(problemCueSec, fps);
  const dockerFrame = secToFrame(dockerCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const errorPop = spring({
    frame: Math.max(0, absFrame - errorFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

  const problemPop = spring({
    frame: Math.max(0, absFrame - problemFrame),
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  const dockerPop = spring({
    frame: Math.max(0, absFrame - dockerFrame),
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
          {scene.eyebrow ?? "THE DEVOPS DILEMMA // 60 FPS"}
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
          {scene.title ?? "Works On My Machine?"}
        </h1>
      </div>

      {/* Main Comparison Container */}
      <div
        style={{
          width: "100%",
          maxWidth: 920,
          background: theme.colors.surface,
          borderRadius: 36,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 28px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(36, 156, 228, 0.12)",
          padding: "38px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Dual Laptop Comparison */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {/* My Laptop */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: "1.5px solid rgba(52, 211, 153, 0.4)",
              boxShadow: "0 12px 30px rgba(52, 211, 153, 0.08)",
              borderRadius: 24,
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(52, 211, 153, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.success,
              }}
            >
              <Laptop size={32} />
            </div>

            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
                Your Laptop
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: theme.colors.success,
                  fontWeight: 600,
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <CheckCircle2 size={18} /> Runs Perfectly
              </div>
            </div>

            <div
              style={{
                fontSize: 14,
                color: theme.colors.muted,
                fontFamily: theme.typography.monoFont,
                background: "rgba(255,255,255,0.04)",
                padding: "6px 12px",
                borderRadius: 10,
                width: "100%",
              }}
            >
              Node 20 • Python 3.11
            </div>
          </div>

          {/* Friend's Laptop */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: "1.5px solid rgba(251, 113, 133, 0.4)",
              boxShadow: "0 12px 30px rgba(251, 113, 133, 0.08)",
              borderRadius: 24,
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              textAlign: "center",
              alignItems: "center",
              opacity: interpolate(errorPop, [0, 1], [0.35, 1]),
              transform: `scale(${interpolate(errorPop, [0, 1], [0.92, 1])})`,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(251, 113, 133, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.danger,
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
                Friend's Laptop
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: theme.colors.danger,
                  fontWeight: 600,
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <XCircle size={18} /> Error on Error!
              </div>
            </div>

            <div
              style={{
                fontSize: 14,
                color: theme.colors.danger,
                fontFamily: theme.typography.monoFont,
                background: "rgba(251, 113, 133, 0.08)",
                padding: "6px 12px",
                borderRadius: 10,
                width: "100%",
              }}
            >
              ModuleNotFoundError 💥
            </div>
          </div>
        </div>

        {/* The Solution Banner: Docker */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(36, 156, 228, 0.22) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: `1.5px solid ${theme.colors.accent}`,
            borderRadius: 22,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(dockerPop, [0, 1], [0.25, 1]),
            transform: `scale(${interpolate(dockerPop, [0, 1], [0.94, 1])})`,
            boxShadow: "0 10px 30px rgba(36, 156, 228, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: theme.colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 6px 16px rgba(36, 156, 228, 0.4)",
              }}
            >
              <Sparkles size={28} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: theme.colors.accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                THE UNIVERSAL FIX
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF" }}>
                Enter Docker 🐳
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#FFFFFF",
              background: theme.colors.accent,
              padding: "8px 18px",
              borderRadius: 12,
              fontFamily: theme.typography.monoFont,
            }}
          >
            Container Engine
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

