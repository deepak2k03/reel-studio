import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../lib/timing";
import type { CodeSceneConfig, StyleSpec, TranscriptData } from "../lib/types";

interface CodeStepperProps {
  scene: CodeSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const CodeStepper: React.FC<CodeStepperProps> = ({
  scene,
  transcript,
  theme,
}) => {
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

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const absoluteFrame = sceneStartFrame + frame;

  // Determine the currently active highlight step anchored either to cuePhrase or offset.
  let activeLines: number[] = [];
  let activeCaption: string | undefined;

  if (scene.steps && scene.steps.length > 0) {
    for (const step of scene.steps) {
      const stepFrame = step.cuePhrase
        ? secToFrame(resolveCueTime(transcript, sceneStartSec + (step.atOffset ?? 0), step.cuePhrase), fps)
        : sceneStartFrame + secToFrame(step.atOffset ?? 0, fps);

      if (absoluteFrame >= stepFrame) {
        activeLines = step.lines;
        activeCaption = step.caption;
      }
    }
  }

  const hasFocus = activeLines.length > 0;
  const activeSet = new Set(activeLines);

  return (
    <AbsoluteFill
      style={{
        paddingTop: theme.safeZone.top,
        paddingBottom: theme.safeZone.bottom,
        paddingLeft: theme.safeZone.left,
        paddingRight: theme.safeZone.right,
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
      }}
    >
      {scene.title && (
        <div
          style={{
            fontFamily: theme.typography.displayFont,
            fontSize: 46,
            fontWeight: 800,
            color: theme.colors.text,
            textAlign: "center",
            letterSpacing: "-0.02em",
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
          }}
        >
          {scene.title}
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: 880,
          borderRadius: 26,
          backgroundColor: "#0D1117",
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 30px 75px rgba(0, 0, 0, 0.52)",
          overflow: "hidden",
          transform: `scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
          opacity: enter,
        }}
      >
        {/* Window title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#EF4444" }} />
            <span style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
            <span style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#10B981" }} />
          </div>
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 20,
              color: theme.colors.muted,
            }}
          >
            {scene.filename}
          </span>
          <span style={{ width: 52 }} />
        </div>

        {/* Highlighted source */}
        <div style={{ padding: "24px 16px" }}>
          <Highlight theme={themes.nightOwl} code={scene.code.trimEnd()} language={scene.language}>
            {({ tokens, getLineProps, getTokenProps }) => (
              <pre
                style={{
                  margin: 0,
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.codeSize,
                  lineHeight: 1.55,
                  overflow: "hidden",
                }}
              >
                {tokens.map((line, i) => {
                  const lineNumber = i + 1;
                  const isActive = !hasFocus || activeSet.has(lineNumber);
                  const lineProps = getLineProps({ line });

                  return (
                    <div
                      key={lineNumber}
                      {...lineProps}
                      style={{
                        ...lineProps.style,
                        display: "flex",
                        alignItems: "baseline",
                        padding: "3px 16px",
                        borderRadius: 4,
                        backgroundColor:
                          hasFocus && isActive ? theme.colors.accentSoft : "transparent",
                        borderLeft:
                          hasFocus && isActive
                            ? `4px solid ${theme.colors.accent}`
                            : "4px solid transparent",
                        opacity: isActive ? 1 : 0.34,
                      }}
                    >
                      <span
                        style={{
                          width: 44,
                          flexShrink: 0,
                          userSelect: "none",
                          color: isActive ? theme.colors.accent : "rgba(148,163,184,0.45)",
                          fontSize: 21,
                        }}
                      >
                        {lineNumber}
                      </span>
                      <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
      </div>

      {activeCaption && (
        <div
          style={{
            alignSelf: "flex-start",
            padding: "12px 22px",
            borderRadius: 14,
            backgroundColor: theme.colors.accentSoft,
            border: `1px solid ${theme.colors.accent}`,
            fontFamily: theme.typography.monoFont,
            fontSize: 23,
            fontWeight: 700,
            color: theme.colors.text,
          }}
        >
          {activeCaption}
        </div>
      )}
    </AbsoluteFill>
  );
};

