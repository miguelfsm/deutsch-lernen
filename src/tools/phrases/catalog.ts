import type { CatalogEntry } from '../../lib/catalog/types'
import { cardSlug } from '../../lib/catalog/slug'
import { categories } from './data'

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
      }
    }),
  )
}
