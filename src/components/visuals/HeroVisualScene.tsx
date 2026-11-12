import React from "react";
import { Circle } from "@remotion/shapes";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { HeroVisualSceneConfig, StyleSpec } from "../../lib/types";
import { TechIcon } from "../TechIcon";

interface HeroVisualSceneProps {
  scene: HeroVisualSceneConfig;
  theme: StyleSpec;
}

export const HeroVisualScene: React.FC<HeroVisualSceneProps> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  const accentColor =
    scene.accentVariant === "success"
      ? theme.colors.success
      : scene.accentVariant === "danger"
        ? theme.colors.danger
        : theme.colors.accent;

  const isDark = theme.meta?.isDark ?? true;
  const floatY = Math.sin(frame / 22) * 8;
  const ringSpin = (frame * 0.45) % 360;
  const pulse = 1 + Math.sin(frame / 18) * 0.04;
  const orbits = (scene.orbitIcons ?? []).slice(0, 4);

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
        gap: 38,
      }}
    >
      {scene.eyebrow && (
        <div
          style={{
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [-18, 0])}px)`,
            fontFamily: theme.typography.monoFont,
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accentColor,
            backgroundColor: theme.colors.accentSoft,
            border: `1px solid ${accentColor}55`,
            padding: "10px 22px",
            borderRadius: 999,
          }}
        >
          {scene.eyebrow}
        </div>
      )}

      {/* Centered Animated Radar + Hero Brand Emblem */}
      <div
        style={{
          position: "relative",
          width: 440,
          height: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.76, 1])})`,
        }}
      >
        {/* Outer rotating segmented ring */}
        <svg
          width={420}
          height={420}
          viewBox="0 0 420 420"
          style={{
            position: "absolute",
            transform: `rotate(${ringSpin}deg)`,
            opacity: 0.45,
          }}
        >
          <circle
            cx={210}
            cy={210}
            r={196}
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
            strokeDasharray="18 14"
          />
        </svg>

        {/* Inner pulsing shape ring */}
        <div
          style={{
            position: "absolute",
            transform: `scale(${pulse})`,
            opacity: 0.25,
          }}
        >
          <Circle
            radius={150}
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
          />
        </div>

        {/* Soft center halo */}
        <div
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}44 0%, transparent 72%)`,
            filter: "blur(18px)",
          }}
        />

        {/* Main Frosted Glass Icon Tile */}
        <div
          style={{
            position: "relative",
            width: 196,
            height: 196,
            borderRadius: 46,
            background: isDark
              ? "linear-gradient(145deg, rgba(30,41,59,0.92), rgba(15,23,42,0.96))"
              : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(241,245,249,0.95))",
            border: `2px solid ${accentColor}88`,
            boxShadow: isDark
              ? `0 28px 70px rgba(0,0,0,0.45), 0 0 46px ${accentColor}33`
              : `0 22px 54px rgba(45, 28, 12, 0.10), 0 0 32px ${accentColor}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${floatY}px)`,
          }}
        >
          <TechIcon name={scene.heroIcon} size={96} color={accentColor} />
        </div>

        {/* Orbiting Secondary Tech Badges */}
        {orbits.map((iconName, idx) => {
          const angle = ((idx * (360 / orbits.length) - 45) * Math.PI) / 180;
          const orbitRadius = 186;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;
          const badgeSpring = spring({
            frame: Math.max(0, frame - (idx + 1) * 6),
            fps,
            config: { damping: 14, stiffness: 210, mass: 0.7 },
          });
          const bob = Math.sin((frame + idx * 18) / 18) * 6;

          return (
            <div
              key={`${iconName}-${idx}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 82,
                height: 82,
                borderRadius: 24,
                backgroundColor: theme.colors.surface,
                border: `1.5px solid ${theme.colors.surfaceBorder}`,
                boxShadow: "0 14px 32px rgba(0,0,0,0.38)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y + bob}px)) scale(${badgeSpring})`,
                opacity: badgeSpring,
              }}
            >
              <TechIcon name={iconName} size={40} color={theme.colors.text} />
            </div>
          );
        })}
      </div>

      {/* Centered Bold Short Headline */}
      <div
        style={{
          maxWidth: 860,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: theme.colors.text,
          }}
        >
          {scene.title}
        </h1>

        {scene.tag && (
          <div
            style={{
              padding: "10px 24px",
              borderRadius: 14,
              backgroundColor: theme.colors.surface,
              border: `1.5px solid ${theme.colors.surfaceBorder}`,
              fontFamily: theme.typography.monoFont,
              fontSize: 24,
              fontWeight: 700,
              color: theme.colors.captionHighlight,
            }}
          >
            {scene.tag}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

