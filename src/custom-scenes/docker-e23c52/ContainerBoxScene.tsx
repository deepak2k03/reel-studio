import React from "react";
import { Box, Code2, Database, Layers, Package, ShieldCheck } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 2: Container / Tiffin Box Metaphor
 * Spoken: "Docker ek platform hai jo tumhari app ko uski saari cheezon ke saath ek dabbe mein pack kar deta hai. Is dabbe ko kehte hain container. Code, libraries, dependencies, sab andar. Bilkul tiffin box jaisa. Khana ek dabbe mein band, aur jahan bhi jaaye, wahi rahega."
 */
export const ContainerBoxScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const containerCueSec = resolveCueTime(transcript, sceneStartSec + 5.2, "kehte hain container", sceneStartSec);
  const codeCueSec = resolveCueTime(transcript, sceneStartSec + 7.1, "Code libraries dependencies", sceneStartSec);
  const tiffinCueSec = resolveCueTime(transcript, sceneStartSec + 9.6, "tiffin box jaisa", sceneStartSec);

  const containerFrame = secToFrame(containerCueSec, fps);
  const codeFrame = secToFrame(codeCueSec, fps);
  const tiffinFrame = secToFrame(tiffinCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const layersPop = spring({
    frame: Math.max(0, absFrame - codeFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.75 },
  });

  const tiffinPop = spring({
    frame: Math.max(0, absFrame - tiffinFrame),
    fps,
    config: { damping: 14, stiffness: 190, mass: 0.8 },
  });

  const items = [
    { title: "Application Code", icon: Code2, desc: "src/, index.ts, configs", tag: "YOUR CODE", accent: true },
    { title: "Dependencies & Libs", icon: Layers, desc: "node_modules, pip packages", tag: "LIBRARIES", accent: false },
    { title: "OS Runtime & Tools", icon: Package, desc: "Node 20 runtime, Alpine Linux", tag: "RUNTIME", accent: false },
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
          {scene.eyebrow ?? "THE CONTAINER METAPHOR"}
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
          {scene.title ?? "Everything In One Box"}
        </h1>
      </div>

      {/* Main Container Mockup Card */}
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
        {/* Shipping Container Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(14, 20, 35, 0.95)",
            padding: "16px 22px",
            borderRadius: 20,
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Box size={24} color={theme.colors.accent} />
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: theme.colors.text,
                fontFamily: theme.typography.monoFont,
              }}
            >
              docker_container // isolated
            </span>
          </div>

          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: theme.colors.success,
              background: "rgba(52, 211, 153, 0.12)",
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(52, 211, 153, 0.3)",
            }}
          >
            ✓ SEALED & PORTABLE
          </span>
        </div>

        {/* 3 Stacked Layers */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                style={{
                  background: it.accent ? "rgba(36, 156, 228, 0.12)" : "rgba(14, 20, 35, 0.95)",
                  border: `1.5px solid ${it.accent ? theme.colors.accent : theme.colors.surfaceBorder}`,
                  borderRadius: 20,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: interpolate(layersPop, [0, 1], [0.4, 1]),
                  transform: `translateY(${interpolate(layersPop, [0, 1], [12, 0])}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: it.accent ? theme.colors.accent : "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: it.accent ? "#FFFFFF" : theme.colors.accent,
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: theme.colors.text }}>
                      {it.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: theme.colors.muted,
                        fontFamily: theme.typography.monoFont,
                        marginTop: 2,
                      }}
                    >
                      {it.desc}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: it.accent ? theme.colors.accent : theme.colors.muted,
                    fontFamily: theme.typography.monoFont,
                  }}
                >
                  {it.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tiffin Box Metaphor Pill */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(252, 84, 108, 0.15) 0%, rgba(14, 20, 35, 0.95) 100%)",
            border: "1.5px solid rgba(252, 84, 108, 0.4)",
            borderRadius: 20,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: interpolate(tiffinPop, [0, 1], [0.3, 1]),
            transform: `scale(${interpolate(tiffinPop, [0, 1], [0.95, 1])})`,
          }}
        >
          <ShieldCheck size={22} color={theme.colors.captionHighlight} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
            "Bilkul tiffin box jaisa — jahan bhi jaaye, wahi rahega!" 🍱
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

