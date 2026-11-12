import React from "react";
import { Composition } from "remotion";
import { TimelineReel, type TimelineReelProps } from "./components/TimelineReel";
import { REELS_FPS, REELS_HEIGHT, REELS_WIDTH } from "./lib/timing";
import type { TimelineData, TranscriptData } from "./lib/types";
import { ApiExplainer } from "./projects/api/ApiExplainer";
import apiTranscriptData from "./projects/api/transcript.json";
import demoTimeline from "./projects/demo-cache-stampede/timeline.json";
import demoTranscript from "./projects/demo-cache-stampede/transcript.json";

const timeline = demoTimeline as TimelineData;
const transcript = demoTranscript as TranscriptData;
const apiTranscript = apiTranscriptData as TranscriptData;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicReel"
        component={TimelineReel}
        durationInFrames={transcript.durationFrames}
        fps={REELS_FPS}
        width={REELS_WIDTH}
        height={REELS_HEIGHT}
        defaultProps={{
          timeline,
          transcript,
          showSafeZones: false,
        }}
        calculateMetadata={({ props }: { props: TimelineReelProps }) => {
          return {
            durationInFrames: Math.max(
              60,
              props.transcript?.durationFrames ?? REELS_FPS * 10,
            ),
            fps: props.timeline?.fps ?? REELS_FPS,
            width: props.timeline?.width ?? REELS_WIDTH,
            height: props.timeline?.height ?? REELS_HEIGHT,
          };
        }}
      />
      <Composition
        id="ApiExplainer"
        component={ApiExplainer}
        durationInFrames={apiTranscript.durationFrames}
        fps={REELS_FPS}
        width={REELS_WIDTH}
        height={REELS_HEIGHT}
        defaultProps={{
          transcript: apiTranscript,
          themeId: "api-bridge",
          showSafeZones: false,
        }}
      />
      <Composition
        id="DemoCacheStampede"
        component={TimelineReel}
        durationInFrames={transcript.durationFrames}
        fps={REELS_FPS}
        width={REELS_WIDTH}
        height={REELS_HEIGHT}
        defaultProps={{
          timeline,
          transcript,
          showSafeZones: false,
        }}
      />
    </>
  );
};
