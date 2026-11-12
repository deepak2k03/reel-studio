import React from "react";
import { ChefHat, ClipboardList, Lock, User, UtensilsCrossed } from "lucide-react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveCueTime, secToFrame } from "../../lib/timing";
import type {
  RestaurantMetaphorSceneConfig,
  StyleSpec,
  TranscriptData,
} from "../../lib/types";

interface RestaurantMetaphorSceneProps {
  scene: RestaurantMetaphorSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const RestaurantMetaphorScene: React.FC<RestaurantMetaphorSceneProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? true;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(2.5, scene.end - sceneStartSec);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
  const sceneEndFrame = secToFrame(scene.end, fps);
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

  const noDirectDefault = Math.min(1.5, sceneSpanSec * 0.14);
  const waiterDefault = Math.min(3.2, sceneSpanSec * 0.30);
  const takeOrderDefault = Math.min(4.4, sceneSpanSec * 0.45);
  const chefTellDefault = Math.min(6.0, sceneSpanSec * 0.62);
  const foodReadyDefault = Math.min(7.5, sceneSpanSec * 0.76);

  const noDirectFrame = scene.noDirectCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + noDirectDefault, scene.noDirectCue), fps)
    : sceneStartFrame + secToFrame(noDirectDefault, fps);
  const waiterFrame = scene.waiterCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + waiterDefault, scene.waiterCue), fps)
    : sceneStartFrame + secToFrame(waiterDefault, fps);
  const takeOrderFrame = scene.takeOrderCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + takeOrderDefault, scene.takeOrderCue), fps)
    : sceneStartFrame + secToFrame(takeOrderDefault, fps);
  const chefTellFrame = scene.chefTellCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + chefTellDefault, scene.chefTellCue), fps)
    : sceneStartFrame + secToFrame(chefTellDefault, fps);
  const foodReadyFrame = scene.foodReadyCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + foodReadyDefault, scene.foodReadyCue), fps)
    : sceneStartFrame + secToFrame(foodReadyDefault, fps);

  const showBarrierWarning = absFrame >= noDirectFrame && absFrame < waiterFrame;
  const waiterActive = absFrame >= waiterFrame;
  const waiterEnter = spring({
    frame: Math.max(0, absFrame - waiterFrame),
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  const outboundEndFrame = Math.max(takeOrderFrame + 24, Math.min(foodReadyFrame - 4, chefTellFrame + 30));
  const returnEndFrame = Math.max(foodReadyFrame + 24, Math.min(sceneEndFrame - 4, foodReadyFrame + 95));

  // Waiter glides down from Table (18%) -> Kitchen (76%) -> back up to Table (22%)
  let waiterY = 48;
  let waiterStatus = "Ready";
  if (absFrame >= takeOrderFrame && absFrame < foodReadyFrame) {
    waiterY = interpolate(absFrame, [takeOrderFrame, outboundEndFrame], [22, 74], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    waiterStatus = absFrame >= chefTellFrame ? "Order → Chef" : "Taking Order #42";
  } else if (absFrame >= foodReadyFrame) {
    waiterY = interpolate(absFrame, [foodReadyFrame, returnEndFrame], [74, 22], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    waiterStatus = absFrame > returnEndFrame - 10 ? "Served to Table ✓" : "Delivering Dish";
  }

  const kitchenDone = absFrame >= foodReadyFrame;
  const orderServed = absFrame >= foodReadyFrame + 85;

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
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
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
          {scene.title}
        </h2>
      </div>

      {/* Spatial Restaurant Diagram Stage */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 880,
          height: 880,
          padding: "28px 30px",
          borderRadius: 32,
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 20px 52px rgba(45, 28, 12, 0.09)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: enter,
        }}
      >
        {/* TOP: Dining Table Zone */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: 24,
            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FAF6F0",
            border: `2px solid ${orderServed ? theme.colors.success : theme.colors.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                backgroundColor: theme.colors.accentSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={34} color={theme.colors.accent} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 30,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                Dining Table (You)
              </div>
              <div
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 19,
                  color: theme.colors.muted,
                }}
              >
                {orderServed ? "Order #42 Delivered ✓" : "Menu → Order #42"}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 14,
              backgroundColor: orderServed
                ? `${theme.colors.success}20`
                : theme.colors.surface,
              border: `1.5px solid ${
                orderServed ? theme.colors.success : theme.colors.surfaceBorder
              }`,
              fontFamily: theme.typography.monoFont,
              fontSize: 19,
              fontWeight: 800,
              color: orderServed ? theme.colors.success : theme.colors.text,
            }}
          >
            <ClipboardList size={20} color={orderServed ? theme.colors.success : theme.colors.accent} />
            {orderServed ? "DISH READY" : "TICKET #42"}
          </div>
        </div>

        {/* MIDDLE: Kitchen Partition Wall & Moving Waiter */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Vertical path */}
          <div
            style={{
              position: "absolute",
              top: 8,
              bottom: 8,
              width: 4,
              background: showBarrierWarning
                ? `repeating-linear-gradient(to bottom, ${theme.colors.danger} 0 10px, transparent 10px 20px)`
                : `repeating-linear-gradient(to bottom, ${theme.colors.accent}66 0 10px, transparent 10px 20px)`,
            }}
          />

          {/* Horizontal Kitchen Barrier Wall */}
          <div
            style={{
              position: "relative",
              width: "92%",
              height: 3,
              backgroundColor: showBarrierWarning
                ? theme.colors.danger
                : theme.colors.surfaceBorder,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!waiterActive && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 22px",
                  borderRadius: 999,
                  backgroundColor: showBarrierWarning
                    ? theme.colors.danger
                    : isDark
                      ? "#1E293B"
                      : "#F3E6DA",
                  color: showBarrierWarning ? "#FFFFFF" : theme.colors.muted,
                  fontFamily: theme.typography.monoFont,
                  fontSize: 20,
                  fontWeight: 800,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                }}
              >
                <Lock size={20} />
                {showBarrierWarning ? "NO DIRECT ENTRY" : "STAFF ONLY PARTITION"}
              </div>
            )}
          </div>

          {/* Moving Waiter Avatar (= API) */}
          {waiterActive && (
            <div
              style={{
                position: "absolute",
                top: `${waiterY}%`,
                transform: `translateY(-50%) scale(${waiterEnter})`,
                opacity: waiterEnter,
                zIndex: 4,
                padding: "16px 26px",
                borderRadius: 22,
                backgroundColor: kitchenDone ? theme.colors.success : theme.colors.accent,
                color: "#FFFFFF",
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <UtensilsCrossed size={28} color="#FFFFFF" />
              <div>
                <div
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 26,
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  Waiter (= API)
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 17,
                    opacity: 0.92,
                  }}
                >
                  {waiterStatus}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM: Kitchen Counter */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: 24,
            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FAF6F0",
            border: `2px solid ${kitchenDone ? theme.colors.success : theme.colors.surfaceBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                backgroundColor: `${theme.colors.success}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChefHat size={34} color={theme.colors.success} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 30,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                Kitchen (Chef)
              </div>
              <div
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 19,
                  color: theme.colors.muted,
                }}
              >
                {kitchenDone
                  ? "Dish Ready for Pickup ✓"
                  : absFrame >= chefTellFrame
                    ? "Cooking Order #42…"
                    : "Waiting for Waiter"}
              </div>
            </div>
          </div>

          <span
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              backgroundColor: kitchenDone
                ? `${theme.colors.success}20`
                : isDark
                  ? "rgba(255,255,255,0.06)"
                  : "#EFE7DC",
              fontFamily: theme.typography.monoFont,
              fontSize: 18,
              fontWeight: 800,
              color: kitchenDone ? theme.colors.success : theme.colors.muted,
            }}
          >
            {kitchenDone ? "READY" : absFrame >= chefTellFrame ? "COOKING" : "IDLE"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

