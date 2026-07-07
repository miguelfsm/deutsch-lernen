import type { Article, Noun } from '../nouns/data'
import type { Verb } from '../verbs/data'

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

// Fold case and collapse whitespace before comparing typed input to the stored
// form, so "  Bin " counts as "bin". If the pronoun isn't in the table the answer
// can't be right (expected stays empty) — a guard, not an expected input.
export function checkConjugation(
  verb: Verb,
  pronoun: string,
  input: string,
): ConjugationResult {
  const expected = verb.conjugations.find((c) => c.pronoun === pronoun)?.form ?? ''
  return {
    correct: expected !== '' && normalise(input) === normalise(expected),
    expected,
  }
}

function normalise(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toLowerCase()
}
