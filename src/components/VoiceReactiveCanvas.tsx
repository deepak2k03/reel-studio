import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import type { StyleSpec, TranscriptWord } from "../lib/types";

interface VoiceReactiveCanvasProps {
  words: TranscriptWord[];
  theme: StyleSpec;
}

/**
 * Production-grade Soothing Voice-Reactive Ambient Canvas.
 * Creates continuous, fluid, hypnotic motion across the 1080x1920 canvas:
 * - Organic drifting particle constellation.
 * - Voice cadence breathing aura expanding/contracting with spoken speech.
 * - Dynamic harmonic ripples responding to voice pulses.
 * - Cinematic vignette.
 */
export const VoiceReactiveCanvas: React.FC<VoiceReactiveCanvasProps> = ({
  words,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = frame / fps;

  // Check if speech is currently active in this frame
  const activeWord = words.find(
    (w) => currentSec >= w.start && currentSec <= w.end
  );
  const isSpeaking = Boolean(activeWord);

  const accent = theme.colors.accent;
  const isDark = theme.meta?.isDark ?? true;

  // Voice Cadence Breathing Aura (Continuous expansion/contraction)
  const breathCycle = (frame * 0.05) % (Math.PI * 2);
  const baseScale = interpolate(Math.sin(breathCycle), [-1, 1], [0.85, 1.15]);
  const voiceBoost = isSpeaking ? 1.25 : 0.9;
  const auraScale = baseScale * voiceBoost;
  const auraOpacity = isSpeaking ? 0.35 : 0.16;

  // 18 Organic Drifting Particles
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const seedX = random(`px-${i}`);
      const seedY = random(`py-${i}`);
      const speed = 0.4 + random(`ps-${i}`) * 0.8;
      const size = 3 + random(`pr-${i}`) * 4;
      const hueShift = random(`ph-${i}`) > 0.5;
      return { seedX, seedY, speed, size, hueShift };
    });
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* 1. Voice Cadence Radiant Aura (Soft Center Glow) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: 720,
          height: 720,
          transform: `translate(-50%, -50%) scale(${auraScale})`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}${Math.round(
            auraOpacity * 255
          ).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          filter: "blur(60px)",
          transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
        }}
      />

      {/* 2. Floating Harmonic Wave Ring (Radiates when speaking) */}
      {isSpeaking && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "44%",
            width: interpolate((frame % 60) / 60, [0, 1], [200, 850]),
            height: interpolate((frame % 60) / 60, [0, 1], [200, 850]),
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: `1.5px solid ${accent}`,
            opacity: interpolate((frame % 60) / 60, [0, 0.5, 1], [0.4, 0.15, 0]),
            pointerEvents: "none",
          }}
        />
      )}

      {/* 3. Drifting Particle Constellation */}
      {particles.map((p, i) => {
        // Continuous deterministic drift
        const x = (p.seedX * 1080 + frame * p.speed * 0.6) % 1080;
        const y =
          (p.seedY * 1920 +
            Math.sin(frame * 0.02 + i) * 60 +
            frame * p.speed * 0.4) %
          1920;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.hueShift ? accent : "#FFFFFF",
              opacity: interpolate(
                Math.sin(frame * 0.04 + i),
                [-1, 1],
                [0.15, 0.45]
              ),
              boxShadow: `0 0 ${p.size * 2}px ${
                p.hueShift ? accent : "#FFFFFF"
              }`,
            }}
          />
        );
      })}

      {/* 4. Cinematic Vignette (Softening outer frame edges) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 45%, rgba(2, 6, 23, 0.6) 100%)"
            : "radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.12) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

