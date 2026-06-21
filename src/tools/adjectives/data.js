// ─── DATA ────────────────────────────────────────────────────────────────────
// Adjectives don't conjugate or decline the way verbs/nouns do (at A1, anyway),
// so the useful structure here is: meaning + opposite (when one exists) +
// an example sentence. Grouped by category, same pattern as german-phrases.jsx.

export const categories = [
  {
    id: "gegensaetze",
    label: "Gegensätze",
    color: { bg: "#cffafe", fg: "#155e75", dot: "#06b6d4" },
    items: [
      {
        word: "schnell", meaning: "fast / quick",
        opposite: { word: "langsam", meaning: "slow" },
        example: "Das Auto ist sehr schnell.", translation: "The car is very fast.",
      },
      {
        word: "kalt", meaning: "cold",
        opposite: { word: "warm", meaning: "warm" },
        example: "Im Winter ist es kalt.", translation: "In winter it's cold.",
      },
      {
        word: "neu", meaning: "new",
        opposite: { word: "alt", meaning: "old" },
        example: "Mein Haus ist alt und groß.", translation: "My house is old and big.",
      },
      {
        word: "billig", meaning: "cheap",
        opposite: { word: "teuer", meaning: "expensive" },
        example: "Hmm. Schön und teuer.", translation: "Hmm. Pretty and expensive.",
      },
      {
        word: "groß", meaning: "big / tall",
        opposite: { word: "klein", meaning: "small" },
        example: "Es ist groß und hell.", translation: "It's big and bright.",
      },
      {
        word: "breit", meaning: "wide",
        opposite: { word: "schmal", meaning: "narrow" },
        example: "Mein Haus ist sehr schmal.", translation: "My house is very narrow.",
      },
      {
        word: "schön", meaning: "beautiful / nice",
        opposite: { word: "hässlich", meaning: "ugly" },
        example: "Es ist breit und schön.", translation: "It's wide and beautiful.",
      },
      {
        word: "hell", meaning: "bright / light",
        opposite: { word: "dunkel", meaning: "dark" },
        example: "Es ist klein und auch dunkel.", translation: "It's small and also dark.",
        note: "Asked as a yes/no question: Ist es hell? — Nein, es ist dunkel.",
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
      },
      {
        word: "gesamt", meaning: "total / entire",
        example: "Die gesamte Wohnung kostet 1200 Franken.", translation: "The whole apartment costs 1200 francs.",
        note: "Often used attributively before a noun (die gesamte Wohnung) rather than alone — declension comes later.",
      },
    ],
  },
];
