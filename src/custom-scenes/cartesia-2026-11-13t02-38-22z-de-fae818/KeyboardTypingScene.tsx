import React from "react";
import { MessageSquare, Sparkles, Smartphone, Check } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Scene 2: Phone Keyboard Suggestions in Action
 * Spoken: "Dekho, jab tum apne phone pe type karte ho: 'I am going to the', toh keyboard khud suggest karta hai: office, market, gym..."
 */
export const KeyboardTypingScene: React.FC<CustomSceneRenderProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(4, scene.end - sceneStartSec);
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  // Stagger typing and suggestion appearances
  const typingStartSec = resolveCueTime(transcript, sceneStartSec + 1.2, "I am going to the", sceneStartSec);
  const officeCueSec = resolveCueTime(transcript, sceneStartSec + 3.8, "office", sceneStartSec);
  const marketCueSec = resolveCueTime(transcript, sceneStartSec + 5.0, "market", sceneStartSec);
  const gymCueSec = resolveCueTime(transcript, sceneStartSec + 6.2, "gym", sceneStartSec);

  const typingStartFrame = secToFrame(typingStartSec, fps);
  const officeFrame = secToFrame(officeCueSec, fps);
  const marketFrame = secToFrame(marketCueSec, fps);
  const gymFrame = secToFrame(gymCueSec, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  // Typing animation for "I am going to the"
  const fullText = "I am going to the ";
  const typingProgress = interpolate(
    absFrame,
    [typingStartFrame, typingStartFrame + 32],
    [0, fullText.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const displayedText = fullText.slice(0, Math.round(typingProgress));
  const showCursor = Math.floor(frame / 16) % 2 === 0;

  // Springs for suggestions popping up
  const officePop = spring({
    frame: Math.max(0, absFrame - officeFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

  const marketPop = spring({
    frame: Math.max(0, absFrame - marketFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

  const gymPop = spring({
    frame: Math.max(0, absFrame - gymFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

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
        gap: 28,
        fontFamily: theme.typography.displayFont,
      }}
    >
      {/* Eyebrow & Title */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: theme.colors.accent,
            background: theme.colors.accentSoft,
            padding: "8px 24px",
            borderRadius: 999,
          }}
        >
          {scene.eyebrow ?? "SMARTPHONE KEYBOARD"}
        </span>
        <h1
          style={{
            fontSize: theme.typography.titleSize,
            fontWeight: 800,
            color: theme.colors.text,
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {scene.title ?? "Next-Word Autocomplete"}
        </h1>
      </div>

      {/* Phone Screen Mockup Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          background: theme.colors.surface,
          borderRadius: 36,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 28px 60px rgba(30, 25, 21, 0.08)",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 26,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        {/* Top Header of Chat App */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.colors.surfaceBorder}`,
            paddingBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: theme.colors.accentSoft,
                color: theme.colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Smartphone size={24} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.colors.text }}>
                Message App
              </div>
              <div style={{ fontSize: 15, color: theme.colors.muted }}>Type a message...</div>
            </div>
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: theme.colors.accent,
              background: theme.colors.accentSoft,
              padding: "4px 12px",
              borderRadius: 8,
              fontFamily: theme.typography.monoFont,
            }}
          >
            LIVE TYPING
          </span>
        </div>

        {/* Typing Input Bar */}
        <div
          style={{
            background: theme.colors.bgSecondary,
            borderRadius: 22,
            padding: "24px 28px",
            border: `1.5px solid ${theme.colors.surfaceBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 32,
              fontWeight: 600,
              color: theme.colors.text,
              letterSpacing: "-0.01em",
            }}
          >
            {displayedText}
          </span>
          {showCursor && (
            <span
              style={{
                width: 3,
                height: 38,
                background: theme.colors.accent,
                borderRadius: 2,
                display: "inline-block",
              }}
            />
          )}
        </div>

        {/* Keyboard Suggestion Strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 6,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.colors.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Keyboard Suggestions Bar:
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            {/* Office Suggestion */}
            <div
              style={{
                background: theme.colors.surface,
                border: `2px solid ${theme.colors.accent}`,
                boxShadow: "0 10px 24px rgba(204, 84, 36, 0.18)",
                borderRadius: 20,
                padding: "20px 16px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                opacity: interpolate(officePop, [0, 1], [0.15, 1]),
                transform: `scale(${interpolate(officePop, [0, 1], [0.85, 1])})`,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: theme.colors.accent,
                }}
              >
                "office"
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: theme.colors.muted,
                  background: theme.colors.accentSoft,
                  padding: "3px 10px",
                  borderRadius: 8,
                }}
              >
                Top Pick (42%)
              </span>
            </div>

            {/* Market Suggestion */}
            <div
              style={{
                background: theme.colors.bgSecondary,
                border: `1px solid ${theme.colors.surfaceBorder}`,
                borderRadius: 20,
                padding: "20px 16px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                opacity: interpolate(marketPop, [0, 1], [0.15, 1]),
                transform: `scale(${interpolate(marketPop, [0, 1], [0.85, 1])})`,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: theme.colors.text,
                }}
              >
                "market"
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.colors.muted,
                }}
              >
                Option 2 (31%)
              </span>
            </div>

            {/* Gym Suggestion */}
            <div
              style={{
                background: theme.colors.bgSecondary,
                border: `1px solid ${theme.colors.surfaceBorder}`,
                borderRadius: 20,
                padding: "20px 16px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                opacity: interpolate(gymPop, [0, 1], [0.15, 1]),
                transform: `scale(${interpolate(gymPop, [0, 1], [0.85, 1])})`,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: theme.colors.text,
                }}
              >
                "gym"
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.colors.muted,
                }}
              >
                Option 3 (18%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
