import React from "react";
import type { BaseCsObjectProps, CsObjectType } from "./types";
import { AnimatedServerRack } from "./AnimatedServerRack";
import { AnimatedDatabase } from "./AnimatedDatabase";
import { AnimatedCpu } from "./AnimatedCpu";
import { AnimatedRamModule } from "./AnimatedRamModule";
import { AnimatedNetworkRouter } from "./AnimatedNetworkRouter";
import { AnimatedShippingContainer } from "./AnimatedShippingContainer";
import { AnimatedMobileClient } from "./AnimatedMobileClient";
import { AnimatedMessageQueue } from "./AnimatedMessageQueue";
import { AnimatedLoadBalancer } from "./AnimatedLoadBalancer";
import { AnimatedTreeIndex } from "./AnimatedTreeIndex";
import { AnimatedCallStack } from "./AnimatedCallStack";
import { AnimatedEventLoop } from "./AnimatedEventLoop";
import { AnimatedSecurityLock } from "./AnimatedSecurityLock";
import { AnimatedProceduralConcept } from "./AnimatedProceduralConcept";

export interface CsObjectProps extends BaseCsObjectProps {
  type: CsObjectType | string;
  [key: string]: any;
}

/**
 * Universal Computer Science Object Dispatcher with On-Demand Element Synthesis.
 * Instead of drawing a lifeless box with a text label, CsObject renders high-fidelity,
 * interactive, deterministic hardware, data structure, or procedural engineering models.
 */
export const CsObject: React.FC<CsObjectProps> = ({
  type,
  label,
  sublabel,
  metric,
  annotation,
  theme,
  state = "active",
  scale = 1,
  glow = true,
  style,
  ...rest
}) => {
  const normalizedType = type.toLowerCase().trim();

  // 1. Server / Backend / Host / Node / Compute
  if (
    normalizedType === "server" ||
    normalizedType === "backend" ||
    normalizedType === "host" ||
    normalizedType === "node" ||
    normalizedType === "compute"
  ) {
    return (
      <AnimatedServerRack
        theme={theme}
        state={state}
        label={label ?? "Backend Server"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 2. Database / Storage / Platters / PostgreSQL / MySQL / Redis
  if (
    normalizedType === "database" ||
    normalizedType === "db" ||
    normalizedType === "storage" ||
    normalizedType === "sql" ||
    normalizedType === "postgres" ||
    normalizedType === "mysql" ||
    normalizedType === "redis"
  ) {
    return (
      <AnimatedDatabase
        theme={theme}
        state={state}
        label={label ?? "Relational DB"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 3. CPU / Processor / Silicon / Core
  if (
    normalizedType === "cpu" ||
    normalizedType === "processor" ||
    normalizedType === "silicon" ||
    normalizedType === "core"
  ) {
    return (
      <AnimatedCpu
        theme={theme}
        state={state}
        label={label ?? "CPU Core"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 4. RAM / Memory / Cache / DRAM / DIMM
  if (
    normalizedType === "ram" ||
    normalizedType === "memory" ||
    normalizedType === "cache" ||
    normalizedType === "dimm"
  ) {
    return (
      <AnimatedRamModule
        theme={theme}
        state={state}
        label={label ?? "Main Memory"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 5. Router / Switch / Gateway / Ingress
  if (
    normalizedType === "router" ||
    normalizedType === "switch" ||
    normalizedType === "gateway" ||
    normalizedType === "ingress"
  ) {
    return (
      <AnimatedNetworkRouter
        theme={theme}
        state={state}
        label={label ?? (normalizedType === "gateway" ? "API Gateway" : "Core Router")}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 6. Load Balancer / Reverse Proxy
  if (
    normalizedType === "loadbalancer" ||
    normalizedType === "balancer" ||
    normalizedType === "proxy" ||
    normalizedType === "nginx" ||
    normalizedType === "envoy"
  ) {
    return (
      <AnimatedLoadBalancer
        theme={theme}
        state={state}
        label={label ?? "Load Balancer"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 7. Container / Docker / Kubernetes Pod / OCI / Microservice
  if (
    normalizedType === "container" ||
    normalizedType === "docker" ||
    normalizedType === "pod" ||
    normalizedType === "microservice"
  ) {
    return (
      <AnimatedShippingContainer
        theme={theme}
        state={state}
        label={label ?? "Container Instance"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 8. Mobile / Phone / Client / User Device / Browser
  if (
    normalizedType === "phone" ||
    normalizedType === "client" ||
    normalizedType === "mobile" ||
    normalizedType === "browser" ||
    normalizedType === "user"
  ) {
    return (
      <AnimatedMobileClient
        theme={theme}
        state={state}
        label={label ?? (normalizedType === "browser" ? "Web Browser" : "Mobile Client")}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 9. Queue / Message Broker / Kafka / Event Bus
  if (
    normalizedType === "queue" ||
    normalizedType === "kafka" ||
    normalizedType === "broker" ||
    normalizedType === "eventbus" ||
    normalizedType === "stream"
  ) {
    return (
      <AnimatedMessageQueue
        theme={theme}
        state={state}
        label={label ?? "Message Queue"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 10. Tree / B-Tree Index / Search Tree
  if (
    normalizedType === "tree" ||
    normalizedType === "btree" ||
    normalizedType === "index" ||
    normalizedType === "ast"
  ) {
    return (
      <AnimatedTreeIndex
        theme={theme}
        state={state}
        label={label ?? "B-Tree Index"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 11. Stack / Call Stack / Memory Frame
  if (
    normalizedType === "stack" ||
    normalizedType === "callstack" ||
    normalizedType === "lifo"
  ) {
    return (
      <AnimatedCallStack
        theme={theme}
        state={state}
        label={label ?? "Call Stack"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 12. Event Loop / Async Runtime
  if (
    normalizedType === "eventloop" ||
    normalizedType === "v8" ||
    normalizedType === "async"
  ) {
    return (
      <AnimatedEventLoop
        theme={theme}
        state={state}
        label={label ?? "Event Loop"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 13. Security Lock / Mutex / Encryption
  if (
    normalizedType === "lock" ||
    normalizedType === "mutex" ||
    normalizedType === "tls" ||
    normalizedType === "crypto"
  ) {
    return (
      <AnimatedSecurityLock
        theme={theme}
        state={state}
        label={label ?? "Mutex Lock"}
        sublabel={sublabel}
        metric={metric}
        annotation={annotation}
        scale={scale}
        glow={glow}
        style={style}
        {...rest}
      />
    );
  }

  // 14. Universal On-Demand Procedural Concept Synthesizer
  // For ANY arbitrary spoken concept (e.g. "Garbage Collector", "Bloom Filter", "Raft Consensus")
  return (
    <AnimatedProceduralConcept
      concept={type}
      theme={theme}
      state={state}
      label={label}
      sublabel={sublabel}
      metric={metric}
      annotation={annotation}
      scale={scale}
      glow={glow}
      style={style}
      {...rest}
    />
  );
};
