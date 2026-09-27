import { describe, it, expect } from 'vitest'
import { entriesForLesson } from './entriesForLesson'
import type { CatalogEntry } from '../catalog/types'

function entry(over: Partial<CatalogEntry> & Pick<CatalogEntry, 'id' | 'kind' | 'lessons'>): CatalogEntry {
  return {
    toolId: over.toolId ?? 'verben',
    route: over.route ?? '/verben',
    slug: over.slug ?? over.id,
    term: over.term ?? over.id,
    gloss: over.gloss ?? 'gloss',
    ...over,
  }
}

const CATALOG: CatalogEntry[] = [
  entry({ id: 'v1', kind: 'verb', lessons: ['A1.2-L08'] }),
  entry({ id: 'v2', kind: 'verb', lessons: ['A1.1'] }),
  entry({ id: 'n1', kind: 'noun', lessons: ['A1.2-L08'] }),
  entry({ id: 'a1', kind: 'adjective', lessons: ['A1.2-L08'] }),
  entry({ id: 'p1', kind: 'preposition', lessons: ['A1.2-L08'] }),
  entry({ id: 'ph1', kind: 'phrase', lessons: ['A1.2-L08'] }),
  entry({ id: 's1', kind: 'strategy', lessons: ['A1.2-L08'] }),
  entry({ id: 'g1', kind: 'grammar', lessons: ['A1.2-L08'] }),
]

describe('entriesForLesson', () => {
  it('keeps only entries tagged with the given lesson', () => {
    const groups = entriesForLesson(CATALOG, 'A1.2-L08')
    const allIds = groups.flatMap((g) => g.entries.map((e) => e.id))
    expect(allIds).not.toContain('v2')
  })

  it('groups in the fixed display order, skipping empty groups', () => {
    const groups = entriesForLesson(CATALOG, 'A1.2-L08')
    expect(groups.map((g) => g.label)).toEqual([
      'Verben',
      'Nomen',
      'Adjektive',
      'Präpositionen',
      'Redemittel/Strategien',
    ])
  })

  it('merges phrase and strategy kinds into one Redemittel/Strategien group', () => {
    const groups = entriesForLesson(CATALOG, 'A1.2-L08')
    const redemittel = groups.find((g) => g.label === 'Redemittel/Strategien')
    expect(redemittel?.entries.map((e) => e.id).sort()).toEqual(['ph1', 's1'])
  })

  it('renders nothing for the grammar kind (reserved for Phase 7)', () => {
    const groups = entriesForLesson(CATALOG, 'A1.2-L08')
    expect(groups.some((g) => g.entries.some((e) => e.kind === 'grammar'))).toBe(false)
  })

  it('returns [] for a lesson with no tagged entries', () => {
    expect(entriesForLesson(CATALOG, 'A1.2-L14')).toEqual([])
  })
})
