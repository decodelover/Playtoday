import type { NormalizedSelection } from "./types";

const lineSelectionPattern = /^(Over|Under)\s+(-?\d+(?:\.\d+)?)$/u;
const handicapSelectionPattern = /^(Home|Away)\s+([+-]?\d+(?:\.\d+)?)$/u;

export function parseDecimalOdds(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d+)?$/u.test(normalized)) {
    return null;
  }
  const decimal = Number(normalized);
  return Number.isFinite(decimal) && decimal > 1 && decimal <= 1000 ? decimal : null;
}

export function calculateRawImpliedProbability(decimalOdds: number): number | null {
  if (!Number.isFinite(decimalOdds) || decimalOdds <= 1 || decimalOdds > 1000) {
    return null;
  }
  return 1 / decimalOdds;
}

export function calculateMarketOverround(decimalOdds: number[]): number | null {
  if (decimalOdds.length < 2) {
    return null;
  }
  let probabilityTotal = 0;
  for (const price of decimalOdds) {
    const probability = calculateRawImpliedProbability(price);
    if (probability === null) {
      return null;
    }
    probabilityTotal += probability;
  }
  return probabilityTotal - 1;
}

export function normalizeSelection(
  providerMarketId: string,
  providerSelection: string,
  mappedSelectionKey?: string,
  mappedParticipant?: "home" | "away" | null,
): NormalizedSelection | null {
  if (mappedSelectionKey) {
    return {
      selectionKey: mappedSelectionKey,
      line: null,
      participant: mappedParticipant ?? null,
    };
  }

  if (["5", "16", "17"].includes(providerMarketId)) {
    const match = lineSelectionPattern.exec(providerSelection.trim());
    if (!match) {
      return null;
    }
    const line = Number(match[2]);
    if (!Number.isFinite(line) || Math.abs(line) > 100) {
      return null;
    }
    return {
      selectionKey: match[1]?.toLowerCase() ?? "",
      line,
      participant: mappedParticipant ?? null,
    };
  }

  if (providerMarketId === "4") {
    const match = handicapSelectionPattern.exec(providerSelection.trim());
    if (!match) {
      return null;
    }
    const line = Number(match[2]);
    if (!Number.isFinite(line) || Math.abs(line) > 100) {
      return null;
    }
    return {
      selectionKey: match[1]?.toLowerCase() ?? "",
      line,
      participant: (match[1]?.toLowerCase() as "home" | "away") ?? null,
    };
  }

  return null;
}
