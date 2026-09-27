import { describe, it, expect } from 'vitest'
import { searchLessons } from './searchLessons'
import type { CatalogEntry } from '../catalog/types'
import type { Lesson } from '../../content/lessons'

const FIXTURE_LESSONS: Lesson[] = [
  { id: 'A1.2-L08', level: 'A1.2', number: 8, title: 'Beruf und Arbeit', sections: [], wortfelder: [], grammar: [] },
]

const CATALOG: CatalogEntry[] = [
  { id: 'v1', toolId: 'verben', route: '/verben', slug: 'arbeiten', term: 'arbeiten', gloss: 'to work', kind: 'verb', lessons: ['A1.2-L08'] },
  { id: 'v2', toolId: 'verben', route: '/verben', slug: 'sein', term: 'sein', gloss: 'to be', kind: 'verb', lessons: ['A1.2-L08'] },
  { id: 'v3', toolId: 'verben', route: '/verben', slug: 'haben', term: 'haben', gloss: 'to have', kind: 'verb', lessons: ['A1.2-L08'] },
  { id: 'v4', toolId: 'verben', route: '/verben', slug: 'suchen', term: 'suchen', gloss: 'to look for', kind: 'verb', lessons: ['A1.2-L08'] },
  { id: 'p1', toolId: 'praepositionen', route: '/praepositionen', slug: 'vor', term: 'vor', gloss: 'ago', kind: 'preposition', lessons: ['A1.2-L08'] },
]

describe('searchLessons', () => {
  it('returns [] for a non-lesson query', () => {
    expect(searchLessons('schlafen', CATALOG, FIXTURE_LESSONS)).toEqual([])
  })

  it('returns one hit with the lesson and its groups for a lesson query', () => {
    const hits = searchLessons('lektion 8', CATALOG, FIXTURE_LESSONS)
    expect(hits).toHaveLength(1)
    expect(hits[0].lesson.id).toBe('A1.2-L08')
  })

  it('caps each group preview at 3 items but keeps the full count', () => {
    const hits = searchLessons('lektion 8', CATALOG, FIXTURE_LESSONS)
    const verbGroup = hits[0].preview.find((g) => g.label === 'Verben')
    expect(verbGroup?.entries).toHaveLength(3)
    expect(hits[0].totalCount).toBe(5)
  })
})
