// ─── DATA ────────────────────────────────────────────────────────────────────
// stemChange: true  → vowel/stem changes (red)
// stemChange: false → regular ending added (blue)
export interface Conjugation {
  pronoun: string
  form: string
  stemChange: boolean
}

export type VerbType = 'regular' | 'irregular' | 'modal'

export interface Verb {
  infinitive: string
  english: string
  type: VerbType
  note: string
  customStem?: string
  conjugations: Conjugation[]
}

export const verbData: Verb[] = [
  {
    infinitive: "sein", english: "to be", type: "irregular",
    note: "Fully suppletive — every form is unpredictable. Memorise each one individually.",
    conjugations: [
      { pronoun: "ich",      form: "bin",   stemChange: true  },
      { pronoun: "du",       form: "bist",  stemChange: true  },
      { pronoun: "er/sie/es",form: "ist",   stemChange: true  },
      { pronoun: "wir",      form: "sind",  stemChange: true  },
      { pronoun: "ihr",      form: "seid",  stemChange: true  },
      { pronoun: "sie/Sie",  form: "sind",  stemChange: true  },
    ],
  },
  {
    infinitive: "haben", english: "to have", type: "irregular",
    note: "The -b- drops in du/er forms: habe → hast / hat.",
    conjugations: [
      { pronoun: "ich",      form: "habe",  stemChange: false },
      { pronoun: "du",       form: "hast",  stemChange: true  },
      { pronoun: "er/sie/es",form: "hat",   stemChange: true  },
      { pronoun: "wir",      form: "haben", stemChange: false },
      { pronoun: "ihr",      form: "habt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "haben", stemChange: false },
    ],
  },
  {
    infinitive: "werden", english: "to become / will", type: "irregular",
    note: "Vowel change e → i in du/er forms. Also the future & passive auxiliary.",
    conjugations: [
      { pronoun: "ich",      form: "werde",  stemChange: false },
      { pronoun: "du",       form: "wirst",  stemChange: true  },
      { pronoun: "er/sie/es",form: "wird",   stemChange: true  },
      { pronoun: "wir",      form: "werden", stemChange: false },
      { pronoun: "ihr",      form: "werdet", stemChange: false },
      { pronoun: "sie/Sie",  form: "werden", stemChange: false },
    ],
  },
  {
    infinitive: "können", english: "can / to be able to", type: "modal",
    note: "Modal: no ending for ich/er. Vowel change ö → a in singular forms.",
    conjugations: [
      { pronoun: "ich",      form: "kann",   stemChange: true  },
      { pronoun: "du",       form: "kannst", stemChange: true  },
      { pronoun: "er/sie/es",form: "kann",   stemChange: true  },
      { pronoun: "wir",      form: "können", stemChange: false },
      { pronoun: "ihr",      form: "könnt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "können", stemChange: false },
    ],
  },
  {
    infinitive: "müssen", english: "must / to have to", type: "modal",
    note: "Modal: no ending for ich/er. Umlaut ü drops in singular forms.",
    conjugations: [
      { pronoun: "ich",      form: "muss",   stemChange: true  },
      { pronoun: "du",       form: "musst",  stemChange: true  },
      { pronoun: "er/sie/es",form: "muss",   stemChange: true  },
      { pronoun: "wir",      form: "müssen", stemChange: false },
      { pronoun: "ihr",      form: "müsst",  stemChange: false },
      { pronoun: "sie/Sie",  form: "müssen", stemChange: false },
    ],
  },
  {
    infinitive: "sagen", english: "to say", type: "regular",
    note: "Fully regular. Pattern: stem + -e / -st / -t / -en / -t / -en.",
    conjugations: [
      { pronoun: "ich",      form: "sage",  stemChange: false },
      { pronoun: "du",       form: "sagst", stemChange: false },
      { pronoun: "er/sie/es",form: "sagt",  stemChange: false },
      { pronoun: "wir",      form: "sagen", stemChange: false },
      { pronoun: "ihr",      form: "sagt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "sagen", stemChange: false },
    ],
  },
  {
    infinitive: "machen", english: "to make / to do", type: "regular",
    note: "Fully regular. A perfect model verb for learning the standard pattern.",
    conjugations: [
      { pronoun: "ich",      form: "mache",  stemChange: false },
      { pronoun: "du",       form: "machst", stemChange: false },
      { pronoun: "er/sie/es",form: "macht",  stemChange: false },
      { pronoun: "wir",      form: "machen", stemChange: false },
      { pronoun: "ihr",      form: "macht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "machen", stemChange: false },
    ],
  },
  {
    infinitive: "gehen", english: "to go", type: "regular",
    note: "Regular in Präsens. In Perfekt it takes 'sein': ich bin gegangen.",
    conjugations: [
      { pronoun: "ich",      form: "gehe",  stemChange: false },
      { pronoun: "du",       form: "gehst", stemChange: false },
      { pronoun: "er/sie/es",form: "geht",  stemChange: false },
      { pronoun: "wir",      form: "gehen", stemChange: false },
      { pronoun: "ihr",      form: "geht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "gehen", stemChange: false },
    ],
  },
  {
    infinitive: "kommen", english: "to come", type: "regular",
    note: "Regular in Präsens. Double -mm- stays in all forms.",
    conjugations: [
      { pronoun: "ich",      form: "komme",  stemChange: false },
      { pronoun: "du",       form: "kommst", stemChange: false },
      { pronoun: "er/sie/es",form: "kommt",  stemChange: false },
      { pronoun: "wir",      form: "kommen", stemChange: false },
      { pronoun: "ihr",      form: "kommt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "kommen", stemChange: false },
    ],
  },
  {
    infinitive: "sollen", english: "should / to be supposed to", type: "modal",
    note: "The most regular modal — no vowel change! No ending for ich/er.",
    conjugations: [
      { pronoun: "ich",      form: "soll",   stemChange: false },
      { pronoun: "du",       form: "sollst", stemChange: false },
      { pronoun: "er/sie/es",form: "soll",   stemChange: false },
      { pronoun: "wir",      form: "sollen", stemChange: false },
      { pronoun: "ihr",      form: "sollt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "sollen", stemChange: false },
    ],
  },
  {
    infinitive: "wollen", english: "to want", type: "modal",
    note: "Modal: no ending for ich/er. Vowel change o → i in singular forms.",
    conjugations: [
      { pronoun: "ich",      form: "will",   stemChange: true  },
      { pronoun: "du",       form: "willst", stemChange: true  },
      { pronoun: "er/sie/es",form: "will",   stemChange: true  },
      { pronoun: "wir",      form: "wollen", stemChange: false },
      { pronoun: "ihr",      form: "wollt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "wollen", stemChange: false },
    ],
  },
  {
    infinitive: "wissen", english: "to know (a fact)", type: "irregular",
    note: "Behaves like a modal in singular: wiss → weiß, no ending for ich/er.",
    conjugations: [
      { pronoun: "ich",      form: "weiß",   stemChange: true  },
      { pronoun: "du",       form: "weißt",  stemChange: true  },
      { pronoun: "er/sie/es",form: "weiß",   stemChange: true  },
      { pronoun: "wir",      form: "wissen", stemChange: false },
      { pronoun: "ihr",      form: "wisst",  stemChange: false },
      { pronoun: "sie/Sie",  form: "wissen", stemChange: false },
    ],
  },
  {
    infinitive: "sehen", english: "to see", type: "irregular",
    note: "Vowel change e → ie in du/er forms (a common pattern: lesen, geben, nehmen…).",
    conjugations: [
      { pronoun: "ich",      form: "sehe",   stemChange: false },
      { pronoun: "du",       form: "siehst", stemChange: true  },
      { pronoun: "er/sie/es",form: "sieht",  stemChange: true  },
      { pronoun: "wir",      form: "sehen",  stemChange: false },
      { pronoun: "ihr",      form: "seht",   stemChange: false },
      { pronoun: "sie/Sie",  form: "sehen",  stemChange: false },
    ],
  },
  {
    infinitive: "lassen", english: "to let / to leave", type: "irregular",
    note: "Vowel change a → ä (umlaut) in du/er forms: lasse → lässt.",
    conjugations: [
      { pronoun: "ich",      form: "lasse",  stemChange: false },
      { pronoun: "du",       form: "lässt",  stemChange: true  },
      { pronoun: "er/sie/es",form: "lässt",  stemChange: true  },
      { pronoun: "wir",      form: "lassen", stemChange: false },
      { pronoun: "ihr",      form: "lasst",  stemChange: false },
      { pronoun: "sie/Sie",  form: "lassen", stemChange: false },
    ],
  },
  {
    infinitive: "stehen", english: "to stand", type: "regular",
    note: "Regular in Präsens.",
    conjugations: [
      { pronoun: "ich",      form: "stehe",  stemChange: false },
      { pronoun: "du",       form: "stehst", stemChange: false },
      { pronoun: "er/sie/es",form: "steht",  stemChange: false },
      { pronoun: "wir",      form: "stehen", stemChange: false },
      { pronoun: "ihr",      form: "steht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "stehen", stemChange: false },
    ],
  },
  {
    infinitive: "finden", english: "to find / to think", type: "regular",
    note: "Stem ends in -d: an -e- is inserted before -st and -t → findest, findet.",
    conjugations: [
      { pronoun: "ich",      form: "finde",   stemChange: false },
      { pronoun: "du",       form: "findest", stemChange: false },
      { pronoun: "er/sie/es",form: "findet",  stemChange: false },
      { pronoun: "wir",      form: "finden",  stemChange: false },
      { pronoun: "ihr",      form: "findet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "finden",  stemChange: false },
    ],
  },
  {
    infinitive: "bleiben", english: "to stay / to remain", type: "regular",
    note: "Regular in Präsens. Perfekt uses 'sein': ich bin geblieben.",
    conjugations: [
      { pronoun: "ich",      form: "bleibe",  stemChange: false },
      { pronoun: "du",       form: "bleibst", stemChange: false },
      { pronoun: "er/sie/es",form: "bleibt",  stemChange: false },
      { pronoun: "wir",      form: "bleiben", stemChange: false },
      { pronoun: "ihr",      form: "bleibt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "bleiben", stemChange: false },
    ],
  },
  {
    infinitive: "liegen", english: "to lie / to be located", type: "regular",
    note: "Regular in Präsens.",
    conjugations: [
      { pronoun: "ich",      form: "liege",  stemChange: false },
      { pronoun: "du",       form: "liegst", stemChange: false },
      { pronoun: "er/sie/es",form: "liegt",  stemChange: false },
      { pronoun: "wir",      form: "liegen", stemChange: false },
      { pronoun: "ihr",      form: "liegt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "liegen", stemChange: false },
    ],
  },
  {
    infinitive: "heißen", english: "to be called", type: "regular",
    note: "Stem ends in -ß: du heißt (not heißst — -st contracts to -t after ß/s/z).",
    conjugations: [
      { pronoun: "ich",      form: "heiße",  stemChange: false },
      { pronoun: "du",       form: "heißt",  stemChange: false },
      { pronoun: "er/sie/es",form: "heißt",  stemChange: false },
      { pronoun: "wir",      form: "heißen", stemChange: false },
      { pronoun: "ihr",      form: "heißt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "heißen", stemChange: false },
    ],
  },
  {
    infinitive: "denken", english: "to think", type: "regular",
    note: "Regular in Präsens. Note: Perfekt is irregular → hat gedacht.",
    conjugations: [
      { pronoun: "ich",      form: "denke",  stemChange: false },
      { pronoun: "du",       form: "denkst", stemChange: false },
      { pronoun: "er/sie/es",form: "denkt",  stemChange: false },
      { pronoun: "wir",      form: "denken", stemChange: false },
      { pronoun: "ihr",      form: "denkt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "denken", stemChange: false },
    ],
  },
  {
    infinitive: "brauchen", english: "to need", type: "regular",
    note: "Fully regular. Very common in everyday speech: Ich brauche Hilfe — I need help.",
    conjugations: [
      { pronoun: "ich",      form: "brauche",  stemChange: false },
      { pronoun: "du",       form: "brauchst", stemChange: false },
      { pronoun: "er/sie/es",form: "braucht",  stemChange: false },
      { pronoun: "wir",      form: "brauchen", stemChange: false },
      { pronoun: "ihr",      form: "braucht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "brauchen", stemChange: false },
    ],
  },
  {
    infinitive: "schreiben", english: "to write", type: "regular",
    note: "Regular in Präsens. Strong verb — vowel changes only in Präteritum/Perfekt (schrieb, geschrieben).",
    conjugations: [
      { pronoun: "ich",      form: "schreibe",  stemChange: false },
      { pronoun: "du",       form: "schreibst", stemChange: false },
      { pronoun: "er/sie/es",form: "schreibt",  stemChange: false },
      { pronoun: "wir",      form: "schreiben", stemChange: false },
      { pronoun: "ihr",      form: "schreibt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "schreiben", stemChange: false },
    ],
  },
  {
    infinitive: "hören", english: "to hear / to listen", type: "regular",
    note: "Fully regular. Also used in hör mal! (hey, listen!) and Ich höre Musik.",
    conjugations: [
      { pronoun: "ich",      form: "höre",  stemChange: false },
      { pronoun: "du",       form: "hörst", stemChange: false },
      { pronoun: "er/sie/es",form: "hört",  stemChange: false },
      { pronoun: "wir",      form: "hören", stemChange: false },
      { pronoun: "ihr",      form: "hört",  stemChange: false },
      { pronoun: "sie/Sie",  form: "hören", stemChange: false },
    ],
  },
  {
    infinitive: "sprechen", english: "to speak / to talk", type: "irregular",
    note: "Vowel change e → i in du/er forms — same pattern as sehen (e→ie), lesen, geben.",
    conjugations: [
      { pronoun: "ich",      form: "spreche",  stemChange: false },
      { pronoun: "du",       form: "sprichst", stemChange: true  },
      { pronoun: "er/sie/es",form: "spricht",  stemChange: true  },
      { pronoun: "wir",      form: "sprechen", stemChange: false },
      { pronoun: "ihr",      form: "sprecht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "sprechen", stemChange: false },
    ],
  },
  {
    infinitive: "möchten", english: "would like to", type: "modal",
    note: "Konjunktiv II of mögen used as a polite wish. Unlike other modals, ich/er take an -e ending: ich möchte, er möchte.",
    conjugations: [
      { pronoun: "ich",      form: "möchte",   stemChange: false },
      { pronoun: "du",       form: "möchtest", stemChange: false },
      { pronoun: "er/sie/es",form: "möchte",   stemChange: false },
      { pronoun: "wir",      form: "möchten",  stemChange: false },
      { pronoun: "ihr",      form: "möchtet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "möchten",  stemChange: false },
    ],
  },
  {
    infinitive: "trinken", english: "to drink", type: "regular",
    note: "Regular in Präsens. Strong verb — vowel changes only in past tenses (trank, getrunken).",
    conjugations: [
      { pronoun: "ich",      form: "trinke",  stemChange: false },
      { pronoun: "du",       form: "trinkst", stemChange: false },
      { pronoun: "er/sie/es",form: "trinkt",  stemChange: false },
      { pronoun: "wir",      form: "trinken", stemChange: false },
      { pronoun: "ihr",      form: "trinkt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "trinken", stemChange: false },
    ],
  },
  {
    infinitive: "suchen", english: "to search / to look for", type: "regular",
    note: "Fully regular. Often paired with nach: Ich suche nach einer Wohnung.",
    conjugations: [
      { pronoun: "ich",      form: "suche",  stemChange: false },
      { pronoun: "du",       form: "suchst", stemChange: false },
      { pronoun: "er/sie/es",form: "sucht",  stemChange: false },
      { pronoun: "wir",      form: "suchen", stemChange: false },
      { pronoun: "ihr",      form: "sucht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "suchen", stemChange: false },
    ],
  },
  {
    infinitive: "schließen", english: "to close / to shut", type: "regular",
    note: "Stem ends in -ß: du schließt (not schließst — same contraction rule as heißen).",
    conjugations: [
      { pronoun: "ich",      form: "schließe", stemChange: false },
      { pronoun: "du",       form: "schließt", stemChange: false },
      { pronoun: "er/sie/es",form: "schließt", stemChange: false },
      { pronoun: "wir",      form: "schließen",stemChange: false },
      { pronoun: "ihr",      form: "schließt", stemChange: false },
      { pronoun: "sie/Sie",  form: "schließen",stemChange: false },
    ],
  },

  // ── About me / origin ──────────────────────────────────────────────────────
  {
    infinitive: "leben", english: "to live (be alive)", type: "regular",
    note: "Fully regular. Use for life in general: Ich lebe in Zürich. Contrast with wohnen (to reside at an address).",
    conjugations: [
      { pronoun: "ich",      form: "lebe",  stemChange: false },
      { pronoun: "du",       form: "lebst", stemChange: false },
      { pronoun: "er/sie/es",form: "lebt",  stemChange: false },
      { pronoun: "wir",      form: "leben", stemChange: false },
      { pronoun: "ihr",      form: "lebt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "leben", stemChange: false },
    ],
  },
  {
    infinitive: "wohnen", english: "to live / to reside", type: "regular",
    note: "Fully regular. Use for a specific address or city: Ich wohne in Zürich, Mythenquai.",
    conjugations: [
      { pronoun: "ich",      form: "wohne",  stemChange: false },
      { pronoun: "du",       form: "wohnst", stemChange: false },
      { pronoun: "er/sie/es",form: "wohnt",  stemChange: false },
      { pronoun: "wir",      form: "wohnen", stemChange: false },
      { pronoun: "ihr",      form: "wohnt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "wohnen", stemChange: false },
    ],
  },
  {
    infinitive: "arbeiten", english: "to work", type: "regular",
    note: "Stem ends in -t: an -e- is inserted before -st and -t → arbeitest, arbeitet (same rule as finden).",
    conjugations: [
      { pronoun: "ich",      form: "arbeite",   stemChange: false },
      { pronoun: "du",       form: "arbeitest", stemChange: false },
      { pronoun: "er/sie/es",form: "arbeitet",  stemChange: false },
      { pronoun: "wir",      form: "arbeiten",  stemChange: false },
      { pronoun: "ihr",      form: "arbeitet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "arbeiten",  stemChange: false },
    ],
  },
  {
    infinitive: "studieren", english: "to study (at university)", type: "regular",
    note: "Regular. Verbs ending in -ieren never add a ge- prefix in Perfekt: hat studiert.",
    conjugations: [
      { pronoun: "ich",      form: "studiere",  stemChange: false },
      { pronoun: "du",       form: "studierst", stemChange: false },
      { pronoun: "er/sie/es",form: "studiert",  stemChange: false },
      { pronoun: "wir",      form: "studieren", stemChange: false },
      { pronoun: "ihr",      form: "studiert",  stemChange: false },
      { pronoun: "sie/Sie",  form: "studieren", stemChange: false },
    ],
  },
  {
    infinitive: "stammen", english: "to originate / to come from", type: "regular",
    note: "Always used with aus: Ich stamme aus Portugal. More formal than kommen aus.",
    conjugations: [
      { pronoun: "ich",      form: "stamme",  stemChange: false },
      { pronoun: "du",       form: "stammst", stemChange: false },
      { pronoun: "er/sie/es",form: "stammt",  stemChange: false },
      { pronoun: "wir",      form: "stammen", stemChange: false },
      { pronoun: "ihr",      form: "stammt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "stammen", stemChange: false },
    ],
  },

  // ── Supermarket / shopping ─────────────────────────────────────────────────
  {
    infinitive: "kaufen", english: "to buy", type: "regular",
    note: "Fully regular. Opposite: verkaufen (to sell). Ich kaufe ein = I'm shopping (einkaufen).",
    conjugations: [
      { pronoun: "ich",      form: "kaufe",  stemChange: false },
      { pronoun: "du",       form: "kaufst", stemChange: false },
      { pronoun: "er/sie/es",form: "kauft",  stemChange: false },
      { pronoun: "wir",      form: "kaufen", stemChange: false },
      { pronoun: "ihr",      form: "kauft",  stemChange: false },
      { pronoun: "sie/Sie",  form: "kaufen", stemChange: false },
    ],
  },
  {
    infinitive: "bezahlen", english: "to pay", type: "regular",
    note: "Regular. Both bezahlen and zahlen mean to pay; bezahlen is more common at a till.",
    conjugations: [
      { pronoun: "ich",      form: "bezahle",  stemChange: false },
      { pronoun: "du",       form: "bezahlst", stemChange: false },
      { pronoun: "er/sie/es",form: "bezahlt",  stemChange: false },
      { pronoun: "wir",      form: "bezahlen", stemChange: false },
      { pronoun: "ihr",      form: "bezahlt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "bezahlen", stemChange: false },
    ],
  },
  {
    infinitive: "kosten", english: "to cost", type: "regular",
    note: "Stem ends in -t: e-insertion in du/er forms → kostest, kostet. Was kostet das?",
    conjugations: [
      { pronoun: "ich",      form: "koste",   stemChange: false },
      { pronoun: "du",       form: "kostest", stemChange: false },
      { pronoun: "er/sie/es",form: "kostet",  stemChange: false },
      { pronoun: "wir",      form: "kosten",  stemChange: false },
      { pronoun: "ihr",      form: "kostet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "kosten",  stemChange: false },
    ],
  },
  {
    infinitive: "nehmen", english: "to take / to get", type: "irregular",
    note: "Strong vowel change e → i in du/er, and -h- drops: nehme → nimmst / nimmt.",
    conjugations: [
      { pronoun: "ich",      form: "nehme",  stemChange: false },
      { pronoun: "du",       form: "nimmst", stemChange: true  },
      { pronoun: "er/sie/es",form: "nimmt",  stemChange: true  },
      { pronoun: "wir",      form: "nehmen", stemChange: false },
      { pronoun: "ihr",      form: "nehmt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "nehmen", stemChange: false },
    ],
  },
  {
    infinitive: "wählen", english: "to choose / to select", type: "regular",
    note: "Fully regular. Also means to vote: Ich wähle die SPD.",
    conjugations: [
      { pronoun: "ich",      form: "wähle",  stemChange: false },
      { pronoun: "du",       form: "wählst", stemChange: false },
      { pronoun: "er/sie/es",form: "wählt",  stemChange: false },
      { pronoun: "wir",      form: "wählen", stemChange: false },
      { pronoun: "ihr",      form: "wählt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "wählen", stemChange: false },
    ],
  },

  // ── Missing from top-30 most-used ─────────────────────────────────────────
  {
    infinitive: "dürfen", english: "may / to be allowed to", type: "modal",
    note: "Modal: no ending for ich/er. Vowel change ü → a in singular. Ich darf nicht = I'm not allowed to.",
    conjugations: [
      { pronoun: "ich",      form: "darf",   stemChange: true  },
      { pronoun: "du",       form: "darfst", stemChange: true  },
      { pronoun: "er/sie/es",form: "darf",   stemChange: true  },
      { pronoun: "wir",      form: "dürfen", stemChange: false },
      { pronoun: "ihr",      form: "dürft",  stemChange: false },
      { pronoun: "sie/Sie",  form: "dürfen", stemChange: false },
    ],
  },
  {
    infinitive: "mögen", english: "to like", type: "modal",
    note: "Vowel change ö → a in singular, no ending for ich/er. Different from möchten (would like): Ich mag Käse vs. Ich möchte Käse kaufen.",
    conjugations: [
      { pronoun: "ich",      form: "mag",   stemChange: true  },
      { pronoun: "du",       form: "magst", stemChange: true  },
      { pronoun: "er/sie/es",form: "mag",   stemChange: true  },
      { pronoun: "wir",      form: "mögen", stemChange: false },
      { pronoun: "ihr",      form: "mögt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "mögen", stemChange: false },
    ],
  },
  {
    infinitive: "glauben", english: "to believe / to think", type: "regular",
    note: "Fully regular. Used for beliefs and opinions: Ich glaube, dass… (I think that…). Very common in spoken German.",
    conjugations: [
      { pronoun: "ich",      form: "glaube",  stemChange: false },
      { pronoun: "du",       form: "glaubst", stemChange: false },
      { pronoun: "er/sie/es",form: "glaubt",  stemChange: false },
      { pronoun: "wir",      form: "glauben", stemChange: false },
      { pronoun: "ihr",      form: "glaubt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "glauben", stemChange: false },
    ],
  },
  {
    infinitive: "halten", english: "to hold / to stop", type: "irregular",
    note: "Vowel change a → ä in du/er forms. Same umlaut pattern as lassen (a→ä).",
    conjugations: [
      { pronoun: "ich",      form: "halte",  stemChange: false },
      { pronoun: "du",       form: "hältst", stemChange: true  },
      { pronoun: "er/sie/es",form: "hält",   stemChange: true  },
      { pronoun: "wir",      form: "halten", stemChange: false },
      { pronoun: "ihr",      form: "haltet", stemChange: false },
      { pronoun: "sie/Sie",  form: "halten", stemChange: false },
    ],
  },
  {
    infinitive: "bringen", english: "to bring", type: "regular",
    note: "Regular in Präsens. A mixed verb — irregular only in past tenses: brachte, hat gebracht.",
    conjugations: [
      { pronoun: "ich",      form: "bringe",  stemChange: false },
      { pronoun: "du",       form: "bringst", stemChange: false },
      { pronoun: "er/sie/es",form: "bringt",  stemChange: false },
      { pronoun: "wir",      form: "bringen", stemChange: false },
      { pronoun: "ihr",      form: "bringt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "bringen", stemChange: false },
    ],
  },
  {
    infinitive: "zeigen", english: "to show", type: "regular",
    note: "Fully regular. Very common: Kannst du mir zeigen, wo…? (Can you show me where…?)",
    conjugations: [
      { pronoun: "ich",      form: "zeige",  stemChange: false },
      { pronoun: "du",       form: "zeigst", stemChange: false },
      { pronoun: "er/sie/es",form: "zeigt",  stemChange: false },
      { pronoun: "wir",      form: "zeigen", stemChange: false },
      { pronoun: "ihr",      form: "zeigt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "zeigen", stemChange: false },
    ],
  },

  // ── Classroom / exercise verbs ─────────────────────────────────────────────
  {
    infinitive: "verbinden", english: "to connect / to link", type: "regular",
    note: "Stem ends in -d → e-insertion: verbindest, verbindet. Common in exercises: Verbinden Sie die Sätze! (Connect the sentences!)",
    conjugations: [
      { pronoun: "ich",      form: "verbinde",   stemChange: false },
      { pronoun: "du",       form: "verbindest", stemChange: false },
      { pronoun: "er/sie/es",form: "verbindet",  stemChange: false },
      { pronoun: "wir",      form: "verbinden",  stemChange: false },
      { pronoun: "ihr",      form: "verbindet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "verbinden",  stemChange: false },
    ],
  },
  {
    infinitive: "ergänzen", english: "to complete / to fill in", type: "regular",
    note: "Stem ends in -z: du ergänzt (not ergänzst — same contraction rule as heißen). Used constantly in coursebooks: Ergänzen Sie die Lücken!",
    conjugations: [
      { pronoun: "ich",      form: "ergänze",  stemChange: false },
      { pronoun: "du",       form: "ergänzt",  stemChange: false },
      { pronoun: "er/sie/es",form: "ergänzt",  stemChange: false },
      { pronoun: "wir",      form: "ergänzen", stemChange: false },
      { pronoun: "ihr",      form: "ergänzt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "ergänzen", stemChange: false },
    ],
  },
  {
    infinitive: "antworten", english: "to answer / to reply", type: "regular",
    note: "Stem ends in -t → e-insertion: antwortest, antwortet. Takes the dative: Ich antworte dir (not: ich antworte dich).",
    conjugations: [
      { pronoun: "ich",      form: "antworte",   stemChange: false },
      { pronoun: "du",       form: "antwortest", stemChange: false },
      { pronoun: "er/sie/es",form: "antwortet",  stemChange: false },
      { pronoun: "wir",      form: "antworten",  stemChange: false },
      { pronoun: "ihr",      form: "antwortet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "antworten",  stemChange: false },
    ],
  },
  {
    infinitive: "ordnen", english: "to sort / to put in order", type: "regular",
    note: "Stem 'ordn-' ends in a consonant cluster → e-insertion: ordnest, ordnet. Used in exercises: Ordnen Sie die Wörter! (Put the words in order!)",
    conjugations: [
      { pronoun: "ich",      form: "ordne",   stemChange: false },
      { pronoun: "du",       form: "ordnest", stemChange: false },
      { pronoun: "er/sie/es",form: "ordnet",  stemChange: false },
      { pronoun: "wir",      form: "ordnen",  stemChange: false },
      { pronoun: "ihr",      form: "ordnet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "ordnen",  stemChange: false },
    ],
  },
  {
    infinitive: "gefallen", english: "to please / to like (inverted)", type: "irregular",
    note: "Works the opposite of English: Das gefällt mir = That pleases me = I like that. The thing you like is the subject. Vowel change a → ä in du/er — same pattern as lassen and halten.",
    conjugations: [
      { pronoun: "ich",      form: "gefalle",   stemChange: false },
      { pronoun: "du",       form: "gefällst",  stemChange: true  },
      { pronoun: "er/sie/es",form: "gefällt",   stemChange: true  },
      { pronoun: "wir",      form: "gefallen",  stemChange: false },
      { pronoun: "ihr",      form: "gefallt",   stemChange: false },
      { pronoun: "sie/Sie",  form: "gefallen",  stemChange: false },
    ],
  },
  {
    infinitive: "spielen", english: "to play", type: "regular",
    note: "Fully regular. Works for games, sports and instruments: Ich spiele Fußball / Ich spiele Gitarre.",
    conjugations: [
      { pronoun: "ich",      form: "spiele",  stemChange: false },
      { pronoun: "du",       form: "spielst", stemChange: false },
      { pronoun: "er/sie/es",form: "spielt",  stemChange: false },
      { pronoun: "wir",      form: "spielen", stemChange: false },
      { pronoun: "ihr",      form: "spielt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "spielen", stemChange: false },
    ],
  },
  {
    infinitive: "anschauen", english: "to watch / to look at", type: "regular",
    customStem: "schau",
    note: "Separable verb — 'an-' detaches to the end of the clause: Ich schaue den Film an. The base verb schauen conjugates regularly; forms here show the base without the prefix.",
    conjugations: [
      { pronoun: "ich",      form: "schaue",  stemChange: false },
      { pronoun: "du",       form: "schaust", stemChange: false },
      { pronoun: "er/sie/es",form: "schaut",  stemChange: false },
      { pronoun: "wir",      form: "schauen", stemChange: false },
      { pronoun: "ihr",      form: "schaut",  stemChange: false },
      { pronoun: "sie/Sie",  form: "schauen", stemChange: false },
    ],
  },
  {
    infinitive: "aufmachen", english: "to open", type: "regular",
    customStem: "mach",
    note: "Separable verb — 'auf-' detaches: Ich mache die Tür auf (I open the door). Base verb machen is fully regular and already in this list.",
    conjugations: [
      { pronoun: "ich",      form: "mache",  stemChange: false },
      { pronoun: "du",       form: "machst", stemChange: false },
      { pronoun: "er/sie/es",form: "macht",  stemChange: false },
      { pronoun: "wir",      form: "machen", stemChange: false },
      { pronoun: "ihr",      form: "macht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "machen", stemChange: false },
    ],
  },
  {
    infinitive: "einkaufen", english: "to go shopping / to shop", type: "regular",
    customStem: "kauf",
    note: "Separable verb — 'ein-' detaches: Ich kaufe im Supermarkt ein. Base verb kaufen is already in this list. Contrast: kaufen = to buy one thing; einkaufen = to do the shopping.",
    conjugations: [
      { pronoun: "ich",      form: "kaufe",  stemChange: false },
      { pronoun: "du",       form: "kaufst", stemChange: false },
      { pronoun: "er/sie/es",form: "kauft",  stemChange: false },
      { pronoun: "wir",      form: "kaufen", stemChange: false },
      { pronoun: "ihr",      form: "kauft",  stemChange: false },
      { pronoun: "sie/Sie",  form: "kaufen", stemChange: false },
    ],
  },
  {
    infinitive: "anrufen", english: "to call / to phone", type: "regular",
    customStem: "ruf",
    note: "Separable verb — 'an-' detaches: Ich rufe dich an (I'll call you). Base verb rufen is regular. Very common in everyday German.",
    conjugations: [
      { pronoun: "ich",      form: "rufe",  stemChange: false },
      { pronoun: "du",       form: "rufst", stemChange: false },
      { pronoun: "er/sie/es",form: "ruft",  stemChange: false },
      { pronoun: "wir",      form: "rufen", stemChange: false },
      { pronoun: "ihr",      form: "ruft",  stemChange: false },
      { pronoun: "sie/Sie",  form: "rufen", stemChange: false },
    ],
  },

  // ── Tagesablauf / Daily routine ────────────────────────────────────────────
  {
    infinitive: "aufstehen", english: "to get up", type: "regular",
    customStem: "steh",
    note: "Separable verb — 'auf-' detaches: Lara steht früh auf. Base verb stehen is fully regular and already in this list.",
    conjugations: [
      { pronoun: "ich",      form: "stehe",  stemChange: false },
      { pronoun: "du",       form: "stehst", stemChange: false },
      { pronoun: "er/sie/es",form: "steht",  stemChange: false },
      { pronoun: "wir",      form: "stehen", stemChange: false },
      { pronoun: "ihr",      form: "steht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "stehen", stemChange: false },
    ],
  },
  {
    infinitive: "aufräumen", english: "to tidy up", type: "regular",
    customStem: "räum",
    note: "Separable verb — 'auf-' detaches: Sie räumt die Küche auf. Base verb räumen is fully regular.",
    conjugations: [
      { pronoun: "ich",      form: "räume",  stemChange: false },
      { pronoun: "du",       form: "räumst", stemChange: false },
      { pronoun: "er/sie/es",form: "räumt",  stemChange: false },
      { pronoun: "wir",      form: "räumen", stemChange: false },
      { pronoun: "ihr",      form: "räumt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "räumen", stemChange: false },
    ],
  },
  {
    infinitive: "fernsehen", english: "to watch TV", type: "irregular",
    customStem: "seh",
    note: "Separable verb — 'fern-' detaches: Er sieht fern. Base verb sehen has the same e → ie change in du/er as the standalone sehen.",
    conjugations: [
      { pronoun: "ich",      form: "sehe",   stemChange: false },
      { pronoun: "du",       form: "siehst", stemChange: true  },
      { pronoun: "er/sie/es",form: "sieht",  stemChange: true  },
      { pronoun: "wir",      form: "sehen",  stemChange: false },
      { pronoun: "ihr",      form: "seht",   stemChange: false },
      { pronoun: "sie/Sie",  form: "sehen",  stemChange: false },
    ],
  },
  {
    infinitive: "essen", english: "to eat", type: "irregular",
    note: "Vowel change e → i in du/er forms, and both collapse to the same form: isst (du) = isst (er/sie/es).",
    conjugations: [
      { pronoun: "ich",      form: "esse",  stemChange: false },
      { pronoun: "du",       form: "isst",  stemChange: true  },
      { pronoun: "er/sie/es",form: "isst",  stemChange: true  },
      { pronoun: "wir",      form: "essen", stemChange: false },
      { pronoun: "ihr",      form: "esst",  stemChange: false },
      { pronoun: "sie/Sie",  form: "essen", stemChange: false },
    ],
  },
  {
    infinitive: "frühstücken", english: "to have breakfast", type: "regular",
    note: "Fully regular despite the long stem. Ich frühstücke um acht Uhr (I have breakfast at eight).",
    conjugations: [
      { pronoun: "ich",      form: "frühstücke",  stemChange: false },
      { pronoun: "du",       form: "frühstückst", stemChange: false },
      { pronoun: "er/sie/es",form: "frühstückt",  stemChange: false },
      { pronoun: "wir",      form: "frühstücken", stemChange: false },
      { pronoun: "ihr",      form: "frühstückt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "frühstücken", stemChange: false },
    ],
  },

  // ── Aus dem Unterricht / from class notes ──────────────────────────────────
  {
    infinitive: "anfangen", english: "to begin / to start", type: "irregular",
    customStem: "fang",
    note: "Separable AND stem-changing: 'an-' detaches and a → ä in du/er. Der Kurs fängt um neun an (the class starts at nine).",
    conjugations: [
      { pronoun: "ich",      form: "fange",  stemChange: false },
      { pronoun: "du",       form: "fängst", stemChange: true  },
      { pronoun: "er/sie/es",form: "fängt",  stemChange: true  },
      { pronoun: "wir",      form: "fangen", stemChange: false },
      { pronoun: "ihr",      form: "fangt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "fangen", stemChange: false },
    ],
  },
  {
    infinitive: "schlafen", english: "to sleep", type: "irregular",
    note: "Stem change a → ä in du/er forms: du schläfst, er schläft. Wie lange schläfst du am Wochenende?",
    conjugations: [
      { pronoun: "ich",      form: "schlafe",  stemChange: false },
      { pronoun: "du",       form: "schläfst", stemChange: true  },
      { pronoun: "er/sie/es",form: "schläft",  stemChange: true  },
      { pronoun: "wir",      form: "schlafen", stemChange: false },
      { pronoun: "ihr",      form: "schlaft",  stemChange: false },
      { pronoun: "sie/Sie",  form: "schlafen", stemChange: false },
    ],
  },
  {
    infinitive: "abkühlen", english: "to cool off / to cool down", type: "regular",
    customStem: "kühl",
    note: "Separable verb — 'ab-' detaches: Die Suppe kühlt schnell ab. Base verb kühlen is regular; reflexive sich abkühlen = to cool oneself down.",
    conjugations: [
      { pronoun: "ich",      form: "kühle",  stemChange: false },
      { pronoun: "du",       form: "kühlst", stemChange: false },
      { pronoun: "er/sie/es",form: "kühlt",  stemChange: false },
      { pronoun: "wir",      form: "kühlen", stemChange: false },
      { pronoun: "ihr",      form: "kühlt",  stemChange: false },
      { pronoun: "sie/Sie",  form: "kühlen", stemChange: false },
    ],
  },
  {
    infinitive: "chatten", english: "to chat (online)", type: "regular",
    note: "Regular loanword. The stem ends in -tt, so an -e- is inserted before -st/-t: du chattest, er chattet (same rule as arbeiten).",
    conjugations: [
      { pronoun: "ich",      form: "chatte",   stemChange: false },
      { pronoun: "du",       form: "chattest", stemChange: false },
      { pronoun: "er/sie/es",form: "chattet",  stemChange: false },
      { pronoun: "wir",      form: "chatten",  stemChange: false },
      { pronoun: "ihr",      form: "chattet",  stemChange: false },
      { pronoun: "sie/Sie",  form: "chatten",  stemChange: false },
    ],
  },
  {
    infinitive: "kochen", english: "to cook", type: "regular",
    note: "Fully regular: stem koch- + -e / -st / -t / -en. Ich koche heute Abend (I'm cooking tonight).",
    conjugations: [
      { pronoun: "ich",      form: "koche",  stemChange: false },
      { pronoun: "du",       form: "kochst", stemChange: false },
      { pronoun: "er/sie/es",form: "kocht",  stemChange: false },
      { pronoun: "wir",      form: "kochen", stemChange: false },
      { pronoun: "ihr",      form: "kocht",  stemChange: false },
      { pronoun: "sie/Sie",  form: "kochen", stemChange: false },
    ],
  },
];
