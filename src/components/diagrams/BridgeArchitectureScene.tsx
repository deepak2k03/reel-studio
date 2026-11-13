import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../../lib/timing";
import type {
  BridgeArchitectureSceneConfig,
  StyleSpec,
  TranscriptData,
} from "../../lib/types";
import { TechIcon } from "../TechIcon";

interface BridgeArchitectureSceneProps {
  scene: BridgeArchitectureSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const BridgeArchitectureScene: React.FC<BridgeArchitectureSceneProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? true;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(2.0, scene.end - sceneStartSec);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absFrame = sceneStartFrame + frame;

  const enter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  const talkDefault = Math.min(4.0, sceneSpanSec * 0.22);
  const shareDefault = Math.min(6.0, sceneSpanSec * 0.52);

  const talkFrame = scene.talkCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + talkDefault, scene.talkCue, sceneStartSec), fps)
    : sceneStartFrame + secToFrame(talkDefault, fps);
  const shareFrame = scene.shareCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + shareDefault, scene.shareCue, sceneStartSec), fps)
    : sceneStartFrame + secToFrame(shareDefault, fps);

  const forwardCycle = (frame % 90) / 90;
  const reverseCycle = ((frame + 45) % 90) / 90;

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
          transform: `translateY(${interpolate(enter, [0, 1], [-16, 0])}px)`,
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
            fontSize: 52,
            fontWeight: 800,
            color: theme.colors.text,
            letterSpacing: "-0.025em",
          }}
        >
          {scene.title}
        </h2>
      </div>

      {/* Main Architectural Bridge Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 940,
          padding: "40px 30px",
          borderRadius: 32,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          opacity: enter,
        }}
      >
        {/* Bridge Span SVG + Bidirectional Typed Packets */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 184,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 184"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Arch truss */}
            <path
              d="M 90 150 Q 400 10 710 150"
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={4}
              strokeOpacity={0.28}
            />
            {/* Bridge deck lanes */}
            <line
              x1={90}
              y1={36}
              x2={710}
              y2={36}
              stroke={theme.colors.accent}
              strokeWidth={3}
              strokeDasharray="10 8"
            />
            <line
              x1={90}
              y1={146}
              x2={710}
              y2={146}
              stroke={theme.colors.success}
              strokeWidth={3}
              strokeDasharray="10 8"
            />
          </svg>

          {/* Moving packet left -> right */}
          <div
            style={{
              position: "absolute",
              left: `${interpolate(forwardCycle, [0, 1], [18, 82])}%`,
              top: 20,
              transform: "translateX(-50%)",
              padding: "5px 14px",
              borderRadius: 999,
              backgroundColor: theme.colors.accent,
              color: "#FFFFFF",
              fontFamily: theme.typography.monoFont,
              fontSize: 17,
              fontWeight: 800,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            {`${scene.packets[0]} →`}
          </div>

          {/* Center Bridge Pylon Badge */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              padding: "10px 24px",
              borderRadius: 999,
              backgroundColor: isDark ? theme.colors.captionHighlight : theme.colors.text,
              color: isDark ? theme.colors.bg : "#FFFFFF",
              fontFamily: theme.typography.monoFont,
              fontSize: 20,
              fontWeight: 800,
              boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
            }}
          >
            {scene.bridgeLabel}
          </div>

          {/* Moving packet right -> left */}
          <div
            style={{
              position: "absolute",
              left: `${interpolate(reverseCycle, [0, 1], [82, 18])}%`,
              top: 130,
              transform: "translateX(-50%)",
              padding: "5px 14px",
              borderRadius: 999,
              backgroundColor: theme.colors.success,
              color: "#FFFFFF",
              fontFamily: theme.typography.monoFont,
              fontSize: 17,
              fontWeight: 800,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            {`← ${scene.packets[1]}`}
          </div>
        </div>

        {/* Two Distinct Connected System Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
          }}
        >
          {[
            { app: scene.leftApp, color: theme.colors.accent, active: absFrame >= talkFrame },
            { app: scene.rightApp, color: theme.colors.success, active: absFrame >= shareFrame },
          ].map(({ app, color, active }) => (
            <div
              key={app.name}
              style={{
                padding: "24px 22px",
                borderRadius: 24,
                backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FAF6F0",
                border: `2px solid ${active ? color : `${color}66`}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 20,
                  backgroundColor: `${color}20`,
                  border: `1.5px solid ${active ? color : `${color}44`}`,
                  boxShadow: active ? `0 0 20px ${color}44` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <TechIcon name={app.icon} size={38} color={color} />
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 30,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                {app.name}
              </div>
              <div
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  color: theme.colors.muted,
                }}
              >
                {app.sub}
              </div>
              <span
                style={{
                  marginTop: 4,
                  padding: "5px 12px",
                  borderRadius: 999,
                  backgroundColor: `${color}1e`,
                  fontFamily: theme.typography.monoFont,
                  fontSize: 17,
                  fontWeight: 700,
                  color,
                }}
              >
                {app.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
