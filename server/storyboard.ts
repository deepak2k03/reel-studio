import type {
  BridgeArchitectureSceneConfig,
  ClientApiServerSceneConfig,
  HeroVisualSceneConfig,
  MetricCompareSceneConfig,
  RestaurantMetaphorSceneConfig,
  SequenceDiagramSceneConfig,
  StyleSpec,
  TimelineData,
  TimelineScene,
  TokenBreakdownItem,
  TokenBreakdownSceneConfig,
  TranscriptData,
  TranscriptSegment,
  VisualFlowEdge,
  VisualFlowNode,
} from "../src/lib/types";

interface BeatGroup {
  start: number;
  end: number;
  text: string;
  segments: TranscriptSegment[];
}

interface DetectedEntity {
  id: string;
  pattern: RegExp;
  icon: string;
  label: string;
  tag: string;
  tone: "active" | "success" | "warning" | "neutral";
  layer: number;
}

interface DomainBlueprint {
  match: RegExp;
  appName: string;
  loadingLabel: string;
  loadedTitle: string;
  loadedValue: string;
  endpoint: string;
  gatewayLabel: string;
  serverLabel: string;
  requestWireLabel: string;
  responseWireLabel: string;
  previewIcon: string;
  jsonPayload: string;
  compareTitle: string;
  slowSide: { label: string; sublabel: string; valueText: string; icon: string };
  fastSide: { label: string; sublabel: string; valueText: string; icon: string };
  bridgeTitle: string;
  packets: [string, string];
}

const TECH_ENTITIES: DetectedEntity[] = [
  { id: "phone", pattern: /\b(phone|mobile|food delivery|weather app|app|ios|android)\b/i, icon: "phone", label: "Mobile App", tag: "Client UI", tone: "active", layer: 1 },
  { id: "client", pattern: /\b(client|user|browser|frontend|webpage|screen|restaurant|table)\b/i, icon: "browser", label: "Browser Client", tag: "User Side", tone: "active", layer: 1 },
  { id: "react", pattern: /\b(react|nextjs|next\.js|ui|component)\b/i, icon: "react", label: "React UI", tag: "Frontend", tone: "active", layer: 1 },
  { id: "dns", pattern: /\b(dns|domain|nameserver|resolver)\b/i, icon: "dns", label: "DNS Resolver", tag: "Lookup", tone: "active", layer: 2 },
  { id: "cloudflare", pattern: /\b(cloudflare|cdn|edge|cloudfront)\b/i, icon: "cloudflare", label: "Edge CDN", tag: "Global Edge", tone: "active", layer: 2 },
  { id: "nginx", pattern: /\b(nginx|load balancer|balancer|proxy|reverse proxy)\b/i, icon: "nginx", label: "Load Balancer", tag: "Traffic Split", tone: "active", layer: 2 },
  { id: "jwt", pattern: /\b(jwt|oauth|session|auth|login|token|permission)\b/i, icon: "jwt", label: "Auth Token", tag: "Verified", tone: "success", layer: 2 },
  { id: "api", pattern: /\b(api|interface|endpoint|rest|webhook|http|gateway)\b/i, icon: "api", label: "API Gateway", tag: "Contract", tone: "active", layer: 2 },
  { id: "waiter", pattern: /\b(waiter)\b/i, icon: "waiter", label: "Waiter", tag: "Messenger", tone: "active", layer: 2 },
  { id: "graphql", pattern: /\b(graphql|schema|resolver)\b/i, icon: "graphql", label: "GraphQL", tag: "Typed Query", tone: "active", layer: 2 },
  { id: "shield", pattern: /\b(security|lock|safe|rate limit|firewall|encrypt)\b/i, icon: "shield", label: "Auth Shield", tag: "Protected", tone: "success", layer: 2 },
  { id: "bridge", pattern: /\b(bridge|pul|connect)\b|ब्रिज|पुल/i, icon: "bridge", label: "API Bridge", tag: "Connector", tone: "success", layer: 2 },
  { id: "redis", pattern: /\b(redis|cache|caching|cached|memcache|ttl)\b/i, icon: "redis", label: "Redis Cache", tag: "In-Memory", tone: "active", layer: 3 },
  { id: "kafka", pattern: /\b(kafka|event|stream|topic|pub|sub|consumer|producer)\b/i, icon: "kafka", label: "Kafka Stream", tag: "Event Bus", tone: "active", layer: 3 },
  { id: "rabbitmq", pattern: /\b(rabbitmq|queue|broker|worker|async|job)\b/i, icon: "rabbitmq", label: "Message Queue", tag: "Async Buffer", tone: "active", layer: 3 },
  { id: "llm", pattern: /\b(llm|ai|rag|embedding|vector|prompt|model|agent)\b/i, icon: "llm", label: "LLM Engine", tag: "Inference", tone: "active", layer: 3 },
  { id: "docker", pattern: /\b(docker|container|containers|image|dockerfile)\b/i, icon: "docker", label: "Docker", tag: "Container", tone: "active", layer: 4 },
  { id: "kubernetes", pattern: /\b(kubernetes|k8s|cluster|pod|pods|helm)\b/i, icon: "kubernetes", label: "Kubernetes", tag: "Orchestrator", tone: "active", layer: 4 },
  { id: "node", pattern: /\b(node|nodejs|express)\b/i, icon: "node", label: "Node.js", tag: "Runtime", tone: "success", layer: 4 },
  { id: "python", pattern: /\b(python|fastapi|django|flask)\b/i, icon: "python", label: "Python API", tag: "Service", tone: "active", layer: 4 },
  { id: "go", pattern: /\b(golang|go|goroutine)\b/i, icon: "go", label: "Go Service", tag: "Concurrent", tone: "active", layer: 4 },
  { id: "typescript", pattern: /\b(typescript|javascript|ts|js)\b/i, icon: "typescript", label: "TypeScript", tag: "Typed App", tone: "active", layer: 4 },
  { id: "server", pattern: /\b(server|backend|service|microservice|worker|engine)\b|सर्वर/i, icon: "server", label: "Backend Server", tag: "Compute", tone: "success", layer: 4 },
  { id: "kitchen", pattern: /\b(kitchen|chef|khana)\b|खाना/i, icon: "kitchen", label: "Kitchen", tag: "Processor", tone: "success", layer: 4 },
  { id: "postgres", pattern: /\b(postgres|postgresql)\b/i, icon: "postgres", label: "PostgreSQL", tag: "Primary DB", tone: "success", layer: 5 },
  { id: "mongodb", pattern: /\b(mongo|mongodb)\b/i, icon: "mongodb", label: "MongoDB", tag: "Document DB", tone: "success", layer: 5 },
  { id: "mysql", pattern: /\b(mysql)\b/i, icon: "mysql", label: "MySQL", tag: "SQL Store", tone: "success", layer: 5 },
  { id: "database", pattern: /\b(database|db|sql|data|storage|index|table|query)\b|डाटा|डेटा/i, icon: "database", label: "Database", tag: "Storage", tone: "success", layer: 5 },
  { id: "github", pattern: /\b(git|github|repo|commit|ci|cd|deploy)\b/i, icon: "github", label: "Git & CI/CD", tag: "Source", tone: "neutral", layer: 5 },
  { id: "loadbalancer", pattern: /\b(load balancer|balancer|round robin|reverse proxy)\b/i, icon: "loadbalancer", label: "Load Balancer", tag: "Traffic Split", tone: "active", layer: 2 },
  { id: "lock", pattern: /\b(lock|mutex|concurrency|race condition|atomic|deadlock)\b/i, icon: "lock", label: "Mutex Lock", tag: "Synchronization", tone: "warning", layer: 2 },
  { id: "eventloop", pattern: /\b(event loop|libuv|async|asynchronous|non-blocking|call stack|callback queue)\b/i, icon: "eventloop", label: "Async Event Loop", tag: "Non-Blocking I/O", tone: "active", layer: 3 },
  { id: "tree", pattern: /\b(tree|b-tree|btree|binary search tree|ast|index)\b/i, icon: "tree", label: "B-Tree Index", tag: "O(log N)", tone: "active", layer: 3 },
  { id: "callstack", pattern: /\b(call stack|stack frame|recursion|lifo|stack overflow)\b/i, icon: "stack", label: "Call Stack", tag: "LIFO Frame", tone: "active", layer: 3 },
  { id: "gc", pattern: /\b(garbage collector|gc|garbage collection|memory leak|sweep)\b/i, icon: "gc", label: "Garbage Collector", tag: "Memory Reclamation", tone: "success", layer: 4 },
  { id: "consensus", pattern: /\b(raft|paxos|consensus|quorum|leader election)\b/i, icon: "cluster", label: "Raft Consensus", tag: "Quorum", tone: "active", layer: 4 },
  { id: "hash", pattern: /\b(hash map|hash table|bloom filter|bit array|hashing)\b/i, icon: "hash", label: "Hash Map / Filter", tag: "O(1) Access", tone: "active", layer: 5 },
];

const ACRONYM_EXPANSIONS: Array<{
  pattern: RegExp;
  acronym: string;
  title: string;
  items: TokenBreakdownItem[];
}> = [
  {
    pattern: /\bapi\b/i,
    acronym: "API",
    title: "API Breakdown",
    items: [
      { token: "A", title: "Application", detail: "App · Service" },
      { token: "P", title: "Programming", detail: "Code · Rules" },
      { token: "I", title: "Interface", detail: "Bridge · Contract" },
    ],
  },
  {
    pattern: /\bjwt\b/i,
    acronym: "JWT",
    title: "JWT Structure",
    items: [
      { token: "HDR", title: "Header", detail: "Algorithm · Type" },
      { token: "PAY", title: "Payload", detail: "Claims · User ID" },
      { token: "SIG", title: "Signature", detail: "Secret Verify" },
    ],
  },
  {
    pattern: /\bsql\b/i,
    acronym: "SQL",
    title: "SQL Breakdown",
    items: [
      { token: "S", title: "Structured", detail: "Rows · Schemas" },
      { token: "Q", title: "Query", detail: "Select · Filter" },
      { token: "L", title: "Language", detail: "DB Standard" },
    ],
  },
  {
    pattern: /\bdns\b/i,
    acronym: "DNS",
    title: "DNS Breakdown",
    items: [
      { token: "D", title: "Domain", detail: "app.example.com" },
      { token: "N", title: "Name", detail: "Human Address" },
      { token: "S", title: "System", detail: "Maps to IP" },
    ],
  },
  {
    pattern: /\bcdn\b/i,
    acronym: "CDN",
    title: "CDN Breakdown",
    items: [
      { token: "C", title: "Content", detail: "Images · Assets" },
      { token: "D", title: "Delivery", detail: "Cached Edge" },
      { token: "N", title: "Network", detail: "Global PoPs" },
    ],
  },
  {
    pattern: /\bhttp\b/i,
    acronym: "HTTP",
    title: "HTTP Breakdown",
    items: [
      { token: "H", title: "HyperText", detail: "Web Payload" },
      { token: "T", title: "Transfer", detail: "Client ↔ Server" },
      { token: "P", title: "Protocol", detail: "GET · POST Rules" },
    ],
  },
  {
    pattern: /\bcrud\b/i,
    acronym: "CRUD",
    title: "CRUD Operations",
    items: [
      { token: "C", title: "Create", detail: "POST · INSERT" },
      { token: "R", title: "Read", detail: "GET · SELECT" },
      { token: "U", title: "Update", detail: "PATCH · MODIFY" },
      { token: "D", title: "Delete", detail: "DELETE · REMOVE" },
    ],
  },
  {
    pattern: /\brag\b/i,
    acronym: "RAG",
    title: "RAG Pipeline",
    items: [
      { token: "R", title: "Retrieval", detail: "Vector Search" },
      { token: "A", title: "Augmented", detail: "Inject Context" },
      { token: "G", title: "Generation", detail: "Grounded LLM" },
    ],
  },
  {
    pattern: /\brest\b/i,
    acronym: "REST",
    title: "REST Architecture",
    items: [
      { token: "R", title: "Resources", detail: "/users /orders" },
      { token: "S", title: "Stateless", detail: "Self-Contained" },
      { token: "T", title: "Transfer", detail: "JSON over HTTP" },
    ],
  },
  {
    pattern: /\bsdk\b/i,
    acronym: "SDK",
    title: "SDK Breakdown",
    items: [
      { token: "S", title: "Software", detail: "Prebuilt Client" },
      { token: "D", title: "Development", detail: "Typed Helpers" },
      { token: "K", title: "Kit", detail: "Ready Tools" },
    ],
  },
];

const DOMAIN_BLUEPRINTS: DomainBlueprint[] = [
  {
    match: /\b(redis|cache|caching|stampede|ttl)\b/i,
    appName: "User Feed Service",
    loadingLabel: "Checking Cache…",
    loadedTitle: "Cache Hit · Instant",
    loadedValue: "2ms · HIT",
    endpoint: "GET cache:user:42",
    gatewayLabel: "REDIS",
    serverLabel: "Redis Cache + Primary DB",
    requestWireLabel: "FALLBACK DB ↓",
    responseWireLabel: "SET EX 300s ↑",
    previewIcon: "redis",
    jsonPayload: `{\n  "key": "user:42",\n  "cache": "HIT",\n  "ttlSec": 300\n}`,
    compareTitle: "Database vs Redis Cache",
    slowSide: { label: "Direct DB", sublabel: "Cold Disk Read", valueText: "180ms", icon: "database" },
    fastSide: { label: "Redis Cache", sublabel: "In-Memory Hit", valueText: "2ms", icon: "redis" },
    bridgeTitle: "Cache-Aside Architecture",
    packets: ["CACHE MISS", "2ms HIT"],
  },
  {
    match: /\b(jwt|auth|login|oauth|token|session)\b/i,
    appName: "Web Client",
    loadingLabel: "Verifying Session…",
    loadedTitle: "Authenticated",
    loadedValue: "JWT VALID",
    endpoint: "POST /auth/verify",
    gatewayLabel: "AUTH",
    serverLabel: "Auth Guard + User Store",
    requestWireLabel: "SIGN & VERIFY ↓",
    responseWireLabel: "CLAIMS OK ↑",
    previewIcon: "jwt",
    jsonPayload: `{\n  "sub": "usr_42",\n  "role": "member",\n  "verified": true\n}`,
    compareTitle: "Unverified vs Signed JWT",
    slowSide: { label: "DB Session", sublabel: "Lookup Per Call", valueText: "45ms", icon: "database" },
    fastSide: { label: "Stateless JWT", sublabel: "Crypto Verify", valueText: "1ms", icon: "jwt" },
    bridgeTitle: "Zero-Trust Auth Bridge",
    packets: ["BEARER JWT", "VERIFIED"],
  },
  {
    match: /\b(docker|container|kubernetes|k8s|pod)\b/i,
    appName: "Cluster Ingress",
    loadingLabel: "Scheduling Pod…",
    loadedTitle: "Container Healthy",
    loadedValue: "3/3 READY",
    endpoint: "DEPLOY app:v2.4",
    gatewayLabel: "RUNTIME",
    serverLabel: "Container Nodes + Registry",
    requestWireLabel: "PULL IMAGE ↓",
    responseWireLabel: "HEALTH 200 ↑",
    previewIcon: "docker",
    jsonPayload: `{\n  "image": "api:v2.4",\n  "replicas": 3,\n  "status": "healthy"\n}`,
    compareTitle: "Bare Metal vs Containers",
    slowSide: { label: "Manual VM", sublabel: "Slow Boot & Drift", valueText: "45s", icon: "server" },
    fastSide: { label: "Container Pod", sublabel: "Isolated & Fast", valueText: "0.8s", icon: "docker" },
    bridgeTitle: "Orchestrated Deployment",
    packets: ["IMAGE PUSH", "POD READY"],
  },
  {
    match: /\b(kafka|rabbitmq|queue|event|stream|webhook|async)\b/i,
    appName: "Checkout Service",
    loadingLabel: "Publishing Event…",
    loadedTitle: "Event Processed",
    loadedValue: "ACK · 4ms",
    endpoint: "PUBLISH orders.created",
    gatewayLabel: "BROKER",
    serverLabel: "Event Bus + Worker Pool",
    requestWireLabel: "CONSUME TOPIC ↓",
    responseWireLabel: "OFFSET COMMIT ↑",
    previewIcon: "kafka",
    jsonPayload: `{\n  "topic": "orders",\n  "partition": 2,\n  "status": "acked"\n}`,
    compareTitle: "Sync Blocking vs Event Queue",
    slowSide: { label: "Sync Chain", sublabel: "Blocks Caller", valueText: "640ms", icon: "server" },
    fastSide: { label: "Event Queue", sublabel: "Async Worker", valueText: "4ms", icon: "kafka" },
    bridgeTitle: "Async Event Pipeline",
    packets: ["EVENT →", "WORKER ACK"],
  },
  {
    match: /\b(sql|postgres|mysql|mongo|database|index|query)\b/i,
    appName: "Analytics App",
    loadingLabel: "Running Query…",
    loadedTitle: "Indexed Result",
    loadedValue: "3ms · 12 ROWS",
    endpoint: "SELECT * FROM orders",
    gatewayLabel: "PLANNER",
    serverLabel: "Primary DB + B-Tree Index",
    requestWireLabel: "INDEX SEEK ↓",
    responseWireLabel: "ROWS RETURNED ↑",
    previewIcon: "database",
    jsonPayload: `{\n  "scan": "B-Tree",\n  "rows": 12,\n  "latencyMs": 3.1\n}`,
    compareTitle: "Full Scan vs B-Tree Index",
    slowSide: { label: "Seq Scan", sublabel: "Reads All Rows", valueText: "240ms", icon: "server" },
    fastSide: { label: "B-Tree Index", sublabel: "Direct Seek", valueText: "3ms", icon: "database" },
    bridgeTitle: "Query Execution Bridge",
    packets: ["SQL QUERY", "RESULT SET"],
  },
  {
    match: /\b(weather|food|delivery|map|zomato|swiggy|uber)\b/i,
    appName: "Weather / Food App",
    loadingLabel: "Delhi · Loading…",
    loadedTitle: "Delhi · 28°C",
    loadedValue: "28°C · Sunny",
    endpoint: "GET /weather",
    gatewayLabel: "API",
    serverLabel: "Server & Database",
    requestWireLabel: "QUERY DB ↓",
    responseWireLabel: "FETCH DATA ↑",
    previewIcon: "weather",
    jsonPayload: `{\n  "city": "Delhi",\n  "temp": "28°C",\n  "status": "Sunny"\n}`,
    compareTitle: "Direct DB vs API Contract",
    slowSide: { label: "Exposed DB", sublabel: "Tightly Coupled", valueText: "RISKY", icon: "database" },
    fastSide: { label: "API Layer", sublabel: "Clean Contract", valueText: "SAFE", icon: "api" },
    bridgeTitle: "Software Bridge",
    packets: ["REQUEST", "JSON DATA"],
  },
];

const DEFAULT_BLUEPRINT: DomainBlueprint = {
  match: /.*/,
  appName: "Client Application",
  loadingLabel: "Sending Request…",
  loadedTitle: "Live Response",
  loadedValue: "200 OK",
  endpoint: "GET /api/v1/resource",
  gatewayLabel: "API",
  serverLabel: "Backend Server & Database",
  requestWireLabel: "QUERY STORE ↓",
  responseWireLabel: "RETURN DATA ↑",
  previewIcon: "check",
  jsonPayload: `{\n  "status": "ok",\n  "latencyMs": 14\n}`,
  compareTitle: "Direct Access vs Clean Layer",
  slowSide: { label: "Tightly Coupled", sublabel: "No Abstraction", valueText: "SLOW", icon: "server" },
  fastSide: { label: "Layered Service", sublabel: "Scalable Flow", valueText: "FAST", icon: "api" },
  bridgeTitle: "Connected Architecture",
  packets: ["REQUEST", "JSON DATA"],
};

const CODE_HINT_RE =
  /\b(json|sql|query|command|terminal|install|npm|pnpm|docker|git|http|const|function|async|schema)\b/i;

const COMPARE_HINT_RE =
  /\b(versus|vs|compare|faster|slower|miss|hit|latency|bottleneck|overload|without|instead|better)\b/i;

const METAPHOR_HINT_RE =
  /\b(waiter|restaurant|kitchen|chef|table|menu)\b|खाना/i;

const ACRONYM_HINT_RE =
  /\b(full form|stands for|means|matlab|kya hota|acronym|breakdown|structure)\b/i;

function detectEntities(text: string): DetectedEntity[] {
  const matched: Array<{ entity: DetectedEntity; pos: number }> = [];
  for (const entity of TECH_ENTITIES) {
    const m = entity.pattern.exec(text);
    if (m) {
      matched.push({ entity, pos: m.index });
    }
  }
  matched.sort((a, b) => a.pos - b.pos);
  return matched.map((m) => m.entity);
}

function selectBlueprint(fullText: string): DomainBlueprint {
  for (const bp of DOMAIN_BLUEPRINTS) {
    if (bp.match.test(fullText)) {
      return bp;
    }
  }
  return DEFAULT_BLUEPRINT;
}

function findMatchingAcronym(
  beatText: string,
  fullText: string,
  allowImplicit: boolean,
) {
  for (const entry of ACRONYM_EXPANSIONS) {
    if (entry.pattern.test(beatText)) {
      return entry;
    }
  }
  if (allowImplicit) {
    for (const entry of ACRONYM_EXPANSIONS) {
      if (entry.pattern.test(fullText)) {
        return entry;
      }
    }
  }
  return null;
}

/**
 * Group transcript segments into balanced visual beats so precision diagrams
 * have sufficient duration (4.5s-8.5s) to complete their step animations cleanly.
 */
function groupSegmentsByCadence(
  segments: TranscriptSegment[],
  totalDuration: number,
  targetBeatSec: number,
): BeatGroup[] {
  if (segments.length === 0) {
    return [
      {
        start: 0,
        end: Math.max(2, totalDuration),
        text: "System Architecture",
        segments: [],
      },
    ];
  }

  const clampedTarget = Math.max(4.5, Math.min(7.2, targetBeatSec));
  const groups: BeatGroup[] = [];
  let bucket: TranscriptSegment[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    bucket.push(seg);

    const bucketStart = bucket[0].start;
    const bucketSpan = seg.end - bucketStart;
    const nextSeg = segments[i + 1];
    const nextPause = nextSeg ? nextSeg.start - seg.end : 1.0;

    const isHookBoundary = groups.length === 0 && bucketSpan >= 2.8;
    const wouldOverflow =
      Boolean(nextSeg) &&
      bucketSpan >= 3.6 &&
      nextSeg!.end - bucketStart > clampedTarget * 1.25;
    const hitTarget =
      bucketSpan >= clampedTarget ||
      wouldOverflow ||
      (bucketSpan >= clampedTarget * 0.68 && nextPause >= 0.35);

    if (isHookBoundary || hitTarget || !nextSeg) {
      groups.push({
        start: groups.length === 0 ? 0 : bucketStart,
        end: nextSeg ? nextSeg.start : Math.max(seg.end, totalDuration),
        text: bucket.map((s) => s.text).join(" ").trim(),
        segments: bucket,
      });
      bucket = [];
    }
  }

  // Merge trailing micro-beat (< 2.5s) into the previous scene so closing stays readable.
  if (groups.length > 2) {
    const last = groups[groups.length - 1];
    if (last.end - last.start < 2.5) {
      const prev = groups[groups.length - 2];
      prev.end = last.end;
      prev.text = `${prev.text} ${last.text}`.trim();
      prev.segments = [...prev.segments, ...last.segments];
      groups.pop();
    }
  }

  return groups;
}

function conciseTitle(rawTitle: string, entities: DetectedEntity[], fallback: string): string {
  const cleaned = rawTitle.trim();
  if (cleaned && !/^(cartesia|untitled|recording|audio|voice)/i.test(cleaned)) {
    const words = cleaned.split(/\s+/).slice(0, 4);
    return words.join(" ");
  }
  if (entities.length >= 2) {
    return `${entities[0].label} + ${entities[1].label}`;
  }
  if (entities.length === 1) {
    return entities[0].label;
  }
  return fallback;
}

function buildHeroScene(params: {
  id: string;
  start: number;
  end: number;
  eyebrow: string;
  title: string;
  tag: string;
  entities: DetectedEntity[];
  sfx: HeroVisualSceneConfig["sfx"];
}): HeroVisualSceneConfig {
  const { id, start, end, eyebrow, title, tag, entities, sfx } = params;
  const heroIcon = entities[0]?.icon ?? "api";
  const orbitPool = entities.slice(1, 5).map((e) => e.icon);
  const defaultOrbits = ["phone", "server", "database"];
  const orbitIcons =
    orbitPool.length >= 2
      ? orbitPool
      : [...orbitPool, ...defaultOrbits.filter((i) => i !== heroIcon)].slice(0, 3);

  return {
    id,
    type: "hero-visual",
    start,
    end,
    eyebrow,
    title,
    tag,
    heroIcon,
    orbitIcons,
    accentVariant: "accent",
    sfx,
  };
}

function buildTokenBreakdownScene(
  id: string,
  group: BeatGroup,
  match: (typeof ACRONYM_EXPANSIONS)[number],
): TokenBreakdownSceneConfig {
  return {
    id,
    type: "token-breakdown",
    start: group.start,
    end: group.end,
    eyebrow: "WHAT IT MEANS",
    title: match.title,
    items: match.items,
    sfx: "pop",
  };
}

function buildRestaurantMetaphorScene(
  id: string,
  group: BeatGroup,
): RestaurantMetaphorSceneConfig {
  return {
    id,
    type: "restaurant-metaphor",
    start: group.start,
    end: group.end,
    eyebrow: "REAL-WORLD ANALOGY",
    title: "Restaurant Analogy",
    sfx: "pop",
  };
}

function buildClientApiServerScene(
  id: string,
  group: BeatGroup,
  blueprint: DomainBlueprint,
): ClientApiServerSceneConfig {
  return {
    id,
    type: "client-api-server",
    start: group.start,
    end: group.end,
    eyebrow: "LIVE SYSTEM FLOW",
    title: blueprint.appName,
    appName: blueprint.appName,
    loadingLabel: blueprint.loadingLabel,
    loadedTitle: blueprint.loadedTitle,
    loadedValue: blueprint.loadedValue,
    endpoint: blueprint.endpoint,
    gatewayLabel: blueprint.gatewayLabel,
    serverLabel: blueprint.serverLabel,
    requestWireLabel: blueprint.requestWireLabel,
    responseWireLabel: blueprint.responseWireLabel,
    previewIcon: blueprint.previewIcon,
    jsonPayload: blueprint.jsonPayload,
    sfx: "pop",
  };
}

function buildSequenceDiagramScene(
  id: string,
  group: BeatGroup,
  allEntities: DetectedEntity[],
  blueprint: DomainBlueprint,
): SequenceDiagramSceneConfig {
  const local = detectEntities(group.text);
  const pool = local.length >= 2 ? local : [...local, ...allEntities];
  const sorted = [...pool].sort((a, b) => a.layer - b.layer);

  const a1 = sorted[0] ?? TECH_ENTITIES[0];
  const a2 =
    sorted.find((e) => e.id !== a1.id && e.layer >= 2 && e.layer <= 3) ??
    TECH_ENTITIES.find((e) => e.id === "api")!;
  const a3 =
    sorted.find((e) => e.id !== a1.id && e.id !== a2.id) ??
    TECH_ENTITIES.find((e) => e.id === "server")!;

  return {
    id,
    type: "sequence-diagram",
    start: group.start,
    end: group.end,
    eyebrow: "HOW IT WORKS",
    title: `${a1.label} ↔ ${a3.label}`,
    actors: [
      { id: "a1", label: a1.label, icon: a1.icon, tone: "accent" },
      { id: "a2", label: a2.label, icon: a2.icon, tone: "accent" },
      { id: "a3", label: a3.label, icon: a3.icon, tone: "success" },
    ],
    steps: [
      { from: "a1", to: "a2", label: blueprint.packets[0], tone: "accent" },
      { from: "a2", to: "a3", label: "Process & Query", tone: "accent" },
      { from: "a3", to: "a1", label: blueprint.packets[1], tone: "success" },
    ],
    sfx: "pop",
  };
}

function buildMetricCompareScene(
  id: string,
  group: BeatGroup,
  blueprint: DomainBlueprint,
): MetricCompareSceneConfig {
  return {
    id,
    type: "metric-compare",
    start: group.start,
    end: group.end,
    eyebrow: "COMPARISON",
    title: blueprint.compareTitle,
    variant: "versus",
    left: {
      label: blueprint.slowSide.label,
      sublabel: blueprint.slowSide.sublabel,
      valueText: blueprint.slowSide.valueText,
      gaugePercent: 28,
      icon: blueprint.slowSide.icon,
      tone: "danger",
    },
    right: {
      label: blueprint.fastSide.label,
      sublabel: blueprint.fastSide.sublabel,
      valueText: blueprint.fastSide.valueText,
      gaugePercent: 95,
      icon: blueprint.fastSide.icon,
      tone: "success",
    },
    sfx: "pop",
  };
}

function buildBridgeArchScene(
  id: string,
  group: BeatGroup,
  allEntities: DetectedEntity[],
  blueprint: DomainBlueprint,
): BridgeArchitectureSceneConfig {
  const local = detectEntities(group.text);
  const pool = local.length >= 2 ? local : [...local, ...allEntities];
  const sorted = [...pool].sort((a, b) => a.layer - b.layer);
  const left = sorted[0] ?? TECH_ENTITIES[0];
  const right =
    [...sorted].reverse().find((e) => e.icon !== left.icon) ??
    TECH_ENTITIES.find((e) => e.id === "server")!;

  return {
    id,
    type: "bridge-architecture",
    start: group.start,
    end: group.end,
    eyebrow: "KEY TAKEAWAY",
    title: blueprint.bridgeTitle,
    leftApp: { name: left.label, sub: left.tag, icon: left.icon, badge: "CLIENT" },
    rightApp: { name: right.label, sub: right.tag, icon: right.icon, badge: "SERVICE" },
    bridgeLabel: `${blueprint.gatewayLabel} BRIDGE`,
    packets: blueprint.packets,
    sfx: "whoosh",
  };
}

function buildCodeOrTerminalScene(
  id: string,
  group: BeatGroup,
  allEntities: DetectedEntity[],
  blueprint: DomainBlueprint,
): TimelineScene {
  const local = detectEntities(group.text);
  const top = local[0] ?? allEntities[0];
  const slugName = (top?.id ?? "service").toLowerCase();

  if (/\b(docker|git|npm|pnpm|install|command|terminal|cli|kubectl)\b/i.test(group.text)) {
    return {
      id,
      type: "terminal",
      start: group.start,
      end: group.end,
      title: `${slugName} — cli`,
      sfx: "click",
      lines: [
        { text: `${blueprint.endpoint}`, kind: "command", atOffset: 0.0 },
        { text: `Status: ${blueprint.loadedValue}`, kind: "success", atOffset: 0.6 },
      ],
    };
  }

  return {
    id,
    type: "code-stepper",
    start: group.start,
    end: group.end,
    title: `${top?.label ?? "Service"} Contract`,
    filename: `${slugName}.ts`,
    language: "typescript",
    sfx: "click",
    code: [
      `const res = await fetch("${blueprint.endpoint}");`,
      `const payload = await res.json();`,
      `return renderUI(payload);`,
    ].join("\n"),
    steps: [
      { atOffset: 0.0, lines: [1], caption: "Send Request" },
      {
        atOffset: Math.max(0.7, (group.end - group.start) * 0.45),
        lines: [2, 3],
        caption: "Apply Payload",
      },
    ],
  };
}

function buildVisualFlowScene(
  id: string,
  group: BeatGroup,
  allEntities: DetectedEntity[],
  blueprint: DomainBlueprint,
): TimelineScene {
  const local = detectEntities(group.text);
  const pool = local.length >= 2 ? local : [...local, ...allEntities];

  const picked: DetectedEntity[] = [];
  for (const item of pool) {
    if (!picked.some((p) => p.icon === item.icon)) {
      picked.push(item);
    }
    if (picked.length >= 3) break;
  }

  while (picked.length < 3) {
    const defaults: DetectedEntity[] = [
      TECH_ENTITIES.find((e) => e.id === "phone")!,
      TECH_ENTITIES.find((e) => e.id === "api")!,
      TECH_ENTITIES.find((e) => e.id === "server")!,
    ];
    const candidate = defaults[picked.length];
    if (!picked.some((p) => p.icon === candidate.icon)) {
      picked.push(candidate);
    } else {
      break;
    }
  }

  picked.sort((a, b) => a.layer - b.layer);

  const span = Math.max(1.5, group.end - group.start);
  const step = Math.min(0.55, span / (picked.length + 1));

  const nodes: VisualFlowNode[] = picked.map((ent, idx) => ({
    id: `vf-${idx}`,
    label: ent.label,
    tag: ent.tag,
    icon: ent.icon,
    status: ent.tone,
    appearAtOffset: Math.round(idx * step * 100) / 100,
  }));

  const edges: VisualFlowEdge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      label: i === 0 ? blueprint.packets[0] : blueprint.packets[1],
      direction: i === 0 ? "forward" : "backward",
      color: i === 0 ? "accent" : "success",
      appearAtOffset: Math.round((i + 0.5) * step * 100) / 100,
    });
  }

  return {
    id,
    type: "visual-flow",
    start: group.start,
    end: group.end,
    eyebrow: "ARCHITECTURE FLOW",
    title: `${nodes[0].label} → ${nodes[nodes.length - 1].label}`,
    nodes,
    edges,
    sfx: "pop",
  };
}

export function buildStoryboard(params: {
  slug: string;
  title: string;
  transcript: TranscriptData;
  styleSpec: StyleSpec;
  audioUrl: string;
  format: "portrait" | "landscape";
}): TimelineData {
  const { slug, title, transcript, styleSpec, audioUrl, format } = params;
  const isLandscape = format === "landscape";
  const width = isLandscape ? 1920 : 1080;
  const height = isLandscape ? 1080 : 1920;

  const fullText = `${title} ${transcript.text}`;
  const blueprint = selectBlueprint(fullText);
  const targetBeat = styleSpec.meta?.avgShotDuration ?? 5.5;
  const groups = groupSegmentsByCadence(
    transcript.segments,
    transcript.duration,
    targetBeat,
  );
  const allEntities = detectEntities(fullText);

  const scenes: TimelineScene[] = [];
  const usedSpecials = new Set<string>();
  let prevType: TimelineScene["type"] | null = null;

  groups.forEach((group, idx) => {
    const id = `scene-${idx + 1}`;
    const isFirst = idx === 0;
    const isLast = idx === groups.length - 1 && groups.length > 2;
    const localEntities = detectEntities(group.text);
    const mergedEntities = localEntities.length > 0 ? localEntities : allEntities;

    if (isFirst) {
      const hero = buildHeroScene({
        id,
        start: group.start,
        end: group.end,
        eyebrow: styleSpec.meta?.pace
          ? `${styleSpec.meta.pace.toUpperCase()} // 60 FPS`
          : "TECH EXPLAINER // 60 FPS",
        title: conciseTitle(title, mergedEntities, "System Explained"),
        tag: mergedEntities[0] ? `{ ${mergedEntities[0].label} }` : "60-SEC GUIDE",
        entities: mergedEntities,
        sfx: "whoosh",
      });
      scenes.push(hero);
      prevType = hero.type;
      return;
    }

    if (isLast) {
      const closing =
        /\b(vs|versus|slower|faster|ms)\b/i.test(group.text) &&
        prevType !== "metric-compare"
          ? buildMetricCompareScene(id, group, blueprint)
          : buildBridgeArchScene(id, group, allEntities, blueprint);
      scenes.push(closing);
      prevType = closing.type;
      return;
    }

    const acronymMatch = findMatchingAcronym(
      group.text,
      fullText,
      idx === 1 && ACRONYM_HINT_RE.test(group.text),
    );
    const isMetaphorBeat =
      METAPHOR_HINT_RE.test(group.text) && !usedSpecials.has("restaurant-metaphor");

    let chosen: TimelineScene;
    if (
      acronymMatch &&
      !usedSpecials.has(`token:${acronymMatch.acronym}`) &&
      (idx === 1 || ACRONYM_HINT_RE.test(group.text))
    ) {
      chosen = buildTokenBreakdownScene(id, group, acronymMatch);
      usedSpecials.add(`token:${acronymMatch.acronym}`);
    } else if (isMetaphorBeat) {
      chosen = buildRestaurantMetaphorScene(id, group);
      usedSpecials.add("restaurant-metaphor");
    } else if (COMPARE_HINT_RE.test(group.text) && prevType !== "metric-compare") {
      chosen = buildMetricCompareScene(id, group, blueprint);
    } else if (
      CODE_HINT_RE.test(group.text) &&
      prevType !== "code-stepper" &&
      prevType !== "terminal" &&
      /\b(docker|git|npm|pnpm|install|command|terminal|cli|const|function|async)\b/i.test(
        group.text,
      )
    ) {
      chosen = buildCodeOrTerminalScene(id, group, allEntities, blueprint);
    } else if (
      prevType !== "client-api-server" &&
      (idx % 2 === 0 || prevType === "sequence-diagram" || /\b(phone|app|screen|json|ui)\b/i.test(group.text))
    ) {
      chosen = buildClientApiServerScene(id, group, blueprint);
    } else if (prevType !== "visual-flow" && idx % 3 === 2) {
      chosen = buildVisualFlowScene(id, group, allEntities, blueprint);
    } else {
      chosen = buildSequenceDiagramScene(id, group, allEntities, blueprint);
    }

    scenes.push(chosen);
    prevType = chosen.type;
  });

  return {
    slug,
    fps: transcript.fps || 60,
    width,
    height,
    audioFile: audioUrl,
    theme: styleSpec.id,
    showSafeZones: false,
    scenes,
  };
}
