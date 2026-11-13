import type { StyleSpec } from "../../lib/types";

export type CsObjectState = "idle" | "active" | "busy" | "error" | "transmitting";

export type CsObjectType =
  | "server"
  | "database"
  | "cpu"
  | "ram"
  | "router"
  | "gateway"
  | "container"
  | "phone"
  | "client"
  | "cloud"
  | "queue";

export interface BaseCsObjectProps {
  theme?: StyleSpec;
  state?: CsObjectState;
  label?: string;
  sublabel?: string;
  metric?: string;
  annotation?: string;
  scale?: number;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

