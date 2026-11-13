import React from "react";
import { Mail, Monitor, Server } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Beat 2: Visualizes API as a live messenger carrying structured requests between two software systems.
 */
export const MessengerBridgeScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? false;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const p = (scene.props ?? {}) as {
    messengerCue?: string;
    commCue?: string;
  };
  const messengerFrame = p.messengerCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 1.5, p.messengerCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 1.5, fps);
  const commFrame = p.commCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 4.5, p.commCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 4.5, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  // Back-and-forth messenger shuttle (0 -> 1 -> 0 over 150 frames)
  const rawCycle = (frame % 150) / 150;
  const goingRight = rawCycle < 0.5;
  const travel = goingRight ? rawCycle * 2 : (1 - rawCycle) * 2;
  const xPct = interpolate(travel, [0, 1], [22, 78]);

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
        gap: 30,
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
            fontSize: 50,
            fontWeight: 800,
            color: theme.colors.text,
            letterSpacing: "-0.025em",
          }}
        >
          {scene.title ?? "API = Messenger"}
        </h2>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 880,
          padding: "44px 32px",
          borderRadius: 34,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          display: "flex",
          flexDirection: "column",
          gap: 36,
          opacity: enter,
        }}
      >
        {/* Two Software Systems Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          {[
            { label: "Software A", sub: "Client / Request", icon: Monitor, color: theme.colors.accent },
            { label: "Software B", sub: "Server / Response", icon: Server, color: theme.colors.success },
          ].map((sys) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.label}
                style={{
                  padding: "28px 20px",
                  borderRadius: 24,
                  backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FAF5ED",
                  border: `2px solid ${sys.color}77`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    backgroundColor: `${sys.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={38} color={sys.color} />
                </div>
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 30,
                    fontWeight: 800,
                    color: theme.colors.text,
                  }}
                >
                  {sys.label}
                </span>
                <span
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 18,
                    color: theme.colors.muted,
                  }}
                >
                  {sys.sub}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dedicated Messenger Shuttle Track */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 110,
            borderRadius: 22,
            backgroundColor: isDark ? "#0A101D" : "#FAF5ED",
            border: `1.5px solid ${theme.colors.surfaceBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 48,
              right: 48,
              height: 4,
              background: `repeating-linear-gradient(to right, ${
                absFrame >= commFrame ? theme.colors.accent : theme.colors.surfaceBorder
              } 0 12px, transparent 12px 22px)`,
            }}
          />

          <div
            style={{
              position: "absolute",
              left: `${xPct}%`,
              transform: "translateX(-50%)",
              padding: "12px 22px",
              borderRadius: 999,
              backgroundColor:
                absFrame >= messengerFrame
                  ? goingRight
                    ? theme.colors.accent
                    : theme.colors.success
                  : theme.colors.muted,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
              whiteSpace: "nowrap",
            }}
          >
            <Mail size={24} color="#FFFFFF" />
            <span
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              {goingRight ? "API · MSG →" : "← API · REPLY"}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

