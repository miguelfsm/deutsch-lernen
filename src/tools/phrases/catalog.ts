import type { CatalogEntry, EntryKind } from '../../lib/catalog/types'
import { cardSlug } from '../../lib/catalog/slug'
import { categories } from './data'

// Phrases mixes several word classes under one tool (plan §3.3): adverbs and
// strategies live here by category id rather than in their own tool.
// (Prepositions used to as well — category `praep` — but moved out to their
// own tool in Phase 6, since they carry a case/use the Phrases card shape has
// no room for.) Map each category id to the kind a lesson page should group it
// under.
function kindForCategory(categoryId: string): EntryKind {
  switch (categoryId) {
    case 'adverbien':
      return 'adverb'
    case 'strategien':
      return 'strategy'
    default:
      return 'phrase'
  }
}

// Phrases are a category-cards tool: a card is identified by (categoryId, phrase).
export function phrasesCatalog(): CatalogEntry[] {
  return categories.flatMap((c) =>
    c.items.map((item) => {
      const slug = cardSlug(c.id, item.phrase)
      return {
        id: `redemittel:${slug}`,
        toolId: 'redemittel',
        route: '/redemittel',
        slug,
        term: item.phrase,
        gloss: item.meaning,
        category: c.label,
        kind: kindForCategory(c.id),
        lessons: item.lessons,
      }
    }),
  )
}
