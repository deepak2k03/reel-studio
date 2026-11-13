import React from "react";
import { useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedCallStackProps extends BaseCsObjectProps {
  frames?: string[];
  maxDepth?: number;
}

/**
 * Production-grade Animated Execution Call Stack & Frame Visualizer.
 * Renders LIFO call stack memory frames with pushing / popping transitions,
 * stack pointer (SP) tracking, and return address indicators.
 */
export const AnimatedCallStack: React.FC<AnimatedCallStackProps> = ({
  theme,
  state = "active",
  label = "Call Stack Memory",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  frames = ["main()", "handleRequest()", "queryDatabase()", "evalCipher()"],
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#818CF8";
  const success = theme?.colors?.success ?? "#34D399";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Active stack depth cycles between 2 and 4 frames
  const activeDepth = 2 + (Math.floor(frame / 22) % 3);

  const width = 360;
  const height = 280;

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
              LIFO
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
              {metric ?? `SP: 0x7FFF (${activeDepth} frames)`}
            </span>
          </div>
        </div>
      )}

      {/* Main Stack SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 280"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 28px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="stackChassis" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* Stack Memory Tube Housing */}
        <rect
          x="10"
          y="10"
          width="340"
          height="260"
          rx="12"
          fill="url(#stackChassis)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Memory Stack Frames (Bottom up) */}
        {frames.map((fn, idx) => {
          const slot = frames.length - 1 - idx;
          const y = 30 + slot * 56;
          const isPresent = idx < activeDepth;
          const isTop = idx === activeDepth - 1;

          if (!isPresent) return null;

          return (
            <g key={idx} transform={`translate(28, ${y})`}>
              <rect
                x="0"
                y="0"
                width="280"
                height="46"
                rx="8"
                fill={isTop ? "rgba(129, 140, 248, 0.22)" : "#090D16"}
                stroke={isTop ? accent : "#475569"}
                strokeWidth={isTop ? 2 : 1}
              />
              <text x="16" y="24" fill="#FFFFFF" fontSize="12" fontFamily="monospace" fontWeight="bold">
                {fn}
              </text>
              <text x="16" y="38" fill={isTop ? accent : "#64748B"} fontSize="8.5" fontFamily="monospace">
                RET_ADDR: 0x{((idx + 1) * 0x1a4).toString(16).toUpperCase()} • FRAME #{idx}
              </text>

              {/* Stack Pointer Arrow (SP) on top frame */}
              {isTop && (
                <g transform="translate(290, 23)">
                  <polygon points="0,0 8,-5 8,5" fill={accent} />
                  <text x="12" y="3" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">
                    SP
                  </text>
                </g>
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

