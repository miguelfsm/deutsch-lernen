// Typed localStorage wrapper for lightweight "seen/known" practice progress.
//
// Stored as a VERSIONED envelope from day one — a future schema change can then
// migrate rather than silently orphan progress. Keyed by catalog `slug` (stable),
// never the display term. Every storage access is guarded, so the app still works
// where localStorage is unavailable (SSR, sandboxed iframes, Safari private mode).
//
// The pure logic (recordResult, migrate) is separated from the IO so it is the
// only part that needs testing.

export interface ProgressEntry {
  seen: number
  known: number
}

export interface ProgressEnvelope {
  version: 2
  data: Record<string, ProgressEntry>
}

export const PROGRESS_VERSION = 2 as const
const STORAGE_KEY = 'deutsch-lernen:progress'

// ── v1 → v2 migration (Phase 6: prepositions moved out of Phrases) ─────────
//
// Progress is keyed by catalog `slug`, not by id (see recordAndSave callers) —
// so it is NOT toolId-qualified, and a moved item's stored key changes when its
// slug does. The `praep` category in Phrases (slug `praep/<phrase>`, built by
// cardSlug) became the prepositions tool (slug = the bare word). This is the
// one mapping from an old slug to its new one, applied once when a v1 envelope
// is loaded. Only items that MOVED are listed — every other slug (verbs,
// nouns, everything else in Phrases…) passes through unchanged.
//
// Content choices behind the mapping (Phase 6 handback): `im`/`am`/`an der`/
// `zum` were contractions or dative examples of a base preposition and are
// folded into it (`in`, `an`, `zu`); `bis zum` is dropped — it never became its
// own preposition entry (it's now just an example + note on `bis`).
const V1_TO_V2_SLUG: Record<string, string> = {
  'praep/ab': 'ab',
  'praep/bis': 'bis',
  'praep/im': 'in',
  'praep/in': 'in',
  'praep/am': 'an',
  'praep/an-der': 'an',
  'praep/zum': 'zu',
}
const V1_DROPPED_SLUGS = new Set(['praep/bis-zum'])

// Pure: remap/merge a v1 envelope's data into v2 slugs. When two old slugs
// collapse onto the same new one (im + in → in), their seen/known counts are
// summed rather than one overwriting the other.
function migrateV1DataToV2(data: Record<string, ProgressEntry>): Record<string, ProgressEntry> {
  const out: Record<string, ProgressEntry> = {}
  for (const [slug, entry] of Object.entries(data)) {
    if (V1_DROPPED_SLUGS.has(slug)) continue
    const mapped = V1_TO_V2_SLUG[slug] ?? slug
    const prev = out[mapped]
    out[mapped] = prev
      ? { seen: prev.seen + entry.seen, known: prev.known + entry.known }
      : { seen: entry.seen, known: entry.known }
  }
  return out
}

export function emptyEnvelope(): ProgressEnvelope {
  return { version: PROGRESS_VERSION, data: {} }
}

// Pure: apply one self-rating. `seen` always increments; `known` increments on a
// hit. Returns a new envelope (no mutation of the input).
export function recordResult(
  env: ProgressEnvelope,
  slug: string,
  wasKnown: boolean,
): ProgressEnvelope {
  const prev = env.data[slug] ?? { seen: 0, known: 0 }
  return {
    version: PROGRESS_VERSION,
    data: {
      ...env.data,
      [slug]: {
        seen: prev.seen + 1,
        known: prev.known + (wasKnown ? 1 : 0),
      },
    },
  }
}

// Pure: coerce arbitrary parsed JSON into a valid envelope. A current-version
// envelope passes through; a v1 envelope is migrated (see V1_TO_V2_SLUG above).
// Anything else — including legacy unversioned blobs — is discarded rather than
// trusted. This is the seam a future migration would extend.
export function migrate(raw: unknown): ProgressEnvelope {
  if (!raw || typeof raw !== 'object') return emptyEnvelope()
  const obj = raw as Partial<ProgressEnvelope> & { version?: unknown }
  if (typeof obj.data !== 'object' || obj.data === null) return emptyEnvelope()
  const data = obj.data as Record<string, ProgressEntry>
  if (obj.version === PROGRESS_VERSION) {
    return { version: PROGRESS_VERSION, data }
  }
  if (obj.version === 1) {
    return { version: PROGRESS_VERSION, data: migrateV1DataToV2(data) }
  }
  return emptyEnvelope()
}

function getStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null
  } catch {
    // Accessing localStorage can itself throw in sandboxed contexts.
    return null
  }
}

export function loadProgress(): ProgressEnvelope {
  const storage = getStorage()
  if (!storage) return emptyEnvelope()
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return emptyEnvelope()
    return migrate(JSON.parse(raw))
  } catch {
    return emptyEnvelope()
  }
}

export function saveProgress(env: ProgressEnvelope): void {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(env))
  } catch {
    // Best-effort: ignore quota/security errors — progress is non-critical.
  }
}

// Convenience for the view: load → record one result → save. Returns the updated
// envelope so the caller can reflect it without a second read.
export function recordAndSave(slug: string, wasKnown: boolean): ProgressEnvelope {
  const next = recordResult(loadProgress(), slug, wasKnown)
  saveProgress(next)
  return next
}

// Sum lifetime totals across all entries — used to show persisted progress.
export function totals(env: ProgressEnvelope): ProgressEntry {
  return Object.values(env.data).reduce(
    (acc, e) => ({ seen: acc.seen + e.seen, known: acc.known + e.known }),
    { seen: 0, known: 0 },
  )
}
