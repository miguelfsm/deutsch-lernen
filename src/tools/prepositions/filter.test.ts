import { describe, it, expect } from 'vitest'
import type { Preposition } from './data'
import { filterPrepositions } from './filter'

const fixture: Preposition[] = [
  { word: 'seit', case: 'Dativ', use: ['temporal'], question: 'Seit wann?', meaning: 'since', examples: [{ de: 'x', en: 'y' }], lessons: ['A1.1'] },
  { word: 'für', case: 'Akkusativ', use: ['temporal'], question: 'Für wie lange?', meaning: 'for', examples: [{ de: 'x', en: 'y' }], lessons: ['A1.1'] },
  { word: 'in', case: 'Wechsel', use: ['lokal', 'temporal'], question: 'Wo?/Wohin?', meaning: 'in', examples: [{ de: 'x', en: 'y' }], lessons: ['A1.1'] },
  { word: 'als', case: 'ohne', use: ['modal'], question: 'Als was?', meaning: 'as', examples: [{ de: 'x', en: 'y' }], lessons: ['A1.1'] },
]

describe('filterPrepositions', () => {
  it('"Alle"/"Alle" returns everything unfiltered', () => {
    expect(filterPrepositions(fixture, 'Alle', 'Alle')).toEqual(fixture)
  })

  it('filters by case alone', () => {
    expect(filterPrepositions(fixture, 'Dativ', 'Alle').map((p) => p.word)).toEqual(['seit'])
    expect(filterPrepositions(fixture, 'Wechsel', 'Alle').map((p) => p.word)).toEqual(['in'])
    expect(filterPrepositions(fixture, 'ohne', 'Alle').map((p) => p.word)).toEqual(['als'])
  })

  it('filters by use alone (a preposition can carry several uses)', () => {
    expect(filterPrepositions(fixture, 'Alle', 'temporal').map((p) => p.word)).toEqual([
      'seit',
      'für',
      'in',
    ])
    expect(filterPrepositions(fixture, 'Alle', 'lokal').map((p) => p.word)).toEqual(['in'])
    expect(filterPrepositions(fixture, 'Alle', 'modal').map((p) => p.word)).toEqual(['als'])
  })

  it('combines both filters (AND, not OR)', () => {
    expect(filterPrepositions(fixture, 'Wechsel', 'lokal').map((p) => p.word)).toEqual(['in'])
    expect(filterPrepositions(fixture, 'Dativ', 'lokal')).toEqual([])
  })
})
