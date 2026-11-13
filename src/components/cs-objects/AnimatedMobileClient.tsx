import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BaseCsObjectProps } from "./types";

export interface AnimatedMobileClientProps extends BaseCsObjectProps {
  platform?: "iOS" | "Android" | "Web";
  appTitle?: string;
  actionText?: string;
  responsePayload?: string;
  touchFrameOffset?: number;
}

/**
 * Production-grade Animated Smartphone / Client Device.
 * Renders realistic glass-and-titanium smartphone chassis:
 * Dynamic pill camera notch, 5G/Wi-Fi status bar indicators, live simulated app UI,
 * touch ripple interactions, and outgoing HTTP request payload visualization.
 */
export const AnimatedMobileClient: React.FC<AnimatedMobileClientProps> = ({
  theme,
  state = "active",
  label = "Mobile Client",
  sublabel,
  metric,
  annotation,
  scale = 1,
  glow = true,
  platform = "iOS",
  appTitle = "Client App",
  actionText = "POST /api/v1/auth",
  responsePayload = '{"status": 200, "ok": true}',
  style,
}) => {
  const frame = useCurrentFrame();
  const isDark = theme?.meta?.isDark ?? true;
  const accent = theme?.colors?.accent ?? "#6366F1"; // Indigo client
  const success = theme?.colors?.success ?? "#10B981";
  const danger = theme?.colors?.danger ?? "#EF4444";

  const isBusy = state === "active" || state === "busy" || state === "transmitting";

  // Touch ripple animation cycle (repeats every 60 frames = 1s at 60fps)
  const touchCycle = frame % 60;
  const touchScale = interpolate(touchCycle, [0, 25], [0.4, 2.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const touchOpacity = interpolate(touchCycle, [0, 25], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const width = 280;
  const height = 380;

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
      {/* Top Header Label */}
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
              {platform}
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
              {metric ?? "5G • 24ms"}
            </span>
          </div>
        </div>
      )}

      {/* Main Smartphone SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 280 380"
        style={{
          filter: glow
            ? `drop-shadow(0 14px 36px ${accent}25) drop-shadow(0 0 16px ${accent}18)`
            : "none",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="phoneBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B0F19" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          <linearGradient id="screenGlassSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Outer Titanium Chassis Frame (260x360) */}
        <rect
          x="10"
          y="10"
          width="260"
          height="360"
          rx="38"
          fill="url(#phoneBezel)"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* Inner OLED Display Panel */}
        <rect
          x="18"
          y="18"
          width="244"
          height="344"
          rx="32"
          fill="url(#phoneScreen)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />

        {/* Dynamic Island / Pill Camera Notch */}
        <rect x="100" y="26" width="80" height="20" rx="10" fill="#000000" stroke="#1E293B" strokeWidth="0.8" />
        <circle cx="120" cy="36" r="3.5" fill="#0B132B" stroke="#1E293B" strokeWidth="0.8" />
        <circle cx="158" cy="36" r="2.5" fill="#06B6D4" opacity="0.6" />

        {/* Status Bar Indicators */}
        <text x="36" y="38" fill="#94A3B8" fontSize="8" fontFamily="monospace" fontWeight="bold">
          9:41
        </text>
        {/* 5G & Battery icon */}
        <text x="212" y="38" fill="#94A3B8" fontSize="8" fontFamily="monospace" fontWeight="bold">
          5G ▮▮▮
        </text>

        {/* App Title Bar */}
        <rect x="28" y="56" width="224" height="28" rx="6" fill="#111827" stroke="#1F2937" strokeWidth="1" />
        <text x="40" y="74" fill="#F3F4F6" fontSize="10" fontFamily="sans-serif" fontWeight="700">
          {appTitle}
        </text>

        {/* Interactive Action Card (e.g. Button or Request Trigger) */}
        <g transform="translate(28, 96)">
          <rect
            x="0"
            y="0"
            width="224"
            height="54"
            rx="8"
            fill="rgba(99, 102, 241, 0.15)"
            stroke={accent}
            strokeWidth="1.2"
          />
          <text x="14" y="24" fill="#C7D2FE" fontSize="10" fontFamily="monospace" fontWeight="bold">
            {actionText}
          </text>
          <text x="14" y="42" fill="#818CF8" fontSize="8.5" fontFamily="monospace">
            Payload: HTTP 1.1 / JSON
          </text>

          {/* Touch Ripple Animation */}
          {touchCycle < 25 && isBusy && (
            <circle
              cx="190"
              cy="27"
              r={14 * touchScale}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              opacity={touchOpacity}
            />
          )}
          {/* Finger tap point dot */}
          <circle cx="190" cy="27" r="5" fill={accent} opacity="0.8" />
        </g>

        {/* Simulated Response Stream Area */}
        <g transform="translate(28, 162)">
          <rect x="0" y="0" width="224" height="154" rx="8" fill="#090D16" stroke="#1F2937" strokeWidth="1" />
          <text x="14" y="20" fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">
            RESPONSE BUFFER:
          </text>

          {/* Code lines */}
          <rect x="14" y="32" width="196" height="18" rx="3" fill="#111827" />
          <text x="22" y="44" fill={success} fontSize="8" fontFamily="monospace">
            HTTP/2 200 OK
          </text>

          <rect x="14" y="56" width="196" height="38" rx="3" fill="#111827" />
          <text x="22" y="70" fill="#38BDF8" fontSize="8" fontFamily="monospace">
            {responsePayload.slice(0, 24)}
          </text>
          <text x="22" y="84" fill="#38BDF8" fontSize="8" fontFamily="monospace">
            {responsePayload.slice(24, 48)}
          </text>

          {/* Data transmission pulse bars */}
          {Array.from({ length: 4 }).map((_, i) => (
            <rect
              key={i}
              x={14 + i * 50}
              y="108"
              width="44"
              height="6"
              rx="2"
              fill={isBusy && (Math.floor(frame / 6) + i) % 2 === 0 ? accent : "#1F2937"}
            />
          ))}
        </g>

        {/* Glass Reflection Sheen */}
        <rect x="18" y="18" width="244" height="344" rx="32" fill="url(#screenGlassSheen)" pointerEvents="none" />

        {/* iOS Home Indicator Bar at Bottom */}
        <rect x="100" y="350" width="80" height="4" rx="2" fill="#E2E8F0" opacity="0.8" />
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

