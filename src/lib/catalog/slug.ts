// Slug generation shared by the catalog adapters (which build `?sel=` targets)
// and the tools' deep-select wiring (which reads them back). Keeping this in one
// place is the whole reason a rendered link and its tool agree on the selector.
//
// A slug is deliberately NOT the display term: it is lowercased, umlaut-folded and
// stripped to `[a-z0-9-]` so it is unambiguous and URL-safe. German case (which
// distinguishes essen/Essen) lives in CatalogEntry.term, never here.

/** Lowercase, transliterate umlauts/ß, and reduce to a URL-safe `[a-z0-9-]` slug. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Verbs are unique by infinitive, so the infinitive alone identifies them. */
export function verbSlug(infinitive: string): string {
  return slugify(infinitive)
}

/**
 * Nouns are identified by (singular, category), so the slug encodes BOTH — this
 * is what keeps it unique even if a singular ever recurs across categories, and
 * what the noun view resolves back to. Category segment first: `familie/bild`.
 */
export function nounSlug(singular: string, category: string): string {
  return `${slugify(category)}/${slugify(singular)}`
}

/**
 * Category-cards tools (adjectives, phrases, satzbau) list every item in a
 * category at once, so a card is identified by (categoryId, term). Same
 * two-segment shape as nouns so deep-select can reselect the right category.
 */
export function cardSlug(categoryId: string, term: string): string {
  return `${slugify(categoryId)}/${slugify(term)}`
}
