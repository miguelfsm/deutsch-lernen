import type { CatalogEntry, EntryKind } from '../../lib/catalog/types'
import { cardSlug } from '../../lib/catalog/slug'
import { categories } from './data'

// Phrases mixes several word classes under one tool (plan §3.3): adverbs and
// prepositions/strategies live here by category id rather than in their own
// tool. Map each category id to the kind a lesson page should group it under.
function kindForCategory(categoryId: string): EntryKind {
  switch (categoryId) {
    case 'adverbien':
      return 'adverb'
    case 'strategien':
      return 'strategy'
    case 'praep':
      return 'preposition'
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
