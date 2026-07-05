import { describe, it, expect } from 'vitest'
import type { CatalogEntry } from './types'
import { searchCatalog } from './search'

// Fixture so the search behaviour is tested independently of live content.
const entries: CatalogEntry[] = [
  { id: 'verben:schlafen', toolId: 'verben', route: '/verben', slug: 'schlafen', term: 'schlafen', gloss: 'to sleep' },
  { id: 'verben:essen', toolId: 'verben', route: '/verben', slug: 'essen', term: 'essen', gloss: 'to eat' },
  { id: 'nomen:lebensmittel/essen', toolId: 'nomen', route: '/nomen', slug: 'lebensmittel/essen', term: 'Essen', gloss: 'food', category: 'Lebensmittel', keywords: ['das'] },
  { id: 'nomen:familie/bild', toolId: 'nomen', route: '/nomen', slug: 'familie/bild', term: 'Bild', gloss: 'picture', category: 'Familie', keywords: ['das'] },
]

describe('searchCatalog', () => {
  it('matches on the German term', () => {
    expect(searchCatalog(entries, 'schlaf').map((e) => e.id)).toEqual(['verben:schlafen'])
  })

  it('matches on the English gloss', () => {
    expect(searchCatalog(entries, 'sleep').map((e) => e.id)).toEqual(['verben:schlafen'])
  })

  it('matches on a keyword (article)', () => {
    const ids = searchCatalog(entries, 'das').map((e) => e.id)
    expect(ids).toContain('nomen:lebensmittel/essen')
    expect(ids).toContain('nomen:familie/bild')
  })

  it('returns [] when nothing matches', () => {
    expect(searchCatalog(entries, 'zzz')).toEqual([])
  })

  it('is case-insensitive and surfaces both the verb and noun for "essen"', () => {
    const ids = searchCatalog(entries, 'ESSEN').map((e) => e.id)
    expect(ids).toContain('verben:essen')
    expect(ids).toContain('nomen:lebensmittel/essen')
  })

  it('returns [] for an empty or whitespace-only query', () => {
    expect(searchCatalog(entries, '')).toEqual([])
    expect(searchCatalog(entries, '   ')).toEqual([])
  })

  it('searches a brand-new tool with no changes to search (open/closed)', () => {
    // A hypothetical future tool contributes an entry; search finds it purely by
    // consuming the CatalogEntry shape — no search-file edit was needed.
    const withNewTool: CatalogEntry[] = [
      ...entries,
      { id: 'praeposition:lokal/auf', toolId: 'praeposition', route: '/praepositionen', slug: 'lokal/auf', term: 'auf', gloss: 'on' },
    ]
    expect(searchCatalog(withNewTool, 'auf').map((e) => e.toolId)).toEqual(['praeposition'])
  })
})
