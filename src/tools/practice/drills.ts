import type { Article, Noun } from '../nouns/data'
import type { CatalogEntry } from '../../lib/catalog/types'
import { verbData, type Verb } from '../verbs/data'
import { IMPERATIV_PRONOUNS, perfektForms, type Tense } from '../verbs/tenses'

// Pure, React-free checkers for the two targeted drills (article & conjugation).
// They own only the "is this answer right?" knowledge — the round loop, deck and
// persistence are the shared Practice shell (session.ts + lib/progress). Kept pure
// so the CONTENT under test (correct gender / conjugated form) is what the tests
// pin down, not any framework wiring.

// A noun's gender is a one-line equality; it earns a test because the fact being
// asserted is the stored article, not the `===`.
export function checkArticle(noun: Noun, guess: Article): boolean {
  return noun.article === guess
}

export interface ConjugationResult {
  correct: boolean
  expected: string
}

// The form a pronoun takes in a given tense. Perfekt has no stored per-pronoun
// table — it's the aux form + partizip, joined ("bist gefahren"), from the
// same `perfektForms` the UI renders.
function expectedForm(verb: Verb, pronoun: string, tense: Tense): string {
  if (tense === 'perfekt') {
    const f = perfektForms(verb).find((f) => f.pronoun === pronoun)
    return f ? `${f.auxForm} ${f.partizip}` : ''
  }
  if (tense === 'imperativ') {
    return verb.imperativ?.[pronoun as (typeof IMPERATIV_PRONOUNS)[number]] ?? ''
  }
  const table = tense === 'praeteritum' ? verb.praeteritum : verb.conjugations
  return table.find((c) => c.pronoun === pronoun)?.form ?? ''
}

// Fold case and collapse whitespace before comparing typed input to the stored
// form, so "  Bin " counts as "bin" and "Bist Gefahren" counts as "bist gefahren".
// If the pronoun isn't in the table the answer can't be right (expected stays
// empty) — a guard, not an expected input. Defaults to Präsens so existing
// callers (and their tests) are unaffected.
export function checkConjugation(
  verb: Verb,
  pronoun: string,
  input: string,
  tense: Tense = 'praesens',
): ConjugationResult {
  const expected = expectedForm(verb, pronoun, tense)
  // An imperative is usually written with "!" — accept it with or without.
  const typed = tense === 'imperativ' ? input.replace(/\s*!+\s*$/, '') : input
  return {
    correct: expected !== '' && normalise(typed) === normalise(expected),
    expected,
  }
}

function normalise(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toLowerCase()
}

// Imperativ can only be drilled on verbs that have one. Given a deck, a start
// index and the tense, return the first index >= from whose card is drillable
// in that tense (cards.length if none remain). The deck itself is never changed,
// and skipped cards are not rated. Other tenses drill every verb.
export function nextDrillable(
  cards: readonly CatalogEntry[],
  from: number,
  tense: Tense,
): number {
  if (tense !== 'imperativ') return from
  let i = from
  while (i < cards.length && !verbData.find((v) => v.infinitive === cards[i].term)?.imperativ) i++
  return i
}
