import React from "react";
import { ArrowRight, Boxes, FileCode, Play, Terminal } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 3: The 3 Pillars (Dockerfile -> Image -> Container)
 * Spoken: "Docker ke teen parts hain: Dockerfile: ek recipe, jisme likhte ho app kaise banegi. Image: us recipe se bana ready-made blueprint. Container: image ko docker run se chalao, toh wo running instance ban jata hai. Ek image se hazaron containers!"
 */
export const DockerfileImageContainerScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const recipeCueSec = resolveCueTime(transcript, sceneStartSec + 2.1, "Dockerfile ek recipe", sceneStartSec);
  const imageCueSec = resolveCueTime(transcript, sceneStartSec + 5.3, "Image us recipe", sceneStartSec);
  const runCueSec = resolveCueTime(transcript, sceneStartSec + 7.6, "Container image ko", sceneStartSec);
  const hazaronCueSec = resolveCueTime(transcript, sceneStartSec + 11.2, "hazaron containers", sceneStartSec);

  const recipeFrame = secToFrame(recipeCueSec, fps);
  const imageFrame = secToFrame(imageCueSec, fps);
  const runFrame = secToFrame(runCueSec, fps);
  const hazaronFrame = secToFrame(hazaronCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const p1 = spring({
    frame: Math.max(0, absFrame - recipeFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

  const p2 = spring({
    frame: Math.max(0, absFrame - imageFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

  const p3 = spring({
    frame: Math.max(0, absFrame - runFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

  const hazaronPop = spring({
    frame: Math.max(0, absFrame - hazaronFrame),
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
          {scene.eyebrow ?? "THE 3 DOCKER PILLARS"}
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
          {scene.title ?? "Recipe ➔ Blueprint ➔ Runtime"}
        </h1>
      </div>

      {/* Main Flow Card */}
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
        {/* Step 1: Dockerfile */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: `1.5px solid ${theme.colors.surfaceBorder}`,
            borderRadius: 22,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(p1, [0, 1], [0.35, 1]),
            transform: `translateY(${interpolate(p1, [0, 1], [10, 0])}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(36, 156, 228, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.accent,
              }}
            >
              <FileCode size={26} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text }}>
                1. Dockerfile
              </div>
              <div style={{ fontSize: 15, color: theme.colors.muted }}>
                The Recipe: instructions on how to build the app
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: theme.colors.accent,
              fontFamily: theme.typography.monoFont,
              background: theme.colors.accentSoft,
              padding: "6px 14px",
              borderRadius: 8,
            }}
          >
            CODE RECIPE
          </span>
        </div>

        {/* Step 2: Image */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: `1.5px solid ${theme.colors.accent}`,
            borderRadius: 22,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(p2, [0, 1], [0.35, 1]),
            transform: `translateY(${interpolate(p2, [0, 1], [10, 0])}px)`,
            boxShadow: "0 8px 24px rgba(36, 156, 228, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: theme.colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}
            >
              <Terminal size={26} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: theme.colors.accent }}>
                2. Docker Image
              </div>
              <div style={{ fontSize: 15, color: theme.colors.text }}>
                The Blueprint: ready-made snapshot packaged & frozen
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: theme.typography.monoFont,
              background: theme.colors.accent,
              padding: "6px 14px",
              borderRadius: 8,
            }}
          >
            BLUEPRINT
          </span>
        </div>

        {/* Step 3: Container */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: "1.5px solid rgba(52, 211, 153, 0.5)",
            borderRadius: 22,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(p3, [0, 1], [0.35, 1]),
            transform: `translateY(${interpolate(p3, [0, 1], [10, 0])}px)`,
            boxShadow: "0 8px 24px rgba(52, 211, 153, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(52, 211, 153, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.success,
              }}
            >
              <Play size={26} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.success }}>
                3. Running Container
              </div>
              <div style={{ fontSize: 15, color: theme.colors.muted }}>
                Run with: <span style={{ fontFamily: theme.typography.monoFont, color: "#FFFFFF" }}>$ docker run myapp</span>
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: theme.colors.success,
              fontFamily: theme.typography.monoFont,
              background: "rgba(52, 211, 153, 0.15)",
              padding: "6px 14px",
              borderRadius: 8,
            }}
          >
            RUNNING INSTANCE
          </span>
        </div>

        {/* Grid of 10 Glowing Containers (Stack Engineer reference style) */}
        <div
          style={{
            background: "rgba(14, 20, 35, 0.95)",
            border: `1px solid ${theme.colors.surfaceBorder}`,
            borderRadius: 20,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: interpolate(hazaronPop, [0, 1], [0.3, 1]),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Boxes size={22} color={theme.colors.accent} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              1 Image ➔ 1000s of Containers!
            </span>
          </div>

          {/* Mini container cube indicators */}
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: theme.colors.accent,
                  boxShadow: "0 0 10px rgba(36, 156, 228, 0.6)",
                  opacity: 0.6 + (idx % 3) * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

