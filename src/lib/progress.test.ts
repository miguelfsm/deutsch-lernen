import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  emptyEnvelope,
  recordResult,
  migrate,
  loadProgress,
  saveProgress,
  recordAndSave,
  totals,
  PROGRESS_VERSION,
  type ProgressEnvelope,
} from './progress'

// jsdom keeps localStorage across tests, so clear it (and any global stubs) after
// each one to prevent cross-test bleed.
afterEach(() => {
  // Unstub first — a test may have replaced localStorage with a throwing/undefined
  // global, and clear() must run against the real jsdom storage.
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('recordResult (pure merge/update)', () => {
  it('increments seen, and known only on a hit, without mutating the input', () => {
    const env = emptyEnvelope()
    const a = recordResult(env, 'verben:schlafen', true)
    expect(a.data['verben:schlafen']).toEqual({ seen: 1, known: 1 })
    // Original untouched (immutability).
    expect(env.data['verben:schlafen']).toBeUndefined()

    const b = recordResult(a, 'verben:schlafen', false)
    expect(b.data['verben:schlafen']).toEqual({ seen: 2, known: 1 })
  })

  it('tracks distinct slugs independently', () => {
    let env = emptyEnvelope()
    env = recordResult(env, 'a', true)
    env = recordResult(env, 'b', false)
    expect(env.data).toEqual({ a: { seen: 1, known: 1 }, b: { seen: 1, known: 0 } })
  })
})

describe('migrate (version envelope)', () => {
  it('passes through a current-version envelope', () => {
    const env: ProgressEnvelope = {
      version: PROGRESS_VERSION,
      data: { a: { seen: 3, known: 2 } },
    }
    expect(migrate(env)).toEqual(env)
  })

  it('discards a wrong/legacy version', () => {
    expect(migrate({ version: 0, data: { a: { seen: 9, known: 9 } } })).toEqual(
      emptyEnvelope(),
    )
    expect(migrate({ data: { a: { seen: 1, known: 1 } } })).toEqual(emptyEnvelope())
  })

  it('discards garbage', () => {
    expect(migrate(null)).toEqual(emptyEnvelope())
    expect(migrate('nope')).toEqual(emptyEnvelope())
    expect(migrate(42)).toEqual(emptyEnvelope())
  })
})

describe('load/save round-trip', () => {
  it('writes then reads back the same envelope', () => {
    const env = recordResult(emptyEnvelope(), 'nomen:familie/bild', true)
    saveProgress(env)
    expect(loadProgress()).toEqual(env)
  })

  it('carries a version field in what is persisted', () => {
    saveProgress(recordResult(emptyEnvelope(), 'a', true))
    const raw = JSON.parse(localStorage.getItem('deutsch-lernen:progress')!)
    expect(raw.version).toBe(PROGRESS_VERSION)
  })

  it('returns an empty envelope when nothing is stored', () => {
    expect(loadProgress()).toEqual(emptyEnvelope())
  })

  it('recordAndSave persists incrementally across calls', () => {
    recordAndSave('a', true)
    recordAndSave('a', false)
    expect(loadProgress().data['a']).toEqual({ seen: 2, known: 1 })
  })
})

describe('missing-localStorage guard', () => {
  it('load returns empty and save is a no-op when storage is absent', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(() => saveProgress(emptyEnvelope())).not.toThrow()
    expect(loadProgress()).toEqual(emptyEnvelope())
  })

  it('survives a storage that throws on access', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied')
      },
      setItem: () => {
        throw new Error('denied')
      },
    })
    expect(() => saveProgress(emptyEnvelope())).not.toThrow()
    expect(loadProgress()).toEqual(emptyEnvelope())
  })
})

describe('totals', () => {
  it('sums lifetime seen/known across entries', () => {
    let env = emptyEnvelope()
    env = recordResult(env, 'a', true)
    env = recordResult(env, 'b', true)
    env = recordResult(env, 'b', false)
    expect(totals(env)).toEqual({ seen: 3, known: 2 })
  })
})
