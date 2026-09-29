import type { CatalogEntry } from './types'

// Pure, flat global search over the catalog. Case-insensitive substring match
// against the German term, the English gloss and any keywords.
//
// Case folding is allowed HERE and ONLY here — a user typing "essen" may
// legitimately want both the verb and the noun, and results stay grouped by tool
// so the distinction is still visible. Identity/linking never fold German case.
//
// Content is Swiss-spelled (no ß, see plan D1), but a query may still use ß —
// pasted text, muscle memory, an old bookmark. Folding ß→ss on BOTH the query and
// the haystacks makes "groß", "gross" and "GROSS" all match, without touching
// identity/linking, which never folds spelling.
function foldSs(s: string): string {
  return s.toLowerCase().replace(/ß/g, 'ss')
}

// Decision: an empty or whitespace-only query returns [] (no dump of the whole
// catalog until the user types at least one non-space character).
export function searchCatalog(
  entries: CatalogEntry[],
  query: string,
): CatalogEntry[] {
  const q = foldSs(query.trim())
  if (!q) return []
  return entries.filter((e) => {
    const haystacks = [e.term, e.gloss, ...(e.keywords ?? []), ...(e.aliases ?? [])]
    return haystacks.some((h) => foldSs(h).includes(q))
  })
}
