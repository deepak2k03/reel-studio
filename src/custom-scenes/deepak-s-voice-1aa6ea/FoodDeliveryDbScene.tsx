import React from "react";
import { ChefHat, Database, Lock, Server, UtensilsCrossed } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CustomSceneRenderProps } from "../types";
import { resolveCueTime, secToFrame } from "../../lib/timing";

/**
 * Beat 3 & 4: Food Delivery App cannot enter Restaurant DB directly; API fetches Menu & Price cleanly.
 */
export const FoodDeliveryDbScene: React.FC<CustomSceneRenderProps> = ({
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
    directCue?: string;
    requestCue?: string;
    dataCue?: string;
    responseCue?: string;
  };

  const directFrame = p.directCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 7.5, p.directCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 7.5, fps);
  const reqFrame = p.requestCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 11.0, p.requestCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 11.0, fps);
  const dataFrame = p.dataCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 15.0, p.dataCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 15.0, fps);
  const resFrame = p.responseCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + 17.5, p.responseCue, sceneStartSec), fps)
    : secToFrame(sceneStartSec + 17.5, fps);

  const enter = spring({
    frame,
    fps,
    config: { damping: theme.motion.springDamping, stiffness: theme.motion.springStiffness, mass: theme.motion.springMass },
  });

  const showLock = absFrame >= directFrame && absFrame < reqFrame;
  const reqActive = absFrame >= reqFrame && absFrame < dataFrame;
  const resActive = absFrame >= resFrame;

  const reqProg = reqActive
    ? interpolate(absFrame, [reqFrame, Math.max(reqFrame + 24, dataFrame - 6)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const resProg = resActive
    ? interpolate(absFrame, [resFrame, resFrame + 60], [0, 1], {
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
        gap: 20,
      }}
    >
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
          {scene.title ?? "Food Delivery Example"}
        </h2>
      </div>

      {/* Layered Food App -> API -> Restaurant DB Flow */}
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: enter,
        }}
      >
        {/* 1. Food Delivery App + Live Menu Preview */}
        <div
          style={{
            width: "100%",
            padding: "22px 26px",
            borderRadius: 28,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${
              resActive ? theme.colors.success : showLock ? theme.colors.danger : theme.colors.accent
            }`,
            boxShadow: isDark
              ? "0 20px 52px rgba(0,0,0,0.45)"
              : "0 18px 46px rgba(45, 28, 12, 0.09)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  backgroundColor: resActive ? `${theme.colors.success}22` : theme.colors.accentSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UtensilsCrossed
                  size={30}
                  color={resActive ? theme.colors.success : theme.colors.accent}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 17,
                    fontWeight: 700,
                    color: theme.colors.muted,
                  }}
                >
                  FOOD DELIVERY APP
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 30,
                    fontWeight: 800,
                    color: theme.colors.text,
                  }}
                >
                  {resActive ? "Menu & Prices Loaded ✓" : "Fetching Menu & Prices…"}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { item: "Paneer Bowl", price: "₹240" },
              { item: "Masala Dosa", price: "₹140" },
            ].map((row) => (
              <div
                key={row.item}
                style={{
                  padding: "12px 16px",
                  borderRadius: 16,
                  backgroundColor: isDark ? "#0A101D" : "#FAF5ED",
                  border: `1.5px solid ${
                    resActive ? `${theme.colors.success}66` : theme.colors.surfaceBorder
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 22,
                    fontWeight: 700,
                    color: resActive ? theme.colors.text : theme.colors.muted,
                  }}
                >
                  {row.item}
                </span>
                <span
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 22,
                    fontWeight: 800,
                    color: resActive ? theme.colors.success : theme.colors.muted,
                  }}
                >
                  {resActive ? row.price : "•••"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connector Lane 1: Direct Lock vs API Request/Response */}
        <div
          style={{
            position: "relative",
            width: "84%",
            height: 112,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {/* Left Wire (Request / Blocked Direct DB) */}
          <div
            style={{
              position: "relative",
              width: 4,
              height: "100%",
              backgroundColor: showLock
                ? theme.colors.danger
                : reqActive
                  ? theme.colors.accent
                  : theme.colors.surfaceBorder,
            }}
          >
            {showLock && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: theme.colors.danger,
                  color: "#FFFFFF",
                  fontFamily: theme.typography.monoFont,
                  fontSize: 17,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Lock size={16} color="#FFFFFF" />
                NO DIRECT DB ACCESS
              </div>
            )}
            {reqActive && reqProg < 0.6 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${interpolate(reqProg, [0, 0.6], [10, 90])}%`,
                  transform: "translate(-50%, -50%)",
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: theme.colors.accent,
                  color: "#FFFFFF",
                  fontFamily: theme.typography.monoFont,
                  fontSize: 17,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                GET /menu ↓
              </div>
            )}
          </div>

          {/* Right Wire (Response) */}
          <div
            style={{
              position: "relative",
              width: 4,
              height: "100%",
              backgroundColor: resActive ? theme.colors.success : theme.colors.surfaceBorder,
            }}
          >
            {resActive && resProg >= 0.35 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${interpolate(resProg, [0.35, 1], [90, 12])}%`,
                  transform: "translate(-50%, -50%)",
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: theme.colors.success,
                  color: "#FFFFFF",
                  fontFamily: theme.typography.monoFont,
                  fontSize: 17,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                200 OK · MENU JSON ↑
              </div>
            )}
          </div>
        </div>

        {/* 2. API Gateway Pill */}
        <div
          style={{
            width: "92%",
            padding: "18px 26px",
            borderRadius: 22,
            backgroundColor: showLock ? theme.colors.danger : theme.colors.accent,
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            {showLock ? "DIRECT DB BLOCKED" : "API · GET /restaurant/menu"}
          </span>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.22)",
              fontFamily: theme.typography.monoFont,
              fontSize: 17,
              fontWeight: 800,
            }}
          >
            {resActive ? "DELIVERED" : reqActive ? "FORWARDING" : showLock ? "LOCKED" : "GATEWAY"}
          </span>
        </div>

        {/* Connector Lane 2 (API <-> Restaurant System) */}
        <div
          style={{
            position: "relative",
            width: "84%",
            height: 92,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 4,
              height: "100%",
              backgroundColor: reqActive ? theme.colors.accent : theme.colors.surfaceBorder,
            }}
          />
          <div
            style={{
              position: "relative",
              width: 4,
              height: "100%",
              backgroundColor: resActive ? theme.colors.success : theme.colors.surfaceBorder,
            }}
          />
        </div>

        {/* 3. Restaurant System & Database */}
        <div
          style={{
            width: "100%",
            padding: "22px 26px",
            borderRadius: 28,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${absFrame >= dataFrame ? theme.colors.success : theme.colors.surfaceBorder}`,
            boxShadow: isDark
              ? "0 20px 52px rgba(0,0,0,0.45)"
              : "0 18px 46px rgba(45, 28, 12, 0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                backgroundColor: `${theme.colors.success}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChefHat size={30} color={theme.colors.success} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 28,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                Restaurant System &amp; DB
              </div>
              <div
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  color: absFrame >= dataFrame ? theme.colors.success : theme.colors.muted,
                }}
              >
                {absFrame >= dataFrame ? "menu.json ready (2 items)" : "Private Inventory Store"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Server size={24} color={theme.colors.muted} />
            <Database size={24} color={theme.colors.success} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

