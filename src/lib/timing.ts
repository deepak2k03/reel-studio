import type { TranscriptData, TranscriptWord } from "./types";

export const REELS_FPS = 60;
export const REELS_WIDTH = 1080;
export const REELS_HEIGHT = 1920;

export function secToFrame(seconds: number, fps: number = REELS_FPS): number {
  return Math.max(0, Math.round(seconds * fps));
}

export function frameToSec(frame: number, fps: number = REELS_FPS): number {
  return frame / fps;
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Finds the start timestamp (in seconds) of a spoken phrase inside transcript words.
 * Enables anchoring visual transitions to exact spoken words rather than hardcoded frames.
 */
export function findCueTime(
  transcript: TranscriptData,
  phrase: string,
  occurrence: number = 0,
): number | null {
  const tokens = phrase
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  if (tokens.length === 0 || transcript.words.length === 0) {
    return null;
  }

  let hits = 0;
  for (let i = 0; i <= transcript.words.length - tokens.length; i++) {
    let matched = true;
    for (let j = 0; j < tokens.length; j++) {
      if (normalizeToken(transcript.words[i + j].word) !== tokens[j]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      if (hits === occurrence) {
        return transcript.words[i].start;
      }
      hits++;
    }
  }
  return null;
}

export function resolveCueTime(
  transcript: TranscriptData,
  fallbackSec: number,
  cuePhrase?: string,
): number {
  if (!cuePhrase) {
    return fallbackSec;
  }
  return findCueTime(transcript, cuePhrase) ?? fallbackSec;
}

export interface CaptionChunk {
  start: number;
  end: number;
  words: TranscriptWord[];
}

/**
 * Groups transcript words into punchy, 1-2 line Reels caption chunks while
 * splitting cleanly on natural vocal pauses.
 */
export function chunkWordsForCaptions(
  words: TranscriptWord[],
  maxWords: number = 4,
  maxChars: number = 24,
  pauseBreakSec: number = 0.35,
): CaptionChunk[] {
  if (words.length === 0) {
    return [];
  }

  const chunks: CaptionChunk[] = [];
  let current: TranscriptWord[] = [];
  let charCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prev = current[current.length - 1];
    const gap = prev ? word.start - prev.end : 0;
    const nextChars = charCount + (current.length > 0 ? 1 : 0) + word.word.length;

    const shouldBreak =
      current.length > 0 &&
      (current.length >= maxWords ||
        nextChars > maxChars ||
        gap >= pauseBreakSec);

    if (shouldBreak) {
      chunks.push({
        start: current[0].start,
        end: current[current.length - 1].end,
        words: current,
      });
      current = [];
      charCount = 0;
    }

    current.push(word);
    charCount += (current.length > 1 ? 1 : 0) + word.word.length;
  }

  if (current.length > 0) {
    chunks.push({
      start: current[0].start,
      end: current[current.length - 1].end,
      words: current,
    });
  }

  return chunks;
}

