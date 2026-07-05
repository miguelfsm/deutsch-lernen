import type { CatalogEntry } from '../../lib/catalog/types'
import { nounSlug } from '../../lib/catalog/slug'
import { nounData } from './data'

// Pure projection of the noun data into catalog entries. Nouns are identified by
// (singular, category), so the slug encodes the category and the article rides
// along as a search keyword ("das" finds das-nouns).
export function nounsCatalog(): CatalogEntry[] {
  return nounData.map((n) => {
    const slug = nounSlug(n.singular, n.category)
    return {
      id: `nomen:${slug}`,
      toolId: 'nomen',
      route: '/nomen',
      slug,
      term: n.singular,
      gloss: n.english,
      category: n.category,
      keywords: [n.article],
    }
  })
}
