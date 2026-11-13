import { FoodDeliveryDbScene } from "./deepak-s-voice-1aa6ea/FoodDeliveryDbScene";
import { HeroAppsScene } from "./deepak-s-voice-1aa6ea/HeroAppsScene";
import { MessengerBridgeScene } from "./deepak-s-voice-1aa6ea/MessengerBridgeScene";
import { ModernEcosystemScene } from "./deepak-s-voice-1aa6ea/ModernEcosystemScene";
import { PaymentWriteScene } from "./deepak-s-voice-1aa6ea/PaymentWriteScene";

import { KeyboardVsChatGptScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/KeyboardVsChatGptScene";
import { KeyboardTypingScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/KeyboardTypingScene";
import { TextPatternsScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/TextPatternsScene";
import { LlmScaleScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/LlmScaleScene";
import { FullSentenceVsTokensScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/FullSentenceVsTokensScene";
import { TokenBreakdownScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/TokenBreakdownScene";
import { AutocompleteLoopScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/AutocompleteLoopScene";
import { PhoneVsLlmOutroScene } from "./cartesia-2026-11-13t02-38-22z-de-fae818/PhoneVsLlmOutroScene";

import { WorksOnMyMachineScene } from "./docker-e23c52/WorksOnMyMachineScene";
import { ContainerBoxScene } from "./docker-e23c52/ContainerBoxScene";
import { DockerfileImageContainerScene } from "./docker-e23c52/DockerfileImageContainerScene";
import { VmVsContainersScene } from "./docker-e23c52/VmVsContainersScene";
import { BuildOnceRunAnywhereScene } from "./docker-e23c52/BuildOnceRunAnywhereScene";

import { DockerWrapperScene } from "./hisotry-of-containers-a41d5f/DockerWrapperScene";
import { ChrootJailScene } from "./hisotry-of-containers-a41d5f/ChrootJailScene";
import { ChrootFlawsToNamespacesScene } from "./hisotry-of-containers-a41d5f/ChrootFlawsToNamespacesScene";
import { NamespacesMatrixScene } from "./hisotry-of-containers-a41d5f/NamespacesMatrixScene";
import { CgroupsResourceLimitScene } from "./hisotry-of-containers-a41d5f/CgroupsResourceLimitScene";
import { NamespacesCgroupsFormulaScene } from "./hisotry-of-containers-a41d5f/NamespacesCgroupsFormulaScene";
import { ContainerHistoryOutroScene } from "./hisotry-of-containers-a41d5f/ContainerHistoryOutroScene";

import type { CustomSceneComponent } from "./types";

/**
 * Per-project bespoke scene registry.
 * Add project-specific TSX scene components under `src/custom-scenes/<slug>/`
 * and register them here under unique `"<slug>/<scene-name>"` keys.
 */
export const CUSTOM_SCENES: Record<string, CustomSceneComponent> = {
  // deepak-s-voice-1aa6ea (How APIs Work)
  "deepak-s-voice-1aa6ea/hero-apps": HeroAppsScene,
  "deepak-s-voice-1aa6ea/messenger-bridge": MessengerBridgeScene,
  "deepak-s-voice-1aa6ea/food-delivery-db": FoodDeliveryDbScene,
  "deepak-s-voice-1aa6ea/payment-write-api": PaymentWriteScene,
  "deepak-s-voice-1aa6ea/modern-ecosystem": ModernEcosystemScene,

  // cartesia-2026-11-13t02-38-22z-de-fae818 (World's Most Powerful Autocomplete)
  "cartesia-2026-11-13t02-38-22z-de-fae818/keyboard-vs-chatgpt": KeyboardVsChatGptScene,
  "cartesia-2026-11-13t02-38-22z-de-fae818/keyboard-typing": KeyboardTypingScene,
  "cartesia-2026-11-13t02-38-22z-de-fae818/text-patterns": TextPatternsScene,
  "cartesia-2026-11-13t02-38-22z-de-fae818/llm-scale": LlmScaleScene,
  "cartesia-2026-11-13t02-38-22z-de-fae818/sentence-vs-tokens": FullSentenceVsTokensScene,
  "cartesia-2026-11-13t02-38-22z-de-fae818/token-breakdown": TokenBreakdownScene,
  "cartesia-2026-11-13t02-38-22z-de-fae818/autocomplete-loop": AutocompleteLoopScene,
  "cartesia-2026-11-13t02-38-22z-de-fae818/phone-vs-llm-outro": PhoneVsLlmOutroScene,

  // docker-e23c52 (What is Docker?)
  "docker-e23c52/works-on-my-machine": WorksOnMyMachineScene,
  "docker-e23c52/container-box": ContainerBoxScene,
  "docker-e23c52/dockerfile-image-container": DockerfileImageContainerScene,
  "docker-e23c52/vm-vs-containers": VmVsContainersScene,
  "docker-e23c52/build-once-run-anywhere": BuildOnceRunAnywhereScene,

  // hisotry-of-containers-a41d5f (History of Linux Containers)
  "hisotry-of-containers-a41d5f/docker-wrapper": DockerWrapperScene,
  "hisotry-of-containers-a41d5f/chroot-jail": ChrootJailScene,
  "hisotry-of-containers-a41d5f/chroot-flaws-namespaces": ChrootFlawsToNamespacesScene,
  "hisotry-of-containers-a41d5f/namespaces-matrix": NamespacesMatrixScene,
  "hisotry-of-containers-a41d5f/cgroups-limits": CgroupsResourceLimitScene,
  "hisotry-of-containers-a41d5f/formula-docker-revolution": NamespacesCgroupsFormulaScene,
  "hisotry-of-containers-a41d5f/history-outro": ContainerHistoryOutroScene,
};
