import type { CatalogEntry } from '../catalog/types'
import type { LessonId } from '../../content/lessons'

// Pure core for the "Lernwortschatz check" workflow (plan §4.3). Matches the
// lines of a transcribed vocab-list photo against the app's catalog, so the CLI
// (scripts/vocab-check.ts) can print a report before anything gets added.
// React-free by design — the CLI is the only current caller, but keeping this
// out of any tool means it stays trivially unit-testable.

/** The word class guessed for a line the app does not have at all. */
export type GuessedKind = 'noun' | 'verb' | 'phrase' | 'unknown'

/** A line that matched one or more catalog entries (exactly, or case-folded). */
export interface VocabMatch {
  /** The original line, exactly as it appeared in the source file. */
  line: string
  entries: CatalogEntry[]
}

/** A line with no catalog match at all. */
export interface VocabMiss {
  line: string
  kind: GuessedKind
}

export interface VocabCheckResult {
  /** In the app, already tagged with this lesson. */
  tagged: VocabMatch[]
  /** In the app, but none of the matching entries carry this lesson's tag. */
  untagged: VocabMatch[]
  /** Not in the app at all. */
  missing: VocabMiss[]
  /** Only a case-insensitive match exists (e.g. "essen" vs "Essen") — needs a human look. */
  maybe: VocabMatch[]
}

/** Fold ß→ss so Swiss-spelled content and ß-spelled photos compare equal (D1). */
function foldSharpS(s: string): string {
  return s.replace(/ß/g, 'ss')
}

/**
 * Strip the parts of a printed Lernwortschatz line that are not the headword:
 * a leading article (identifies a noun), everything after the first comma
 * (plural/extra markers, e.g. "der Arzt, -¨e" → "Arzt"), and a leading
 * reflexive "sich " (e.g. "sich bewerben" → "bewerben").
 */
function extractHeadword(trimmed: string): {
  headword: string
  hasArticle: boolean
  hadSich: boolean
} {
  const articleMatch = /^(der|die|das)\s+/.exec(trimmed)
  const hasArticle = articleMatch !== null
  const afterArticle = hasArticle ? trimmed.slice(articleMatch![0].length) : trimmed

  const commaIndex = afterArticle.indexOf(',')
  const beforeComma = (commaIndex >= 0 ? afterArticle.slice(0, commaIndex) : afterArticle).trim()

  const sichMatch = /^sich\s+/.exec(beforeComma)
  const hadSich = sichMatch !== null
  const headword = hadSich ? beforeComma.slice(sichMatch![0].length).trim() : beforeComma

  return { headword, hasArticle, hadSich }
}

/** Guess a word class for a line that matched nothing in the catalog. */
function guessKind(
  trimmedLine: string,
  headword: string,
  hasArticle: boolean,
  hadSich: boolean,
): GuessedKind {
  if (hasArticle) return 'noun'
  if (hadSich || /^[a-zäöü].*(en|ern|eln)$/.test(headword)) return 'verb'
  const isMultiWord = trimmedLine.split(/\s+/).length > 1
  if (/[?!]$/.test(trimmedLine) || isMultiWord) return 'phrase'
  return 'unknown'
}

/**
 * Check one lesson's transcribed vocab lines against the catalog.
 *
 * Matching rules (plan §4.3): trim; skip blank lines and `#` comments; strip a
 * leading article; strip plural/extra markers after the first comma; strip a
 * leading reflexive "sich "; fold ß↔ss; compare to `CatalogEntry.term`
 * case-sensitively first (German case is meaning), then case-insensitively as a
 * "maybe". Nouns match on the singular term regardless of category. If several
 * entries match, all are reported.
 */
export function checkVocab(
  lines: string[],
  entries: CatalogEntry[],
  lessonId: LessonId,
): VocabCheckResult {
  const result: VocabCheckResult = { tagged: [], untagged: [], missing: [], maybe: [] }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue

    const { headword, hasArticle, hadSich } = extractHeadword(trimmed)
    const folded = foldSharpS(headword)

    const exact = entries.filter((e) => foldSharpS(e.term) === folded)
    if (exact.length > 0) {
      const target = exact.some((e) => e.lessons.includes(lessonId)) ? result.tagged : result.untagged
      target.push({ line: rawLine, entries: exact })
      continue
    }

    const foldedLower = folded.toLowerCase()
    const caseInsensitive = entries.filter((e) => foldSharpS(e.term).toLowerCase() === foldedLower)
    if (caseInsensitive.length > 0) {
      result.maybe.push({ line: rawLine, entries: caseInsensitive })
      continue
    }

    result.missing.push({ line: rawLine, kind: guessKind(trimmed, headword, hasArticle, hadSich) })
  }

  return result
}
