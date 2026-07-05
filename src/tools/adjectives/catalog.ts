import type { CatalogEntry } from '../../lib/catalog/types'
import { cardSlug } from '../../lib/catalog/slug'
import { categories } from './data'

// Adjectives are a category-cards tool: a card is identified by (categoryId,
// word). The opposite (when present) rides along as a search keyword.
export function adjectivesCatalog(): CatalogEntry[] {
  return categories.flatMap((c) =>
    c.items.map((item) => {
      const slug = cardSlug(c.id, item.word)
      return {
        id: `adjektive:${slug}`,
        toolId: 'adjektive',
        route: '/adjektive',
        slug,
        term: item.word,
        gloss: item.meaning,
        category: c.label,
        keywords: item.opposite ? [item.opposite.word] : undefined,
      }
    }),
  )
}
