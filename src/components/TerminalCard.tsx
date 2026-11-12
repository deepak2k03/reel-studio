import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../lib/timing";
import type { StyleSpec, TerminalSceneConfig, TranscriptData } from "../lib/types";

interface TerminalCardProps {
  scene: TerminalSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absoluteFrame = sceneStartFrame + frame;

  const enter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  return (
    <AbsoluteFill
      style={{
        paddingTop: theme.safeZone.top,
        paddingBottom: theme.safeZone.bottom,
        paddingLeft: theme.safeZone.left,
        paddingRight: theme.safeZone.right,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          borderRadius: 26,
          backgroundColor: "#090D14",
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 30px 75px rgba(0, 0, 0, 0.55)",
          overflow: "hidden",
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            backgroundColor: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            fontFamily: theme.typography.monoFont,
            fontSize: 20,
            color: theme.colors.muted,
          }}
        >
          {scene.title ?? "terminal — zsh"}
        </div>

        <div
          style={{
            padding: "28px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.codeSize,
            lineHeight: 1.45,
          }}
        >
          {scene.lines.map((line, idx) => {
            const lineFrame = line.cuePhrase
              ? secToFrame(resolveCueTime(transcript, sceneStartSec + (line.atOffset ?? idx * 0.5), line.cuePhrase), fps)
              : sceneStartFrame + secToFrame(line.atOffset ?? idx * 0.45, fps);

            if (absoluteFrame < lineFrame) {
              return null;
            }

            const lineEnter = spring({
              frame: Math.max(0, absoluteFrame - lineFrame),
              fps,
              config: { damping: 18, stiffness: 220, mass: 0.7 },
            });

            const color =
              line.kind === "command"
                ? theme.colors.accent
                : line.kind === "success"
                  ? theme.colors.success
                  : line.kind === "error"
                    ? theme.colors.danger
                    : line.kind === "muted"
                      ? theme.colors.muted
                      : theme.colors.text;

            return (
              <div
                key={idx}
                style={{
                  color,
                  opacity: lineEnter,
                  transform: `translateX(${interpolate(lineEnter, [0, 1], [-12, 0])}px)`,
                }}
              >
                {line.kind === "command" ? `$ ${line.text}` : line.text}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

