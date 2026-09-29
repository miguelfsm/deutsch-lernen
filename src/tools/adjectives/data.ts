// ─── DATA ────────────────────────────────────────────────────────────────────
// Adjectives don't conjugate or decline the way verbs/nouns do (at A1, anyway),
// so the useful structure here is: meaning + opposite (when one exists) +
// an example sentence. Grouped by category, same pattern as german-phrases.jsx.

import type { LessonId } from '../../content/lessons'

export interface AdjectiveItem {
  word: string
  meaning: string
  opposite?: { word: string; meaning: string }
  example: string
  translation: string
  note?: string
  // Lessons this item belongs to. Every existing item predates lesson tagging,
  // so all are backfilled to the A1.1 bucket (decision D3).
  lessons: LessonId[]
}

export interface AdjectiveCategory {
  id: string
  label: string
  color: { bg: string; fg: string; dot: string }
  items: AdjectiveItem[]
}

export const categories: AdjectiveCategory[] = [
  {
    id: "gegensaetze",
    label: "Gegensätze",
    color: { bg: "#cffafe", fg: "#155e75", dot: "#06b6d4" },
    items: [
      {
        word: "schnell", meaning: "fast / quick",
        opposite: { word: "langsam", meaning: "slow" },
        example: "Das Auto ist sehr schnell.", translation: "The car is very fast.",
        lessons: ["A1.1"],
      },
      {
        word: "kalt", meaning: "cold",
        opposite: { word: "warm", meaning: "warm" },
        example: "Im Winter ist es kalt.", translation: "In winter it's cold.",
        lessons: ["A1.1"],
      },
      {
        word: "neu", meaning: "new",
        opposite: { word: "alt", meaning: "old" },
        example: "Mein Haus ist alt und gross.", translation: "My house is old and big.",
        lessons: ["A1.1"],
      },
      {
        word: "billig", meaning: "cheap",
        opposite: { word: "teuer", meaning: "expensive" },
        example: "Hmm. Schön und teuer.", translation: "Hmm. Pretty and expensive.",
        lessons: ["A1.1"],
      },
      {
        word: "gross", meaning: "big / tall",
        opposite: { word: "klein", meaning: "small" },
        example: "Es ist gross und hell.", translation: "It's big and bright.",
        lessons: ["A1.1"],
      },
      {
        word: "breit", meaning: "wide",
        opposite: { word: "schmal", meaning: "narrow" },
        example: "Mein Haus ist sehr schmal.", translation: "My house is very narrow.",
        lessons: ["A1.1"],
      },
      {
        word: "schön", meaning: "beautiful / nice",
        opposite: { word: "hässlich", meaning: "ugly" },
        example: "Es ist breit und schön.", translation: "It's wide and beautiful.",
        lessons: ["A1.1"],
      },
      {
        word: "hell", meaning: "bright / light",
        opposite: { word: "dunkel", meaning: "dark" },
        example: "Es ist klein und auch dunkel.", translation: "It's small and also dark.",
        note: "Asked as a yes/no question: Ist es hell? — Nein, es ist dunkel.",
        lessons: ["A1.1"],
      },
      {
        word: "gut", meaning: "good",
        opposite: { word: "schlecht", meaning: "bad" },
        example: "Das Essen ist sehr gut.", translation: "The food is very good.",
        note: "The most basic adjective of all. Irregular comparison: gut → besser → am besten.",
        lessons: ["A1.1"],
      },
      {
        word: "richtig", meaning: "right / correct",
        opposite: { word: "falsch", meaning: "wrong / false" },
        example: "Die Antwort ist richtig.", translation: "The answer is correct.",
        note: "Pairs with the exercise prompt 'Richtig oder falsch?' (true or false?).",
        lessons: ["A1.1"],
      },
      {
        word: "lang", meaning: "long",
        opposite: { word: "kurz", meaning: "short" },
        example: "Der Film ist sehr lang.", translation: "The film is very long.",
        note: "Of time or length. Umlaut in comparison: lang → länger.",
        lessons: ["A1.1"],
      },
      {
        word: "früh", meaning: "early",
        opposite: { word: "spät", meaning: "late" },
        example: "Am Morgen stehe ich früh auf.", translation: "In the morning I get up early.",
        note: "Useful with clock time: Es ist noch früh. / Es ist schon spät.",
        lessons: ["A1.1"],
      },
      {
        word: "leicht", meaning: "easy / light",
        opposite: { word: "schwer", meaning: "hard / heavy" },
        example: "Die Aufgabe ist leicht.", translation: "The exercise is easy.",
        note: "Both pairs share the words: leicht/schwer also mean light/heavy (weight): Die Tasche ist schwer.",
        lessons: ["A1.1"],
      },
    ],
  },
  {
    id: "allgemein",
    label: "Allgemein",
    color: { bg: "#fef9c3", fg: "#854d0e", dot: "#eab308" },
    items: [
      {
        word: "erlaubt", meaning: "allowed / permitted",
        opposite: { word: "verboten", meaning: "forbidden" },
        example: "Hier ist Rauchen nicht erlaubt.", translation: "Smoking isn't allowed here.",
        note: "erlaubt/verboten is a very common A1 pair — usually seen with sein: Das ist erlaubt. / Das ist verboten.",
        lessons: ["A1.1"],
      },
      {
        word: "gesamt", meaning: "total / entire",
        example: "Die gesamte Wohnung kostet 1200 Franken.", translation: "The whole apartment costs 1200 francs.",
        note: "Often used attributively before a noun (die gesamte Wohnung) rather than alone — declension comes later.",
        lessons: ["A1.1"],
      },
      {
        word: "komisch", meaning: "funny / strange",
        opposite: { word: "normal", meaning: "normal" },
        example: "Das ist komisch.", translation: "That's funny / strange.",
        note: "Carries both senses — 'amusing' and 'odd/weird' — context decides which. For 'funny ha-ha' you can also say lustig.",
        lessons: ["A1.1"],
      },
      {
        word: "gleich", meaning: "same / equal",
        opposite: { word: "verschieden", meaning: "different" },
        example: "Wir haben die gleiche Tasche.", translation: "We have the same bag.",
        note: "As an adverb gleich also means 'in a moment / shortly': Ich komme gleich. With clock time, es ist gleich zehn = 'it's almost ten.'",
        lessons: ["A1.1"],
      },
      {
        word: "wichtig", meaning: "important",
        opposite: { word: "unwichtig", meaning: "unimportant" },
        example: "Das ist sehr wichtig.", translation: "That's very important.",
        note: "The un- prefix flips many adjectives: wichtig → unwichtig, freundlich → unfreundlich.",
        lessons: ["A1.1"],
      },
    ],
  },
  {
    id: "beruf",
    label: "Beruf & Arbeit",
    color: { bg: "#ffedd5", fg: "#9a3412", dot: "#f97316" },
    items: [
      {
        word: "eigen-", meaning: "own (bound stem)",
        example: "Sofia hat eine eigene Praxis.", translation: "Sofia has her own practice.",
        note: "Bound stem: eigen- is never used without an ending (eine eigene Praxis, mein eigener Chef, ein eigenes Zimmer), so it is stored with a hyphen. Adjective.",
        lessons: ["A1.2-L08"],
      },
      {
        word: "beruflich", meaning: "professional / job-related",
        opposite: { word: "privat", meaning: "private" },
        example: "Was machen Sie beruflich?", translation: "What do you do for a living?",
        note: "Adjective/adverb from der Beruf. Was machen Sie beruflich? = What is your job? Opposite: privat (Berufliches und Privates).",
        lessons: ["A1.2-L08"],
      },
      {
        word: "selbstständig", meaning: "self-employed",
        opposite: { word: "angestellt", meaning: "employed (by a company)" },
        example: "Ich bin seit zwei Jahren selbstständig.", translation: "I have been self-employed for two years.",
        note: "Adjective, used with sein. Also spelled selbständig. Also means 'independent'. Ich bin angestellt / selbstständig answers Was sind Sie von Beruf?",
        lessons: ["A1.2-L08"],
      },
      {
        word: "berufstätig", meaning: "working / employed",
        opposite: { word: "arbeitslos", meaning: "unemployed" },
        example: "Ich bin nicht berufstätig.", translation: "I am not working.",
        note: "Adjective, used with sein: Ich bin berufstätig. Means having a job (also used for parents: Sie ist berufstätig).",
        lessons: ["A1.2-L08"],
      },
      {
        word: "arbeitslos", meaning: "unemployed",
        opposite: { word: "berufstätig", meaning: "working / employed" },
        example: "Ich bin arbeitslos.", translation: "I am unemployed.",
        note: "Adjective: Arbeit + -los (without). The suffix -los means 'without': arbeitslos, kinderlos, sorglos. Noun: der / die Arbeitslose.",
        lessons: ["A1.2-L08"],
      },
      {
        word: "geehrt", meaning: "honoured / dear (in a formal letter)",
        example: "Sehr geehrter Herr Winter, ...", translation: "Dear Mr Winter, ...",
        note: "Only in the formal letter greeting: Sehr geehrter Herr ... (to a man), Sehr geehrte Frau ... (to a woman), Sehr geehrte Damen und Herren. It takes an adjective ending (-er / -e).",
        lessons: ["A1.2-L08"],
      },
      {
        word: "ander-", meaning: "other / different (bound stem)",
        example: "Es gibt das eine oder andere Problem.", translation: "There is the odd problem.",
        note: "Bound stem: ander- always has an ending (ein anderer Job, eine andere Stelle, andere Leute), so it is stored with a hyphen. das eine oder andere = one thing or another.",
        lessons: ["A1.2-L08"],
      },
      {
        word: "befristet", meaning: "limited in time / fixed-term",
        opposite: { word: "unbefristet", meaning: "permanent / open-ended" },
        example: "Die Stelle ist befristet.", translation: "The job is fixed-term.",
        note: "Adjective for contracts and jobs: eine befristete Stelle / ein befristeter Vertrag. Often: befristet für ein Jahr. Opposite: unbefristet.",
        lessons: ["A1.2-L08"],
      },
      {
        word: "dringend", meaning: "urgent / urgently",
        example: "Dringend gesucht: Aushilfen.", translation: "Urgently wanted: temporary staff.",
        note: "Works as an adjective (ein dringendes Problem) and as an adverb (Wir suchen dringend …). In ads: Dringend gesucht!",
        lessons: ["A1.2-L08"],
      },
      {
        word: "frei", meaning: "free / vacant / available",
        opposite: { word: "besetzt", meaning: "taken / occupied" },
        example: "Ist die Stelle noch frei?", translation: "Is the job still available?",
        note: "Adjective, used with sein. Ist die Stelle noch frei? = Is the position still open? Other uses: Der Platz ist frei (the seat is free), Ich habe morgen frei (I have the day off).",
        lessons: ["A1.2-L08"],
      },
    ],
  },
];
