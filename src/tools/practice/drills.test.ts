import { describe, it, expect, afterEach } from 'vitest'
import type { Noun } from '../nouns/data'
import type { Verb } from '../verbs/data'
import { checkArticle, checkConjugation } from './drills'

// PR-4 established that jsdom keeps localStorage across tests; clear it so no drill
// test can leak progress into another (these checkers don't touch storage, but the
// teardown is the file-wide convention for the practice suite).
afterEach(() => localStorage.clear())

const kind: Noun = {
  singular: 'Kind',
  english: 'child',
  article: 'das',
  plural: 'Kinder',
  category: 'Familie',
  example: 'Das Kind spielt.',
  translation: 'The child is playing.',
  note: '',
  lessons: ['A1.1'],
}

// A verb with a genuine stem change (schlafen: a → ä in du/er), so normalisation
// is tested against a form that isn't just the infinitive stem + ending.
const schlafen: Verb = {
  infinitive: 'schlafen',
  english: 'to sleep',
  type: 'irregular',
  note: '',
  example: 'Ich schlafe gut.',
  translation: 'I sleep well.',
  lessons: ['A1.1'],
  conjugations: [
    { pronoun: 'ich', form: 'schlafe', stemChange: false },
    { pronoun: 'du', form: 'schläfst', stemChange: true },
    { pronoun: 'er/sie/es', form: 'schläft', stemChange: true },
    { pronoun: 'wir', form: 'schlafen', stemChange: false },
    { pronoun: 'ihr', form: 'schlaft', stemChange: false },
    { pronoun: 'sie/Sie', form: 'schlafen', stemChange: false },
  ],
  praeteritum: [
    { pronoun: 'ich', form: 'schlief', stemChange: true },
    { pronoun: 'du', form: 'schliefst', stemChange: true },
    { pronoun: 'er/sie/es', form: 'schlief', stemChange: true },
    { pronoun: 'wir', form: 'schliefen', stemChange: true },
    { pronoun: 'ihr', form: 'schlieft', stemChange: true },
    { pronoun: 'sie/Sie', form: 'schliefen', stemChange: true },
  ],
  perfekt: { auxiliary: 'haben', partizip: 'geschlafen' },
}

// A sein-verb, for a Perfekt drill case (full-form answers like "bist gefahren").
const fahren: Verb = {
  infinitive: 'fahren',
  english: 'to drive / to go',
  type: 'irregular',
  note: '',
  example: 'Ich fahre mit dem Bus.',
  translation: 'I go by bus.',
  lessons: ['A1.1'],
  conjugations: [
    { pronoun: 'ich', form: 'fahre', stemChange: false },
    { pronoun: 'du', form: 'fährst', stemChange: true },
    { pronoun: 'er/sie/es', form: 'fährt', stemChange: true },
    { pronoun: 'wir', form: 'fahren', stemChange: false },
    { pronoun: 'ihr', form: 'fahrt', stemChange: false },
    { pronoun: 'sie/Sie', form: 'fahren', stemChange: false },
  ],
  praeteritum: [
    { pronoun: 'ich', form: 'fuhr', stemChange: true },
    { pronoun: 'du', form: 'fuhrst', stemChange: true },
    { pronoun: 'er/sie/es', form: 'fuhr', stemChange: true },
    { pronoun: 'wir', form: 'fuhren', stemChange: true },
    { pronoun: 'ihr', form: 'fuhrt', stemChange: true },
    { pronoun: 'sie/Sie', form: 'fuhren', stemChange: true },
  ],
  perfekt: { auxiliary: 'sein', partizip: 'gefahren' },
}

describe('checkArticle', () => {
  it('accepts the correct gender', () => {
    expect(checkArticle(kind, 'das')).toBe(true)
  })

  it('rejects a wrong gender', () => {
    expect(checkArticle(kind, 'der')).toBe(false)
    expect(checkArticle(kind, 'die')).toBe(false)
  })
})

describe('checkConjugation', () => {
  it('accepts an exact match and returns the expected form', () => {
    const r = checkConjugation(schlafen, 'ich', 'schlafe')
    expect(r).toEqual({ correct: true, expected: 'schlafe' })
  })

  it('rejects a wrong form but still returns what was expected', () => {
    const r = checkConjugation(schlafen, 'du', 'schlafst')
    expect(r).toEqual({ correct: false, expected: 'schläfst' })
  })

  it('is case- and whitespace-insensitive', () => {
    expect(checkConjugation(schlafen, 'ich', '  Schlafe ').correct).toBe(true)
    expect(checkConjugation(schlafen, 'du', 'SCHLÄFST').correct).toBe(true)
  })

  it('matches a stem-changing form when typed correctly', () => {
    expect(checkConjugation(schlafen, 'er/sie/es', 'schläft')).toEqual({
      correct: true,
      expected: 'schläft',
    })
  })

  it('defaults to Präsens when no tense is given', () => {
    expect(checkConjugation(schlafen, 'ich', 'schlafe').expected).toBe('schlafe')
  })

  it('checks Präteritum against the stored praeteritum table', () => {
    expect(checkConjugation(schlafen, 'du', 'schliefst', 'praeteritum')).toEqual({
      correct: true,
      expected: 'schliefst',
    })
    expect(checkConjugation(schlafen, 'du', 'schläfst', 'praeteritum').correct).toBe(false)
  })

  it('checks Perfekt against the full derived form (aux + partizip)', () => {
    // haben-verb
    expect(checkConjugation(schlafen, 'ich', 'habe geschlafen', 'perfekt')).toEqual({
      correct: true,
      expected: 'habe geschlafen',
    })
    // sein-verb, whitespace/case-normalised
    expect(checkConjugation(fahren, 'du', '  Bist Gefahren ', 'perfekt')).toEqual({
      correct: true,
      expected: 'bist gefahren',
    })
    expect(checkConjugation(fahren, 'du', 'hast gefahren', 'perfekt').correct).toBe(false)
  })
})
