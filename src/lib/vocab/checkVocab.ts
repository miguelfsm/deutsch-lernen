import type { CatalogEntry } from '../catalog/types'
import type { LessonId } from '../../content/lessons'

// Pure core for the "Lernwortschatz check" workflow (plan §4.3). Matches the
// lines of a transcribed vocab-list photo against the app's catalog, so the CLI
// (scripts/vocab-check.ts) can print a report before anything gets added.
// React-free by design — the CLI is the only current caller, but keeping this
// out of any tool means it stays trivially unit-testable.

/** The word class guessed for a headword the app does not have at all. */
export type GuessedKind = 'noun' | 'verb' | 'phrase' | 'unknown'

/** A headword that matched one or more catalog entries (exactly, or case-folded). */
export interface VocabMatch {
  /** The original line, exactly as it appeared in the source file. */
  line: string
  /**
   * The specific headword this result is about. Equal to `line` (trimmed)
   * unless the line held several forms separated by " / " (e.g. "der Kollege,
   * -n / die Kollegin, -nen"), in which case each form is checked and reported
   * on its own, with `line` kept alongside for context.
   */
  form: string
  entries: CatalogEntry[]
}

/** A headword with no catalog match at all. */
export interface VocabMiss {
  line: string
  form: string
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

/** Valency placeholders the book prints around a verb's government, e.g.
 * "jemandem helfen" or "jemanden fragen" — not part of the headword itself. */
const PLACEHOLDER_WORDS = ['jemandem', 'jemanden', 'jemand', 'etwas']
const LEADING_PLACEHOLDER = new RegExp(`^(?:${PLACEHOLDER_WORDS.join('|')})\\b\\s*`, 'i')
const TRAILING_PLACEHOLDER = new RegExp(`\\s*\\b(?:${PLACEHOLDER_WORDS.join('|')})$`, 'i')

/** Fold ß→ss so Swiss-spelled content and ß-spelled photos compare equal (D1). */
function foldSharpS(s: string): string {
  return s.replace(/ß/g, 'ss')
}

/** Repeatedly strip a trailing parenthesised note, e.g. "(Pl.)", "(+ Dat.)". */
function stripTrailingParens(s: string): string {
  let result = s
  let previous: string
  do {
    previous = result
    result = result.replace(/\s*\([^()]*\)\s*$/, '').trim()
  } while (result !== previous)
  return result
}

/** Strip leading/trailing valency placeholders (not a middle occurrence). */
function stripPlaceholders(s: string): string {
  let result = s
  let changed = true
  while (changed) {
    changed = false
    if (LEADING_PLACEHOLDER.test(result)) {
      result = result.replace(LEADING_PLACEHOLDER, '')
      changed = true
    }
    if (TRAILING_PLACEHOLDER.test(result)) {
      result = result.replace(TRAILING_PLACEHOLDER, '')
      changed = true
    }
  }
  return result.trim()
}

interface ExtractedForm {
  /**
   * Candidate strings to compare against `CatalogEntry.term`. Several optional
   * cleanup steps (trailing-parens stripping, valency-placeholder stripping,
   * the reflexive "sich " prefix) are each tried both applied and un-applied,
   * since the catalog may store the headword either way — e.g. "wie viel(e)"
   * is itself a real catalog term (the parens are part of the word, not a
   * printed note), while "(Pl.)" on another line is a note to strip. Plan
   * review: don't bake in a single stripping/storage convention.
   */
  candidates: string[]
  hasArticle: boolean
  hadSich: boolean
  /** The headword used to guess a word class when nothing matches — parens
   * stripped (a printed note isn't part of the class signal), but NOT
   * placeholder-stripped, so a placeholder phrase like "etwas Wichtiges"
   * still reads as multi-word rather than collapsing to one word. */
  headwordForGuess: string
}

const collapseWhitespace = (s: string): string => s.replace(/\s+/g, ' ').trim()

/** Every distinct way `s` could plausibly be spelled once its trailing-parens
 * note and/or its valency placeholders are optionally removed. */
function candidateVariants(s: string): string[] {
  const plain = collapseWhitespace(s)
  const noParens = collapseWhitespace(stripTrailingParens(plain))
  const noPlaceholders = collapseWhitespace(stripPlaceholders(plain))
  const noParensNoPlaceholders = collapseWhitespace(stripPlaceholders(noParens))
  const variants = [plain, noParens, noPlaceholders, noParensNoPlaceholders]
  // A bound stem printed with a trailing hyphen ("eigen-", "Senioren-") matches
  // the catalog either hyphenated (a stored stem) or bare (the base word).
  const bare = variants
    .filter((v) => v.length > 1 && v.endsWith('-'))
    .map((v) => v.slice(0, -1).trim())
  return [...new Set([...variants, ...bare])]
}

/**
 * Clean one headword ("form") from a Lernwortschatz line: strip a leading
 * article (identifies a noun) and everything after the first comma
 * (plural/extra markers, e.g. "der Arzt, -¨e" → "Arzt"), then strip
 * separable-verb dots/pipes ("an·rufen" / "an|rufen" → "anrufen", always
 * safe — real German orthography never uses these). What's left is expanded
 * into candidate variants (see `candidateVariants`), optionally also without
 * a leading "sich " if the line had one.
 */
function extractForm(rawForm: string): ExtractedForm {
  const trimmed = rawForm.trim()

  const articleMatch = /^(der|die|das)\s+/.exec(trimmed)
  const hasArticle = articleMatch !== null
  let rest = hasArticle ? trimmed.slice(articleMatch![0].length) : trimmed

  const commaIndex = rest.indexOf(',')
  rest = (commaIndex >= 0 ? rest.slice(0, commaIndex) : rest).trim()
  rest = collapseWhitespace(rest.replace(/[·|]/g, ''))

  const sichMatch = /^sich\s+/i.exec(rest)
  const hadSich = sichMatch !== null
  const bare = hadSich ? rest.slice(sichMatch![0].length).trim() : rest

  const candidates = hadSich
    ? [...new Set([...candidateVariants(rest), ...candidateVariants(bare)])]
    : candidateVariants(rest)

  return {
    candidates,
    hasArticle,
    hadSich,
    headwordForGuess: collapseWhitespace(stripTrailingParens(bare)),
  }
}

/** Guess a word class for a headword that matched nothing in the catalog. */
function guessKind(headword: string, hasArticle: boolean, hadSich: boolean): GuessedKind {
  if (hasArticle) return 'noun'
  if (hadSich || /^[a-zäöü].*(en|ern|eln)$/.test(headword)) return 'verb'
  const isMultiWord = headword.split(/\s+/).length > 1
  if (/[?!]$/.test(headword) || isMultiWord) return 'phrase'
  return 'unknown'
}

/**
 * Check one lesson's transcribed vocab lines against the catalog.
 *
 * Matching rules (plan §4.3, refined in review): trim; skip blank lines and
 * `#` comments; split a line on " / " and "; " into separate headwords (each
 * checked on its own, e.g. "der Kollege, -n / die Kollegin, -nen" or
 * "Senioren (Pl.); Senioren-"); a bound stem with a trailing hyphen ("eigen-")
 * matches both the hyphenated and the bare form; strip a leading
 * article; strip plural/extra markers after the first comma; strip
 * separable-verb "·"/"|" (always — never real orthography); fold ß↔ss;
 * compare to `CatalogEntry.term` case-sensitively first (German case is
 * meaning), then case-insensitively as a "maybe". A trailing parenthesised
 * note (e.g. "(Pl.)", "(+ Dat.)"), leading/trailing valency placeholders
 * ("jemandem", "jemanden", "jemand", "etwas"), and a leading reflexive
 * "sich " are each tried BOTH stripped and un-stripped as match candidates —
 * the catalog may store either form (e.g. "wie viel(e)" keeps its parens as
 * part of the word), so nothing here assumes one storage convention. Nouns
 * match on the singular term regardless of category. If several entries
 * match, all are reported.
 */
export function checkVocab(
  lines: string[],
  entries: CatalogEntry[],
  lessonId: LessonId,
): VocabCheckResult {
  const result: VocabCheckResult = { tagged: [], untagged: [], missing: [], maybe: [] }

  for (const rawLine of lines) {
    const trimmedLine = rawLine.trim()
    if (trimmedLine === '' || trimmedLine.startsWith('#')) continue

    const forms = trimmedLine
      .split(' / ')
      .flatMap((f) => f.split('; '))
      .map((f) => f.trim())
      .filter((f) => f !== '')

    for (const form of forms) {
      const { candidates, hasArticle, hadSich, headwordForGuess } = extractForm(form)

      // A catalog entry's `aliases` (e.g. a noun's feminine form) count as
      // extra terms, matched exactly like `term`.
      const termsOf = (e: CatalogEntry): string[] => [e.term, ...(e.aliases ?? [])]

      const exact = entries.filter((e) =>
        termsOf(e).some((t) => candidates.some((c) => foldSharpS(t) === foldSharpS(c))),
      )
      if (exact.length > 0) {
        const bucket = exact.some((e) => e.lessons.includes(lessonId)) ? result.tagged : result.untagged
        bucket.push({ line: rawLine, form, entries: exact })
        continue
      }

      const caseInsensitive = entries.filter((e) =>
        termsOf(e).some((t) =>
          candidates.some((c) => foldSharpS(t).toLowerCase() === foldSharpS(c).toLowerCase()),
        ),
      )
      if (caseInsensitive.length > 0) {
        result.maybe.push({ line: rawLine, form, entries: caseInsensitive })
        continue
      }

      result.missing.push({
        line: rawLine,
        form,
        kind: guessKind(headwordForGuess, hasArticle, hadSich),
      })
    }
  }

  return result
}
