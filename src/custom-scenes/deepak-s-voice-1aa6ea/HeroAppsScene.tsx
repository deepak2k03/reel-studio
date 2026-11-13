import React from "react";
import { CloudSun, CreditCard, KeyRound, Webhook } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Beat 1: Shows Login, Weather, and Online Payment apps connecting through an API hub.
 */
export const HeroAppsScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? false;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const p = (scene.props ?? {}) as {
    loginCue?: string;
    weatherCue?: string;
    paymentCue?: string;
    apiCue?: string;
  };

  const loginFrame = p.loginCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 1.5, p.loginCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + sceneSpanSec * 0.16, fps);
  const weatherFrame = p.weatherCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 3.0, p.weatherCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + sceneSpanSec * 0.34, fps);
  const payFrame = p.paymentCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 4.5, p.paymentCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + sceneSpanSec * 0.52, fps);
  const apiFrame = p.apiCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 7.5, p.apiCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + sceneSpanSec * 0.78, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });
  const apiUnlock = spring({
    frame: Math.max(0, absFrame - apiFrame),
    fps,
    config: { damping: 14, stiffness: 210, mass: 0.78 },
  });

  const apps = [
    { label: "Login", tag: "AUTH", icon: KeyRound, triggerFrame: loginFrame, cx: 170, cy: 130 },
    { label: "Weather", tag: "28°C", icon: CloudSun, triggerFrame: weatherFrame, cx: 430, cy: 130 },
    { label: "Payment", tag: "₹499", icon: CreditCard, triggerFrame: payFrame, cx: 690, cy: 130 },
  ];

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
        gap: 32,
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-14, 0])}px)`,
        }}
      >
        {scene.eyebrow && (
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.colors.accent,
              backgroundColor: theme.colors.accentSoft,
              border: `1px solid ${theme.colors.accent}44`,
              padding: "6px 18px",
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
            fontSize: 54,
            fontWeight: 800,
            color: theme.colors.text,
            letterSpacing: "-0.025em",
          }}
        >
          {scene.title ?? "Apps Talk Via APIs"}
        </h2>
      </div>

      {/* Main Custom Connected Apps SVG + Node Diagram */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 860,
          height: 540,
          borderRadius: 34,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          overflow: "hidden",
          opacity: enter,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 860 540"
          style={{ position: "absolute", inset: 0 }}
        >
          {apps.map((app, i) => {
            const active = absFrame >= app.triggerFrame;
            const pathD = `M ${app.cx} 215 C ${app.cx} 305, 430 270, 430 355`;
            return (
              <g key={`wire-${i}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={active ? theme.colors.accent : theme.colors.surfaceBorder}
                  strokeWidth={active ? 4 : 2.5}
                  strokeDasharray="10 8"
                  strokeDashoffset={active ? dashOffset : 0}
                  strokeOpacity={active ? 0.9 : 0.45}
                />
                {active && (
                  <circle
                    cx={interpolate((frame + i * 22) % 60, [0, 60], [app.cx, 430])}
                    cy={interpolate((frame + i * 22) % 60, [0, 60], [215, 355])}
                    r={6}
                    fill={theme.colors.accent}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Top 3 Real App Cards */}
        <div
          style={{
            position: "absolute",
            top: 42,
            left: 36,
            right: 36,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {apps.map((app) => {
            const Icon = app.icon;
            const unlocked = absFrame >= app.triggerFrame;
            const pop = spring({
              frame: Math.max(0, absFrame - app.triggerFrame),
              fps,
              config: { damping: 14, stiffness: 220, mass: 0.72 },
            });
            return (
              <div
                key={app.label}
                style={{
                  padding: "22px 16px",
                  borderRadius: 24,
                  backgroundColor: unlocked
                    ? isDark
                      ? "rgba(255,255,255,0.06)"
                      : "#FAF5ED"
                    : theme.colors.surface,
                  border: `2px solid ${unlocked ? theme.colors.accent : theme.colors.surfaceBorder}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  transform: `translateY(${unlocked ? -6 * pop : 0}px) scale(${unlocked ? 1 + 0.03 * pop : 0.96})`,
                  opacity: unlocked ? 1 : 0.55,
                }}
              >
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 18,
                    backgroundColor: unlocked ? theme.colors.accent : theme.colors.accentSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={32} color={unlocked ? "#FFFFFF" : theme.colors.accent} />
                </div>
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 28,
                    fontWeight: 800,
                    color: theme.colors.text,
                  }}
                >
                  {app.label}
                </span>
                <span
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 17,
                    fontWeight: 700,
                    color: unlocked ? theme.colors.accent : theme.colors.muted,
                  }}
                >
                  {app.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Central API Role Medallion */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: "50%",
            transform: `translateX(-50%) scale(${0.92 + 0.1 * apiUnlock})`,
            padding: "20px 38px",
            borderRadius: 28,
            backgroundColor: absFrame >= apiFrame ? theme.colors.accent : isDark ? "#0F172A" : "#FAF5ED",
            border: `2.5px solid ${theme.colors.accent}`,
            boxShadow: absFrame >= apiFrame
              ? `0 18px 42px ${theme.colors.accentSoft}`
              : "none",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Webhook
            size={36}
            color={absFrame >= apiFrame ? "#FFFFFF" : theme.colors.accent}
          />
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 32,
              fontWeight: 800,
              color: absFrame >= apiFrame ? "#FFFFFF" : theme.colors.text,
              letterSpacing: "0.04em",
            }}
          >
            API ROLE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

