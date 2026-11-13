import React from "react";
import { useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedTreeIndexProps extends BaseCsObjectProps {
  treeType?: "B-Tree Index" | "Binary Search Tree" | "Trie" | "AST";
  searchKey?: string;
  depth?: number;
}

/**
 * Production-grade Animated Hierarchical Tree Index & B-Tree Structure.
 * Renders root node, branch nodes, and leaf pages with active pointer traversal
 * highlights and deterministic search key path illumination.
 */
export const AnimatedTreeIndex: React.FC<AnimatedTreeIndexProps> = ({
  theme,
  state = "active",
  label = "B-Tree Database Index",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  treeType = "B+ Tree Index",
  searchKey = "key: 42",
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#F59E0B"; // Amber for trees/indices
  const success = theme?.colors?.success ?? "#10B981";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Traversal stage: 0 = Root, 1 = Internal Node, 2 = Leaf Hit
  const stage = Math.floor(frame / 20) % 3;

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
      {(label || metric) && (
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
              {label}
            </span>
            <span
              style={{
                fontFamily: theme?.typography?.monoFont ?? "monospace",
                fontSize: 12,
                color: accent,
                background: `${accent}20`,
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              {treeType}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(15, 23, 42, 0.75)",
              border: `1px solid ${accent}33`,
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isBusy ? success : "#64748B",
                boxShadow: `0 0 6px ${isBusy ? success : "#64748B"}`,
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
              {metric ?? "O(log N) Lookup"}
            </span>
          </div>
        </div>
      )}

      {/* Main Tree SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 420 240"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 28px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="treeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <filter id="treeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="10"
          y="10"
          width="400"
          height="220"
          rx="14"
          fill="url(#treeBg)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Branch Lines Connecting Root -> Level 1 */}
        <line
          x1="210"
          y1="56"
          x2="120"
          y2="106"
          stroke={stage >= 1 ? accent : "#334155"}
          strokeWidth={stage >= 1 ? 2.5 : 1.2}
        />
        <line x1="210" y1="56" x2="300" y2="106" stroke="#334155" strokeWidth="1.2" />

        {/* Branch Lines Level 1 -> Leaf Nodes */}
        <line
          x1="120"
          y1="138"
          x2="70"
          y2="182"
          stroke={stage >= 2 ? success : "#334155"}
          strokeWidth={stage >= 2 ? 2.5 : 1.2}
        />
        <line x1="120" y1="138" x2="160" y2="182" stroke="#334155" strokeWidth="1.2" />
        <line x1="300" y1="138" x2="250" y2="182" stroke="#334155" strokeWidth="1.2" />
        <line x1="300" y1="138" x2="340" y2="182" stroke="#334155" strokeWidth="1.2" />

        {/* Level 0: Root Page [ 50 | 100 ] */}
        <g transform="translate(160, 26)">
          <rect
            x="0"
            y="0"
            width="100"
            height="32"
            rx="6"
            fill={stage === 0 ? "rgba(245, 158, 11, 0.25)" : "#090D16"}
            stroke={stage === 0 ? accent : "#475569"}
            strokeWidth={stage === 0 ? 2 : 1}
          />
          <text x="50" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
            [ 50 | 100 ]
          </text>
        </g>

        {/* Level 1: Internal Pages [ 20 | 40 ] and [ 70 | 90 ] */}
        <g transform="translate(75, 106)">
          <rect
            x="0"
            y="0"
            width="90"
            height="32"
            rx="6"
            fill={stage === 1 ? "rgba(245, 158, 11, 0.25)" : "#090D16"}
            stroke={stage === 1 ? accent : "#475569"}
            strokeWidth={stage === 1 ? 2 : 1}
          />
          <text x="45" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
            [ 20 | 40 ]
          </text>
        </g>
        <g transform="translate(255, 106)">
          <rect x="0" y="0" width="90" height="32" rx="6" fill="#090D16" stroke="#475569" strokeWidth="1" />
          <text x="45" y="20" textAnchor="middle" fill="#94A3B8" fontSize="10.5" fontFamily="monospace">
            [ 70 | 90 ]
          </text>
        </g>

        {/* Level 2: Leaf Pages [ 41 | 42 | 43 ] */}
        {[
          { x: 28, label: "[41 | 42]", isHit: true },
          { x: 124, label: "[45 | 48]", isHit: false },
          { x: 214, label: "[72 | 80]", isHit: false },
          { x: 304, label: "[92 | 99]", isHit: false },
        ].map((leaf, idx) => {
          const isTarget = leaf.isHit && stage === 2;
          return (
            <g key={idx} transform={`translate(${leaf.x}, 182)`}>
              <rect
                x="0"
                y="0"
                width="84"
                height="30"
                rx="6"
                fill={isTarget ? "rgba(16, 185, 129, 0.25)" : "#090D16"}
                stroke={isTarget ? success : "#334155"}
                strokeWidth={isTarget ? 2 : 1}
              />
              <text
                x="42"
                y="19"
                textAnchor="middle"
                fill={isTarget ? "#FFFFFF" : "#64748B"}
                fontSize="10"
                fontFamily="monospace"
                fontWeight={isTarget ? "bold" : "normal"}
              >
                {leaf.label}
              </text>
              {isTarget && (
                <circle cx="72" cy="15" r="4" fill={success} filter="url(#treeGlow)" />
              )}
            </g>
          );
        })}
      </svg>

      {/* Annotation */}
      {annotation && (
        <div
          style={{
            marginTop: 8,
            padding: "4px 12px",
            background: "rgba(15, 23, 42, 0.8)",
            border: `1px solid ${accent}44`,
            borderRadius: 6,
            fontFamily: theme?.typography?.monoFont ?? "monospace",
            fontSize: 12,
            color: accent,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
          {annotation}
        </div>
      )}
    </div>
  );
};

