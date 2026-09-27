// "Welcher Fall?" drill data + pure checker. Kept co-located with the
// preposition tool (not in practice/drills.ts) because the content — the drill
// sentences themselves — is preposition-specific, the same way verb/noun data
// stays in each tool's own data.ts; practice/drills.ts holds the generic,
// content-free checkers shared across drills. See Phase 6 handback for this
// call.
//
// Coverage: one item per Dativ/Akkusativ preposition that has a clear,
// distinguishing article (plan §5 Phase 6). Wechsel and 'ohne' prepositions are
// deliberately NOT covered — a single blank can't show a Wo?/Wohin? contrast,
// and "als" (ohne) takes no article at all to quiz.
export interface FallDrillItem {
  /** The preposition this item drills — must match a Preposition.word. */
  word: string
  /** The sentence with a '___' placeholder for the blank. */
  sentence: string
  /** Exactly four article choices; one of them equals `answer`. */
  options: string[]
  answer: string
  /** Feedback shown after answering, e.g. "seit + Dativ · das Jahr → einem Jahr". */
  why: string
}

export const fallDrillData: FallDrillItem[] = [
  {
    word: 'seit',
    sentence: 'Ich wohne seit ___ Jahr in Zürich.',
    options: ['einem', 'einen', 'ein', 'einer'],
    answer: 'einem',
    why: 'seit + Dativ · das Jahr → einem Jahr',
  },
  {
    word: 'für',
    sentence: 'Ich suche für ___ Monat eine Wohnung.',
    options: ['einem', 'einen', 'ein', 'einer'],
    answer: 'einen',
    why: 'für + Akkusativ · der Monat → einen Monat',
  },
  {
    word: 'vor',
    sentence: 'Sie hat vor ___ Woche angefangen.',
    options: ['einem', 'eine', 'einer', 'einen'],
    answer: 'einer',
    why: 'vor + Dativ · die Woche → einer Woche',
  },
  {
    word: 'bei',
    sentence: 'Ich arbeite bei ___ Firma in Bern.',
    options: ['einer', 'einem', 'eine', 'einen'],
    answer: 'einer',
    why: 'bei + Dativ · die Firma → einer Firma',
  },
  {
    word: 'mit',
    sentence: 'Ich fahre mit ___ Velo zur Arbeit.',
    options: ['einem', 'einen', 'eine', 'einer'],
    answer: 'einem',
    why: 'mit + Dativ · das Velo → einem Velo',
  },
  {
    word: 'nach',
    sentence: 'Nach ___ Kurs gehe ich nach Hause.',
    options: ['einem', 'einen', 'eine', 'einer'],
    answer: 'einem',
    why: 'nach + Dativ · der Kurs → einem Kurs',
  },
  {
    word: 'ab',
    sentence: 'Ab ___ Woche arbeite ich Teilzeit.',
    options: ['einer', 'einem', 'eine', 'einen'],
    answer: 'einer',
    why: 'ab + Dativ · die Woche → einer Woche',
  },
  {
    word: 'zu',
    sentence: 'Ich gehe zu ___ Arzt.',
    options: ['einem', 'einen', 'eine', 'einer'],
    answer: 'einem',
    why: 'zu + Dativ · der Arzt → einem Arzt',
  },
  {
    word: 'bis',
    sentence: 'Ich bleibe bis ___ Monat hier.',
    options: ['einen', 'einem', 'eine', 'einer'],
    answer: 'einen',
    why: 'bis + Akkusativ · der Monat → einen Monat',
  },
]

/** The drill item for a given preposition word, if it has one (see coverage note). */
export function fallDrillFor(word: string): FallDrillItem | undefined {
  return fallDrillData.find((d) => d.word === word)
}

/** Pure equality check — the content (which article is right) is what's tested. */
export function checkFallDrill(item: FallDrillItem, guess: string): boolean {
  return guess === item.answer
}
