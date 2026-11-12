import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../../lib/timing";
import type { SequenceDiagramSceneConfig, StyleSpec, TranscriptData } from "../../lib/types";
import { TechIcon } from "../TechIcon";

interface SequenceDiagramSceneProps {
  scene: SequenceDiagramSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const SequenceDiagramScene: React.FC<SequenceDiagramSceneProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? true;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(2.0, scene.end - sceneStartSec);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absFrame = sceneStartFrame + frame;

  const headerEnter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  const actors = scene.actors.slice(0, 3);
  const actorIndex = new Map(actors.map((a, i) => [a.id, i]));

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
        gap: 26,
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: headerEnter,
          transform: `translateY(${interpolate(headerEnter, [0, 1], [-16, 0])}px)`,
        }}
      >
        {scene.eyebrow && (
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.colors.accent,
              backgroundColor: theme.colors.accentSoft,
              border: `1px solid ${theme.colors.accent}44`,
              padding: "6px 18px",
              borderRadius: 999,
            }}
          >
            {scene.eyebrow}
          </span>
        )}
        <h2
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: 48,
            fontWeight: 800,
            color: theme.colors.text,
            letterSpacing: "-0.025em",
          }}
        >
          {scene.title}
        </h2>
      </div>

      {/* UML Sequence Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 880,
          height: 820,
          padding: "32px 26px",
          borderRadius: 32,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          display: "flex",
          flexDirection: "column",
          opacity: headerEnter,
        }}
      >
        {/* Actor Header Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${actors.length}, 1fr)`,
            gap: 16,
            zIndex: 2,
          }}
        >
          {actors.map((actor) => {
            const color =
              actor.tone === "success"
                ? theme.colors.success
                : actor.tone === "danger"
                  ? theme.colors.danger
                  : theme.colors.accent;
            return (
              <div
                key={actor.id}
                style={{
                  padding: "16px 12px",
                  borderRadius: 20,
                  backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FAF6F0",
                  border: `2px solid ${color}77`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <TechIcon name={actor.icon} size={34} color={color} />
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 23,
                    fontWeight: 800,
                    color: theme.colors.text,
                    textAlign: "center",
                  }}
                >
                  {actor.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Vertical Lifelines + Horizontal Message Arrows */}
        <div style={{ position: "relative", flex: 1, marginTop: 12 }}>
          {actors.map((actor, idx) => {
            const xPct = ((idx + 0.5) / actors.length) * 100;
            return (
              <div
                key={`line-${actor.id}`}
                style={{
                  position: "absolute",
                  left: `${xPct}%`,
                  top: 0,
                  bottom: 12,
                  width: 3,
                  transform: "translateX(-50%)",
                  background: `repeating-linear-gradient(to bottom, ${theme.colors.surfaceBorder} 0 10px, transparent 10px 20px)`,
                }}
              />
            );
          })}

          {scene.steps.map((step, idx) => {
            const fromIdx = actorIndex.get(step.from) ?? 0;
            const toIdx = actorIndex.get(step.to) ?? 1;
            const defaultStepOffset =
              sceneSpanSec * (0.1 + (idx / Math.max(1, scene.steps.length)) * 0.65);
            const stepFrame = step.cuePhrase
              ? secToFrame(
                  resolveCueTime(
                    transcript,
                    sceneStartSec + (step.atOffset ?? defaultStepOffset),
                    step.cuePhrase,
                  ),
                  fps,
                )
              : sceneStartFrame + secToFrame(step.atOffset ?? defaultStepOffset, fps);

            if (absFrame < stepFrame) return null;

            const stepProg = spring({
              frame: Math.max(0, absFrame - stepFrame),
              fps,
              config: { damping: 16, stiffness: 190, mass: 0.8 },
            });

            const x1 = ((fromIdx + 0.5) / actors.length) * 100;
            const x2 = ((toIdx + 0.5) / actors.length) * 100;
            const leftPct = Math.min(x1, x2);
            const widthPct = Math.abs(x2 - x1);
            const goingRight = x2 >= x1;
            const topPct = 14 + (idx / Math.max(1, scene.steps.length)) * 72;

            const color =
              step.tone === "success"
                ? theme.colors.success
                : step.tone === "danger"
                  ? theme.colors.danger
                  : theme.colors.accent;

            return (
              <div
                key={`step-${idx}`}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  top: `${topPct}%`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  opacity: stepProg,
                }}
              >
                <span
                  style={{
                    padding: "5px 14px",
                    borderRadius: 999,
                    backgroundColor: isDark ? theme.colors.bg : "#FFFFFF",
                    border: `1.5px solid ${color}`,
                    fontFamily: theme.typography.monoFont,
                    fontSize: 20,
                    fontWeight: 700,
                    color,
                    whiteSpace: "nowrap",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                >
                  {`${idx + 1}. ${step.label}`}
                </span>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 4,
                    backgroundColor: color,
                    transform: `scaleX(${stepProg})`,
                    transformOrigin: goingRight ? "left center" : "right center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      [goingRight ? "right" : "left"]: -2,
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      [goingRight ? "borderLeft" : "borderRight"]: `14px solid ${color}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

