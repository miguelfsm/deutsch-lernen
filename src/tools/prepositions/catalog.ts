import type { CatalogEntry } from '../../lib/catalog/types'
import { slugify } from '../../lib/catalog/slug'
import { prepositionData } from './data'

// Prepositions are unique by word, so the folded word itself is the slug — the
// same idea as verbSlug, just spelled out here since a preposition's identity
// has no second field (unlike a noun's singular+category).
export function prepositionsCatalog(): CatalogEntry[] {
  return prepositionData.map((p) => {
    const slug = slugify(p.word)
    return {
      id: `praepositionen:${slug}`,
      toolId: 'praepositionen',
      route: '/praepositionen',
      slug,
      term: p.word,
      gloss: p.meaning,
      // Case and use ride along as search keywords so "Dativ" or "lokal" surfaces
      // the matching prepositions from global search.
      keywords: [p.case, ...p.use],
      kind: 'preposition',
      lessons: p.lessons,
    }
  })
}
