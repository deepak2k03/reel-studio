import React from "react";
import { CheckCircle2, CreditCard, Send, ShieldCheck, XCircle } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Beat 5: Shows that APIs also SEND write commands (Payment Deduction -> Payment Successful / Failed).
 */
export const PaymentWriteScene: React.FC<CustomSceneRenderProps> = ({
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
    sendCue?: string;
    deductCue?: string;
    processCue?: string;
    successCue?: string;
    failedCue?: string;
  };

  const sendFrame = p.sendCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 3.0, p.sendCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 3.0, fps);
  const deductFrame = p.deductCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 6.5, p.deductCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 6.5, fps);
  const processFrame = p.processCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 10.0, p.processCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 10.0, fps);
  const successFrame = p.successCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 14.0, p.successCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 14.0, fps);
  const failedFrame = p.failedCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 16.0, p.failedCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 16.0, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const isSending = absFrame >= sendFrame;
  const isProcessing = absFrame >= processFrame;
  const showSuccess = absFrame >= successFrame;
  const showFailed = absFrame >= failedFrame;

  const packetProgress = isSending
    ? interpolate(absFrame, [sendFrame, Math.max(sendFrame + 36, deductFrame + 30)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

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
        gap: 24,
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
            fontSize: 48,
            fontWeight: 800,
            color: theme.colors.text,
            letterSpacing: "-0.025em",
          }}
        >
          {scene.title ?? "Send Data Via API"}
        </h2>
      </div>

      {/* Main Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          padding: "30px 28px",
          borderRadius: 34,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          opacity: enter,
        }}
      >
        {/* Top Mode Pill: GET Read vs POST Send */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
          <span
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              fontFamily: theme.typography.monoFont,
              fontSize: 18,
              fontWeight: 700,
              color: theme.colors.muted,
              backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F3ECE0",
              textDecoration: isSending ? "line-through" : "none",
            }}
          >
            READ ONLY (GET)
          </span>
          <span
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              fontFamily: theme.typography.monoFont,
              fontSize: 18,
              fontWeight: 800,
              color: "#FFFFFF",
              backgroundColor: theme.colors.accent,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Send size={16} color="#FFFFFF" />
            SEND DATA (POST)
          </span>
        </div>

        {/* App Checkout -> Payment System */}
        <div
          style={{
            padding: "20px 22px",
            borderRadius: 22,
            backgroundColor: isDark ? "#0A101D" : "#FAF5ED",
            border: `2px solid ${theme.colors.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <CreditCard size={34} color={theme.colors.accent} />
            <div>
              <div
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 17,
                  fontWeight: 700,
                  color: theme.colors.accent,
                }}
              >
                POST /api/pay/deduct
              </div>
              <div
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 28,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                Deduct ₹499 · User #84
              </div>
            </div>
          </div>
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 18,
              fontWeight: 800,
              color: isSending ? theme.colors.accent : theme.colors.muted,
            }}
          >
            {isSending ? "SENT →" : "READY"}
          </span>
        </div>

        {/* Animated Vertical Pipe */}
        <div
          style={{
            position: "relative",
            height: 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 4,
              height: "100%",
              backgroundColor: isSending ? theme.colors.accent : theme.colors.surfaceBorder,
            }}
          />
          {isSending && (
            <div
              style={{
                position: "absolute",
                top: `${interpolate(packetProgress, [0, 1], [12, 88])}%`,
                transform: "translateY(-50%)",
                padding: "6px 18px",
                borderRadius: 999,
                backgroundColor: theme.colors.accent,
                color: "#FFFFFF",
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {`{ "amount": 499, "action": "deduct" } ↓`}
            </div>
          )}
        </div>

        {/* Payment Gateway Processor */}
        <div
          style={{
            padding: "20px 22px",
            borderRadius: 22,
            backgroundColor: isDark ? "#0A101D" : "#FAF5ED",
            border: `2px solid ${isProcessing ? theme.colors.success : theme.colors.surfaceBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ShieldCheck
              size={34}
              color={isProcessing ? theme.colors.success : theme.colors.muted}
            />
            <div>
              <div
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 28,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                Payment System Core
              </div>
              <div
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  color: isProcessing ? theme.colors.success : theme.colors.muted,
                }}
              >
                {showSuccess
                  ? "Transaction processed · Responding via API"
                  : isProcessing
                    ? "Validating balance & processing…"
                    : "Waiting for API command"}
              </div>
            </div>
          </div>
        </div>

        {/* Explicit Dual Outcome Response Badges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 18,
              backgroundColor: showSuccess ? `${theme.colors.success}1C` : "transparent",
              border: `2px solid ${showSuccess ? theme.colors.success : theme.colors.surfaceBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: showSuccess ? 1 : 0.4,
            }}
          >
            <CheckCircle2 size={26} color={theme.colors.success} />
            <span
              style={{
                fontFamily: theme.typography.displayFont,
                fontSize: 24,
                fontWeight: 800,
                color: showSuccess ? theme.colors.success : theme.colors.muted,
              }}
            >
              Payment Successful
            </span>
          </div>

          <div
            style={{
              padding: "16px 18px",
              borderRadius: 18,
              backgroundColor: showFailed ? `${theme.colors.danger}18` : "transparent",
              border: `2px solid ${showFailed ? theme.colors.danger : theme.colors.surfaceBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: showFailed ? 1 : 0.4,
            }}
          >
            <XCircle size={26} color={theme.colors.danger} />
            <span
              style={{
                fontFamily: theme.typography.displayFont,
                fontSize: 24,
                fontWeight: 800,
                color: showFailed ? theme.colors.danger : theme.colors.muted,
              }}
            >
              Payment Failed
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

