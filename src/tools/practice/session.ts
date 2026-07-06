import type { CatalogEntry } from '../../lib/catalog/types'

// Pure, React-free session logic for the practice tool. A "session" is one round
// through a shuffled deck of catalog entries: reveal, self-rate, advance, and a
// final tally. No persistence, no DOM — the view (PracticeTool) and the store
// (lib/progress) compose these; this module owns only deck traversal.

export type Direction = 'de-en' | 'en-de'

export interface Session {
  readonly cards: readonly CatalogEntry[]
  readonly direction: Direction
  readonly index: number
  readonly known: number
  readonly unknown: number
}

export interface Summary {
  total: number
  known: number
  unknown: number
}

// Fisher–Yates with an INJECTED RNG so tests are deterministic. Production passes
// Math.random (the default); we never ship a seeded deck.
export function shuffle<T>(
  items: readonly T[],
  rng: () => number = Math.random,
): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Narrow the catalog to the chosen content sets (by toolId). Adding a tool that
// contributes catalog entries makes it drillable with no change here.
export function filterByTools(
  entries: readonly CatalogEntry[],
  toolIds: ReadonlySet<string>,
): CatalogEntry[] {
  return entries.filter((e) => toolIds.has(e.toolId))
}

export function createSession(
  entries: readonly CatalogEntry[],
  direction: Direction,
  rng: () => number = Math.random,
): Session {
  return {
    cards: shuffle(entries, rng),
    direction,
    index: 0,
    known: 0,
    unknown: 0,
  }
}

export function currentCard(session: Session): CatalogEntry | undefined {
  return session.cards[session.index]
}

export function isEmpty(session: Session): boolean {
  return session.cards.length === 0
}

export function isComplete(session: Session): boolean {
  return session.index >= session.cards.length
}

// Record the self-rating for the current card and advance. A no-op once the deck
// is exhausted, so double-clicks past the end can't corrupt the tally.
export function answer(session: Session, wasKnown: boolean): Session {
  if (isComplete(session)) return session
  return {
    ...session,
    index: session.index + 1,
    known: session.known + (wasKnown ? 1 : 0),
    unknown: session.unknown + (wasKnown ? 0 : 1),
  }
}

export function summary(session: Session): Summary {
  return {
    total: session.cards.length,
    known: session.known,
    unknown: session.unknown,
  }
}

// Which side is shown as the prompt vs. revealed as the answer, per direction.
// The German side is always `entry.term`, so callers speak that regardless of
// direction (and only when it is already visible).
export function promptText(entry: CatalogEntry, direction: Direction): string {
  return direction === 'de-en' ? entry.term : entry.gloss
}

export function answerText(entry: CatalogEntry, direction: Direction): string {
  return direction === 'de-en' ? entry.gloss : entry.term
}
