import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../../lib/timing";
import type { StyleSpec, TranscriptData, VisualFlowSceneConfig } from "../../lib/types";
import { TechIcon } from "../TechIcon";

interface VisualFlowSceneProps {
  scene: VisualFlowSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const VisualFlowScene: React.FC<VisualFlowSceneProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isLandscape = width > height;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absoluteFrame = sceneStartFrame + frame;

  const headerEnter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  const isDark = theme.meta?.isDark ?? true;
  const nodes = scene.nodes.slice(0, 4);
  const dashOffset = -(frame * 2.2);

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
      }}
    >
      {/* Centered Header */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: headerEnter,
          transform: `translateY(${interpolate(headerEnter, [0, 1], [-18, 0])}px)`,
        }}
      >
        {scene.eyebrow && (
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.colors.accent,
              backgroundColor: theme.colors.accentSoft,
              border: `1px solid ${theme.colors.accent}44`,
              padding: "6px 16px",
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
            fontSize: 50,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            color: theme.colors.text,
          }}
        >
          {scene.title}
        </h2>
      </div>

      {/* Centered Flow Stage */}
      <div
        style={{
          width: "100%",
          maxWidth: isLandscape ? 1460 : 820,
          display: "flex",
          flexDirection: isLandscape ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {nodes.map((node, idx) => {
          const appearFrame = node.cuePhrase
            ? secToFrame(
                resolveCueTime(
                  transcript,
                  sceneStartSec + (node.appearAtOffset ?? idx * 0.4),
                  node.cuePhrase,
                ),
                fps,
              )
            : sceneStartFrame + secToFrame(node.appearAtOffset ?? idx * 0.35, fps);

          const nodeSpring = spring({
            frame: Math.max(0, absoluteFrame - appearFrame),
            fps,
            config: {
              damping: theme.motion.springDamping,
              stiffness: theme.motion.springStiffness,
              mass: theme.motion.springMass,
            },
          });

          const statusColor =
            node.status === "warning"
              ? theme.colors.danger
              : node.status === "success"
                ? theme.colors.success
                : node.status === "active"
                  ? theme.colors.accent
                  : theme.colors.surfaceBorder;

          const edge = scene.edges[idx];
          const edgeColor =
            edge?.color === "danger"
              ? theme.colors.danger
              : edge?.color === "success"
                ? theme.colors.success
                : theme.colors.accent;

          const edgeFrame = edge
            ? edge.cuePhrase
              ? secToFrame(
                  resolveCueTime(
                    transcript,
                    sceneStartSec + (edge.appearAtOffset ?? (idx + 0.5) * 0.4),
                    edge.cuePhrase,
                  ),
                  fps,
                )
              : sceneStartFrame + secToFrame(edge.appearAtOffset ?? (idx + 0.5) * 0.38, fps)
            : 0;

          const edgeProgress = edge
            ? spring({
                frame: Math.max(0, absoluteFrame - edgeFrame),
                fps,
                config: { damping: 18, stiffness: 180, mass: 0.85 },
              })
            : 0;

          const packetCycle = (((frame - idx * 16) % 66) + 66) % 66 / 66;
          const packetPos =
            edge?.direction === "backward"
              ? interpolate(packetCycle, [0, 1], [86, 14])
              : interpolate(packetCycle, [0, 1], [14, 86]);

          const pulseGlow =
            node.status === "active" || node.status === "warning" || node.status === "success"
              ? 0.25 + Math.sin((frame + idx * 14) / 14) * 0.12
              : 0;

          return (
            <React.Fragment key={node.id}>
              {/* Centered Visual Node */}
              <div
                style={{
                  width: isLandscape ? 320 : "100%",
                  maxWidth: 660,
                  padding: "24px 28px",
                  borderRadius: 28,
                  backgroundColor: theme.colors.surface,
                  border: `2px solid ${statusColor}`,
                  boxShadow: isDark
                    ? pulseGlow > 0
                      ? `0 20px 50px rgba(0,0,0,0.42), 0 0 38px ${statusColor}${Math.round(pulseGlow * 255).toString(16).padStart(2, "0")}`
                      : "0 18px 42px rgba(0,0,0,0.38)"
                    : "0 16px 42px rgba(45, 28, 12, 0.08)",
                  display: "flex",
                  flexDirection: isLandscape ? "column" : "row",
                  alignItems: "center",
                  justifyContent: isLandscape ? "center" : "flex-start",
                  textAlign: isLandscape ? "center" : "left",
                  gap: 22,
                  opacity: nodeSpring,
                  transform: `scale(${interpolate(nodeSpring, [0, 1], [0.84, 1])})`,
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 24,
                    backgroundColor: `${statusColor}22`,
                    border: `1.5px solid ${statusColor}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <TechIcon
                    name={node.icon}
                    size={48}
                    color={
                      node.status === "neutral" || !node.status
                        ? theme.colors.accent
                        : statusColor
                    }
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isLandscape ? "center" : "flex-start",
                    gap: 8,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.typography.displayFont,
                      fontSize: 34,
                      fontWeight: 800,
                      lineHeight: 1.15,
                      color: theme.colors.text,
                    }}
                  >
                    {node.label}
                  </span>
                  {node.tag && (
                    <span
                      style={{
                        fontFamily: theme.typography.monoFont,
                        fontSize: 20,
                        fontWeight: 700,
                        color:
                          node.status === "warning"
                            ? theme.colors.danger
                            : node.status === "success"
                              ? theme.colors.success
                              : theme.colors.accent,
                        backgroundColor: `${statusColor}1c`,
                        padding: "4px 12px",
                        borderRadius: 999,
                      }}
                    >
                      {node.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Animated Connector & Traveling Packet */}
              {idx < nodes.length - 1 && edge && (
                <div
                  style={{
                    position: "relative",
                    width: isLandscape ? 120 : 280,
                    height: isLandscape ? 90 : nodes.length === 2 ? 150 : 96,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: edgeProgress,
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox={isLandscape ? "0 0 120 90" : "0 0 280 100"}
                    preserveAspectRatio="none"
                    style={{ position: "absolute", inset: 0 }}
                  >
                    {isLandscape ? (
                      <line
                        x1={0}
                        y1={45}
                        x2={120}
                        y2={45}
                        stroke={edgeColor}
                        strokeWidth={4}
                        strokeDasharray="10 8"
                        strokeDashoffset={dashOffset}
                      />
                    ) : (
                      <line
                        x1={140}
                        y1={0}
                        x2={140}
                        y2={100}
                        stroke={edgeColor}
                        strokeWidth={4}
                        strokeDasharray="10 8"
                        strokeDashoffset={dashOffset}
                      />
                    )}
                  </svg>

                  {/* Glowing Traveling Orb */}
                  {edgeProgress > 0.7 && (
                    <div
                      style={{
                        position: "absolute",
                        left: isLandscape ? `${packetPos}%` : "50%",
                        top: isLandscape ? "50%" : `${packetPos}%`,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: edgeColor,
                        boxShadow: `0 0 20px ${edgeColor}`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}

                  {edge.label && (
                    <span
                      style={{
                        position: "relative",
                        zIndex: 2,
                        padding: "5px 14px",
                        borderRadius: 999,
                        backgroundColor: theme.colors.bg,
                        border: `1.5px solid ${edgeColor}88`,
                        fontFamily: theme.typography.monoFont,
                        fontSize: 19,
                        fontWeight: 700,
                        color: edgeColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {edge.label}
                    </span>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

