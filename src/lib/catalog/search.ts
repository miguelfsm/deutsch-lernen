import type { CatalogEntry } from './types'

// Pure, flat global search over the catalog. Case-insensitive substring match
// against the German term, the English gloss and any keywords.
//
// Case folding is allowed HERE and ONLY here — a user typing "essen" may
// legitimately want both the verb and the noun, and results stay grouped by tool
// so the distinction is still visible. Identity/linking never fold German case.
//
// Decision: an empty or whitespace-only query returns [] (no dump of the whole
// catalog until the user types at least one non-space character).
export function searchCatalog(
  entries: CatalogEntry[],
  query: string,
): CatalogEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return entries.filter((e) => {
    const haystacks = [e.term, e.gloss, ...(e.keywords ?? [])]
    return haystacks.some((h) => h.toLowerCase().includes(q))
  })
}
