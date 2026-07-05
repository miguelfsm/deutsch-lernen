import type { CatalogEntry } from '../../lib/catalog/types'
import { cardSlug } from '../../lib/catalog/slug'
import { categories } from './data'

// Satzbau is a category-cards tool: a card is identified by (categoryId, pattern).
// The `term` is the rule's short label; the demo sentence stays in the data.
export function satzbauCatalog(): CatalogEntry[] {
  return categories.flatMap((c) =>
    c.items.map((item) => {
      const slug = cardSlug(c.id, item.pattern)
      return {
        id: `satzbau:${slug}`,
        toolId: 'satzbau',
        route: '/satzbau',
        slug,
        term: item.pattern,
        gloss: item.meaning,
        category: c.label,
      }
    }),
  )
}
