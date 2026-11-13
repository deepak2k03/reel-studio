import React from "react";
import { ArrowRight, Boxes, Check, Eye, Gauge, Sparkles, Terminal } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 6: The Container Equation (Namespaces + cgroups = LXC -> Docker 2013)
 * Spoken: "Ab namespaces batate hain process kya DEKH sakta hai, aur cgroups batate hain process kitna USE kar sakta hai. Inhi sab ko jodke bana LXC, par use karna mushkil tha. Phir 2013 mein Docker ne ek Dockerfile, ek image aur ek docker run mein sab easy bana diya."
 */
export const NamespacesCgroupsFormulaScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const seeCueSec = resolveCueTime(transcript, sceneStartSec + 1.8, "kya DEKH sakta hai", sceneStartSec);
  const lxcCueSec = resolveCueTime(transcript, sceneStartSec + 5.5, "jodke bana LXC", sceneStartSec);
  const dockerCueSec = resolveCueTime(transcript, sceneStartSec + 10.2, "2013 mein Docker ne", sceneStartSec);

  const seeFrame = secToFrame(seeCueSec, fps);
  const lxcFrame = secToFrame(lxcCueSec, fps);
  const dockerFrame = secToFrame(dockerCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const formulaPop = spring({
    frame: Math.max(0, absFrame - seeFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.75 },
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
          {scene.eyebrow ?? "THE CONTAINER EQUATION"}
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
          {scene.title ?? "The Magic Formula"}
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
        {/* The Equation Grid: Namespaces + cgroups = LXC */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 16,
            alignItems: "center",
            opacity: interpolate(formulaPop, [0, 1], [0.35, 1]),
          }}
        >
          {/* Card 1: Namespaces */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: `1.5px solid ${theme.colors.accent}`,
              borderRadius: 22,
              padding: "22px 18px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Eye size={28} color={theme.colors.accent} />
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text }}>
              Namespaces
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: theme.colors.accent,
                background: theme.colors.accentSoft,
                padding: "4px 12px",
                borderRadius: 8,
              }}
            >
              What you SEE 👁️
            </div>
          </div>

          <span style={{ fontSize: 28, fontWeight: 800, color: theme.colors.muted }}>
            +
          </span>

          {/* Card 2: cgroups */}
          <div
            style={{
              background: "rgba(14, 20, 35, 0.95)",
              border: "1.5px solid rgba(52, 211, 153, 0.5)",
              borderRadius: 22,
              padding: "22px 18px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Gauge size={28} color={theme.colors.success} />
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text }}>
              cgroups
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: theme.colors.success,
                background: "rgba(52, 211, 153, 0.15)",
                padding: "4px 12px",
                borderRadius: 8,
              }}
            >
              What you USE ⚡
            </div>
          </div>
        </div>

        {/* 2013: Docker packages it */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(36, 156, 228, 0.25) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: `2px solid ${theme.colors.accent}`,
            borderRadius: 24,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(dockerPop, [0, 1], [0.35, 1]),
            transform: `scale(${interpolate(dockerPop, [0, 1], [0.95, 1])})`,
            boxShadow: "0 10px 30px rgba(36, 156, 228, 0.25)",
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
                boxShadow: "0 6px 18px rgba(36, 156, 228, 0.4)",
              }}
            >
              <Sparkles size={32} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: theme.colors.accent, letterSpacing: "0.12em" }}>
                YEAR 2013 REVOLUTION
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF" }}>
                Docker Made It Simple!
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 14,
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.1)",
              padding: "8px 16px",
              borderRadius: 10,
            }}
          >
            Dockerfile + docker run
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

