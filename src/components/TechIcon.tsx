import React from "react";
import {
  ArrowLeftRight,
  Braces,
  CheckCircle2,
  ChefHat,
  Cloud,
  CloudSun,
  Cpu,
  Database,
  Globe,
  KeyRound,
  Layers,
  Lock,
  Monitor,
  Network,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  User,
  UtensilsCrossed,
  Webhook,
  Workflow,
  Zap,
  icons as lucideIcons,
} from "lucide-react";
import {
  siAnthropic,
  siApachekafka,
  siBun,
  siCaddy,
  siClickhouse,
  siCloudflare,
  siDeno,
  siDjango,
  siDocker,
  siDuckdb,
  siElasticsearch,
  siExpress,
  siFastapi,
  siFlask,
  siGit,
  siGithub,
  siGo,
  siGooglegemini,
  siGrafana,
  siGraphql,
  siHelm,
  siJavascript,
  siKubernetes,
  siLinux,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPrometheus,
  siPython,
  siRabbitmq,
  siReact,
  siRedis,
  siRust,
  siSqlite,
  siStripe,
  siSupabase,
  siSvelte,
  siTailwindcss,
  siTerraform,
  siTraefikproxy,
  siTypescript,
  siVercel,
  siVite,
  type SimpleIcon,
} from "simple-icons";

const BRAND_ICONS: Record<string, SimpleIcon> = {
  anthropic: siAnthropic,
  claude: siAnthropic,
  gemini: siGooglegemini,
  googlegemini: siGooglegemini,
  vercel: siVercel,
  supabase: siSupabase,
  prisma: siPrisma,
  stripe: siStripe,
  terraform: siTerraform,
  helm: siHelm,
  traefik: siTraefikproxy,
  caddy: siCaddy,
  elasticsearch: siElasticsearch,
  elastic: siElasticsearch,
  clickhouse: siClickhouse,
  duckdb: siDuckdb,
  bun: siBun,
  deno: siDeno,
  vite: siVite,
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  svelte: siSvelte,
  django: siDjango,
  flask: siFlask,
  redis: siRedis,
  postgres: siPostgresql,
  postgresql: siPostgresql,
  docker: siDocker,
  kubernetes: siKubernetes,
  k8s: siKubernetes,
  go: siGo,
  golang: siGo,
  python: siPython,
  typescript: siTypescript,
  ts: siTypescript,
  javascript: siJavascript,
  js: siJavascript,
  react: siReact,
  node: siNodedotjs,
  nodejs: siNodedotjs,
  kafka: siApachekafka,
  graphql: siGraphql,
  nginx: siNginx,
  cloudflare: siCloudflare,
  git: siGit,
  github: siGithub,
  linux: siLinux,
  mongodb: siMongodb,
  mongo: siMongodb,
  mysql: siMysql,
  sqlite: siSqlite,
  fastapi: siFastapi,
  express: siExpress,
  nextjs: siNextdotjs,
  rust: siRust,
  rabbitmq: siRabbitmq,
  prometheus: siPrometheus,
  grafana: siGrafana,
};

const INFRA_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  client: Monitor,
  browser: Globe,
  phone: Smartphone,
  smartphone: Smartphone,
  mobile: Smartphone,
  server: Server,
  database: Database,
  db: Database,
  cache: Zap,
  queue: Layers,
  lock: Lock,
  key: KeyRound,
  jwt: KeyRound,
  auth: ShieldCheck,
  shield: ShieldCheck,
  zap: Cpu,
  cpu: Cpu,
  globe: Globe,
  dns: Globe,
  cloud: Cloud,
  weather: CloudSun,
  sun: CloudSun,
  network: Network,
  terminal: Terminal,
  code: Braces,
  json: Braces,
  api: Webhook,
  webhook: Webhook,
  gateway: Workflow,
  bridge: ArrowLeftRight,
  waiter: UtensilsCrossed,
  utensils: UtensilsCrossed,
  chef: ChefHat,
  kitchen: ChefHat,
  user: User,
  check: CheckCircle2,
  search: Search,
  llm: Sparkles,
  ai: Sparkles,
  sparkles: Sparkles,
};

export interface TechIconProps {
  name: string;
  size?: number;
  color?: string;
  useBrandColor?: boolean;
}

const LUCIDE_BY_NORMALIZED: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {};
for (const [iconName, comp] of Object.entries(lucideIcons)) {
  LUCIDE_BY_NORMALIZED[iconName.toLowerCase()] = comp;
}

export const TechIcon: React.FC<TechIconProps> = ({
  name,
  size = 44,
  color = "#38BDF8",
  useBrandColor = true,
}) => {
  const raw = name.trim();
  const key = raw.toLowerCase();
  const compactKey = key.replace(/[^a-z0-9]/g, "");
  const brand = BRAND_ICONS[key] ?? BRAND_ICONS[compactKey];

  if (brand) {
    // Ensure dark brand colors (e.g. GitHub, Express, Postgres) stay high-contrast on dark cards.
    const r = parseInt(brand.hex.slice(0, 2), 16);
    const g = parseInt(brand.hex.slice(2, 4), 16);
    const b = parseInt(brand.hex.slice(4, 6), 16);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const fill = useBrandColor && luma >= 106 ? `#${brand.hex}` : color;

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        aria-label={brand.title}
      >
        <path d={brand.path} />
      </svg>
    );
  }

  const LucideComp =
    INFRA_ICONS[key] ??
    LUCIDE_BY_NORMALIZED[key] ??
    LUCIDE_BY_NORMALIZED[compactKey] ??
    Server;
  return <LucideComp size={size} color={color} strokeWidth={2.1} />;
};

