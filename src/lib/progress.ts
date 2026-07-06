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
  version: 1
  data: Record<string, ProgressEntry>
}

export const PROGRESS_VERSION = 1 as const
const STORAGE_KEY = 'deutsch-lernen:progress'

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

// Pure: coerce arbitrary parsed JSON into a valid envelope. Anything whose version
// doesn't match — including legacy unversioned blobs — is discarded rather than
// trusted. This is the seam a future migration would extend.
export function migrate(raw: unknown): ProgressEnvelope {
  if (!raw || typeof raw !== 'object') return emptyEnvelope()
  const obj = raw as Partial<ProgressEnvelope>
  if (
    obj.version !== PROGRESS_VERSION ||
    typeof obj.data !== 'object' ||
    obj.data === null
  ) {
    return emptyEnvelope()
  }
  return { version: PROGRESS_VERSION, data: obj.data as Record<string, ProgressEntry> }
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
