import { describe, it, expect } from 'vitest'
import type { CatalogEntry } from '../../lib/catalog/types'
import { buildChoices } from './quiz'

const entry = (
  toolId: string,
  slug: string,
  term: string,
  gloss: string,
): CatalogEntry => ({ id: `${toolId}:${slug}`, toolId, route: `/${toolId}`, slug, term, gloss })

const pool: CatalogEntry[] = [
  entry('verben', 'schlafen', 'schlafen', 'to sleep'),
  entry('verben', 'essen', 'essen', 'to eat'),
  entry('verben', 'kommen', 'kommen', 'to come'),
  entry('verben', 'lernen', 'lernen', 'to learn'),
  entry('verben', 'kochen', 'kochen', 'to cook'),
]
const card = pool[0]

// Deterministic RNG so the shuffles inside buildChoices are assertable.
const rngZero = () => 0

describe('buildChoices', () => {
  it('always includes exactly one correct option, matching the answer side', () => {
    const choices = buildChoices(card, pool, 'de-en', rngZero)
    const correct = choices.filter((c) => c.correct)
    expect(correct).toHaveLength(1)
    expect(correct[0].text).toBe('to sleep') // DE→EN reveals the gloss
  })

  it('reveals the German term as the correct answer in EN→DE', () => {
    const choices = buildChoices(card, pool, 'en-de', rngZero)
    expect(choices.find((c) => c.correct)?.text).toBe('schlafen')
  })

  it('returns `count` distinct options when the pool is large enough', () => {
    const choices = buildChoices(card, pool, 'de-en', rngZero, 4)
    expect(choices).toHaveLength(4)
    const texts = choices.map((c) => c.text)
    expect(new Set(texts).size).toBe(4) // no duplicates
  })

  it('never offers a distractor equal to the correct answer', () => {
    // A second entry glossed identically to the card must not become a 2nd "right".
    const withDup = [...pool, entry('nomen', 'x/schlaf', 'Schlaf', 'to sleep')]
    const choices = buildChoices(card, withDup, 'de-en', rngZero, 4)
    expect(choices.filter((c) => c.text === 'to sleep')).toHaveLength(1)
  })

  it('caps at the available distractors for a small pool (still includes correct)', () => {
    const tiny = [card, entry('verben', 'essen', 'essen', 'to eat')]
    const choices = buildChoices(card, tiny, 'de-en', rngZero, 4)
    expect(choices).toHaveLength(2)
    expect(choices.some((c) => c.correct)).toBe(true)
  })

  it('degrades to a single (correct) option when there are no distractors', () => {
    const choices = buildChoices(card, [card], 'de-en', rngZero, 4)
    expect(choices).toEqual([{ text: 'to sleep', correct: true }])
  })

  it('is deterministic under an injected RNG', () => {
    const a = buildChoices(card, pool, 'de-en', rngZero)
    const b = buildChoices(card, pool, 'de-en', rngZero)
    expect(a).toEqual(b)
  })

  it('randomizes option order — the correct answer is not pinned to a position', () => {
    // Guard against a memorizable layout: across many production (Math.random)
    // builds, the correct answer must land in more than one index.
    const positions = new Set<number>()
    for (let i = 0; i < 200; i++) {
      const choices = buildChoices(card, pool, 'de-en')
      positions.add(choices.findIndex((c) => c.correct))
    }
    // With 4 options a fixed position would give size 1; a real shuffle spreads it.
    expect(positions.size).toBeGreaterThan(1)
  })
})
