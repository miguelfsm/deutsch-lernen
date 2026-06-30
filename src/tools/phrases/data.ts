// ─── DATA ────────────────────────────────────────────────────────────────────
// Each category holds short phrases/words that don't conjugate or decline —
// question words, prepositions/contractions, particles, and conversational
// strategies. Each entry gets a meaning + an example sentence in context.

export interface PhraseItem {
  phrase: string
  meaning: string
  example: string
  translation: string
  note?: string
}

export interface PhraseCategory {
  id: string
  label: string
  color: { bg: string; fg: string; dot: string }
  items: PhraseItem[]
}

export const categories: PhraseCategory[] = [
  {
    id: "wfragen",
    label: "W-Fragen",
    color: { bg: "#dbeafe", fg: "#1e40af", dot: "#3b82f6" },
    items: [
      { phrase: "wer", meaning: "who", example: "Wer ist da?", translation: "Who's there?" },
      { phrase: "was", meaning: "what", example: "Was kostet das?", translation: "What does that cost?" },
      { phrase: "wo", meaning: "where", example: "Wo wohnen Sie?", translation: "Where do you live?" },
      { phrase: "wohin", meaning: "where to", example: "Wohin gehst du?", translation: "Where are you going (to)?" },
      { phrase: "woher", meaning: "where from", example: "Woher kommst du?", translation: "Where are you from?" },
      { phrase: "wann", meaning: "when", example: "Wann sind Sie zu Hause?", translation: "When are you home?" },
      { phrase: "warum", meaning: "why", example: "Warum lernst du Deutsch?", translation: "Why are you learning German?" },
      { phrase: "wie", meaning: "how", example: "Wie heißen Sie?", translation: "What's your name?" },
      { phrase: "wie viel(e)", meaning: "how much / how many", example: "Wie viele Zimmer hat die Wohnung?", translation: "How many rooms does the apartment have?" },
      { phrase: "wie lange", meaning: "how long", example: "Wie lange bleibst du?", translation: "How long are you staying?" },
      { phrase: "wie groß/breit/hoch/alt", meaning: "how big/wide/high/old", example: "Wie groß ist er denn?", translation: "How tall is he, then?" },
    ],
  },
  {
    id: "praep",
    label: "Präpositionen",
    color: { bg: "#fef3c7", fg: "#92400e", dot: "#f59e0b" },
    items: [
      { phrase: "ab", meaning: "from / starting at", example: "Ab Montag bin ich da.", translation: "I'm there starting Monday." },
      { phrase: "bis", meaning: "until", example: "Bis morgen!", translation: "See you tomorrow! (lit. until tomorrow)" },
      { phrase: "bis zum", meaning: "until the (bis + zu dem)", example: "Bis zum nächsten Mal.", translation: "Until next time." },
      { phrase: "im", meaning: "in the (in + dem)", example: "Ich wohne im Zentrum.", translation: "I live in the city centre." },
      { phrase: "in", meaning: "in", example: "Ich lebe in Zürich.", translation: "I live in Zurich." },
      { phrase: "am", meaning: "on/at the (an + dem)", example: "Am Montag arbeite ich nicht.", translation: "I don't work on Mondays." },
      { phrase: "an der", meaning: "at/on the (fem., dative)", example: "Ich wohne an der Bahnhofstrasse.", translation: "I live on Bahnhofstrasse." },
      { phrase: "zum", meaning: "to the (zu + dem)", example: "Wie komme ich zum Bahnhof?", translation: "How do I get to the station?" },
    ],
  },
  {
    id: "partikel",
    label: "Konnektoren & Partikeln",
    color: { bg: "#ede9fe", fg: "#5b21b6", dot: "#8b5cf6" },
    items: [
      { phrase: "aber", meaning: "but", example: "Es ist klein, aber gemütlich.", translation: "It's small, but cosy." },
      { phrase: "auch", meaning: "also / too", example: "Ich auch.", translation: "Me too." },
      { phrase: "doch", meaning: "(flexible: yet/but/indeed)", example: "Ist er nicht da? — Doch, er ist da.", translation: "Isn't he there? — Yes he is (contradicting a negative).", note: "One of the trickiest small words: as an answer it contradicts a negative question; mid-sentence it can soften a statement or add emphasis." },
      { phrase: "vielleicht", meaning: "maybe / perhaps", example: "Vielleicht morgen.", translation: "Maybe tomorrow." },
      { phrase: "denn", meaning: "(softening particle in questions) / because", example: "Was kostet das denn?", translation: "So what does that cost, then?", note: "In questions, denn softens the tone — adds a conversational 'so...' feel rather than a hard interrogation." },
      { phrase: "ach", meaning: "oh / ah", example: "Ach so!", translation: "Oh I see!" },
      { phrase: "genau", meaning: "exactly", example: "Ja, genau.", translation: "Yes, exactly." },
      { phrase: "genug", meaning: "enough", example: "Das ist genug, danke.", translation: "That's enough, thanks.", note: "Comes after the verb/noun it limits: Ich habe genug Geld (I have enough money), Das reicht / das ist genug (that's enough)." },
      { phrase: "und", meaning: "and", example: "Brot und Butter.", translation: "Bread and butter.", note: "The most frequent word in German. Coordinating — joins words or clauses with no change to word order." },
      { phrase: "oder", meaning: "or", example: "Tee oder Kaffee?", translation: "Tea or coffee?", note: "Coordinating like und (no word-order change). Different from the tag question '…, oder?'." },
      { phrase: "weil", meaning: "because", example: "Ich bleibe zu Hause, weil ich müde bin.", translation: "I'm staying home because I'm tired.", note: "Subordinating: sends the conjugated verb to the END of its clause (… weil ich müde bin). Contrast denn (= because, but keeps normal order)." },
    ],
  },
  {
    id: "strategien",
    label: "Gesprächsstrategien",
    color: { bg: "#d1fae5", fg: "#065f46", dot: "#10b981" },
    items: [
      { phrase: "Sag mal, ...", meaning: "Tell me, ... / Hey, ...", example: "Sag mal, wo wohnst du jetzt?", translation: "Hey, where do you live now?" },
      { phrase: "Schau mal! / Schauen Sie mal!", meaning: "Look!", example: "Schau mal, das ist günstig!", translation: "Look, that's cheap!", note: "Schau mal = du-form, Schauen Sie mal = Sie-form." },
      { phrase: "..., oder?", meaning: "..., right? (tag question)", example: "Das ist teuer, oder?", translation: "That's expensive, right?" },
      { phrase: "..., richtig?", meaning: "..., correct?", example: "Du kommst aus Spanien, richtig?", translation: "You're from Spain, correct?" },
      { phrase: "Ja, genau.", meaning: "Yes, exactly.", example: "— Du wohnst in Bern? — Ja, genau.", translation: "— You live in Bern? — Yes, exactly." },
      { phrase: "Aha, gut!", meaning: "Oh, good!", example: "Aha, gut! Dann bis morgen.", translation: "Oh, good! See you tomorrow then." },
      { phrase: "Also, ...", meaning: "So, ... / Well, ...", example: "Also, ich brauche eine Wohnung.", translation: "So, I need an apartment." },
      { phrase: "Oh, ...", meaning: "Oh, ...", example: "Oh, das ist schön!", translation: "Oh, that's nice!" },
      { phrase: "Ah ja, danke.", meaning: "Oh I see, thanks.", example: "— Es ist an der Marktstrasse. — Ah ja, danke.", translation: "— It's on Marktstrasse. — Oh I see, thanks." },
      { phrase: "noch einmal", meaning: "once more / again", example: "Können Sie das bitte noch einmal sagen?", translation: "Could you say that once more, please?", note: "Key repair strategy when you miss something: noch einmal (or colloquial noch mal). Pair with langsamer, bitte — 'more slowly, please.'" },
    ],
  },
  {
    id: "gern",
    label: "Vorlieben (gern/nicht gern)",
    color: { bg: "#fce7f3", fg: "#9d174d", dot: "#ec4899" },
    items: [
      { phrase: "gern", meaning: "gladly / like to (do something)", example: "Ich arbeite gern.", translation: "I like working.", note: "gern sits right after the conjugated verb — not at the end of the sentence." },
      { phrase: "nicht gern", meaning: "don't like to (do something)", example: "Ich sehe nicht gern fern.", translation: "I don't like watching TV.", note: "nicht gern travels together as one unit, right after the verb — different from the usual nicht placement near the end." },
      { phrase: "gern + separable verb", meaning: "like to ... (prefix still goes to the end)", example: "Ich stehe gern früh auf.", translation: "I like getting up early.", note: "gern stays right after the conjugated verb (stehe); the separable prefix (auf) still moves to the very end." },
      { phrase: "nicht gern + separable verb", meaning: "don't like to ... (prefix still goes to the end)", example: "Ich räume nicht gern auf.", translation: "I don't like tidying up.", note: "Same rule: nicht gern stays as a block after the verb, auf still goes last." },
      { phrase: "Was machst du gern?", meaning: "What do you like to do?", example: "Was machst du gern? — Ich spiele gern Fußball.", translation: "What do you like to do? — I like playing football." },
      { phrase: "Was machst du nicht gern?", meaning: "What don't you like to do?", example: "Was machst du nicht gern? — Ich stehe nicht gern früh auf.", translation: "What don't you like to do? — I don't like getting up early." },
    ],
  },
  {
    id: "negation",
    label: "Negation",
    color: { bg: "#e0e7ff", fg: "#3730a3", dot: "#6366f1" },
    items: [
      { phrase: "nie", meaning: "never", example: "Ich stehe nie früh auf.", translation: "I never get up early." },
      { phrase: "niemand", meaning: "nobody / no one", example: "Niemand ist zu Hause.", translation: "Nobody is home." },
      { phrase: "nicht", meaning: "not", example: "Das ist nicht erlaubt.", translation: "That's not allowed.", note: "Usually goes near the end of the sentence, but right before what's being negated (an adjective, a prefix, etc.)." },
      { phrase: "kein/keine/kein", meaning: "no / not a(ny)", example: "Ich habe keine Zeit.", translation: "I don't have any time.", note: "Used instead of nicht when negating a noun that would otherwise take ein/eine — kein replaces the indefinite article." },
      { phrase: "nichts", meaning: "nothing", example: "Ich sehe nichts.", translation: "I see nothing / I don't see anything." },
    ],
  },
  {
    id: "einkaufen",
    label: "Einkaufen",
    color: { bg: "#fee2e2", fg: "#991b1b", dot: "#ef4444" },
    items: [
      { phrase: "Ich hätte gern ...", meaning: "I'd like ... (polite)", example: "Ich hätte gern Kartoffeln.", translation: "I'd like some potatoes.", note: "More polite/formal than ich möchte — very common way to open a request at a market or counter." },
      { phrase: "Wo finde ich ...?", meaning: "Where do I find ...?", example: "Wo finde ich den Spinat?", translation: "Where do I find the spinach?" },
      { phrase: "Kann ich Ihnen helfen?", meaning: "Can I help you?", example: "Kann ich Ihnen helfen?", translation: "Can I help you?", note: "What the seller says to you — the polite Sie-form. Listen for this when you walk up to a counter." },
      { phrase: "Sonst noch etwas?", meaning: "Anything else?", example: "Sonst noch etwas? — Nein, danke. Das ist alles.", translation: "Anything else? — No thanks, that's everything.", note: "Standard German. In Zürich you may hear a Swiss-German (Mundart) version instead, spelling varies — worth confirming the local form with a native speaker." },
      { phrase: "Das macht dann ... Franken, bitte.", meaning: "That comes to ... francs, please.", example: "Das macht dann 12 Franken 50, bitte.", translation: "That comes to 12.50 francs, please." },
      { phrase: "Nein, tut mir leid.", meaning: "No, I'm sorry.", example: "Haben Sie Eier? — Nein, tut mir leid.", translation: "Do you have eggs? — No, I'm sorry.", note: "Polite way to say something isn't available." },
      { phrase: "Nein, danke. Das ist alles.", meaning: "No thanks, that's everything.", example: "Sonst noch etwas? — Nein, danke. Das ist alles.", translation: "Anything else? — No thanks, that's everything." },
    ],
  },
  {
    id: "ort",
    label: "Ort (hier/dort)",
    color: { bg: "#ccfbf1", fg: "#115e59", dot: "#14b8a6" },
    items: [
      { phrase: "hier", meaning: "here", example: "Das Arbeitszimmer ist hier.", translation: "The study is here." },
      { phrase: "dort", meaning: "there", example: "Die Küche ist dort.", translation: "The kitchen is there." },
      { phrase: "Wo?", meaning: "Where?", example: "Wo ist die Küche? — Dort.", translation: "Where's the kitchen? — There.", note: "hier and dort are the two basic answers to wo? — pair them together when describing a room or apartment." },
    ],
  },
  {
    id: "haben-ausdruecke",
    label: "Ausdrücke mit haben",
    color: { bg: "#ffe4e6", fg: "#9f1239", dot: "#f43f5e" },
    items: [
      { phrase: "Hunger haben", meaning: "to be hungry", example: "Mama, wir haben Hunger.", translation: "Mom, we're hungry.", note: "German uses haben + noun where English uses to be + adjective: ich habe Hunger, not 'ich bin hungrig' in everyday speech." },
      { phrase: "Durst haben", meaning: "to be thirsty", example: "Ich habe Durst.", translation: "I'm thirsty.", note: "Same pattern as Hunger haben." },
      { phrase: "Zeit haben", meaning: "to have time", example: "Ich habe keine Zeit.", translation: "I don't have time.", note: "Negated with keine, since Zeit is a noun — see the Negation category." },
      { phrase: "Angst haben", meaning: "to be afraid", example: "Hab keine Angst!", translation: "Don't be afraid!" },
    ],
  },
  {
    id: "zeitangaben",
    label: "Zeitangaben (Wann?)",
    color: { bg: "#e0e7ff", fg: "#3730a3", dot: "#6366f1" },
    items: [
      { phrase: "am + Tag", meaning: "on (a day / part of day)", example: "Am Montag habe ich Deutsch.", translation: "On Monday I have German.", note: "an + dem → am. Used for days and parts of the day: am Montag, am Morgen, am Wochenende." },
      { phrase: "um + Uhrzeit", meaning: "at (a clock time)", example: "Um zehn Uhr fängt der Kurs an.", translation: "The class starts at ten o'clock.", note: "um is the clock-time preposition: um 7 Uhr, um halb neun." },
      { phrase: "von … bis …", meaning: "from … to / until …", example: "Ich arbeite von neun bis fünf.", translation: "I work from nine to five.", note: "Also for ranges of days: von Montag bis Freitag (Monday to Friday)." },
      { phrase: "am Wochenende", meaning: "on the weekend", example: "Am Wochenende schlafe ich lange.", translation: "On the weekend I sleep in.", note: "am Samstag + am Sonntag = am Wochenende. German uses am here, not 'in'." },
      { phrase: "jetzt", meaning: "now", example: "Wie spät ist es jetzt?", translation: "What time is it now?" },
      { phrase: "heute", meaning: "today", example: "Heute koche ich.", translation: "Today I'm cooking.", note: "Fronted → verb second (V2): Heute koche ich. Family: gestern / heute / morgen." },
      { phrase: "morgen", meaning: "tomorrow", example: "Morgen habe ich frei.", translation: "Tomorrow I'm off.", note: "Lowercase morgen = tomorrow; capitalised der Morgen = the morning." },
      { phrase: "gestern", meaning: "yesterday", example: "Gestern war ich im Kino.", translation: "Yesterday I was at the cinema." },
    ],
  },
  {
    id: "uhrzeit",
    label: "Uhrzeit (Wie spät?)",
    color: { bg: "#fae8ff", fg: "#86198f", dot: "#d946ef" },
    items: [
      { phrase: "Wie spät ist es?", meaning: "What time is it?", example: "Wie spät ist es jetzt? — Es ist zehn Uhr.", translation: "What time is it now? — It's ten o'clock.", note: "Also: Wie viel Uhr ist es? Answer with Es ist …" },
      { phrase: "schon", meaning: "already", example: "Es ist schon zehn Uhr!", translation: "It's already ten o'clock!", note: "schon signals it's later than expected — the opposite feeling to erst." },
      { phrase: "erst", meaning: "only / not until", example: "Es ist erst acht Uhr.", translation: "It's only eight o'clock.", note: "erst plays the time down (earlier than expected): erst acht. Also 'not until': Ich komme erst um zehn." },
      { phrase: "Oh je!", meaning: "Oh no! / Oh dear!", example: "Oh je, ich bin spät dran!", translation: "Oh no, I'm running late!", note: "Mild dismay; also spelled Oje!. spät dran sein = to be running late." },
      { phrase: "Noch so lange!", meaning: "Still so long to go!", example: "Noch so lange bis zur Pause!", translation: "Still so long until the break!", note: "noch = still / yet. (Heard as 'nach so lange' in class — the word is noch.)" },
    ],
  },
  {
    id: "aufgaben",
    label: "Aufgaben · Anweisungen",
    color: { bg: "#e7e5e4", fg: "#44403c", dot: "#78716c" },
    items: [
      { phrase: "Was passt?", meaning: "What fits? / Which matches?", example: "Was passt? Ordnen Sie zu.", translation: "What matches? Match them up.", note: "Classic matching-exercise prompt; usually paired with Ordnen Sie zu." },
      { phrase: "Ordnen Sie zu.", meaning: "Match / assign.", example: "Ordnen Sie die Bilder den Wörtern zu.", translation: "Match the pictures to the words.", note: "From zuordnen (separable) — the prefix zu goes to the end. du-form: Ordne zu." },
      { phrase: "Ergänzen Sie.", meaning: "Complete / fill in.", example: "Ergänzen Sie die Sätze.", translation: "Complete the sentences.", note: "du-form: Ergänze." },
      { phrase: "Kreuzen Sie an.", meaning: "Tick / check (a box).", example: "Kreuzen Sie an: richtig oder falsch?", translation: "Tick the box: true or false?", note: "From ankreuzen (separable). du-form: Kreuz an." },
      { phrase: "Markieren Sie.", meaning: "Mark / highlight.", example: "Markieren Sie das richtige Wort.", translation: "Mark the correct word.", note: "du-form: Markiere." },
      { phrase: "Hören Sie.", meaning: "Listen.", example: "Hören Sie und wiederholen Sie.", translation: "Listen and repeat.", note: "du-form: Hör(e)." },
      { phrase: "Lesen Sie.", meaning: "Read.", example: "Lesen Sie den Text.", translation: "Read the text.", note: "du-form: Lies (stem change e → ie)." },
      { phrase: "Schreiben Sie.", meaning: "Write.", example: "Schreiben Sie die Antwort.", translation: "Write the answer.", note: "du-form: Schreib(e)." },
      { phrase: "Richtig oder falsch?", meaning: "True or false?", example: "Richtig oder falsch? Kreuzen Sie an.", translation: "True or false? Tick the box.", note: "Common comprehension-check prompt." },
    ],
  },
  {
    id: "adverbien",
    label: "Adverbien (Häufigkeit & Grad)",
    color: { bg: "#e0f2fe", fg: "#075985", dot: "#0ea5e9" },
    items: [
      { phrase: "sehr", meaning: "very", example: "Das ist sehr gut.", translation: "That's very good.", note: "Intensifier before adjectives/adverbs: sehr gut, sehr schnell. (Not used with verbs — there you'd use a different word.)" },
      { phrase: "nur", meaning: "only / just", example: "Ich habe nur fünf Franken.", translation: "I only have five francs.", note: "General 'only'. For clock time German prefers erst: Es ist erst acht (see Uhrzeit)." },
      { phrase: "immer", meaning: "always", example: "Er kommt immer zu spät.", translation: "He's always late.", note: "Frequency scale: immer > oft > manchmal > selten > nie." },
      { phrase: "oft", meaning: "often", example: "Ich koche oft.", translation: "I cook often." },
      { phrase: "manchmal", meaning: "sometimes", example: "Manchmal spiele ich Fußball.", translation: "Sometimes I play football.", note: "Fronted → verb second (V2): Manchmal spiele ich …" },
      { phrase: "wieder", meaning: "again", example: "Er ruft wieder an.", translation: "He's calling again.", note: "schon wieder = yet again (often with a touch of annoyance)." },
      { phrase: "natürlich", meaning: "of course / naturally", example: "Natürlich! Kein Problem.", translation: "Of course! No problem." },
    ],
  },
];
