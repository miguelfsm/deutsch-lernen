import { describe, it, expect } from 'vitest'
import { filterVerbs } from './filter.js'
import type { Verb } from './data.js'

const make = (infinitive: string, english: string): Verb => ({
  infinitive,
  english,
  type: 'regular',
  note: '',
  conjugations: [],
  example: '',
  translation: '',
})

const verbs = [
  make('gehen', 'to go'),
  make('aufstehen', 'to get up'),
  make('kochen', 'to cook'),
]

describe('filterVerbs', () => {
  it('returns the full list for an empty or whitespace query', () => {
    expect(filterVerbs(verbs, '')).toHaveLength(3)
    expect(filterVerbs(verbs, '   ')).toHaveLength(3)
  })

  it('matches any part of the infinitive, case-insensitively', () => {
    expect(filterVerbs(verbs, 'steh').map((v) => v.infinitive)).toEqual([
      'aufstehen',
    ])
    expect(filterVerbs(verbs, 'GEH').map((v) => v.infinitive)).toEqual([
      'gehen',
    ])
  })

  it('also matches the English gloss', () => {
    expect(filterVerbs(verbs, 'cook').map((v) => v.infinitive)).toEqual([
      'kochen',
    ])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterVerbs(verbs, 'xyz')).toEqual([])
  })
})
