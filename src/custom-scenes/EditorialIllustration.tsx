import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { StyleSpec } from "../lib/types";
import { resolveProjectMedia } from "./types";

interface EditorialIllustrationProps {
  src: string;
  mediaBaseUrl?: string;
  theme: StyleSpec;
  width?: number;
  height?: number;
  borderRadius?: number;
  paperBlend?: boolean;
  delayFrames?: number;
  floatAmplitude?: number;
  style?: React.CSSProperties;
}

/**
 * Renders generated project artwork with spring entrance, subtle float, and optional
 * light/dark paper blending (`multiply` on cream/white paper, `screen` on dark canvases).
 */
export const EditorialIllustration: React.FC<EditorialIllustrationProps> = ({
  src,
  mediaBaseUrl,
  theme,
  width = 480,
  height = 480,
  borderRadius = 24,
  paperBlend = true,
  delayFrames = 0,
  floatAmplitude = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? true;

  const enter = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: {
      damping: theme.motion.springDamping,
      stiffness: theme.motion.springStiffness,
      mass: theme.motion.springMass,
    },
  });

  const floatY = floatAmplitude > 0 ? Math.sin(frame / 24) * floatAmplitude : 0;
  const resolvedSrc = resolveProjectMedia(mediaBaseUrl, src);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: paperBlend ? 0 : borderRadius,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [18, 0]) + floatY}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      <Img
        src={resolvedSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          mixBlendMode: paperBlend ? (isDark ? "screen" : "multiply") : "normal",
        }}
      />
    </div>
  );
};

