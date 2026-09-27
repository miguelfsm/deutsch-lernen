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
  {
    id: 'A1.2-L08',
    level: 'A1.2',
    number: 8,
    title: 'Beruf und Arbeit',
    folge: 'Total fotogen',
    sections: [
      {
        key: 'A',
        title: 'Ich bin Physiotherapeutin.',
        goals: ['Berufe benennen und erfragen', 'über die berufliche Situation sprechen'],
      },
      {
        key: 'B',
        title: 'Wann hast du die Ausbildung gemacht?',
        goals: [
          'private und berufliche Informationen über Vergangenheit und Gegenwart austauschen',
        ],
      },
      {
        key: 'C',
        title: 'Ich hatte ja noch keine Berufserfahrung.',
        goals: ['von Ereignissen und Aktivitäten in der Vergangenheit berichten'],
      },
      {
        key: 'D',
        title: 'Inserate',
        goals: [
          'Stellenanzeigen verstehen',
          'Telefongespräch: Informationen zu einem Stellenangebot erfragen',
          'ein Stellengesuch schreiben',
        ],
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
    pages: { kb: 10, ab: 96, lws: 178 },
  },
  {
    id: 'A1.2-L09',
    level: 'A1.2',
    number: 9,
    title: 'Ämter',
    folge: 'Komm mit!',
    sections: [
      {
        key: 'A',
        title: 'Sie müssen ein Gesuch ausfüllen.',
        goals: ['Abläufe auf dem Amt und im Alltag erklären'],
      },
      {
        key: 'B',
        title: 'Schau mal!',
        goals: ['Aufforderungen verstehen und Anweisungen geben'],
      },
      {
        key: 'C',
        title: 'Sie dürfen in der Schweiz Auto fahren.',
        goals: ['über Erlaubtes und Verbotenes sprechen'],
      },
      {
        key: 'D',
        title: 'Umzugsmeldung',
        goals: [
          'eine Umzugsmeldung ausfüllen',
          'um Erklärungen und Verständnishilfen bitten',
        ],
      },
      {
        key: 'E',
        title: 'Einreise in die Schweiz',
        goals: ['Abläufe auf dem Amt verstehen'],
      },
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
    pages: { kb: 22, ab: 108, lws: 183 },
  },
  {
    id: 'A1.2-L10',
    level: 'A1.2',
    number: 10,
    title: 'Gesundheit, Krankheit und Unfall',
    folge: 'Unsere Augen sind so blau',
    sections: [
      {
        key: 'A',
        title: 'Ihr Auge tut weh.',
        goals: ['Körperteile benennen', 'über das Befinden sprechen'],
      },
      {
        key: 'B',
        title: 'Unsere Augen sind so blau.',
        goals: ['über das Befinden anderer sprechen'],
      },
      {
        key: 'C',
        title: 'Ich soll Schmerztabletten nehmen.',
        goals: ['Anweisungen und Ratschläge verstehen und geben'],
      },
      {
        key: 'D',
        title: 'Krankmeldung',
        goals: ['sich telefonisch und schriftlich krankmelden'],
      },
      {
        key: 'E',
        title: 'Anruf beim Arzt / Notfall',
        goals: ['einen Termin vereinbaren', 'einen Notfall melden'],
      },
    ],
    wortfelder: ['Körperteile', 'Krankheiten', 'Brief'],
    grammar: ['Possessivartikel dein, sein, ihr, unser…', 'sollen', 'Satzklammer'],
    phonetik: ['Laut h', 'Vokalneueinsatz'],
    pruefung: ['Hören T1'],
    fokus: ['Packungsbeilage', 'Sicherheitsvorschriften'],
    pages: { kb: 34, ab: 119, lws: 187 },
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
        title: 'Fahren Sie dann nach links.',
        goals: ['nach dem Weg fragen und den Weg beschreiben'],
      },
      {
        key: 'B',
        title: 'Wir fahren mit dem Auto.',
        goals: ['Verkehrsmittel benennen'],
      },
      {
        key: 'C',
        title: 'Da! Vor der Brücke links.',
        goals: ['Ortsangaben machen'],
      },
      {
        key: 'D',
        title: 'Wir gehen zu Walter und holen das Auto.',
        goals: ['Orte und Richtungen angeben'],
      },
      {
        key: 'E',
        title: 'Am Bahnhof',
        goals: [
          'Durchsagen verstehen',
          'am Schalter: um Auskunft bitten',
          'Fahrplänen Informationen entnehmen',
        ],
      },
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
    pages: { kb: 46, ab: 131, lws: 190 },
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
        title: 'Gleich nach dem Kurs gehe ich in den Laden.',
        goals: ['Zeitangaben verstehen und machen', 'Tagesabläufe beschreiben'],
      },
      {
        key: 'B',
        title: 'Sie bekommen sie in vier Wochen.',
        goals: ['zeitliche Bezüge nennen', 'um Serviceleistungen bitten'],
      },
      {
        key: 'C',
        title: 'Könnten Sie mir das bitte zeigen?',
        goals: ['höfliche Bitten und Aufforderungen ausdrücken'],
      },
      {
        key: 'D',
        title: 'Telefonbeantworter',
        goals: ['Texte für die Combox verstehen und formulieren'],
      },
      {
        key: 'E',
        title: 'Hilfe im Alltag',
        goals: [
          'Inserate verstehen',
          'eine Gebrauchsanweisung verstehen',
          'Telefongespräch: Kundendienst',
        ],
      },
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
    pages: { kb: 58, ab: 143, lws: 193 },
  },
  {
    id: 'A1.2-L13',
    level: 'A1.2',
    number: 13,
    title: 'Neue Kleider',
    folge: 'Das ist aber kalt heute!',
    sections: [
      {
        key: 'A',
        title: 'Schau mal, Lara, die Jacke da! Die ist super!',
        goals: ['Kleidungsstücke benennen'],
      },
      {
        key: 'B',
        title: 'Die Jacke passt dir perfekt.',
        goals: ['Gefallen/Missfallen ausdrücken'],
      },
      {
        key: 'C',
        title: 'Und hier: Die ist noch besser.',
        goals: ['Vorlieben und Bewertungen ausdrücken'],
      },
      {
        key: 'D',
        title: 'Welche meinst du? – Diese hier.',
        goals: ['Vorlieben erfragen', 'eine Auswahl treffen'],
      },
      {
        key: 'E',
        title: 'Im Warenhaus',
        goals: ['um Hilfe/Rat bitten'],
      },
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
    pages: { kb: 70, ab: 155, lws: 196 },
  },
  {
    id: 'A1.2-L14',
    level: 'A1.2',
    number: 14,
    title: 'Feste',
    folge: 'Ende gut, alles gut',
    sections: [
      {
        key: 'A',
        title: 'Am fünfzehnten Januar fange ich an.',
        goals: ['das Datum erfragen und nennen', 'über Feste und Feiertage sprechen'],
      },
      {
        key: 'B',
        title: 'Ich habe dich sehr gern, Grosspapi!',
        goals: ['über Personen und Dinge sprechen', 'um Hilfe bitten'],
      },
      {
        key: 'C',
        title: 'Wir feiern Abschied, denn …',
        goals: ['Gründe angeben', 'einen Termin absagen und zusagen'],
      },
      {
        key: 'D',
        title: 'Einladungen',
        goals: ['Einladungen verstehen und schreiben'],
      },
      {
        key: 'E',
        title: 'Feste und Glückwünsche',
        goals: ['Feste nennen', 'Texte über Feste verstehen', 'Glückwünsche formulieren'],
      },
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
    pages: { kb: 82, ab: 168, lws: 200 },
  },
]
