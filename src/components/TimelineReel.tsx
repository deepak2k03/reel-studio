import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Loop,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CUSTOM_SCENES } from "../custom-scenes/registry";
import { getTheme } from "../lib/themes";
import { resolveCueTime, secToFrame } from "../lib/timing";
import type {
  SceneCameraMode,
  SceneTransitionKind,
  StyleSpec,
  TimelineData,
  TimelineScene,
  TranscriptData,
} from "../lib/types";
import { ArchDiagram } from "./ArchDiagram";
import { CameraRig } from "./CameraRig";
import { CodeStepper } from "./CodeStepper";
import { ConceptCard } from "./ConceptCard";
import { KeypointsCard } from "./KeypointsCard";
import { KineticCaptions } from "./KineticCaptions";
import { ReelBackground } from "./ReelBackground";
import { VoiceReactiveCanvas } from "./VoiceReactiveCanvas";
import { TerminalCard } from "./TerminalCard";
import { BridgeArchitectureScene } from "./diagrams/BridgeArchitectureScene";
import { ClientApiServerScene } from "./diagrams/ClientApiServerScene";
import { RestaurantMetaphorScene } from "./diagrams/RestaurantMetaphorScene";
import { SequenceDiagramScene } from "./diagrams/SequenceDiagramScene";
import { TokenBreakdownScene } from "./diagrams/TokenBreakdownScene";
import { HeroVisualScene } from "./visuals/HeroVisualScene";
import { MetricCompareScene } from "./visuals/MetricCompareScene";
import { VisualFlowScene } from "./visuals/VisualFlowScene";

export type TimelineReelProps = {
  timeline: TimelineData;
  transcript: TranscriptData;
  styleSpec?: StyleSpec;
  showSafeZones?: boolean;
  mediaBaseUrl?: string;
};

const TRANSITION_OVERLAP_FRAMES = 10;

interface SceneMotionStageProps {
  baseDuration: number;
  hasNext: boolean;
  isFirst: boolean;
  transition: SceneTransitionKind;
  camera: SceneCameraMode;
  children: React.ReactNode;
}

const SceneMotionStage: React.FC<SceneMotionStageProps> = ({
  baseDuration,
  hasNext,
  isFirst,
  transition,
  camera,
  children,
}) => {
  const frame = useCurrentFrame();

  const enterFrames = isFirst || transition === "none" ? 1 : 11;
  const exitFrames = hasNext && transition !== "none" ? TRANSITION_OVERLAP_FRAMES : 0;

  const enterProg =
    enterFrames <= 1
      ? 1
      : interpolate(frame, [0, enterFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

  const exitProg =
    exitFrames <= 0
      ? 0
      : interpolate(
          frame,
          [Math.max(0, baseDuration - 2), baseDuration + exitFrames],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        );

  const opacity = enterProg * (1 - exitProg);
  let translateY = 0;
  let scale = 1;

  if (transition === "slide-up") {
    translateY = (1 - enterProg) * 24 - exitProg * 16;
    scale = 1 - exitProg * 0.015;
  } else if (transition === "zoom") {
    scale = 0.96 + 0.04 * enterProg - exitProg * 0.02;
  }

  const content = (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );

  if (camera === "none") {
    return content;
  }

  const cameraEndScale = camera === "pull-out" ? 1.0 : 1.032;
  const cameraStartScale = camera === "pull-out" ? 1.045 : 1.0;

  return (
    <CameraRig
      keyframes={[
        { frame: 0, scale: cameraStartScale },
        { frame: Math.max(2, baseDuration), scale: cameraEndScale },
      ]}
    >
      {content}
    </CameraRig>
  );
};

const renderScene = (
  scene: TimelineScene,
  transcript: TranscriptData,
  theme: StyleSpec,
  mediaBaseUrl?: string,
) => {
  switch (scene.type) {
    case "concept-card":
      return <ConceptCard scene={scene} theme={theme} />;
    case "code-stepper":
      return <CodeStepper scene={scene} transcript={transcript} theme={theme} />;
    case "arch-diagram":
      return <ArchDiagram scene={scene} transcript={transcript} theme={theme} />;
    case "terminal":
      return <TerminalCard scene={scene} transcript={transcript} theme={theme} />;
    case "keypoints":
      return <KeypointsCard scene={scene} transcript={transcript} theme={theme} />;
    case "hero-visual":
      return <HeroVisualScene scene={scene} theme={theme} />;
    case "visual-flow":
      return <VisualFlowScene scene={scene} transcript={transcript} theme={theme} />;
    case "metric-compare":
      return <MetricCompareScene scene={scene} theme={theme} />;
    case "token-breakdown":
      return <TokenBreakdownScene scene={scene} transcript={transcript} theme={theme} />;
    case "client-api-server":
      return <ClientApiServerScene scene={scene} transcript={transcript} theme={theme} />;
    case "sequence-diagram":
      return <SequenceDiagramScene scene={scene} transcript={transcript} theme={theme} />;
    case "bridge-architecture":
      return <BridgeArchitectureScene scene={scene} transcript={transcript} theme={theme} />;
    case "restaurant-metaphor":
      return <RestaurantMetaphorScene scene={scene} transcript={transcript} theme={theme} />;
    case "custom-scene": {
      const CustomComp = CUSTOM_SCENES[scene.componentId];
      if (!CustomComp) {
        return (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.danger,
              fontFamily: theme.typography.monoFont,
              fontSize: 24,
            }}
          >
            {`Missing custom scene: ${scene.componentId}`}
          </AbsoluteFill>
        );
      }
      return (
        <CustomComp
          scene={scene}
          transcript={transcript}
          theme={theme}
          mediaBaseUrl={mediaBaseUrl}
        />
      );
    }
  }
};

export const TimelineReel: React.FC<TimelineReelProps> = ({
  timeline,
  transcript,
  styleSpec,
  showSafeZones = false,
  mediaBaseUrl,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const theme = styleSpec ?? getTheme(timeline.theme);

  const resolvedScenes = timeline.scenes.map((scene) => {
    const startSec = resolveCueTime(transcript, scene.start, scene.cuePhrase);
    const startFrame = secToFrame(startSec, fps);
    return { scene, startSec, startFrame };
  });

  const audioSrc = timeline.audioFile
    ? timeline.audioFile.startsWith("http://") || timeline.audioFile.startsWith("https://")
      ? timeline.audioFile
      : staticFile(timeline.audioFile)
    : null;

  const ambientEnabled = timeline.ambientAudio !== false;
  const rawAmbientFile =
    typeof timeline.ambientAudio === "object" && timeline.ambientAudio.file
      ? timeline.ambientAudio.file
      : "sfx/ambient-warm.wav";
  const ambientFile =
    rawAmbientFile.startsWith("sfx/") || rawAmbientFile.startsWith("/")
      ? rawAmbientFile
      : `sfx/${rawAmbientFile}`;
  const ambientSrc = rawAmbientFile.startsWith("http://") || rawAmbientFile.startsWith("https://")
    ? rawAmbientFile
    : rawAmbientFile !== "sfx/ambient-warm.wav" && mediaBaseUrl
      ? `${mediaBaseUrl.replace(/\/$/, "")}/${rawAmbientFile.replace(/^\//, "")}`
      : staticFile(ambientFile);
  const ambientVolume =
    typeof timeline.ambientAudio === "object" && timeline.ambientAudio.volume !== undefined
      ? timeline.ambientAudio.volume
      : 0.038;

  return (
    <AbsoluteFill>
      <ReelBackground
        theme={theme}
        showSafeZones={showSafeZones || timeline.showSafeZones}
      />

      {/* Soothing voice-reactive continuous ambient canvas */}
      <VoiceReactiveCanvas words={transcript.words} theme={theme} />

      {/* Primary voiceover track */}
      {audioSrc && <Audio src={audioSrc} />}

      {/* Subtle studio ambient bed underneath voiceover */}
      {ambientEnabled && (
        <Loop durationInFrames={480}>
          <Audio src={ambientSrc} volume={ambientVolume} />
        </Loop>
      )}

      {/* Voice-synced scenes with smooth overlap transitions & subtle camera push */}
      {resolvedScenes.map(({ scene, startSec, startFrame }, index) => {
        const nextScene = resolvedScenes[index + 1];
        const explicitEndFrame = secToFrame(scene.end, fps);
        const endFrame = nextScene
          ? Math.min(explicitEndFrame, nextScene.startFrame)
          : Math.max(explicitEndFrame, durationInFrames);
        const baseDuration = Math.max(1, endFrame - startFrame);

        const transition: SceneTransitionKind = scene.transition ?? "slide-up";
        const camera: SceneCameraMode = scene.camera ?? "push-in";
        const overlap = nextScene && transition !== "none" ? TRANSITION_OVERLAP_FRAMES : 0;

        return (
          <React.Fragment key={scene.id}>
            <Sequence from={startFrame} durationInFrames={baseDuration + overlap}>
              <SceneMotionStage
                baseDuration={baseDuration}
                hasNext={Boolean(nextScene)}
                isFirst={index === 0}
                transition={transition}
                camera={camera}
              >
                {renderScene(scene, transcript, theme, mediaBaseUrl)}
              </SceneMotionStage>
            </Sequence>

            {scene.sfx && scene.sfx !== "none" && (
              <Sequence from={startFrame} durationInFrames={Math.min(45, baseDuration)}>
                <Audio src={staticFile(`sfx/${scene.sfx}.wav`)} volume={0.34} />
              </Sequence>
            )}

            {(scene.sfxCues ?? []).map((rawCue, cueIdx) => {
              const cue = rawCue as { kind?: string; type?: string; atOffset?: number; cuePhrase?: string; volume?: number };
              const sfxKind = cue.kind ?? cue.type;
              if (!sfxKind || sfxKind === "none") {
                return null;
              }
              const cueSec = resolveCueTime(
                transcript,
                startSec + (cue.atOffset ?? 0),
                cue.cuePhrase,
                startSec,
              );
              const cueFrame = secToFrame(cueSec, fps);
              if (cueFrame < startFrame || cueFrame >= endFrame) {
                return null;
              }
              return (
                <Sequence
                  key={`${scene.id}-sfx-${cueIdx}`}
                  from={cueFrame}
                  durationInFrames={Math.min(45, Math.max(10, endFrame - cueFrame))}
                >
                  <Audio
                    src={staticFile(`sfx/${sfxKind}.wav`)}
                    volume={cue.volume ?? 0.32}
                  />
                </Sequence>
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Frame-accurate word-highlighted captions */}
      <KineticCaptions words={transcript.words} theme={theme} />
    </AbsoluteFill>
  );
};
