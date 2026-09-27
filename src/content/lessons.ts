// ─── LESSON REGISTRY ────────────────────────────────────────────────────────
// The one list of lessons. Pure data + types, no React. See
// plans/LESSONS_PLAN_A1_2.md §3.1 for the design and Appendix A for the A1.2
// source material (Kursbuch + Arbeitsbuch TOC).
//
// Adding a lesson = one registry entry below + one new `LessonId` union member.

/** A course book / level. Extend this union when a new book starts. */
export type Level = 'A1.1' | 'A1.2' | 'A2.1'

// Book numbering restarts per volume in some series, so the id is level-scoped
// rather than a bare lesson number (decision D2/D3, plan §3.1).
export type LessonId =
  | 'A1.1'
  | 'A1.2-L08'
  | 'A1.2-L09'
  | 'A1.2-L10'
  | 'A1.2-L11'
  | 'A1.2-L12'
  | 'A1.2-L13'
  | 'A1.2-L14'

/** One column A–E of the Kursbuch's lesson table. */
export interface LessonSection {
  key: 'A' | 'B' | 'C' | 'D' | 'E'
  title: string
  goals: string[]
}

export interface Lesson {
  id: LessonId
  level: Level
  /** Lesson number within the level, e.g. 8. Absent for the 'A1.1' bucket. */
  number?: number
  title: string
  /** The Kursbuch episode/story title, e.g. "Total fotogen". */
  folge?: string
  sections: LessonSection[]
  wortfelder: string[]
  /** Grammatik bullets, as printed in the Kursbuch's lesson table. */
  grammar: string[]
  /** Arbeitsbuch Phonetik topics. */
  phonetik?: string[]
  /** Arbeitsbuch Prüfung (exam-skill practice) topics. */
  pruefung?: string[]
  /** Arbeitsbuch Fokus (extra task) topics. */
  fokus?: string[]
  pages?: { kb?: number; ab?: number; lws?: number }
}

export const lessons: Lesson[] = [
  // A level-wide pseudo-lesson: every item that predates lesson tagging (all of
  // A1.1) is tagged with this bucket (decision D3). Precise L1–7 tags can come
  // later by retagging only — no data shape change needed.
  {
    id: 'A1.1',
    level: 'A1.1',
    title: 'A1.1 (untagged backlog)',
    sections: [],
    wortfelder: [],
    grammar: [],
  },

  // ── A1.2 — Lektionen 8–14, from the Kursbuch + Arbeitsbuch TOC ────────────
  // Section titles below mirror the TOC's short goal phrases (Appendix A did
  // not include the book's quoted section titles, e.g. "Ich bin
  // Physiotherapeutin."); the real quoted titles can be filled in during the
  // per-lesson intake (plan §5, Phase 8+) once the Kursbuch pages are
  // transcribed. See the Phase 1 handback for this judgement call.
  {
    id: 'A1.2-L08',
    level: 'A1.2',
    number: 8,
    title: 'Beruf und Arbeit',
    folge: 'Total fotogen',
    sections: [
      { key: 'A', title: 'Berufe benennen', goals: ['Berufe benennen'] },
      {
        key: 'B',
        title: 'über Vergangenheit/Gegenwart austauschen',
        goals: ['über Vergangenheit/Gegenwart austauschen'],
      },
      {
        key: 'C',
        title: 'von Ereignissen in der Vergangenheit berichten',
        goals: ['von Ereignissen in der Vergangenheit berichten'],
      },
      {
        key: 'D',
        title: 'Stelleninserate, Stellengesuch',
        goals: ['Stelleninserate', 'Stellengesuch'],
      },
    ],
    wortfelder: ['Berufe', 'Arbeit'],
    grammar: [
      'Wortbildung Nomen (-in)',
      'bei (lokal)',
      'als (modal)',
      'vor, seit + Dat, für + Akk',
      'Präteritum sein, haben',
    ],
    phonetik: ['e/ä, -e/-er'],
    pruefung: ['Sprechen T2'],
    fokus: ['Inserat schreiben', 'Aufgabenverteilung fragen'],
    pages: { lws: 178 },
  },
  {
    id: 'A1.2-L09',
    level: 'A1.2',
    number: 9,
    title: 'Ämter',
    folge: 'Komm mit!',
    sections: [
      { key: 'A', title: 'Abläufe erklären', goals: ['Abläufe erklären'] },
      { key: 'B', title: 'Aufforderungen', goals: ['Aufforderungen'] },
      { key: 'C', title: 'Erlaubtes/Verbotenes', goals: ['Erlaubtes/Verbotenes'] },
      { key: 'D', title: 'Umzugsmeldung', goals: ['Umzugsmeldung'] },
      { key: 'E', title: 'Einreise in die Schweiz', goals: ['Einreise in die Schweiz'] },
    ],
    wortfelder: ['Amt', 'Regeln Verkehr/Umwelt', 'Umzugsmeldung'],
    grammar: [
      'Modalverben müssen, dürfen',
      'Satzklammer',
      'man',
      'Imperativ (Warten Sie bitte!)',
      'helfen',
    ],
    phonetik: ['Satzakzent Modalverben', 'Satzmelodie Frage/Aufforderung'],
    pruefung: ['Schreiben T1'],
    fokus: ['Genossenschaftswohnungen', 'Arbeitsplan absprechen'],
    pages: { lws: 183 },
  },
  {
    id: 'A1.2-L10',
    level: 'A1.2',
    number: 10,
    title: 'Gesundheit, Krankheit und Unfall',
    folge: 'Unsere Augen sind so blau',
    sections: [
      { key: 'A', title: 'Körperteile, Befinden', goals: ['Körperteile', 'Befinden'] },
      { key: 'B', title: 'Befinden anderer', goals: ['Befinden anderer'] },
      {
        key: 'C',
        title: 'Anweisungen/Ratschläge',
        goals: ['Anweisungen/Ratschläge'],
      },
      { key: 'D', title: 'Krankmeldung', goals: ['Krankmeldung'] },
      { key: 'E', title: 'Arzt/Notfall', goals: ['Arzt/Notfall'] },
    ],
    wortfelder: ['Körperteile', 'Krankheiten', 'Brief'],
    grammar: ['Possessivartikel dein, sein, ihr, unser…', 'sollen', 'Satzklammer'],
    phonetik: ['Laut h', 'Vokalneueinsatz'],
    pruefung: ['Hören T1'],
    fokus: ['Packungsbeilage', 'Sicherheitsvorschriften'],
    pages: { lws: 187 },
  },
  {
    id: 'A1.2-L11',
    level: 'A1.2',
    number: 11,
    title: 'In der Stadt unterwegs',
    folge: 'Alles im grünen Bereich',
    sections: [
      {
        key: 'A',
        title: 'Weg fragen/beschreiben',
        goals: ['Weg fragen/beschreiben'],
      },
      { key: 'B', title: 'Verkehrsmittel', goals: ['Verkehrsmittel'] },
      { key: 'C', title: 'Ortsangaben', goals: ['Ortsangaben'] },
      { key: 'D', title: 'Orte & Richtungen', goals: ['Orte & Richtungen'] },
      { key: 'E', title: 'Am Bahnhof', goals: ['Am Bahnhof'] },
    ],
    wortfelder: ['Einrichtungen in der Stadt', 'Verkehrsmittel'],
    grammar: [
      'mit + Dat',
      'lokal an, auf, bei, hinter, in, neben, über, unter, vor, zwischen (Wo?)',
      'zu, nach, in (Wohin?)',
    ],
    phonetik: ['Laut z'],
    pruefung: ['Hören T2'],
    fokus: ['Kinderbetreuung finden', 'Termin bei einer Firma'],
    pages: { lws: 190 },
  },
  {
    id: 'A1.2-L12',
    level: 'A1.2',
    number: 12,
    title: 'Kundenservice',
    folge: 'Super Service!',
    sections: [
      {
        key: 'A',
        title: 'Zeitangaben, Tagesabläufe',
        goals: ['Zeitangaben', 'Tagesabläufe'],
      },
      { key: 'B', title: 'zeitliche Bezüge', goals: ['zeitliche Bezüge'] },
      { key: 'C', title: 'höfliche Bitten', goals: ['höfliche Bitten'] },
      { key: 'D', title: 'Telefonbeantworter', goals: ['Telefonbeantworter'] },
      { key: 'E', title: 'Hilfe im Alltag', goals: ['Hilfe im Alltag'] },
    ],
    wortfelder: ['Kundenservice', 'Telekommunikation'],
    grammar: [
      'temporal vor, nach, bei, in, bis, ab',
      'Konjunktiv II würde, könnte',
      'Satzklammer',
      'Präfixverben auf-/zumachen, ein-/ausschalten',
    ],
    phonetik: ['Satzakzent', 'Laut ng'],
    pruefung: ['Hören T3', 'Sprechen T3'],
    fokus: ['Angebote verstehen', 'Auf der Bank'],
    pages: { lws: 193 },
  },
  {
    id: 'A1.2-L13',
    level: 'A1.2',
    number: 13,
    title: 'Neue Kleider',
    folge: 'Das ist aber kalt heute!',
    sections: [
      { key: 'A', title: 'Kleidungsstücke', goals: ['Kleidungsstücke'] },
      { key: 'B', title: 'Gefallen/Missfallen', goals: ['Gefallen/Missfallen'] },
      {
        key: 'C',
        title: 'Vorlieben, Bewertungen',
        goals: ['Vorlieben', 'Bewertungen'],
      },
      { key: 'D', title: 'Auswahl treffen', goals: ['Auswahl treffen'] },
      { key: 'E', title: 'Im Warenhaus', goals: ['Im Warenhaus'] },
    ],
    wortfelder: ['Kleider & Gegenstände', 'Landschaften'],
    grammar: [
      'Demonstrativ der, das, die',
      'welch-',
      'Personalpronomen Dativ',
      'Verben mit Dativ gefallen, gehören, passen',
      'Komparation gut, gern, viel',
      'mögen',
    ],
    phonetik: ['Bindung'],
    pruefung: ['Lesen T3'],
    fokus: ['Rabatt aushandeln', 'Schutzkleidung'],
    pages: { lws: 196 },
  },
  {
    id: 'A1.2-L14',
    level: 'A1.2',
    number: 14,
    title: 'Feste',
    folge: 'Ende gut, alles gut',
    sections: [
      { key: 'A', title: 'Datum, Feste', goals: ['Datum', 'Feste'] },
      {
        key: 'B',
        title: 'über Personen sprechen, um Hilfe bitten',
        goals: ['über Personen sprechen', 'um Hilfe bitten'],
      },
      {
        key: 'C',
        title: 'Gründe, Termine absagen/zusagen',
        goals: ['Gründe', 'Termine absagen/zusagen'],
      },
      { key: 'D', title: 'Einladungen', goals: ['Einladungen'] },
      { key: 'E', title: 'Glückwünsche', goals: ['Glückwünsche'] },
    ],
    wortfelder: ['Monate', 'Feste', 'Glückwünsche'],
    grammar: [
      'Ordinalzahlen',
      'Personalpronomen Akkusativ',
      'Konjunktion denn',
      'werden',
    ],
    phonetik: ['Satzmelodie Satzverbindungen'],
    pruefung: ['Lesen T2'],
    fokus: ['Veranstaltungshinweise', 'Um Hilfe bitten'],
    pages: { lws: 200 },
  },
]
