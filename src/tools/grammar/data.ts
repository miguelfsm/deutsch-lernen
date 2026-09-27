// ─── DATA ────────────────────────────────────────────────────────────────────
// Grammar topics, one per "Grammatik und Kommunikation" summary in the course
// book. A small block model (table / rule / examples) renders every topic —
// see plans/LESSONS_PLAN_A1_2.md §3.6 and Appendix B for the L8 content.
import type { LessonId } from '../../content/lessons'

/**
 * One row of a grammar table. `question` is optional and, when present, is
 * rendered as its own spanning row above `cells` — the book's "Wann? / Seit
 * wann?" question-row layout (the mock's "qtable" shape, e.g. vor/seit and
 * für). A plain table (no row asks a question, e.g. the Wortbildung or
 * Präteritum tables) simply omits it on every row. This is deliberately an
 * optional field on `table`'s existing rows rather than a fourth block type:
 * plan §3.6/§7 says add a 4th type only when a real page needs a genuinely
 * different shape, and a per-row question label is the only difference here —
 * the head/cell rendering is identical.
 */
export interface GrammarTableRow {
  question?: string
  cells: string[]
}

export type GrammarBlock =
  | { type: 'table'; caption?: string; head: string[]; rows: GrammarTableRow[] }
  | { type: 'examples'; items: { de: string; en: string }[] }
  | { type: 'rule'; text: string }

export interface GrammarTopic {
  id: string
  title: string
  /** The book's own grammar reference, e.g. "UG 6.01". */
  ugRef?: string
  /** One-line English summary shown under the title. */
  summary: string
  blocks: GrammarBlock[]
  /**
   * Catalog entry ids (`CatalogEntry.id`, e.g. "praepositionen:seit") this
   * topic is "Verwandt" (related) to — the words that carry the grammar point.
   * Where the grammar point IS a word (vor + Dativ), the preposition/verb item
   * is the source of truth and this only references it — no copy.
   */
  related?: string[]
  lessons: LessonId[]
}

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'wortbildung',
    title: 'Nomen: Wortbildung',
    ugRef: 'UG 11.01',
    summary: 'Most job titles: add -in for the female form (plural -innen). A few change more.',
    blocks: [
      { type: 'rule', text: 'Most jobs: add -in for the female form. Plural: -innen.' },
      {
        type: 'table',
        head: ['♂ der', '♀ die (-in)'],
        rows: [
          { cells: ['der Mechatroniker', 'die Mechatronikerin'] },
          { cells: ['der Arzt', 'die Ärztin'] },
          { cells: ['⚠ der Hausmann', 'die Hausfrau'] },
          { cells: ['⚠ der Pflegefachmann', 'die Pflegefachfrau'] },
        ],
      },
      {
        type: 'examples',
        items: [
          { de: 'Er ist Arzt von Beruf.', en: 'He is a doctor.' },
          { de: 'Sie ist Ärztin von Beruf.', en: 'She is a doctor.' },
        ],
      },
    ],
    // No Arzt/Ärztin/Hauswart noun exists in nouns/data.ts yet — leave related
    // empty rather than inventing catalog entries (Phase 7 scope note).
    related: [],
    lessons: ['A1.2-L08'],
  },
  {
    id: 'bei-als',
    title: 'bei (lokal) · als (modal)',
    ugRef: 'UG 6.03',
    summary: 'als names the job itself (no article); bei names the company or person you work for.',
    blocks: [
      {
        type: 'table',
        head: ['Wo arbeiten Sie?', ''],
        rows: [
          { cells: ['Ich arbeite', 'als Hauswart.'] },
          { cells: ['Ich arbeite', 'bei «Immowohl».'] },
        ],
      },
      { type: 'rule', text: 'als + job (no article) · bei + company / person.' },
    ],
    related: ['praepositionen:bei', 'praepositionen:als'],
    lessons: ['A1.2-L08'],
  },
  {
    id: 'vor-seit',
    title: 'vor, seit + Dativ',
    ugRef: 'UG 6.01',
    summary: 'vor = a point in the past (ago). seit = started in the past and still true now.',
    blocks: [
      {
        type: 'table',
        head: ['', 'm', 'n', 'f', 'Pl', ''],
        rows: [
          {
            question: 'Wann?',
            cells: ['Ich habe vor', 'einem Monat', 'einem Jahr', 'einer Woche', 'zwei Monaten', 'die Ausbildung gemacht.'],
          },
          {
            question: 'Seit wann? / Wie lange?',
            cells: ['Ich bin seit', 'einem Monat', 'einem Jahr', 'einer Woche', 'zwei Jahren', 'selbstständig.'],
          },
        ],
      },
      {
        type: 'rule',
        text: 'vor = a point in the past (ago). seit = started in the past and still true. Plural dative adds -n: Jahren, Monaten.',
      },
    ],
    related: ['praepositionen:vor', 'praepositionen:seit'],
    lessons: ['A1.2-L08'],
  },
  {
    id: 'fuer',
    title: 'für + Akkusativ',
    ugRef: 'UG 6.01',
    summary: 'für states a planned or intended duration.',
    blocks: [
      {
        type: 'table',
        head: ['', 'm', 'n', 'f', 'Pl', ''],
        rows: [
          {
            question: 'Für wie lange?',
            cells: ['Ich suche für', 'einen Monat', 'ein Jahr', 'eine Woche', 'zwei Wochen', 'eine Arbeit.'],
          },
        ],
      },
      {
        type: 'examples',
        items: [{ de: 'Ich möchte gern für ein Jahr in Italien sein.', en: 'I would like to be in Italy for a year.' }],
      },
    ],
    related: ['praepositionen:fuer'],
    lessons: ['A1.2-L08'],
  },
  {
    id: 'praeteritum-sein-haben',
    title: 'Präteritum: sein und haben',
    ugRef: 'UG 5.06',
    summary: 'The simple past of sein and haben — used for narrating the past, even in speech.',
    blocks: [
      {
        type: 'table',
        head: ['', 'sein', 'haben'],
        rows: [
          { cells: ['ich', 'war', 'hatte'] },
          { cells: ['du', 'warst', 'hattest'] },
          { cells: ['er/sie/es', 'war', 'hatte'] },
          { cells: ['wir', 'waren', 'hatten'] },
          { cells: ['ihr', 'wart', 'hattet'] },
          { cells: ['sie/Sie', 'waren', 'hatten'] },
        ],
      },
      {
        type: 'examples',
        items: [
          { de: 'Früher war ich Koch. Heute bin ich Hauswart.', en: 'I used to be a cook. Today I am a caretaker.' },
          { de: 'Früher hatte ich kein Auto.', en: 'I used to have no car.' },
        ],
      },
    ],
    related: ['verben:sein', 'verben:haben'],
    lessons: ['A1.2-L08'],
  },
]
