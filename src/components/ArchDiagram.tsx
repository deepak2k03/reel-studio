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

const MicroCsHardwareIcon: React.FC<{
  icon?: ArchNode["icon"];
  statusColor: string;
  frame: number;
}> = ({ icon, statusColor, frame }) => {
  if (icon === "server") {
    const fanRot = (frame * 12) % 360;
    const ledBlink = (frame % 20) < 10;
    return (
      <svg width="48" height="38" viewBox="0 0 48 38">
        <rect x="2" y="4" width="44" height="30" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        {[6, 15, 24].map((x) => (
          <rect key={x} x={x} y="8" width="7" height="12" rx="1" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
        ))}
        <circle cx="8" cy="24" r="1.5" fill="#22C55E" />
        <circle cx="14" cy="24" r="1.5" fill={ledBlink ? "#38BDF8" : "#1E293B"} />
        <circle cx="37" cy="18" r="8" fill="#1E293B" stroke="#475569" strokeWidth="1" />
        <g transform={`rotate(${fanRot}, 37, 18)`}>
          <line x1="37" y1="11" x2="37" y2="25" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="30" y1="18" x2="44" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (icon === "database") {
    const armAngle = interpolate(Math.sin(frame * 0.15), [-1, 1], [-12, 16]);
    return (
      <svg width="44" height="42" viewBox="0 0 44 42">
        <rect x="3" y="2" width="38" height="38" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        <circle cx="20" cy="21" r="14" fill="#1E293B" stroke="#475569" strokeWidth="1" />
        <circle cx="20" cy="21" r="9" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeDasharray="3 2" />
        <circle cx="20" cy="21" r="4" fill="#64748B" />
        <g transform={`rotate(${armAngle}, 34, 12)`}>
          <line x1="34" y1="12" x2="20" y2="20" stroke="#CBD5E1" strokeWidth="1.8" />
          <circle cx="20" cy="20" r="1.8" fill={statusColor} />
        </g>
      </svg>
    );
  }

  if (icon === "cache") {
    const activeChip = Math.floor(frame / 8) % 4;
    return (
      <svg width="48" height="28" viewBox="0 0 48 28">
        <rect x="2" y="3" width="44" height="20" rx="2" fill="#0B0B10" stroke="#45475A" strokeWidth="1.2" />
        {[6, 15, 24, 33].map((x, i) => (
          <rect
            key={x}
            x={x}
            y="7"
            width="6"
            height="10"
            rx="1"
            fill={i === activeChip ? statusColor : "#1E1E2E"}
            stroke="#313244"
            strokeWidth="0.8"
          />
        ))}
        {[5, 10, 15, 20, 28, 33, 38].map((x) => (
          <rect key={x} x={x} y="23" width="2" height="3" fill="#FBBF24" />
        ))}
      </svg>
    );
  }

  if (icon === "zap") {
    const pulse = interpolate(Math.sin(frame * 0.2), [-1, 1], [3, 9]);
    return (
      <svg width="42" height="42" viewBox="0 0 42 42">
        <rect x="3" y="3" width="36" height="36" rx="4" fill="#022C22" stroke="#059669" strokeWidth="1.5" />
        <polygon points="5,5 10,5 5,10" fill="#FBBF24" />
        <rect x="10" y="10" width="22" height="22" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        <circle cx="21" cy="21" r={pulse} fill="none" stroke="#06B6D4" strokeWidth="1.2" opacity="0.8" />
        <circle cx="21" cy="21" r="2.5" fill="#06B6D4" />
      </svg>
    );
  }

  if (icon === "queue") {
    const shift = Math.floor(frame / 12) % 3;
    return (
      <svg width="48" height="32" viewBox="0 0 48 32">
        <rect x="2" y="4" width="44" height="24" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
        {[6, 19, 32].map((x, i) => (
          <rect
            key={x}
            x={x}
            y="8"
            width="10"
            height="16"
            rx="2"
            fill={i === shift ? `${statusColor}44` : "#1E293B"}
            stroke={i === shift ? statusColor : "#475569"}
            strokeWidth="1"
          />
        ))}
      </svg>
    );
  }

  if (icon === "client") {
    return (
      <svg width="34" height="46" viewBox="0 0 34 46">
        <rect x="2" y="2" width="30" height="42" rx="7" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
        <rect x="4" y="4" width="26" height="38" rx="5" fill="#030712" />
        <rect x="11" y="6" width="12" height="3" rx="1.5" fill="#1E293B" />
        <rect x="7" y="14" width="20" height="6" rx="1" fill={`${statusColor}44`} />
        <rect x="7" y="23" width="14" height="4" rx="1" fill="#1E293B" />
        <rect x="12" y="38" width="10" height="1.5" rx="0.75" fill="#94A3B8" />
      </svg>
    );
  }

  const FallbackIcon = ICONS[icon ?? "server"] ?? Server;
  return <FallbackIcon size={26} color={statusColor} />;
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
                width: "78%",
                maxWidth: 680,
                minWidth: 420,
                padding: "24px 28px",
                borderRadius: 26,
                backgroundColor: theme.colors.surface,
                border: `2px solid ${statusColor}`,
                boxShadow:
                  node.status && node.status !== "neutral"
                    ? `0 14px 42px ${statusColor}33`
                    : "0 16px 40px rgba(0,0,0,0.42)",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 20,
                  backgroundColor: `${statusColor}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                <div style={{ transform: "scale(1.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MicroCsHardwareIcon
                    icon={node.icon}
                    statusColor={node.status === "neutral" || !node.status ? theme.colors.accent : statusColor}
                    frame={frame}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 32,
                    fontWeight: 800,
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
                      fontSize: 20,
                      fontWeight: 600,
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

