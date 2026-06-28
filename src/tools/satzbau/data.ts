// ─── DATA ────────────────────────────────────────────────────────────────────
// Sentence-level patterns (Satzbau) rather than single words: the verb-second
// rule, separable verbs inside a sentence, and question patterns. Same
// category → cards shape as phrases/adjectives, so it reuses CategoryCardsTool.
// Here the headword (`pattern`) is a short label for the rule; `example` is the
// German sentence that demonstrates it.

export interface SatzbauItem {
  pattern: string
  meaning: string
  example: string
  translation: string
  note?: string
}

export interface SatzbauCategory {
  id: string
  label: string
  color: { bg: string; fg: string; dot: string }
  items: SatzbauItem[]
}

export const categories: SatzbauCategory[] = [
  {
    id: "verbposition",
    label: "Verbposition",
    color: { bg: "#dbeafe", fg: "#1e40af", dot: "#3b82f6" },
    items: [
      {
        pattern: "Verb an Position 2",
        meaning: "verb is always 2nd",
        example: "Robert macht am Nachmittag Sport.",
        translation: "Robert does sport in the afternoon.",
        note: "In a German statement the conjugated verb is always the second element — no matter what comes first.",
      },
      {
        pattern: "Zeit zuerst → Subjekt nach dem Verb",
        meaning: "front the time phrase",
        example: "Am Nachmittag macht Robert Sport.",
        translation: "In the afternoon Robert does sport.",
        note: "Start with a time or place phrase and the verb still stays 2nd, so the subject moves to right after it. Same meaning as 'Robert macht am Nachmittag Sport.'",
      },
      {
        pattern: "Am Mittag isst er mit Nina",
        meaning: "time + V2 in action",
        example: "Am Mittag isst er mit Nina.",
        translation: "At noon he eats with Nina.",
        note: "Fronted 'am Mittag' → verb 'isst' in position 2 → subject 'er' right after it. (essen → er isst.)",
      },
    ],
  },
  {
    id: "trennbar",
    label: "Trennbare Verben",
    color: { bg: "#ede9fe", fg: "#5b21b6", dot: "#8b5cf6" },
    items: [
      {
        pattern: "Vorsilbe ans Satzende",
        meaning: "separable prefix goes last",
        example: "Am Donnerstag ruft Tim Mama und Papa an.",
        translation: "On Thursday Tim calls Mom and Dad.",
        note: "anrufen → ruft … an. The conjugated part stays in position 2; the prefix lands at the very end of the sentence.",
      },
      {
        pattern: "aufräumen im Satz",
        meaning: "to tidy up",
        example: "Tim räumt sein Zimmer auf.",
        translation: "Tim tidies up his room.",
        note: "aufräumen → räumt … auf. (Corrected from the class note 'ruft … auf', which mixed up aufrufen and aufräumen.)",
      },
      {
        pattern: "gehen + Infinitiv",
        meaning: "go and do something",
        example: "Er geht spazieren.",
        translation: "He goes for a walk.",
        note: "gehen + an infinitive expresses going to do an activity: spazieren gehen, einkaufen gehen, schlafen gehen.",
      },
    ],
  },
  {
    id: "fragen",
    label: "Fragen",
    color: { bg: "#d1fae5", fg: "#065f46", dot: "#10b981" },
    items: [
      {
        pattern: "Wann …? + trennbares Verb",
        meaning: "When …?",
        example: "Wann stehst du am Wochenende auf?",
        translation: "When do you get up on the weekend?",
        note: "In a W-question the question word comes first and the verb second; a separable prefix still goes to the end (stehst … auf).",
      },
      {
        pattern: "Um wie viel Uhr …?",
        meaning: "At what time …?",
        example: "Um wie viel Uhr gehst du ins Bett?",
        translation: "At what time do you go to bed?",
        note: "Asks for a clock time; answer with um (Um zehn Uhr). ins Bett gehen = to go to bed.",
      },
      {
        pattern: "Wann fängt … an?",
        meaning: "When does … start?",
        example: "Wann fängt der Kurs an?",
        translation: "When does the class start?",
        note: "anfangen → fängt … an (separable + a → ä). Answer: Um neun (Uhr).",
      },
    ],
  },
  {
    id: "tekamolo",
    label: "Zeit vor Ort",
    color: { bg: "#fef3c7", fg: "#92400e", dot: "#f59e0b" },
    items: [
      {
        pattern: "Zeit vor Ort",
        meaning: "time before place",
        example: "Er ist von acht bis zwölf Uhr im Kurs.",
        translation: "He's at the course from eight to twelve.",
        note: "When a sentence has both a time phrase and a place phrase, time comes first, place comes last — never the other way around.",
      },
      {
        pattern: "Zwei Zeitangaben: allgemein vor genau",
        meaning: "general time before specific time",
        example: "Er geht am Abend um zehn Uhr ins Bett.",
        translation: "He goes to bed in the evening at ten o'clock.",
        note: "With two time expressions, the more general one (am Abend) comes before the more specific one (um zehn Uhr), and the place phrase (ins Bett) still comes last.",
      },
      {
        pattern: "Nicht: Ort vor Zeit",
        meaning: "common mistake to avoid",
        example: "Er sieht noch ein bisschen zu Hause fern.",
        translation: "He watches a bit of TV at home still.",
        note: "Separable prefix (fern) still goes last, but notice the place phrase 'zu Hause' comes before it, after the time word 'noch ein bisschen' — fernsehen is separable, so the prefix is always the final word regardless of TeKaMoLo order.",
      },
    ],
  },
]
