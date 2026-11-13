import React from "react";
import { Database, Server, Smartphone } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCueTime, secToFrame } from "../../lib/timing";
import type {
  ClientApiServerSceneConfig,
  StyleSpec,
  TranscriptData,
} from "../../lib/types";
import { TechIcon } from "../TechIcon";
import {
  AnimatedMobileClient,
  AnimatedServerRack,
  AnimatedDatabase,
  AnimatedNetworkRouter,
} from "../cs-objects";

interface ClientApiServerSceneProps {
  scene: ClientApiServerSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
}

export const ClientApiServerScene: React.FC<ClientApiServerSceneProps> = ({
  scene,
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme.meta?.isDark ?? true;

  const sceneStartSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
  const sceneSpanSec = Math.max(2.0, scene.end - sceneStartSec);
  const sceneStartFrame = secToFrame(sceneStartSec, fps);
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

  const reqDefault = Math.min(3.0, sceneSpanSec * 0.14);
  const carryDefault = Math.min(5.0, sceneSpanSec * 0.36);
  const dataDefault = Math.min(7.5, sceneSpanSec * 0.56);
  const screenDefault = Math.min(9.5, sceneSpanSec * 0.76);

  const reqFrame = scene.requestCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + reqDefault, scene.requestCue, sceneStartSec), fps)
    : sceneStartFrame + secToFrame(reqDefault, fps);
  const carryFrame = scene.carryCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + carryDefault, scene.carryCue, sceneStartSec), fps)
    : sceneStartFrame + secToFrame(carryDefault, fps);
  const dataFrame = scene.dataCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + dataDefault, scene.dataCue, sceneStartSec), fps)
    : sceneStartFrame + secToFrame(dataDefault, fps);
  const screenFrame = scene.screenCue
    ? secToFrame(resolveCueTime(transcript, sceneStartSec + screenDefault, scene.screenCue, sceneStartSec), fps)
    : sceneStartFrame + secToFrame(screenDefault, fps);

  const reqActive = absFrame >= reqFrame && absFrame < dataFrame;
  const resActive = absFrame >= dataFrame;
  const uiLoaded = absFrame >= screenFrame;

  const reqEndFrame = Math.max(reqFrame + 24, Math.min(dataFrame - 4, carryFrame + 55));
  const resEndFrame = Math.max(dataFrame + 24, screenFrame + 10);

  const reqProgress = reqActive
    ? interpolate(absFrame, [reqFrame, reqEndFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const resProgress = resActive
    ? interpolate(absFrame, [dataFrame, resEndFrame], [0, 1], {
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
        gap: 22,
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

      {/* Main System Architecture Stage */}
      <div
        style={{
          width: "100%",
          maxWidth: 940,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          opacity: enter,
        }}
      >
        {/* 1. REAL SMARTPHONE UI FRAME */}
        <div
          style={{
            width: "100%",
            padding: "24px 28px",
            borderRadius: 30,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${uiLoaded ? theme.colors.success : theme.colors.accent}`,
            boxShadow: isDark
              ? "0 20px 52px rgba(0,0,0,0.45)"
              : "0 18px 46px rgba(45, 28, 12, 0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                backgroundColor: uiLoaded ? `${theme.colors.success}22` : theme.colors.accentSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Smartphone size={34} color={uiLoaded ? theme.colors.success : theme.colors.accent} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  fontWeight: 700,
                  color: theme.colors.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {scene.appName}
              </div>
              <div
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 32,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                {uiLoaded ? scene.loadedTitle : scene.loadingLabel}
              </div>
            </div>
          </div>

          {/* Live App Screen Preview Widget */}
          <div
            style={{
              minWidth: 210,
              padding: "14px 20px",
              borderRadius: 18,
              backgroundColor: isDark ? "#0A101E" : "#FAF6F0",
              border: `1.5px solid ${
                uiLoaded ? theme.colors.success : theme.colors.surfaceBorder
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <TechIcon
              name={scene.previewIcon ?? "weather"}
              size={26}
              color={uiLoaded ? theme.colors.success : theme.colors.muted}
            />
            <span
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 24,
                fontWeight: 800,
                color: uiLoaded ? theme.colors.success : theme.colors.muted,
              }}
            >
              {uiLoaded ? scene.loadedValue : "•••"}
            </span>
          </div>
        </div>

        {/* Connector Lane 1 (Phone <-> API) */}
        <div
          style={{
            position: "relative",
            width: "80%",
            height: 112,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {/* Request track (down) */}
          <div
            style={{
              position: "relative",
              width: 4,
              height: "100%",
              backgroundColor: reqActive ? theme.colors.accent : theme.colors.surfaceBorder,
            }}
          >
            {reqActive && reqProgress < 0.55 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${interpolate(reqProgress, [0, 0.55], [8, 92])}%`,
                  transform: "translate(-50%, -50%)",
                  padding: "5px 14px",
                  borderRadius: 999,
                  backgroundColor: theme.colors.accent,
                  color: "#FFFFFF",
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                {scene.endpoint} ↓
              </div>
            )}
          </div>

          {/* Response track (up) */}
          <div
            style={{
              position: "relative",
              width: 4,
              height: "100%",
              backgroundColor: resActive ? theme.colors.success : theme.colors.surfaceBorder,
            }}
          >
            {resActive && resProgress >= 0.45 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${interpolate(resProgress, [0.45, 1], [92, 10])}%`,
                  transform: "translate(-50%, -50%)",
                  padding: "5px 14px",
                  borderRadius: 999,
                  backgroundColor: theme.colors.success,
                  color: "#FFFFFF",
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                200 OK · JSON ↑
              </div>
            )}
          </div>
        </div>

        {/* 2. REAL ANIMATED API CONTRACT GATEWAY & ROUTER */}
        <div
          style={{
            width: "92%",
            padding: "14px 20px",
            borderRadius: 22,
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "#FAF6F0",
            border: `2px solid ${theme.colors.accent}`,
            boxShadow: `0 16px 38px ${theme.colors.accentSoft}`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 22,
                fontWeight: 800,
                color: theme.colors.text,
              }}
            >
              {scene.gatewayLabel ? `${scene.gatewayLabel} · ${scene.endpoint}` : `API GATEWAY · ${scene.endpoint}`}
            </span>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                backgroundColor: `${theme.colors.accent}24`,
                fontFamily: theme.typography.monoFont,
                fontSize: 16,
                fontWeight: 800,
                color: theme.colors.accent,
                border: `1px solid ${theme.colors.accent}44`,
              }}
            >
              {resActive ? "DATA READY" : reqActive ? "FORWARDING" : "STANDBY"}
            </span>
          </div>

          {/* Micro-Chassis 10GbE Router Interface with Live Activity LEDs */}
          <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <AnimatedNetworkRouter
              theme={theme}
              state={reqActive || resActive ? "active" : "idle"}
              label=""
              metric=""
              scale={0.46}
              portCount={8}
            />
          </div>
        </div>

        {/* Connector Lane 2 (API <-> Server) */}
        <div
          style={{
            position: "relative",
            width: "80%",
            height: 112,
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
          >
            {reqActive && reqProgress >= 0.45 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${interpolate(reqProgress, [0.45, 1], [8, 92])}%`,
                  transform: "translate(-50%, -50%)",
                  padding: "5px 14px",
                  borderRadius: 999,
                  backgroundColor: theme.colors.accent,
                  color: "#FFFFFF",
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                {scene.requestWireLabel ?? "QUERY DB ↓"}
              </div>
            )}
          </div>

          <div
            style={{
              position: "relative",
              width: 4,
              height: "100%",
              backgroundColor: resActive ? theme.colors.success : theme.colors.surfaceBorder,
            }}
          >
            {resActive && resProgress < 0.55 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${interpolate(resProgress, [0, 0.55], [92, 10])}%`,
                  transform: "translate(-50%, -50%)",
                  padding: "5px 14px",
                  borderRadius: 999,
                  backgroundColor: theme.colors.success,
                  color: "#FFFFFF",
                  fontFamily: theme.typography.monoFont,
                  fontSize: 18,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                {scene.responseWireLabel ?? "FETCH DATA ↑"}
              </div>
            )}
          </div>
        </div>

        {/* 3. REAL ANIMATED SERVER RACK + DATABASE ASSEMBLY */}
        <div
          style={{
            width: "100%",
            padding: "20px 24px",
            borderRadius: 30,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${resActive ? theme.colors.success : theme.colors.surfaceBorder}`,
            boxShadow: isDark
              ? "0 20px 52px rgba(0,0,0,0.45)"
              : "0 18px 46px rgba(45, 28, 12, 0.09)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: theme.typography.displayFont,
                fontSize: 28,
                fontWeight: 800,
                color: theme.colors.text,
              }}
            >
              {scene.serverLabel ?? "Backend & Database Infrastructure"}
            </span>
            <span
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 14,
                color: resActive ? theme.colors.success : theme.colors.muted,
                background: resActive ? `${theme.colors.success}1A` : "rgba(255,255,255,0.05)",
                padding: "3px 10px",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              {resActive ? "QUERY RESOLVED" : "BUFFERING"}
            </span>
          </div>

          {/* Live Dual Hardware: Server Chassis + Disk Platters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              height: 125,
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
              <AnimatedServerRack
                theme={theme}
                state={resActive ? "busy" : reqActive ? "active" : "idle"}
                label="Node Host"
                sublabel="Compute"
                units={1}
                scale={0.44}
                cpuLoad={resActive ? 86 : 28}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
              <AnimatedDatabase
                theme={theme}
                state={resActive ? "busy" : "idle"}
                label="Storage"
                sublabel="WAL Sync"
                scale={0.42}
                platterCount={2}
                showBufferPool={false}
              />
            </div>
          </div>

          <pre
            style={{
              margin: 0,
              padding: "16px 20px",
              borderRadius: 16,
              backgroundColor: isDark ? "#080D18" : "#FAF6F0",
              border: `1.5px solid ${
                resActive ? `${theme.colors.success}66` : theme.colors.surfaceBorder
              }`,
              fontFamily: theme.typography.monoFont,
              fontSize: 21,
              lineHeight: 1.45,
              color: resActive ? theme.colors.success : theme.colors.muted,
              whiteSpace: "pre-wrap",
            }}
          >
            {scene.jsonPayload}
          </pre>
        </div>
      </div>
    </AbsoluteFill>
  );
};

