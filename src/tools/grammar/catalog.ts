import type { CatalogEntry } from '../../lib/catalog/types'
import { slugify } from '../../lib/catalog/slug'
import { grammarTopics } from './data'

// Grammar topics are unique by their own `id` (already a short kebab-case
// string), so the slugified id is the catalog slug — same idea as
// prepositionsCatalog.
export function grammarCatalog(): CatalogEntry[] {
  return grammarTopics.map((g) => {
    const slug = slugify(g.id)
    return {
      id: `grammatik:${slug}`,
      toolId: 'grammatik',
      route: '/grammatik',
      slug,
      term: g.title,
      gloss: g.summary,
      keywords: g.ugRef ? [g.ugRef] : [],
      kind: 'grammar',
      lessons: g.lessons,
    }
  })
}
