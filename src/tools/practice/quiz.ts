import type { CatalogEntry } from '../../lib/catalog/types'
import { answerText, shuffle, type Direction } from './session'

// Pure multiple-choice option builder for the quiz mode. Given the card to test
// and a pool to draw distractors from, returns a shuffled set of choices with
// exactly one marked correct. React-free and RNG-injected so it is deterministic
// under test; production passes Math.random.

export interface Choice {
  text: string
  correct: boolean
}

export function buildChoices(
  card: CatalogEntry,
  pool: readonly CatalogEntry[],
  direction: Direction,
  rng: () => number = Math.random,
  count = 4,
): Choice[] {
  const correct = answerText(card, direction)

  // Candidate distractors: the answer-side text of every OTHER entry, de-duped and
  // never equal to the correct answer (so a synonym elsewhere can't make two
  // "right" options). Dedupe by text since only the string is shown.
  const seen = new Set<string>([correct])
  const candidates: string[] = []
  for (const e of pool) {
    if (e.id === card.id) continue
    const text = answerText(e, direction)
    if (seen.has(text)) continue
    seen.add(text)
    candidates.push(text)
  }

  const distractors = shuffle(candidates, rng).slice(0, Math.max(0, count - 1))

  const choices: Choice[] = [
    { text: correct, correct: true },
    ...distractors.map((text) => ({ text, correct: false })),
  ]
  return shuffle(choices, rng)
}
