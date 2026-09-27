import { describe, it, expect } from 'vitest'
import type { CatalogEntry, EntryKind } from '../../lib/catalog/types'
import type { LessonId } from '../../content/lessons'
import {
  shuffle,
  filterByTools,
  filterByLesson,
  createSession,
  currentCard,
  isEmpty,
  isComplete,
  answer,
  summary,
  promptText,
  answerText,
} from './session'

// Fixture catalog so the logic is tested independently of live content.
const KIND_BY_TOOL: Record<string, EntryKind> = {
  verben: 'verb',
  nomen: 'noun',
  adjektive: 'adjective',
}

const entry = (
  toolId: string,
  slug: string,
  term: string,
  gloss: string,
  lessons: LessonId[] = ['A1.1'],
): CatalogEntry => ({
  id: `${toolId}:${slug}`,
  toolId,
  route: `/${toolId}`,
  slug,
  term,
  gloss,
  kind: KIND_BY_TOOL[toolId] ?? 'phrase',
  lessons,
})

const fixture: CatalogEntry[] = [
  entry('verben', 'schlafen', 'schlafen', 'to sleep'),
  entry('verben', 'essen', 'essen', 'to eat'),
  entry('nomen', 'familie/bild', 'Bild', 'picture'),
  entry('adjektive', 'gegensaetze/schnell', 'schnell', 'fast'),
]

// A deterministic RNG that always returns 0 → Fisher–Yates always picks index 0
// as the swap target, giving a fixed, assertable permutation.
const rngZero = () => 0

describe('shuffle', () => {
  it('is deterministic given an injected RNG', () => {
    const a = shuffle([1, 2, 3, 4], rngZero)
    const b = shuffle([1, 2, 3, 4], rngZero)
    expect(a).toEqual(b)
  })

  it('is a permutation (same members, no loss)', () => {
    const out = shuffle(fixture, rngZero)
    expect(out).toHaveLength(fixture.length)
    const ids = (es: CatalogEntry[]) => es.map((e) => e.id).sort()
    expect(ids(out)).toEqual(ids(fixture))
  })

  it('does not mutate the input array', () => {
    const input = [1, 2, 3]
    shuffle(input, rngZero)
    expect(input).toEqual([1, 2, 3])
  })
})

describe('filterByTools', () => {
  it('keeps only the chosen content sets', () => {
    const out = filterByTools(fixture, new Set(['verben']))
    expect(out.map((e) => e.slug)).toEqual(['schlafen', 'essen'])
  })

  it('returns an empty deck when nothing is selected', () => {
    expect(filterByTools(fixture, new Set())).toEqual([])
  })
})

describe('filterByLesson', () => {
  const withLessons: CatalogEntry[] = [
    entry('verben', 'arbeiten', 'arbeiten', 'to work', ['A1.2-L08']),
    entry('verben', 'schlafen', 'schlafen', 'to sleep', ['A1.1']),
    entry('praepositionen', 'seit', 'seit', 'since', ['A1.2-L08']),
  ]

  it('keeps only entries tagged with the given lesson', () => {
    const out = filterByLesson(withLessons, 'A1.2-L08')
    expect(out.map((e) => e.slug).sort()).toEqual(['arbeiten', 'seit'])
  })

  it('returns every entry when no lesson is chosen (undefined = all lessons)', () => {
    expect(filterByLesson(withLessons, undefined)).toHaveLength(withLessons.length)
  })

  it('does not mutate the input', () => {
    const copy = [...withLessons]
    filterByLesson(withLessons, 'A1.2-L08')
    expect(withLessons).toEqual(copy)
  })
})

describe('createSession', () => {
  it('builds a deck from the given entries with a zeroed tally', () => {
    const s = createSession(fixture, 'de-en', 'flashcard', rngZero)
    expect(s.cards).toHaveLength(fixture.length)
    expect(s.index).toBe(0)
    expect(s.known).toBe(0)
    expect(s.unknown).toBe(0)
    expect(s.direction).toBe('de-en')
    expect(s.mode).toBe('flashcard')
  })

  it('records the chosen mode on the session', () => {
    expect(createSession(fixture, 'de-en', 'quiz', rngZero).mode).toBe('quiz')
  })

  it('reports an empty deck via isEmpty', () => {
    const s = createSession([], 'de-en', 'flashcard', rngZero)
    expect(isEmpty(s)).toBe(true)
    expect(isComplete(s)).toBe(true)
    expect(currentCard(s)).toBeUndefined()
  })
})

describe('answer / advance', () => {
  it('records known/unknown and advances the index', () => {
    let s = createSession(fixture, 'de-en', 'flashcard', rngZero)
    s = answer(s, true)
    expect(s.index).toBe(1)
    expect(s.known).toBe(1)
    expect(s.unknown).toBe(0)

    s = answer(s, false)
    expect(s.index).toBe(2)
    expect(s.known).toBe(1)
    expect(s.unknown).toBe(1)
  })

  it('completes after the last card and is a no-op past the end', () => {
    let s = createSession(fixture, 'de-en', 'flashcard', rngZero)
    for (let i = 0; i < fixture.length; i++) s = answer(s, i % 2 === 0)
    expect(isComplete(s)).toBe(true)

    const frozen = answer(s, true) // past the end
    expect(frozen).toEqual(s)
  })

  it('summarises the round', () => {
    let s = createSession(fixture, 'de-en', 'flashcard', rngZero)
    s = answer(s, true)
    s = answer(s, true)
    s = answer(s, false)
    s = answer(s, true)
    expect(summary(s)).toEqual({ total: 4, known: 3, unknown: 1 })
  })
})

describe('direction', () => {
  const card = entry('verben', 'schlafen', 'schlafen', 'to sleep')

  it('DE→EN prompts with the German term and reveals the English gloss', () => {
    expect(promptText(card, 'de-en')).toBe('schlafen')
    expect(answerText(card, 'de-en')).toBe('to sleep')
  })

  it('EN→DE swaps the sides', () => {
    expect(promptText(card, 'en-de')).toBe('to sleep')
    expect(answerText(card, 'en-de')).toBe('schlafen')
  })
})
