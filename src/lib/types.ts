export interface TranscriptWord {
  id: number;
  word: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  probability?: number;
}

export interface TranscriptSegment {
  id: number;
  text: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  words: TranscriptWord[];
}

export interface TranscriptPause {
  afterWordId: number;
  afterWord: string;
  start: number;
  end: number;
  duration: number;
  startFrame: number;
  endFrame: number;
}

export interface TranscriptData {
  fps: number;
  duration: number;
  durationFrames: number;
  language: string;
  text: string;
  words: TranscriptWord[];
  segments: TranscriptSegment[];
  pauses: TranscriptPause[];
}

export interface StyleSpec {
  id: string;
  name: string;
  colors: {
    bg: string;
    bgSecondary: string;
    surface: string;
    surfaceBorder: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    success: string;
    danger: string;
    captionHighlight: string;
  };
  typography: {
    displayFont: string;
    monoFont: string;
    titleSize: number;
    bodySize: number;
    codeSize: number;
    captionSize: number;
  };
  motion: {
    springDamping: number;
    springStiffness: number;
    springMass: number;
  };
  safeZone: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  meta?: {
    sourceWidth?: number;
    sourceHeight?: number;
    sourceFps?: number;
    sourceDuration?: number;
    shotCount?: number;
    avgShotDuration?: number;
    pace?: string;
    isDark?: boolean;
  };
}

export interface ConceptSceneConfig {
  id: string;
  type: "concept-card";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  variant?: "default" | "alert" | "success";
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface CodeHighlightStep {
  /** Time offset in seconds relative to scene start, OR absolute spoken cuePhrase */
  atOffset?: number;
  cuePhrase?: string;
  lines: number[];
  caption?: string;
}

export interface CodeSceneConfig {
  id: string;
  type: "code-stepper";
  start: number;
  end: number;
  cuePhrase?: string;
  title?: string;
  filename: string;
  language: string;
  code: string;
  steps?: CodeHighlightStep[];
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: "client" | "server" | "database" | "cache" | "queue" | "lock" | "zap" | "shield";
  /** Percentage positions (0-100) inside the diagram canvas */
  x: number;
  y: number;
  appearAtOffset?: number;
  cuePhrase?: string;
  status?: "neutral" | "active" | "warning" | "success";
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  appearAtOffset?: number;
  cuePhrase?: string;
  animatePacket?: boolean;
  dashed?: boolean;
  color?: "accent" | "success" | "danger";
}

export interface ArchSceneConfig {
  id: string;
  type: "arch-diagram";
  start: number;
  end: number;
  cuePhrase?: string;
  title: string;
  subtitle?: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface TerminalLine {
  text: string;
  kind?: "command" | "output" | "success" | "error" | "muted";
  atOffset?: number;
  cuePhrase?: string;
}

export interface TerminalSceneConfig {
  id: string;
  type: "terminal";
  start: number;
  end: number;
  cuePhrase?: string;
  title?: string;
  lines: TerminalLine[];
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface KeypointItem {
  label: string;
  detail?: string;
  atOffset?: number;
  cuePhrase?: string;
}

export interface KeypointsSceneConfig {
  id: string;
  type: "keypoints";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  items: KeypointItem[];
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface HeroVisualSceneConfig {
  id: string;
  type: "hero-visual";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  tag?: string;
  heroIcon: string;
  orbitIcons?: string[];
  accentVariant?: "accent" | "success" | "danger";
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface VisualFlowNode {
  id: string;
  label: string;
  tag?: string;
  icon: string;
  status?: "neutral" | "active" | "success" | "warning";
  appearAtOffset?: number;
  cuePhrase?: string;
}

export interface VisualFlowEdge {
  label?: string;
  direction?: "forward" | "backward" | "both";
  color?: "accent" | "success" | "danger";
  appearAtOffset?: number;
  cuePhrase?: string;
}

export interface VisualFlowSceneConfig {
  id: string;
  type: "visual-flow";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  nodes: VisualFlowNode[];
  edges: VisualFlowEdge[];
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface MetricSide {
  label: string;
  sublabel?: string;
  icon: string;
  valueText?: string;
  gaugePercent?: number;
  tone?: "accent" | "success" | "danger" | "neutral";
}

export interface MetricCompareSceneConfig {
  id: string;
  type: "metric-compare";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  variant: "bridge" | "versus";
  centerLabel?: string;
  centerIcon?: string;
  left: MetricSide;
  right: MetricSide;
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface TokenBreakdownItem {
  token: string;
  title: string;
  detail: string;
  cuePhrase?: string;
  atOffset?: number;
}

export interface TokenBreakdownSceneConfig {
  id: string;
  type: "token-breakdown";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  items: TokenBreakdownItem[];
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface ClientApiServerSceneConfig {
  id: string;
  type: "client-api-server";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  appName: string;
  loadingLabel: string;
  loadedTitle: string;
  loadedValue: string;
  endpoint: string;
  jsonPayload: string;
  previewIcon?: string;
  gatewayLabel?: string;
  serverLabel?: string;
  requestWireLabel?: string;
  responseWireLabel?: string;
  requestCue?: string;
  carryCue?: string;
  dataCue?: string;
  screenCue?: string;
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface SequenceActor {
  id: string;
  label: string;
  icon: string;
  tone?: "accent" | "success" | "danger" | "neutral";
}

export interface SequenceStep {
  from: string;
  to: string;
  label: string;
  tone?: "accent" | "success" | "danger";
  cuePhrase?: string;
  atOffset?: number;
}

export interface SequenceDiagramSceneConfig {
  id: string;
  type: "sequence-diagram";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  actors: SequenceActor[];
  steps: SequenceStep[];
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface BridgeArchitectureSceneConfig {
  id: string;
  type: "bridge-architecture";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  leftApp: { name: string; sub: string; icon: string; badge: string };
  rightApp: { name: string; sub: string; icon: string; badge: string };
  bridgeLabel: string;
  packets: [string, string];
  talkCue?: string;
  shareCue?: string;
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface RestaurantMetaphorSceneConfig {
  id: string;
  type: "restaurant-metaphor";
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title: string;
  noDirectCue?: string;
  waiterCue?: string;
  takeOrderCue?: string;
  chefTellCue?: string;
  foodReadyCue?: string;
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export interface CustomSceneConfig {
  id: string;
  type: "custom-scene";
  componentId: string;
  start: number;
  end: number;
  cuePhrase?: string;
  eyebrow?: string;
  title?: string;
  props?: Record<string, unknown>;
  sfx?: "pop" | "whoosh" | "click" | "none";
}

export type TimelineScene =
  | ConceptSceneConfig
  | CodeSceneConfig
  | ArchSceneConfig
  | TerminalSceneConfig
  | KeypointsSceneConfig
  | HeroVisualSceneConfig
  | VisualFlowSceneConfig
  | MetricCompareSceneConfig
  | TokenBreakdownSceneConfig
  | ClientApiServerSceneConfig
  | SequenceDiagramSceneConfig
  | BridgeArchitectureSceneConfig
  | RestaurantMetaphorSceneConfig
  | CustomSceneConfig;

export interface TimelineData {
  slug: string;
  fps: number;
  width: number;
  height: number;
  audioFile: string;
  theme: string;
  showSafeZones?: boolean;
  scenes: TimelineScene[];
}

