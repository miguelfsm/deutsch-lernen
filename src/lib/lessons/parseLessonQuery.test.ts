import { describe, it, expect } from 'vitest'
import { parseLessonQuery } from './parseLessonQuery'
import type { Lesson, LessonId } from '../../content/lessons'

const FIXTURE: Lesson[] = [
  { id: 'A1.1', level: 'A1.1', title: 'A1.1', sections: [], wortfelder: [], grammar: [] },
  { id: 'A1.2-L08', level: 'A1.2', number: 8, title: 'Beruf und Arbeit', sections: [], wortfelder: [], grammar: [] },
  { id: 'A1.2-L09', level: 'A1.2', number: 9, title: 'Ämter', sections: [], wortfelder: [], grammar: [] },
]

// A second fixture where two levels share a lesson number, to test the
// "return all" behaviour for a level-less query (plan §4.2).
const SHARED_NUMBER: Lesson[] = [
  ...FIXTURE,
  {
    id: 'A2.1-L08' as LessonId, // future level not yet in the LessonId union; test-only
    level: 'A2.1',
    number: 8,
    title: 'Something',
    sections: [],
    wortfelder: [],
    grammar: [],
  },
]

describe('parseLessonQuery', () => {
  it.each([
    ['lektion 8', ['A1.2-L08']],
    ['lektion8', ['A1.2-L08']],
    ['l8', ['A1.2-L08']],
    ['L08', ['A1.2-L08']],
    ['a1.2 l8', ['A1.2-L08']],
    ['A1.2-L08', ['A1.2-L08']],
    ['Lektion 9', ['A1.2-L09']],
  ])('recognises %s', (query, expected) => {
    expect(parseLessonQuery(query, FIXTURE)).toEqual(expected)
  })

  it('a plain number is NOT a lesson query (would make text search noisy)', () => {
    expect(parseLessonQuery('8', FIXTURE)).toEqual([])
  })

  it('returns [] for a query naming an unknown lesson number', () => {
    expect(parseLessonQuery('lektion 99', FIXTURE)).toEqual([])
  })

  it('returns [] for a non-lesson query', () => {
    expect(parseLessonQuery('schlafen', FIXTURE)).toEqual([])
    expect(parseLessonQuery('', FIXTURE)).toEqual([])
    expect(parseLessonQuery('   ', FIXTURE)).toEqual([])
  })

  it('returns every lesson sharing a number when no level is given', () => {
    const ids = parseLessonQuery('lektion 8', SHARED_NUMBER)
    expect(ids).toEqual(expect.arrayContaining(['A1.2-L08', 'A2.1-L08']))
    expect(ids).toHaveLength(2)
  })

  it('a level prefix narrows to just that level', () => {
    expect(parseLessonQuery('a1.2 l8', SHARED_NUMBER)).toEqual(['A1.2-L08'])
  })

  it('is case-insensitive', () => {
    expect(parseLessonQuery('LEKTION 8', FIXTURE)).toEqual(['A1.2-L08'])
  })
})
