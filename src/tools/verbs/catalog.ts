import type { CatalogEntry } from '../../lib/catalog/types'
import { verbSlug } from '../../lib/catalog/slug'
import { verbData } from './data'

// Pure projection of the verb data into catalog entries. Search/practice/linking
// import THIS, never data.ts. Verbs are unique by infinitive.
export function verbsCatalog(): CatalogEntry[] {
  return verbData.map((v) => {
    const slug = verbSlug(v.infinitive)
    return {
      id: `verben:${slug}`,
      toolId: 'verben',
      route: '/verben',
      slug,
      term: v.infinitive,
      gloss: v.english,
    }
  })
}
