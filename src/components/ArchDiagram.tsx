import React from "react";
import {
  Cpu,
  Database,
  Layers,
  Lock,
  Monitor,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../lib/timing";
import type { ArchNode, ArchSceneConfig, StyleSpec, TranscriptData } from "../lib/types";

interface ArchDiagramProps {
  scene: ArchSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

const ICONS: Record<NonNullable<ArchNode["icon"]>, React.ComponentType<{ size?: number; color?: string }>> = {
  client: Monitor,
  server: Server,
  database: Database,
  cache: Zap,
  queue: Layers,
  lock: Lock,
  zap: Cpu,
  shield: ShieldCheck,
};

export const ArchDiagram: React.FC<ArchDiagramProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absoluteFrame = sceneStartFrame + frame;

  const headerEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 190, mass: 0.8 },
  });

  const nodeMap = new Map(scene.nodes.map((n) => [n.id, n]));

  return (
    <AbsoluteFill
      style={{
        paddingTop: theme.safeZone.top,
        paddingBottom: theme.safeZone.bottom,
        paddingLeft: theme.safeZone.left,
        paddingRight: theme.safeZone.right,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          opacity: headerEnter,
          transform: `translateY(${interpolate(headerEnter, [0, 1], [22, 0])}px)`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: theme.colors.text,
          }}
        >
          {scene.title}
        </h2>
        {scene.subtitle && (
          <p
            style={{
              margin: "8px 0 0 0",
              fontFamily: theme.typography.displayFont,
              fontSize: 28,
              color: theme.colors.muted,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>

      {/* Diagram workspace */}
      <div
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          borderRadius: 30,
          backgroundColor: "rgba(15, 23, 42, 0.55)",
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          overflow: "hidden",
        }}
      >
        {/* SVG Edges & animated packets */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {scene.edges.map((edge, idx) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) {
              return null;
            }

            const appearFrame = edge.cuePhrase
              ? secToFrame(resolveCueTime(transcript, sceneStartSec + (edge.appearAtOffset ?? 0), edge.cuePhrase), fps)
              : sceneStartFrame + secToFrame(edge.appearAtOffset ?? 0, fps);

            const edgeProgress = spring({
              frame: Math.max(0, absoluteFrame - appearFrame),
              fps,
              config: { damping: 18, stiffness: 160, mass: 0.9 },
            });

            if (absoluteFrame < appearFrame) {
              return null;
            }

            const strokeColor =
              edge.color === "danger"
                ? theme.colors.danger
                : edge.color === "success"
                  ? theme.colors.success
                  : theme.colors.accent;

            const currentX2 = interpolate(edgeProgress, [0, 1], [fromNode.x, toNode.x]);
            const currentY2 = interpolate(edgeProgress, [0, 1], [fromNode.y, toNode.y]);

            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={currentX2}
                  y2={currentY2}
                  stroke={strokeColor}
                  strokeWidth={0.7}
                  strokeDasharray={edge.dashed ? "2 1.5" : undefined}
                  strokeOpacity={0.85}
                />
              </g>
            );
          })}
        </svg>

        {/* Animated data packets (HTML circles avoid non-uniform SVG aspect scaling) */}
        {scene.edges.map((edge, idx) => {
          if (!edge.animatePacket) return null;
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          const appearFrame = edge.cuePhrase
            ? secToFrame(resolveCueTime(transcript, sceneStartSec + (edge.appearAtOffset ?? 0), edge.cuePhrase), fps)
            : sceneStartFrame + secToFrame(edge.appearAtOffset ?? 0, fps);

          if (absoluteFrame < appearFrame + 18) return null;

          const packetCycle = ((absoluteFrame - appearFrame) % 72) / 72;
          const packetX = interpolate(packetCycle, [0, 1], [fromNode.x, toNode.x]);
          const packetY = interpolate(packetCycle, [0, 1], [fromNode.y, toNode.y]);
          const dotColor =
            edge.color === "danger"
              ? theme.colors.danger
              : edge.color === "success"
                ? theme.colors.success
                : theme.colors.accent;

          return (
            <div
              key={`packet-${idx}`}
              style={{
                position: "absolute",
                left: `${packetX}%`,
                top: `${packetY}%`,
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: dotColor,
                boxShadow: `0 0 18px ${dotColor}`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}

        {/* Edge Labels */}
        {scene.edges.map((edge, idx) => {
          if (!edge.label) return null;
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          const appearFrame = edge.cuePhrase
            ? secToFrame(resolveCueTime(transcript, sceneStartSec + (edge.appearAtOffset ?? 0), edge.cuePhrase), fps)
            : sceneStartFrame + secToFrame(edge.appearAtOffset ?? 0, fps);

          if (absoluteFrame < appearFrame) return null;

          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          return (
            <div
              key={`label-${idx}`}
              style={{
                position: "absolute",
                left: `${midX}%`,
                top: `${midY}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: theme.colors.bg,
                border: `1px solid ${theme.colors.surfaceBorder}`,
                padding: "4px 12px",
                borderRadius: 999,
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 700,
                color:
                  edge.color === "danger"
                    ? theme.colors.danger
                    : edge.color === "success"
                      ? theme.colors.success
                      : theme.colors.accent,
                whiteSpace: "nowrap",
              }}
            >
              {edge.label}
            </div>
          );
        })}

        {/* Nodes */}
        {scene.nodes.map((node) => {
          const appearFrame = node.cuePhrase
            ? secToFrame(resolveCueTime(transcript, sceneStartSec + (node.appearAtOffset ?? 0), node.cuePhrase), fps)
            : sceneStartFrame + secToFrame(node.appearAtOffset ?? 0, fps);

          if (absoluteFrame < appearFrame) {
            return null;
          }

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

          const IconComponent = ICONS[node.icon ?? "server"];

          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${interpolate(nodeSpring, [0, 1], [0.72, 1])})`,
                opacity: nodeSpring,
                minWidth: 230,
                maxWidth: 290,
                padding: "18px 20px",
                borderRadius: 22,
                backgroundColor: theme.colors.surface,
                border: `2px solid ${statusColor}`,
                boxShadow:
                  node.status && node.status !== "neutral"
                    ? `0 12px 35px ${statusColor}33`
                    : "0 14px 32px rgba(0,0,0,0.38)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: `${statusColor}24`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconComponent
                  size={26}
                  color={node.status === "neutral" || !node.status ? theme.colors.accent : statusColor}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 24,
                    fontWeight: 700,
                    color: theme.colors.text,
                    lineHeight: 1.15,
                  }}
                >
                  {node.label}
                </span>
                {node.sublabel && (
                  <span
                    style={{
                      fontFamily: theme.typography.monoFont,
                      fontSize: 17,
                      color: theme.colors.muted,
                    }}
                  >
                    {node.sublabel}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

