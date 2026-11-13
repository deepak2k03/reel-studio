import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedPacketCableProps extends BaseCsObjectProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  protocol?: string; // "TCP/IP", "gRPC", "HTTPS", "WebSocket"
  packetLabels?: string[];
  cableType?: "fiber" | "copper" | "bus";
  bandwidth?: string;
}

/**
 * Production-grade Animated Data Bus / Optical Fiber Cable.
 * Renders physical high-speed data transmission conduit with traveling
 * protocol packets (e.g. SYN, ACK, GET, 200 OK), glowing photon pulses,
 * and serialized binary bitstream indicators.
 */
export const AnimatedPacketCable: React.FC<AnimatedPacketCableProps> = ({
  theme,
  state = "active",
  label,
  startX = 40,
  startY = 60,
  endX = 380,
  endY = 60,
  protocol = "HTTPS / TCP",
  packetLabels = ["SYN", "ACK", "GET /api", "200 OK"],
  cableType = "fiber",
  bandwidth = "10 Gbps",
  scale = 1,
  glow = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const accent = theme?.colors?.accent ?? (cableType === "fiber" ? "#06B6D4" : "#F59E0B");

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  const totalLength = Math.hypot(endX - startX, endY - startY);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  // Traveling packet stream position along length
  const speed = isBusy ? 4.5 : 1.5;
  const travelOffset = (frame * speed) % totalLength;

  return (
    <div
      style={{
        position: "relative",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      <svg
        width={Math.max(startX, endX) + 60}
        height={Math.max(startY, endY) + 60}
        style={{
          overflow: "visible",
          filter: glow
            ? `drop-shadow(0 0 12px ${accent}44)`
            : "none",
        }}
      >
        <defs>
          <linearGradient id="cableSheath" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <filter id="packetGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Cable Conduit Line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#1E293B"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Inner Glass Fiber Core / Copper Core */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={cableType === "fiber" ? "#083344" : "#451A03"}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Optical Pulse / Electrical Wave (Moving Dashes) */}
        {isBusy && (
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={accent}
            strokeWidth="3"
            strokeDasharray="14 28"
            strokeDashoffset={-frame * 3}
            filter="url(#packetGlow)"
            opacity="0.8"
          />
        )}

        {/* Connectors on Both Ends */}
        {[
          [startX, startY],
          [endX, endY],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            <circle cx="0" cy="0" r="8" fill="#334155" stroke="#64748B" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill={accent} />
          </g>
        ))}

        {/* Moving Packet Badges along the cable */}
        {packetLabels.map((pkt, idx) => {
          const packetSpacing = totalLength / packetLabels.length;
          const pos = (travelOffset + idx * packetSpacing) % totalLength;
          const ratio = pos / totalLength;
          const px = startX + (endX - startX) * ratio;
          const py = startY + (endY - startY) * ratio;

          return (
            <g key={idx} transform={`translate(${px}, ${py})`}>
              <rect
                x="-32"
                y="-14"
                width="64"
                height="18"
                rx="4"
                fill="#0F172A"
                stroke={accent}
                strokeWidth="1.2"
                filter="url(#packetGlow)"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {pkt}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

