import React, { useMemo } from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { chunkWordsForCaptions, frameToSec } from "../lib/timing";
import type { StyleSpec, TranscriptWord } from "../lib/types";

interface KineticCaptionsProps {
  words: TranscriptWord[];
  theme: StyleSpec;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = frameToSec(frame, fps);

  const chunks = useMemo(() => chunkWordsForCaptions(words, 4, 24, 0.35), [words]);

  const activeChunk = chunks.find(
    (c) => currentSec >= c.start - 0.04 && currentSec <= c.end + 0.16,
  );

  if (!activeChunk) {
    return null;
  }

  const chunkStartFrame = Math.round(activeChunk.start * fps);
  const popProgress = spring({
    frame: Math.max(0, frame - chunkStartFrame),
    fps,
    config: { damping: 16, stiffness: 240, mass: 0.7 },
  });

  const exactWord = activeChunk.words.find(
    (w) => currentSec >= w.start && currentSec <= w.end,
  );
  const startedWords = activeChunk.words.filter((w) => currentSec >= w.start);
  const currentWordId =
    exactWord?.id ??
    (startedWords.length > 0 ? startedWords[startedWords.length - 1].id : null);

  const isDark = theme.meta?.isDark ?? true;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: Math.max(48, theme.safeZone.bottom - 125),
        paddingLeft: theme.safeZone.left,
        paddingRight: theme.safeZone.right,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 20px",
          padding: isDark ? "16px 28px" : "8px 16px",
          borderRadius: 20,
          backgroundColor: isDark ? "rgba(9, 13, 22, 0.82)" : "transparent",
          border: isDark ? `1px solid ${theme.colors.surfaceBorder}` : "none",
          boxShadow: isDark ? "0 18px 42px rgba(0, 0, 0, 0.45)" : "none",
          transform: `scale(${0.92 + 0.08 * popProgress}) translateY(${(1 - popProgress) * 14}px)`,
          opacity: popProgress,
          maxWidth: 880,
        }}
      >
        {activeChunk.words.map((w) => {
          const isCurrent = w.id === currentWordId;
          const isSpoken = currentSec > w.end && !isCurrent;

          return (
            <span
              key={w.id}
              style={{
                fontFamily: theme.typography.displayFont,
                fontSize: isDark ? theme.typography.captionSize : theme.typography.captionSize + 6,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
                padding: "0 2px",
                color: isCurrent
                  ? theme.colors.captionHighlight
                  : isSpoken
                    ? theme.colors.text
                    : isDark
                      ? "rgba(248, 250, 252, 0.58)"
                      : "rgba(30, 25, 21, 0.42)",
                transform: isCurrent ? "scale(1.05)" : "scale(1)",
                textShadow: isDark
                  ? isCurrent
                    ? `0 0 22px ${theme.colors.accentSoft}`
                    : "0 2px 10px rgba(0,0,0,0.65)"
                  : "none",
                display: "inline-block",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

