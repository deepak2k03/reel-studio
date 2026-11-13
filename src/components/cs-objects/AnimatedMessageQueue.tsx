import React from "react";
import { useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedMessageQueueProps extends BaseCsObjectProps {
  queueType?: string; // "Kafka Topic", "RabbitMQ", "SQS", "Redis Stream"
  partitionCount?: number;
  messageCount?: number;
}

/**
 * Production-grade Animated Distributed Message Queue & Partition Log.
 * Renders serialized partition message segments, active consumer read pointers,
 * producer write offsets, and FIFO message sliding.
 */
export const AnimatedMessageQueue: React.FC<AnimatedMessageQueueProps> = ({
  theme,
  state = "active",
  label = "Distributed Message Queue",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  queueType = "Kafka Partition",
  partitionCount = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#F59E0B"; // Amber for queue
  const success = theme?.colors?.success ?? "#10B981";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Sliding offset cycle
  const offsetShift = Math.floor(frame / 10) % 6;

  const width = 420;
  const height = 180;

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
      {/* Header Label */}
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
              {queueType}
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
              {metric ?? "Lag: 0 ms • Offset: 104,281"}
            </span>
          </div>
        </div>
      )}

      {/* Main Queue SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 420 180"
        style={{
          filter: glow
            ? `drop-shadow(0 10px 28px ${accent}25) drop-shadow(0 0 14px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="queueBox" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* Outer Queue Conduit Housing */}
        <rect
          x="10"
          y="15"
          width="400"
          height="140"
          rx="10"
          fill="url(#queueBox)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Partition Log Slots (Sequential FIFO messages) */}
        <g transform="translate(24, 40)">
          <text x="0" y="-8" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            PARTITION-0 (APPEND-ONLY COMMIT LOG):
          </text>

          {Array.from({ length: 6 }).map((_, i) => {
            const logicalOffset = 104280 + i + offsetShift;
            const isConsumerOffset = i === 2;
            const isProducerOffset = i === 5;

            return (
              <g key={i} transform={`translate(${i * 62}, 4)`}>
                {/* Log message frame */}
                <rect
                  x="0"
                  y="0"
                  width="56"
                  height="64"
                  rx="6"
                  fill={isConsumerOffset ? "rgba(16, 185, 129, 0.15)" : isProducerOffset ? "rgba(245, 158, 11, 0.15)" : "#181825"}
                  stroke={isConsumerOffset ? success : isProducerOffset ? accent : "#334155"}
                  strokeWidth="1.5"
                />
                {/* Offset ID */}
                <text x="28" y="16" textAnchor="middle" fill="#CDD6F4" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  MSG #{logicalOffset % 1000}
                </text>
                {/* Payload bar */}
                <rect x="6" y="24" width="44" height="6" rx="2" fill="#45475A" />
                <rect x="6" y="34" width="34" height="6" rx="2" fill="#313244" />
                <text
                  x="28"
                  y="54"
                  textAnchor="middle"
                  fill={isConsumerOffset ? success : isProducerOffset ? accent : "#6C7086"}
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {isConsumerOffset ? "CONSUMED" : isProducerOffset ? "LATEST" : "COMMITTED"}
                </text>
              </g>
            );
          })}
        </g>

        {/* Consumer Group Pointer Arrow */}
        <g transform="translate(176, 120)">
          <polygon points="0,0 6,10 -6,10" fill={success} />
          <text x="0" y="20" textAnchor="middle" fill={success} fontSize="8" fontFamily="monospace" fontWeight="bold">
            CONSUMER POINTER
          </text>
        </g>
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

