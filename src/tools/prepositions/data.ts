// ─── DATA ────────────────────────────────────────────────────────────────────
// Prepositions, keyed by word — one record per preposition, even when it covers
// several uses (temporal/lokal/modal) and several lessons. See
// plans/LESSONS_PLAN_A1_2.md §3.5.
import type { LessonId } from '../../content/lessons'

// Wechsel = Dativ (Wo?) / Akkusativ (Wohin?). 'ohne' = takes no case at all,
// e.g. "als" (L8: Ich arbeite als Hauswart) — no article, no case change.
export type Case = 'Dativ' | 'Akkusativ' | 'Wechsel' | 'ohne'
export type PrepUse = 'temporal' | 'lokal' | 'modal'

export interface Preposition {
  word: string
  case: Case
  use: PrepUse[]
  question: string
  meaning: string
  /**
   * Contraction forms with a definite article (im, am, zum…). Stored as plain
   * strings, not expansions — the tool shows them as a "also seen as" note next
   * to the article table, which already spells out dem/den/das/die.
   */
  contractions?: string[]
  examples: { de: string; en: string }[]
  note?: string
  lessons: LessonId[]
}

// Content note (Phase 6 handback): the course book's L11 grammar bullet groups
// "an, auf, bei, hinter, in, neben, über, unter, vor, zwischen" together as one
// "lokal (Wo?)" list, but grammatically `bei` is Dativ-only (there is no
// "*bei den Tisch"), so it keeps `case: 'Dativ'` here rather than 'Wechsel'.
// Every other word in that list — an, auf, hinter, in, neben, über, unter, vor,
// zwischen — is genuinely two-way and is `case: 'Wechsel'`; where a word's
// lokal use is Wechsel but it also has a temporal use that is ALWAYS Dativ (an,
// in, vor), that's called out in its own `note`.
export const prepositionData: Preposition[] = [
  {
    word: 'ab',
    case: 'Dativ',
    use: ['temporal'],
    question: 'Ab wann?',
    meaning: 'from / starting at',
    examples: [
      { de: 'Ab Montag arbeite ich wieder.', en: "From Monday I'm working again." },
    ],
    lessons: ['A1.1', 'A1.2-L12'],
  },
  {
    word: 'als',
    case: 'ohne',
    use: ['modal'],
    question: 'Als was?',
    meaning: 'as (a role)',
    examples: [{ de: 'Ich arbeite als Hauswart.', en: 'I work as a caretaker.' }],
    note: 'No article, no case change: the job title stays as it is.',
    lessons: ['A1.2-L08'],
  },
  {
    word: 'an',
    case: 'Wechsel',
    use: ['lokal', 'temporal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ) · Wann?',
    meaning: 'at / on (a vertical surface or a point) · on (a day)',
    contractions: ['am', 'ans'],
    examples: [
      { de: 'Ich wohne an der Bahnhofstrasse.', en: 'I live on Bahnhofstrasse.' },
      { de: 'Am Montag arbeite ich nicht.', en: "I don't work on Mondays." },
    ],
    note: 'Temporal an (a day) is always Dativ: am Montag. Only the lokal use varies with Wo?/Wohin?.',
    lessons: ['A1.1', 'A1.2-L11'],
  },
  {
    word: 'auf',
    case: 'Wechsel',
    use: ['lokal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ)',
    meaning: 'on (a horizontal surface)',
    examples: [{ de: 'Wo ist der Schlüssel? – Auf dem Tisch.', en: "Where's the key? – On the table." }],
    lessons: ['A1.2-L11'],
  },
  {
    word: 'bei',
    case: 'Dativ',
    use: ['lokal', 'temporal'],
    question: 'Wo? · Wann?',
    meaning: 'at / with (a place, company or person)',
    contractions: ['beim'],
    examples: [
      { de: 'Ich arbeite bei «Immowohl».', en: 'I work at Immowohl.' },
      { de: "Beim Essen lese ich nicht.", en: "I don't read while eating." },
    ],
    lessons: ['A1.2-L08', 'A1.2-L11', 'A1.2-L12'],
  },
  {
    word: 'bis',
    case: 'Akkusativ',
    use: ['temporal'],
    question: 'Bis wann?',
    meaning: 'until',
    examples: [
      { de: 'Bis morgen!', en: 'See you tomorrow!' },
      { de: 'Ich arbeite bis Freitag.', en: 'I work until Friday.' },
      { de: 'Bis zum nächsten Mal.', en: 'Until next time.' },
    ],
    note: 'Usually no article: bis Freitag, bis morgen. With an article it joins zu: bis zum Montag.',
    lessons: ['A1.1', 'A1.2-L12'],
  },
  {
    word: 'für',
    case: 'Akkusativ',
    use: ['temporal'],
    question: 'Für wie lange?',
    meaning: 'for (a duration)',
    examples: [{ de: 'Ich suche für einen Monat eine Arbeit.', en: 'I am looking for a job for one month.' }],
    lessons: ['A1.2-L08'],
  },
  {
    word: 'hinter',
    case: 'Wechsel',
    use: ['lokal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ)',
    meaning: 'behind',
    examples: [{ de: 'Das Velo steht hinter dem Haus.', en: 'The bike is behind the house.' }],
    lessons: ['A1.2-L11'],
  },
  {
    word: 'in',
    case: 'Wechsel',
    use: ['lokal', 'temporal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ) · Wann?',
    meaning: 'in / into',
    contractions: ['im', 'ins'],
    examples: [
      { de: 'Ich lebe in Zürich.', en: 'I live in Zurich.' },
      { de: 'Ich wohne im Zentrum.', en: 'I live in the city centre.' },
      { de: 'Ich gehe in den Park.', en: 'I am going into the park.' },
      { de: 'In einer Stunde.', en: 'In an hour.' },
    ],
    note: 'Temporal in (a duration from now) is always Dativ: in einer Stunde. Only the lokal use varies with Wo?/Wohin?.',
    lessons: ['A1.1', 'A1.2-L11', 'A1.2-L12'],
  },
  {
    word: 'mit',
    case: 'Dativ',
    use: ['modal'],
    question: 'Womit? · Mit wem?',
    meaning: 'with / by (means)',
    examples: [{ de: 'Wir fahren mit dem Auto.', en: 'We are going by car.' }],
    lessons: ['A1.2-L11'],
  },
  {
    word: 'nach',
    case: 'Dativ',
    use: ['lokal', 'temporal'],
    question: 'Wohin? · Wann?',
    meaning: 'to / after',
    examples: [
      { de: 'Ich fahre nach Bern.', en: 'I am going to Bern.' },
      { de: 'Nach dem Kurs gehe ich in den Laden.', en: 'After the course I go to the shop.' },
    ],
    lessons: ['A1.2-L11', 'A1.2-L12'],
  },
  {
    word: 'neben',
    case: 'Wechsel',
    use: ['lokal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ)',
    meaning: 'next to',
    examples: [{ de: 'Der Stuhl steht neben dem Tisch.', en: 'The chair is next to the table.' }],
    lessons: ['A1.2-L11'],
  },
  {
    word: 'seit',
    case: 'Dativ',
    use: ['temporal'],
    question: 'Seit wann? · Wie lange?',
    meaning: 'since / for (an ongoing period)',
    examples: [{ de: 'Ich bin seit zwei Jahren selbstständig.', en: 'I have been self-employed for two years.' }],
    lessons: ['A1.2-L08'],
  },
  {
    word: 'über',
    case: 'Wechsel',
    use: ['lokal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ)',
    meaning: 'over / above',
    examples: [{ de: 'Die Lampe hängt über dem Tisch.', en: 'The lamp hangs above the table.' }],
    lessons: ['A1.2-L11'],
  },
  {
    word: 'unter',
    case: 'Wechsel',
    use: ['lokal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ)',
    meaning: 'under',
    examples: [{ de: 'Die Katze schläft unter dem Bett.', en: 'The cat is sleeping under the bed.' }],
    lessons: ['A1.2-L11'],
  },
  {
    word: 'vor',
    case: 'Wechsel',
    use: ['temporal', 'lokal'],
    question: 'Wann? · Wo? (Dativ) · Wohin? (Akkusativ)',
    meaning: 'before / ago · in front of',
    examples: [
      { de: 'Ich habe vor einem Jahr die Ausbildung gemacht.', en: 'I did the training a year ago.' },
      { de: 'Das Auto steht vor dem Haus.', en: 'The car is in front of the house.' },
    ],
    note: "Temporal vor ('ago') is always Dativ: vor einem Jahr. Only the lokal use varies: Wo? vor dem Haus (Dativ) / Wohin? vor das Haus (Akkusativ).",
    lessons: ['A1.2-L08', 'A1.2-L11', 'A1.2-L12'],
  },
  {
    word: 'zu',
    case: 'Dativ',
    use: ['lokal'],
    question: 'Wohin?',
    meaning: 'to (a place or person)',
    contractions: ['zum', 'zur'],
    examples: [
      { de: 'Ich gehe zum Zahnarzt.', en: 'I am going to the dentist.' },
      { de: 'Wie komme ich zum Bahnhof?', en: 'How do I get to the station?' },
    ],
    lessons: ['A1.1', 'A1.2-L11'],
  },
  {
    word: 'zwischen',
    case: 'Wechsel',
    use: ['lokal'],
    question: 'Wo? (Dativ) · Wohin? (Akkusativ)',
    meaning: 'between',
    examples: [{ de: 'Die Post ist zwischen der Bank und dem Kiosk.', en: 'The post office is between the bank and the kiosk.' }],
    lessons: ['A1.2-L11'],
  },
]
