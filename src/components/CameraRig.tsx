import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface CameraKeyframe {
  /** Frame relative to current sequence */
  frame: number;
  scale: number;
  x?: number;
  y?: number;
}

interface CameraRigProps {
  keyframes: CameraKeyframe[];
  children: React.ReactNode;
}

/**
 * Smoothly interpolates pan/zoom across keyframed regions of a diagram or code view.
 */
export const CameraRig: React.FC<CameraRigProps> = ({ keyframes, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (keyframes.length === 0) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  if (sorted.length === 1) {
    const only = sorted[0];
    return (
      <AbsoluteFill
        style={{
          transform: `translate(${only.x ?? 0}px, ${only.y ?? 0}px) scale(${only.scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const inputRange = sorted.map((k) => k.frame);
  if (inputRange[inputRange.length - 1] < durationInFrames) {
    const last = sorted[sorted.length - 1];
    sorted.push({ ...last, frame: durationInFrames });
    inputRange.push(durationInFrames);
  }

  const scale = interpolate(
    frame,
    inputRange,
    sorted.map((k) => k.scale),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const x = interpolate(
    frame,
    inputRange,
    sorted.map((k) => k.x ?? 0),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const y = interpolate(
    frame,
    inputRange,
    sorted.map((k) => k.y ?? 0),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

