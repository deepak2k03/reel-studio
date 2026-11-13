import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedProceduralConceptProps extends BaseCsObjectProps {
  concept: string; // The on-demand concept name, e.g. "Garbage Collector", "Bloom Filter", "Raft Quorum", "Hash Map"
}

type Archetype = "cycler" | "cluster" | "pipeline" | "matrix" | "gate";

function resolveArchetype(concept: string): {
  archetype: Archetype;
  color: string;
  category: string;
} {
  const c = concept.toLowerCase();
  if (c.includes("gc") || c.includes("garbage") || c.includes("loop") || c.includes("cycle") || c.includes("sweep")) {
    return { archetype: "cycler", color: "#10B981", category: "RECLAMATION" };
  }
  if (c.includes("cluster") || c.includes("raft") || c.includes("paxos") || c.includes("consensus") || c.includes("mesh") || c.includes("swarm")) {
    return { archetype: "cluster", color: "#8B5CF6", category: "DISTRIBUTED" };
  }
  if (c.includes("hash") || c.includes("map") || c.includes("bloom") || c.includes("filter") || c.includes("table") || c.includes("array")) {
    return { archetype: "matrix", color: "#F59E0B", category: "DATA STRUCTURE" };
  }
  if (c.includes("auth") || c.includes("token") || c.includes("gate") || c.includes("firewall") || c.includes("cert") || c.includes("tls")) {
    return { archetype: "gate", color: "#EF4444", category: "SECURITY GATE" };
  }
  // Default to streaming pipeline / engine
  return { archetype: "pipeline", color: "#06B6D4", category: "PROCESSING ENGINE" };
}

/**
 * Universal On-Demand Procedural Computer Science Concept Synthesizer.
 * Whenever a spoken concept lacks a pre-baked component, this engine dynamically
 * synthesizes a rich, multi-layer animated engineering model on the fly.
 */
export const AnimatedProceduralConcept: React.FC<AnimatedProceduralConceptProps> = ({
  concept,
  theme,
  state = "active",
  label,
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  const { archetype, color, category } = resolveArchetype(concept);
  const displayTitle = label ?? concept;

  const width = 420;
  const height = 240;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: width,
          marginBottom: 8,
          padding: "0 6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontFamily: theme?.typography?.displayFont ?? "system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: theme?.colors?.text ?? "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            {displayTitle}
          </span>
          <span
            style={{
              fontFamily: theme?.typography?.monoFont ?? "monospace",
              fontSize: 11,
              color,
              background: `${color}1E`,
              padding: "2px 6px",
              borderRadius: 4,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {category}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(15, 23, 42, 0.75)",
            border: `1px solid ${color}33`,
            borderRadius: 6,
            padding: "2px 8px",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          <span
            style={{
              fontFamily: theme?.typography?.monoFont ?? "monospace",
              fontSize: 11,
              fontWeight: 700,
              color: isDark ? "#E2E8F0" : "#0F172A",
            }}
          >
            {metric ?? "SYNTHESIZED ON-DEMAND"}
          </span>
        </div>
      </div>

      {/* Main Procedural SVG Visualizer */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 420 240"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 28px ${color}25) drop-shadow(0 0 14px ${color}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id={`procBg-${concept}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <filter id={`procGlow-${concept}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Chassis Frame */}
        <rect
          x="10"
          y="10"
          width="400"
          height="220"
          rx="14"
          fill={`url(#procBg-${concept})`}
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Render Archetype Visual */}
        {archetype === "cycler" && (
          /* Circular Sweep / GC Rotor */
          <g transform="translate(210, 120)">
            <circle cx="0" cy="0" r="76" fill="none" stroke="#1E293B" strokeWidth="12" />
            {/* Memory blocks around perimeter */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const bx = Math.cos(rad) * 76;
              const by = Math.sin(rad) * 76;
              const isSwept = (Math.floor(frame / 14) + i) % 4 === 0;
              return (
                <rect
                  key={deg}
                  x={bx - 8}
                  y={by - 8}
                  width="16"
                  height="16"
                  rx="3"
                  fill={isSwept ? color : "#090D16"}
                  stroke={isSwept ? "#FFFFFF" : "#334155"}
                  strokeWidth="1.2"
                />
              );
            })}
            {/* Rotating Sweep Beam */}
            <g transform={`rotate(${(frame * 4) % 360}, 0, 0)`}>
              <line x1="0" y1="0" x2="76" y2="0" stroke={color} strokeWidth="3" filter={`url(#procGlow-${concept})`} />
              <circle cx="76" cy="0" r="4" fill="#FFFFFF" />
            </g>
            <circle cx="0" cy="0" r="26" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontFamily="monospace" fontWeight="bold">
              SWEEP
            </text>
          </g>
        )}

        {archetype === "cluster" && (
          /* Distributed Consensus Cluster (Quorum nodes) */
          <g transform="translate(210, 120)">
            {/* Interconnecting Quorum Mesh Lines */}
            {[
              [-80, -40, 80, -40],
              [80, -40, 0, 50],
              [0, 50, -80, -40],
              [0, 0, -80, -40],
              [0, 0, 80, -40],
              [0, 0, 0, 50],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            ))}
            {/* Leader Node in Center */}
            <circle cx="0" cy="0" r="24" fill="#090D16" stroke={color} strokeWidth="2.5" filter={`url(#procGlow-${concept})`} />
            <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
              LEADER
            </text>
            {/* Follower Nodes */}
            {[
              [-80, -40, "N-1"],
              [80, -40, "N-2"],
              [0, 50, "N-3"],
            ].map(([nx, ny, nlabel], i) => (
              <g key={i} transform={`translate(${nx}, ${ny})`}>
                <circle cx="0" cy="0" r="18" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  {nlabel as string}
                </text>
              </g>
            ))}
          </g>
        )}

        {archetype === "matrix" && (
          /* Hash Table / Bloom Filter Matrix */
          <g transform="translate(36, 50)">
            <text x="0" y="-8" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              HASH SLOTS & BIT ARRAY:
            </text>
            {/* 16 Hash Bit Slots */}
            {Array.from({ length: 16 }).map((_, i) => {
              const isActive = (Math.floor(frame / 10) + i * 3) % 5 === 0;
              return (
                <g key={i} transform={`translate(${i * 22}, 8)`}>
                  <rect
                    x="0"
                    y="0"
                    width="18"
                    height="32"
                    rx="3"
                    fill={isActive ? `${color}33` : "#090D16"}
                    stroke={isActive ? color : "#334155"}
                    strokeWidth="1.2"
                  />
                  <text
                    x="9"
                    y="20"
                    textAnchor="middle"
                    fill={isActive ? "#FFFFFF" : "#64748B"}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {isActive ? "1" : "0"}
                  </text>
                </g>
              );
            })}
            {/* Key projection pointer */}
            <g transform={`translate(${30 + ((frame * 3) % 280)}, 58)`}>
              <polygon points="0,0 6,-8 -6,-8" fill={color} />
              <text x="0" y="16" textAnchor="middle" fill={color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                hash(key)
              </text>
            </g>
          </g>
        )}

        {archetype === "gate" && (
          /* Security Barrier & Token Gate */
          <g transform="translate(70, 60)">
            <rect x="0" y="0" width="100" height="110" rx="8" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
            <text x="50" y="24" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="monospace" fontWeight="bold">
              CLIENT
            </text>
            <rect x="180" y="0" width="100" height="110" rx="8" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
            <text x="230" y="24" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="monospace" fontWeight="bold">
              PROTECTED
            </text>
            {/* Middle Firewall Barrier */}
            <line x1="140" y1="0" x2="140" y2="110" stroke={color} strokeWidth="4" strokeDasharray="8 4" filter={`url(#procGlow-${concept})`} />
            <circle cx="140" cy="55" r="14" fill="#090D16" stroke={color} strokeWidth="2" />
            <text x="140" y="58" textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" fontWeight="bold">
              AUTH
            </text>
          </g>
        )}

        {archetype === "pipeline" && (
          /* Multi-Stage Streaming Engine */
          <g transform="translate(36, 80)">
            {[0, 1, 2, 3].map((stage, i) => {
              const sx = i * 90;
              const isPulsing = (Math.floor(frame / 12) + i) % 2 === 0;
              return (
                <g key={i} transform={`translate(${sx}, 0)`}>
                  <rect
                    x="0"
                    y="0"
                    width="76"
                    height="60"
                    rx="8"
                    fill={isPulsing ? `${color}25` : "#090D16"}
                    stroke={isPulsing ? color : "#334155"}
                    strokeWidth="1.5"
                  />
                  <text x="38" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    STAGE {i + 1}
                  </text>
                  <text x="38" y="42" textAnchor="middle" fill={isPulsing ? color : "#64748B"} fontSize="7.5" fontFamily="monospace">
                    {isPulsing ? "COMPUTE" : "READY"}
                  </text>
                  {i < 3 && (
                    <line x1="76" y1="30" x2="90" y2="30" stroke={color} strokeWidth="2" strokeDasharray="3 2" />
                  )}
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Annotation */}
      {annotation && (
        <div
          style={{
            marginTop: 8,
            padding: "4px 12px",
            background: "rgba(15, 23, 42, 0.8)",
            border: `1px solid ${color}44`,
            borderRadius: 6,
            fontFamily: theme?.typography?.monoFont ?? "monospace",
            fontSize: 12,
            color,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
          {annotation}
        </div>
      )}
    </div>
  );
};

