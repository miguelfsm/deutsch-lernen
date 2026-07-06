import { catalog } from './index'
import type { CatalogEntry } from './types'

// Pure lookups + reference scanning over the catalog. This is the resolver behind
// deep-select (`?sel=`) and cross-linking (Feature D).
//
// Spike outcome (recorded in docs/SOLUTION_DESIGN.md): a light-normalisation
// auto-scan reaches high RECALL on inflected forms (lernst→lernen, kommt→kommen),
// but a naive scan also emits two error classes — function-word chip-spam and,
// worse, cross-POS homograph links (the noun "Essen" → the verb "essen") that are
// exactly the identity collision the catalog forbids case-folding to prevent.
// `linksForText` therefore implements the agreed DISCIPLINED auto-scan: only verb
// and noun headwords are link targets, gated by part-of-speech-aware casing.

// ── Exact lookups (no case-folding on the German side: essen ≠ Essen) ──────────

/** Exact slug lookup. Slugs are already URL-safe; identity is an exact match. */
export function findEntryBySlug(
  slug: string,
  entries: CatalogEntry[] = catalog,
): CatalogEntry | undefined {
  return entries.find((e) => e.slug === slug)
}

/**
 * Resolve a noun's full identity from (singular, category) — the noun view keys
 * selection on both. The German side is compared case-sensitively so `essen`
 * (verb) and `Essen` (noun) can never collapse into one another.
 */
export function findNoun(
  singular: string,
  category: string,
  entries: CatalogEntry[] = catalog,
): CatalogEntry | undefined {
  return entries.find(
    (e) => e.toolId === 'nomen' && e.term === singular && e.category === category,
  )
}

// ── Disciplined auto-scan (linksForText) ───────────────────────────────────────

/** Lowercase + transliterate umlauts/ß so inflected forms compare on equal terms. */
function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
}

/** German nouns are always capitalised; used as the part-of-speech gate. */
function isCapitalised(token: string): boolean {
  return /^[A-ZÄÖÜ]/.test(token)
}

function tokenize(text: string): string[] {
  return text.split(/[\s.,!?;:„“"»«()–—/]+/).filter((t) => t.length >= 2)
}

// A verb's stem: the folded infinitive minus its -en/-n ending. Inflected A1 forms
// are the stem plus one of these endings. The empty ending is deliberately EXCLUDED
// so a bare adjective/noun that equals a verb stem (heiß→heißen, Essen→essen when
// lower-cased) cannot masquerade as a conjugated verb — an inflectional ending must
// actually be present.
const VERB_ENDINGS = ['e', 'st', 't', 'en', 'et', 'te', 'test', 'tet', 'ten']

function verbStem(infinitive: string): string {
  const f = fold(infinitive)
  if (f.endsWith('en')) return f.slice(0, -2)
  if (f.endsWith('n')) return f.slice(0, -1)
  return f
}

function tokenMatchesVerb(token: string, infinitive: string): boolean {
  // POS gate: a verb only matches a LOWERCASE surface token. This is what keeps
  // the capitalised noun "Essen"/"Antwort"/"Frage" from linking to the verb.
  if (isCapitalised(token)) return false
  const stem = verbStem(infinitive)
  if (stem.length < 2) return false
  const t = fold(token)
  if (!t.startsWith(stem)) return false
  return VERB_ENDINGS.includes(t.slice(stem.length))
}

// Nouns match a CAPITALISED token by exact fold, or a tight plural fold (singular
// plus a short plural marker). Kept deliberately narrow — broad plural folding
// starts matching unrelated nouns (Reise→Reis).
const PLURAL_ENDINGS = ['e', 'en', 'er', 'n', 's']

function tokenMatchesNoun(token: string, singular: string): boolean {
  if (!isCapitalised(token)) return false
  const t = fold(token)
  const s = fold(singular)
  if (t === s) return true
  if (s.length >= 3 && t.startsWith(s) && PLURAL_ENDINGS.includes(t.slice(s.length)))
    return true
  return false
}

/**
 * Scan an example sentence and return the verb/noun catalog entries it references,
 * for rendering cross-link chips. Only verbs and nouns are link targets; phrases,
 * adjectives and satzbau patterns are not (they produced chip-spam / rule-label
 * non-matches in the spike). Results are de-duplicated and returned in catalog
 * order. An entry the sentence is its OWN card for is NOT filtered here — call
 * sites pass their own slug to strip the self-reference.
 */
export function linksForText(
  text: string,
  entries: CatalogEntry[] = catalog,
): CatalogEntry[] {
  const tokens = tokenize(text)
  const seen = new Set<string>()
  const out: CatalogEntry[] = []
  for (const e of entries) {
    let hit = false
    if (e.toolId === 'verben') hit = tokens.some((t) => tokenMatchesVerb(t, e.term))
    else if (e.toolId === 'nomen') hit = tokens.some((t) => tokenMatchesNoun(t, e.term))
    if (hit && !seen.has(e.id)) {
      seen.add(e.id)
      out.push(e)
    }
  }
  return out
}

/** Chip target for a card, minus a self-reference back to the card's own item. */
export function linksForCard(
  text: string,
  selfSlug: string,
  selfToolId: string,
  entries: CatalogEntry[] = catalog,
): CatalogEntry[] {
  return linksForText(text, entries).filter(
    (e) => !(e.toolId === selfToolId && e.slug === selfSlug),
  )
}
