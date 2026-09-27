import type { Article, Noun } from '../nouns/data'
import type { Verb } from '../verbs/data'
import { perfektForms, type Tense } from '../verbs/tenses'

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
  return {
    correct: expected !== '' && normalise(input) === normalise(expected),
    expected,
  }
}

function normalise(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toLowerCase()
}
