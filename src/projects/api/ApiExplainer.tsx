import React from "react";
import {
  ArrowDown,
  ArrowUp,
  ChefHat,
  CloudSun,
  Layers,
  Server,
  Smartphone,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KineticCaptions } from "../../components/KineticCaptions";
import { ReelBackground } from "../../components/ReelBackground";
import { getTheme } from "../../lib/themes";
import { findCueTime, secToFrame } from "../../lib/timing";
import type { StyleSpec, TranscriptData } from "../../lib/types";

export type ApiExplainerProps = {
  transcript: TranscriptData;
  themeId?: string;
  showSafeZones?: boolean;
};

const useCue = (transcript: TranscriptData, phrase: string, fallbackSec: number) => {
  const { fps } = useVideoConfig();
  const sec = findCueTime(transcript, phrase) ?? fallbackSec;
  return secToFrame(sec, fps);
};

const SceneContainer: React.FC<{
  theme: StyleSpec;
  chapter: string;
  children: React.ReactNode;
}> = ({ theme, chapter, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 200, mass: 0.8 },
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
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: enter,
        }}
      >
        <span
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: theme.colors.accent,
            backgroundColor: theme.colors.accentSoft,
            border: `1px solid ${theme.colors.accent}44`,
            padding: "8px 18px",
            borderRadius: 999,
          }}
        >
          {chapter}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const HookScene: React.FC<{ transcript: TranscriptData; theme: StyleSpec }> = ({
  transcript,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const apiBeat = useCue(transcript, "API kya", 2.72);

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.85 },
  });
  const popApi = spring({
    frame: Math.max(0, frame - apiBeat),
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.7 },
  });

  return (
    <SceneContainer theme={theme} chapter="01 // 60-SEC EXPLAINER">
      <div
        style={{
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          borderRadius: 34,
          padding: "56px 46px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.48)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 28,
          transform: `translateY(${interpolate(badgeSpring, [0, 1], [40, 0])}px)`,
          opacity: badgeSpring,
        }}
      >
        <div
          style={{
            padding: "14px 28px",
            borderRadius: 20,
            backgroundColor: theme.colors.accentSoft,
            border: `2px solid ${theme.colors.accent}`,
            fontFamily: theme.typography.monoFont,
            fontSize: 46,
            fontWeight: 800,
            color: theme.colors.accent,
            transform: `scale(${1 + 0.08 * popApi})`,
            boxShadow: `0 0 ${24 + 28 * popApi}px ${theme.colors.accentSoft}`,
          }}
        >
          {"{ API }"}
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: theme.colors.text,
          }}
        >
          API kya hoti hai?
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: 32,
            lineHeight: 1.35,
            color: theme.colors.muted,
          }}
        >
          Har app ke peeche ka silent messenger — ek minute mein samjho.
        </p>
      </div>
    </SceneContainer>
  );
};

const AcronymScene: React.FC<{
  transcript: TranscriptData;
  theme: StyleSpec;
  sceneStartSec: number;
}> = ({ transcript, theme, sceneStartSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const items = [
    {
      letter: "A",
      word: "Application",
      desc: "Koi bhi app ya software",
      cue: useCue(transcript, "Application", 5.72),
    },
    {
      letter: "P",
      word: "Programming",
      desc: "Code aur logic ka set",
      cue: useCue(transcript, "Programming", 6.16),
    },
    {
      letter: "I",
      word: "Interface",
      desc: "Do systems ke beech ka rasta",
      cue: useCue(transcript, "Interface", 6.82),
    },
  ];

  return (
    <SceneContainer theme={theme} chapter="02 // FULL FORM">
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {items.map((item) => {
          const activeProgress = spring({
            frame: Math.max(0, absFrame - item.cue),
            fps,
            config: { damping: 14, stiffness: 220, mass: 0.75 },
          });
          const isLit = absFrame >= item.cue;

          return (
            <div
              key={item.letter}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "28px 30px",
                borderRadius: 26,
                backgroundColor: theme.colors.surface,
                border: `2px solid ${isLit ? theme.colors.accent : theme.colors.surfaceBorder}`,
                boxShadow: isLit
                  ? `0 18px 46px ${theme.colors.accentSoft}`
                  : "0 16px 36px rgba(0,0,0,0.35)",
                transform: `scale(${isLit ? 1 + 0.03 * activeProgress : 0.97})`,
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 22,
                  backgroundColor: isLit ? theme.colors.accent : theme.colors.accentSoft,
                  color: isLit ? theme.colors.bg : theme.colors.accent,
                  fontFamily: theme.typography.monoFont,
                  fontSize: 48,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {item.letter}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 40,
                    fontWeight: 800,
                    color: theme.colors.text,
                  }}
                >
                  {item.word}
                </span>
                <span
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 25,
                    color: theme.colors.muted,
                  }}
                >
                  {item.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </SceneContainer>
  );
};

const RestaurantAnalogyScene: React.FC<{
  transcript: TranscriptData;
  theme: StyleSpec;
  sceneStartSec: number;
}> = ({ transcript, theme, sceneStartSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const tableCue = useCue(transcript, "table par", 12.96);
  const kitchenCue = useCue(transcript, "kitchen mein", 14.4);
  const noDirectCue = useCue(transcript, "seedhe kitchen", 16.32);
  const waiterCue = useCue(transcript, "ek waiter", 19.24);
  const orderDownCue = useCue(transcript, "aapka order", 20.42);
  const chefTellCue = useCue(transcript, "chef ko batata", 22.2);
  const foodUpCue = useCue(transcript, "khana banne", 23.82);

  const tableIn = spring({
    frame: Math.max(0, absFrame - (tableCue - 30)),
    fps,
    config: { damping: 16, stiffness: 190, mass: 0.8 },
  });
  const kitchenIn = spring({
    frame: Math.max(0, absFrame - (kitchenCue - 15)),
    fps,
    config: { damping: 16, stiffness: 190, mass: 0.8 },
  });
  const waiterIn = spring({
    frame: Math.max(0, absFrame - waiterCue),
    fps,
    config: { damping: 14, stiffness: 210, mass: 0.8 },
  });

  const showDirectWarning = absFrame >= noDirectCue && absFrame < waiterCue + 10;
  const showWaiter = absFrame >= waiterCue;

  const orderPhase =
    absFrame >= orderDownCue && absFrame < foodUpCue
      ? interpolate(absFrame, [orderDownCue, chefTellCue + 40], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      : -1;

  const foodPhase =
    absFrame >= foodUpCue
      ? interpolate(absFrame, [foodUpCue, foodUpCue + 120], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      : -1;

  return (
    <SceneContainer theme={theme} chapter="03 // RESTAURANT EXAMPLE">
      <div
        style={{
          position: "relative",
          flex: 1,
          borderRadius: 30,
          backgroundColor: "rgba(15, 23, 42, 0.55)",
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Top: Customer Table */}
        <div
          style={{
            width: "88%",
            padding: "24px 28px",
            borderRadius: 24,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${theme.colors.accent}`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: tableIn,
            transform: `scale(${interpolate(tableIn, [0, 1], [0.85, 1])})`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
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
                fontSize: 32,
                fontWeight: 800,
                color: theme.colors.text,
              }}
            >
              Aap (Customer Table)
            </div>
            <div
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 20,
                color: theme.colors.muted,
              }}
            >
              Menu dekh ke order choose karte ho
            </div>
          </div>
        </div>

        {/* Middle lane: Either blocked direct line OR Waiter = API */}
        <div
          style={{
            position: "relative",
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Vertical track */}
          <div
            style={{
              position: "absolute",
              top: 12,
              bottom: 12,
              width: 4,
              borderRadius: 4,
              background: showDirectWarning
                ? `repeating-linear-gradient(to bottom, ${theme.colors.danger} 0 12px, transparent 12px 24px)`
                : showWaiter
                  ? theme.colors.accent
                  : "rgba(148,163,184,0.25)",
            }}
          />

          {showDirectWarning && (
            <div
              style={{
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 24px",
                borderRadius: 999,
                backgroundColor: "#1F1218",
                border: `2px solid ${theme.colors.danger}`,
                color: theme.colors.danger,
                fontFamily: theme.typography.monoFont,
                fontSize: 23,
                fontWeight: 800,
              }}
            >
              <X size={26} color={theme.colors.danger} />
              Seedhe Kitchen mein Entry Nahi!
            </div>
          )}

          {showWaiter && (
            <div
              style={{
                zIndex: 2,
                width: "82%",
                padding: "24px 28px",
                borderRadius: 24,
                backgroundColor: "#1B170E",
                border: `2.5px solid ${theme.colors.captionHighlight}`,
                boxShadow: "0 18px 46px rgba(251, 191, 36, 0.22)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                transform: `scale(${interpolate(waiterIn, [0, 1], [0.7, 1])})`,
                opacity: waiterIn,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  backgroundColor: "rgba(251, 191, 36, 0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UtensilsCrossed size={32} color={theme.colors.captionHighlight} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: theme.typography.displayFont,
                    fontSize: 32,
                    fontWeight: 800,
                    color: theme.colors.captionHighlight,
                  }}
                >
                  Waiter (= API)
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: 20,
                    color: theme.colors.text,
                  }}
                >
                  Order le jaata hai & khana laata hai
                </div>
              </div>
            </div>
          )}

          {/* Moving request pill */}
          {orderPhase >= 0 && orderPhase < 1 && (
            <div
              style={{
                position: "absolute",
                top: `${interpolate(orderPhase, [0, 1], [8, 86])}%`,
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: theme.colors.accent,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              <ArrowDown size={20} color={theme.colors.bg} />
              ORDER REQUEST
            </div>
          )}

          {/* Moving response pill */}
          {foodPhase >= 0 && foodPhase <= 1 && (
            <div
              style={{
                position: "absolute",
                top: `${interpolate(foodPhase, [0, 1], [86, 8])}%`,
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: theme.colors.success,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              <ArrowUp size={20} color={theme.colors.bg} />
              KHANA READY!
            </div>
          )}
        </div>

        {/* Bottom: Kitchen */}
        <div
          style={{
            width: "88%",
            padding: "24px 28px",
            borderRadius: 24,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${theme.colors.success}`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: kitchenIn,
            transform: `scale(${interpolate(kitchenIn, [0, 1], [0.85, 1])})`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: "rgba(52, 211, 153, 0.16)",
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
                fontSize: 32,
                fontWeight: 800,
                color: theme.colors.text,
              }}
            >
              Kitchen (Chef)
            </div>
            <div
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 20,
                color: theme.colors.muted,
              }}
            >
              Actual khana yahan prepare hota hai
            </div>
          </div>
        </div>
      </div>
    </SceneContainer>
  );
};

const AnalogyMapScene: React.FC<{ theme: StyleSpec }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  const rows = [
    { left: "Waiter takes Order", right: "API sends Request" },
    { left: "Kitchen cooks Food", right: "Server fetches Data" },
    { left: "Waiter serves Table", right: "API updates Screen" },
  ];

  return (
    <SceneContainer theme={theme} chapter="04 // TECH MAPPING">
      <div
        style={{
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          borderRadius: 30,
          padding: "42px 34px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          transform: `scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
          opacity: pop,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            fontFamily: theme.typography.displayFont,
            fontSize: 44,
            fontWeight: 800,
          }}
        >
          <span style={{ color: theme.colors.captionHighlight }}>Waiter</span>
          <span style={{ color: theme.colors.muted }}>=</span>
          <span style={{ color: theme.colors.accent }}>API</span>
        </div>

        {rows.map((r, i) => {
          const rowIn = spring({
            frame: Math.max(0, frame - i * 14),
            fps,
            config: { damping: 16, stiffness: 210, mass: 0.75 },
          });
          return (
            <div
              key={r.left}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: "20px 22px",
                borderRadius: 20,
                backgroundColor: "rgba(7, 11, 20, 0.75)",
                border: `1px solid ${theme.colors.surfaceBorder}`,
                opacity: rowIn,
                transform: `translateY(${interpolate(rowIn, [0, 1], [20, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 25,
                  fontWeight: 700,
                  color: theme.colors.captionHighlight,
                }}
              >
                {r.left}
              </span>
              <span
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: 24,
                  color: theme.colors.muted,
                }}
              >
                →
              </span>
              <span
                style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: 25,
                  fontWeight: 700,
                  color: theme.colors.accent,
                }}
              >
                {r.right}
              </span>
            </div>
          );
        })}
      </div>
    </SceneContainer>
  );
};

const RealWorldFlowScene: React.FC<{
  transcript: TranscriptData;
  theme: StyleSpec;
  sceneStartSec: number;
}> = ({ transcript, theme, sceneStartSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const foodCue = useCue(transcript, "food delivery", 32.62);
  const weatherCue = useCue(transcript, "weather app", 33.92);
  const reqCue = useCue(transcript, "ek request", 36.56);
  const apiCarryCue = useCue(transcript, "API aapki", 38.04);
  const dataCue = useCue(transcript, "zaroori data", 41.62);
  const screenCue = useCue(transcript, "screen par", 43.8);

  const reqProgress =
    absFrame >= reqCue && absFrame < dataCue
      ? interpolate(absFrame, [reqCue, apiCarryCue + 90], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      : -1;

  const resProgress =
    absFrame >= dataCue
      ? interpolate(absFrame, [dataCue, screenCue + 25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      : -1;

  const showJson = absFrame >= dataCue;

  return (
    <SceneContainer theme={theme} chapter="05 // REAL-WORLD FLOW">
      <div
        style={{
          position: "relative",
          flex: 1,
          borderRadius: 30,
          backgroundColor: "rgba(15, 23, 42, 0.55)",
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Phone App */}
        <div
          style={{
            zIndex: 2,
            width: "92%",
            padding: "22px 26px",
            borderRadius: 24,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${absFrame >= screenCue ? theme.colors.success : theme.colors.accent}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Smartphone size={34} color={theme.colors.accent} />
            <span
              style={{
                fontFamily: theme.typography.displayFont,
                fontSize: 32,
                fontWeight: 800,
                color: theme.colors.text,
              }}
            >
              Your Phone App
            </span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <span
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                fontFamily: theme.typography.monoFont,
                fontSize: 20,
                fontWeight: 700,
                backgroundColor:
                  absFrame >= foodCue ? theme.colors.accentSoft : "rgba(255,255,255,0.05)",
                color: absFrame >= foodCue ? theme.colors.accent : theme.colors.muted,
                border: `1px solid ${absFrame >= foodCue ? theme.colors.accent : "transparent"}`,
              }}
            >
              Food Delivery
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 999,
                fontFamily: theme.typography.monoFont,
                fontSize: 20,
                fontWeight: 700,
                backgroundColor:
                  absFrame >= weatherCue ? theme.colors.accentSoft : "rgba(255,255,255,0.05)",
                color: absFrame >= weatherCue ? theme.colors.accent : theme.colors.muted,
                border: `1px solid ${absFrame >= weatherCue ? theme.colors.accent : "transparent"}`,
              }}
            >
              <CloudSun size={18} />
              Weather App
            </span>
          </div>
        </div>

        {/* Upper connection track */}
        <div
          style={{
            position: "relative",
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 4,
              height: "100%",
              backgroundColor:
                resProgress >= 0 ? theme.colors.success : theme.colors.accent,
              opacity: 0.65,
            }}
          />
          {reqProgress >= 0 && reqProgress < 0.5 && (
            <div
              style={{
                position: "absolute",
                top: `${interpolate(reqProgress, [0, 0.5], [10, 88])}%`,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: theme.colors.accent,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              REQUEST ↓
            </div>
          )}
          {resProgress >= 0.5 && (
            <div
              style={{
                position: "absolute",
                top: `${interpolate(resProgress, [0.5, 1], [88, 10])}%`,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: theme.colors.success,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              DATA ↑
            </div>
          )}
        </div>

        {/* Middle: API Gateway Layer */}
        <div
          style={{
            zIndex: 2,
            position: "relative",
            width: "92%",
            padding: "24px 26px",
            borderRadius: 22,
            backgroundColor: "#081C26",
            border: `2px solid ${theme.colors.accent}`,
            boxShadow:
              absFrame >= apiCarryCue ? `0 0 36px ${theme.colors.accentSoft}` : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Layers size={30} color={theme.colors.accent} />
            <span
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 26,
                fontWeight: 800,
                color: theme.colors.accent,
              }}
            >
              GET /api/weather
            </span>
          </div>
          {reqProgress >= 0 && reqProgress < 1 && (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                backgroundColor: theme.colors.accent,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              RELAYING →
            </span>
          )}
          {resProgress >= 0 && (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                backgroundColor: theme.colors.success,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              200 OK ←
            </span>
          )}
        </div>

        {/* Lower connection track */}
        <div
          style={{
            position: "relative",
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 4,
              height: "100%",
              backgroundColor:
                resProgress >= 0 ? theme.colors.success : theme.colors.accent,
              opacity: 0.65,
            }}
          />
          {reqProgress >= 0.5 && reqProgress <= 1 && (
            <div
              style={{
                position: "absolute",
                top: `${interpolate(reqProgress, [0.5, 1], [10, 88])}%`,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: theme.colors.accent,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              TO SERVER ↓
            </div>
          )}
          {resProgress >= 0 && resProgress < 0.5 && (
            <div
              style={{
                position: "absolute",
                top: `${interpolate(resProgress, [0, 0.5], [88, 10])}%`,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: theme.colors.success,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              JSON ↑
            </div>
          )}
        </div>

        {/* Server + JSON Response */}
        <div
          style={{
            zIndex: 2,
            width: "92%",
            padding: "22px 26px",
            borderRadius: 24,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${showJson ? theme.colors.success : theme.colors.surfaceBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Server size={32} color={theme.colors.success} />
            <span
              style={{
                fontFamily: theme.typography.displayFont,
                fontSize: 32,
                fontWeight: 800,
                color: theme.colors.text,
              }}
            >
              Backend Server
            </span>
          </div>
          {showJson && (
            <pre
              style={{
                margin: 0,
                padding: "16px 20px",
                borderRadius: 14,
                backgroundColor: "#060911",
                border: `1px solid ${theme.colors.success}55`,
                fontFamily: theme.typography.monoFont,
                fontSize: 21,
                lineHeight: 1.45,
                color: theme.colors.success,
                whiteSpace: "pre-wrap",
              }}
            >
              {`{\n  "city": "Delhi",\n  "temp": "28°C",\n  "status": "Sunny"\n}`}
            </pre>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};

const BridgeSummaryScene: React.FC<{
  transcript: TranscriptData;
  theme: StyleSpec;
  sceneStartSec: number;
}> = ({ transcript, theme, sceneStartSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absFrame = secToFrame(sceneStartSec, fps) + frame;

  const bridgeCue = useCue(transcript, "bridge", 50.1);
  const talkCue = useCue(transcript, "baat kar", 53.24);
  const shareCue = useCue(transcript, "data share", 54.34);

  const bridgePop = spring({
    frame: Math.max(0, absFrame - bridgeCue),
    fps,
    config: { damping: 14, stiffness: 210, mass: 0.8 },
  });

  const packetProgress = ((frame % 60) / 60);

  return (
    <SceneContainer theme={theme} chapter="06 // KEY TAKEAWAY">
      <div
        style={{
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceBorder}`,
          borderRadius: 32,
          padding: "46px 34px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: theme.typography.displayFont,
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.15,
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          API = Software Bridge (Pul)
        </h2>

        {/* Bridge Diagram */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "26px 10px",
          }}
        >
          <div
            style={{
              width: 210,
              padding: "24px 18px",
              borderRadius: 22,
              backgroundColor: "#0B1324",
              border: `2px solid ${theme.colors.accent}`,
              textAlign: "center",
              fontFamily: theme.typography.displayFont,
              fontSize: 28,
              fontWeight: 800,
              color: theme.colors.text,
            }}
          >
            App A
          </div>

          <div
            style={{
              flex: 1,
              position: "relative",
              height: 6,
              backgroundColor: theme.colors.accent,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${packetProgress * 100}%`,
                top: -6,
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: theme.colors.success,
                boxShadow: `0 0 18px ${theme.colors.success}`,
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 2,
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: theme.colors.captionHighlight,
                color: theme.colors.bg,
                fontFamily: theme.typography.monoFont,
                fontSize: 24,
                fontWeight: 800,
                transform: `scale(${0.92 + 0.14 * bridgePop})`,
              }}
            >
              API BRIDGE
            </div>
          </div>

          <div
            style={{
              width: 210,
              padding: "24px 18px",
              borderRadius: 22,
              backgroundColor: "#0B1324",
              border: `2px solid ${theme.colors.success}`,
              textAlign: "center",
              fontFamily: theme.typography.displayFont,
              fontSize: 28,
              fontWeight: 800,
              color: theme.colors.text,
            }}
          >
            App B
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <span
            style={{
              padding: "12px 20px",
              borderRadius: 16,
              fontFamily: theme.typography.monoFont,
              fontSize: 22,
              fontWeight: 700,
              backgroundColor:
                absFrame >= talkCue ? theme.colors.accentSoft : "rgba(255,255,255,0.05)",
              color: absFrame >= talkCue ? theme.colors.accent : theme.colors.muted,
              border: `1px solid ${absFrame >= talkCue ? theme.colors.accent : "transparent"}`,
            }}
          >
            Apps Baat Karein
          </span>
          <span
            style={{
              padding: "12px 20px",
              borderRadius: 16,
              fontFamily: theme.typography.monoFont,
              fontSize: 22,
              fontWeight: 700,
              backgroundColor:
                absFrame >= shareCue
                  ? "rgba(52, 211, 153, 0.16)"
                  : "rgba(255,255,255,0.05)",
              color: absFrame >= shareCue ? theme.colors.success : theme.colors.muted,
              border: `1px solid ${absFrame >= shareCue ? theme.colors.success : "transparent"}`,
            }}
          >
            Data Share Karein
          </span>
        </div>
      </div>
    </SceneContainer>
  );
};

export const ApiExplainer: React.FC<ApiExplainerProps> = ({
  transcript,
  themeId = "api-bridge",
  showSafeZones = false,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const theme = getTheme(themeId);

  const s1End = findCueTime(transcript, "API ka") ?? 4.3;
  const s2End = findCueTime(transcript, "Ise samajhne") ?? 8.14;
  const s3End = findCueTime(transcript, "Technology ki") ?? 26.94;
  const s4End = findCueTime(transcript, "Jab aap apne") ?? 31.44;
  const s5End = findCueTime(transcript, "Aasaan shabdon") ?? 45.18;

  const f1 = secToFrame(s1End, fps);
  const f2 = secToFrame(s2End, fps);
  const f3 = secToFrame(s3End, fps);
  const f4 = secToFrame(s4End, fps);
  const f5 = secToFrame(s5End, fps);

  return (
    <AbsoluteFill>
      <ReelBackground theme={theme} showSafeZones={showSafeZones} />
      <Audio src={staticFile("projects/api/voice.wav")} />

      {/* Beat SFX anchored to scene transitions */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
      </Sequence>
      {[f1, f2, f3, f4, f5].map((startFrame, idx) => (
        <Sequence key={startFrame} from={startFrame} durationInFrames={30}>
          <Audio
            src={staticFile(idx % 2 === 0 ? "sfx/pop.wav" : "sfx/whoosh.wav")}
            volume={0.32}
          />
        </Sequence>
      ))}

      <Sequence from={0} durationInFrames={f1}>
        <HookScene transcript={transcript} theme={theme} />
      </Sequence>

      <Sequence from={f1} durationInFrames={f2 - f1}>
        <AcronymScene transcript={transcript} theme={theme} sceneStartSec={s1End} />
      </Sequence>

      <Sequence from={f2} durationInFrames={f3 - f2}>
        <RestaurantAnalogyScene
          transcript={transcript}
          theme={theme}
          sceneStartSec={s2End}
        />
      </Sequence>

      <Sequence from={f3} durationInFrames={f4 - f3}>
        <AnalogyMapScene theme={theme} />
      </Sequence>

      <Sequence from={f4} durationInFrames={f5 - f4}>
        <RealWorldFlowScene
          transcript={transcript}
          theme={theme}
          sceneStartSec={s4End}
        />
      </Sequence>

      <Sequence from={f5} durationInFrames={Math.max(1, durationInFrames - f5)}>
        <BridgeSummaryScene
          transcript={transcript}
          theme={theme}
          sceneStartSec={s5End}
        />
      </Sequence>

      <KineticCaptions words={transcript.words} theme={theme} />
    </AbsoluteFill>
  );
};

