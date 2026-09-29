// ─── DATA ────────────────────────────────────────────────────────────────────
// Each category holds short phrases/words that don't conjugate or decline —
// question words, prepositions/contractions, particles, and conversational
// strategies. Each entry gets a meaning + an example sentence in context.
import type { LessonId } from '../../content/lessons'

export interface PhraseItem {
  phrase: string
  meaning: string
  example: string
  translation: string
  note?: string
  // Lessons this item belongs to. Every existing item predates lesson tagging,
  // so all are backfilled to the A1.1 bucket (decision D3).
  lessons: LessonId[]
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
      { phrase: "wer", meaning: "who", example: "Wer ist da?", translation: "Who's there?", lessons: ["A1.1"] },
      { phrase: "was", meaning: "what", example: "Was kostet das?", translation: "What does that cost?", lessons: ["A1.1"] },
      { phrase: "wo", meaning: "where", example: "Wo wohnen Sie?", translation: "Where do you live?", lessons: ["A1.1"] },
      { phrase: "wohin", meaning: "where to", example: "Wohin gehst du?", translation: "Where are you going (to)?", lessons: ["A1.1"] },
      { phrase: "woher", meaning: "where from", example: "Woher kommst du?", translation: "Where are you from?", lessons: ["A1.1"] },
      { phrase: "wann", meaning: "when", example: "Wann sind Sie zu Hause?", translation: "When are you home?", lessons: ["A1.1"] },
      { phrase: "warum", meaning: "why", example: "Warum lernst du Deutsch?", translation: "Why are you learning German?", lessons: ["A1.1"] },
      { phrase: "wie", meaning: "how", example: "Wie heissen Sie?", translation: "What's your name?", lessons: ["A1.1"] },
      { phrase: "wie viel(e)", meaning: "how much / how many", example: "Wie viele Zimmer hat die Wohnung?", translation: "How many rooms does the apartment have?", lessons: ["A1.1"] },
      { phrase: "wie lange", meaning: "how long", example: "Wie lange bleibst du?", translation: "How long are you staying?", lessons: ["A1.1"] },
      { phrase: "wie gross/breit/hoch/alt", meaning: "how big/wide/high/old", example: "Wie gross ist er denn?", translation: "How tall is he, then?", lessons: ["A1.1"] },
    ],
  },
  {
    id: "partikel",
    label: "Konnektoren & Partikeln",
    color: { bg: "#ede9fe", fg: "#5b21b6", dot: "#8b5cf6" },
    items: [
      { phrase: "aber", meaning: "but", example: "Es ist klein, aber gemütlich.", translation: "It's small, but cosy.", lessons: ["A1.1"] },
      { phrase: "auch", meaning: "also / too", example: "Ich auch.", translation: "Me too.", lessons: ["A1.1"] },
      { phrase: "doch", meaning: "(flexible: yet/but/indeed)", example: "Ist er nicht da? — Doch, er ist da.", translation: "Isn't he there? — Yes he is (contradicting a negative).", note: "One of the trickiest small words: as an answer it contradicts a negative question; mid-sentence it can soften a statement or add emphasis.", lessons: ["A1.1"] },
      { phrase: "vielleicht", meaning: "maybe / perhaps", example: "Vielleicht morgen.", translation: "Maybe tomorrow.", lessons: ["A1.1"] },
      { phrase: "denn", meaning: "(softening particle in questions) / because", example: "Was kostet das denn?", translation: "So what does that cost, then?", note: "In questions, denn softens the tone — adds a conversational 'so...' feel rather than a hard interrogation.", lessons: ["A1.1"] },
      { phrase: "ach", meaning: "oh / ah", example: "Ach so!", translation: "Oh I see!", lessons: ["A1.1"] },
      { phrase: "genau", meaning: "exactly", example: "Ja, genau.", translation: "Yes, exactly.", lessons: ["A1.1"] },
      { phrase: "genug", meaning: "enough", example: "Das ist genug, danke.", translation: "That's enough, thanks.", note: "Comes after the verb/noun it limits: Ich habe genug Geld (I have enough money), Das reicht / das ist genug (that's enough).", lessons: ["A1.1"] },
      { phrase: "und", meaning: "and", example: "Brot und Butter.", translation: "Bread and butter.", note: "The most frequent word in German. Coordinating — joins words or clauses with no change to word order.", lessons: ["A1.1"] },
      { phrase: "oder", meaning: "or", example: "Tee oder Kaffee?", translation: "Tea or coffee?", note: "Coordinating like und (no word-order change). Different from the tag question '…, oder?'.", lessons: ["A1.1"] },
      { phrase: "weil", meaning: "because", example: "Ich bleibe zu Hause, weil ich müde bin.", translation: "I'm staying home because I'm tired.", note: "Subordinating: sends the conjugated verb to the END of its clause (… weil ich müde bin). Contrast denn (= because, but keeps normal order).", lessons: ["A1.1"] },
    ],
  },
  {
    id: "strategien",
    label: "Gesprächsstrategien",
    color: { bg: "#d1fae5", fg: "#065f46", dot: "#10b981" },
    items: [
      { phrase: "Sag mal, ...", meaning: "Tell me, ... / Hey, ...", example: "Sag mal, wo wohnst du jetzt?", translation: "Hey, where do you live now?", lessons: ["A1.1"] },
      { phrase: "Schau mal! / Schauen Sie mal!", meaning: "Look!", example: "Schau mal, das ist günstig!", translation: "Look, that's cheap!", note: "Schau mal = du-form, Schauen Sie mal = Sie-form.", lessons: ["A1.1"] },
      { phrase: "..., oder?", meaning: "..., right? (tag question)", example: "Das ist teuer, oder?", translation: "That's expensive, right?", lessons: ["A1.1"] },
      { phrase: "..., richtig?", meaning: "..., correct?", example: "Du kommst aus Spanien, richtig?", translation: "You're from Spain, correct?", lessons: ["A1.1"] },
      { phrase: "Ja, genau.", meaning: "Yes, exactly.", example: "— Du wohnst in Bern? — Ja, genau.", translation: "— You live in Bern? — Yes, exactly.", lessons: ["A1.1"] },
      { phrase: "Aha, gut!", meaning: "Oh, good!", example: "Aha, gut! Dann bis morgen.", translation: "Oh, good! See you tomorrow then.", lessons: ["A1.1"] },
      { phrase: "Also, ...", meaning: "So, ... / Well, ...", example: "Also, ich brauche eine Wohnung.", translation: "So, I need an apartment.", lessons: ["A1.1"] },
      { phrase: "Oh, ...", meaning: "Oh, ...", example: "Oh, das ist schön!", translation: "Oh, that's nice!", lessons: ["A1.1"] },
      { phrase: "Ah ja, danke.", meaning: "Oh I see, thanks.", example: "— Es ist an der Marktstrasse. — Ah ja, danke.", translation: "— It's on Marktstrasse. — Oh I see, thanks.", lessons: ["A1.1"] },
      { phrase: "noch einmal", meaning: "once more / again", example: "Können Sie das bitte noch einmal sagen?", translation: "Could you say that once more, please?", note: "Key repair strategy when you miss something: noch einmal (or colloquial noch mal). Pair with langsamer, bitte — 'more slowly, please.'", lessons: ["A1.1"] },
    ],
  },
  {
    id: "gern",
    label: "Vorlieben (gern/nicht gern)",
    color: { bg: "#fce7f3", fg: "#9d174d", dot: "#ec4899" },
    items: [
      { phrase: "gern", meaning: "gladly / like to (do something)", example: "Ich arbeite gern.", translation: "I like working.", note: "gern sits right after the conjugated verb — not at the end of the sentence.", lessons: ["A1.1"] },
      { phrase: "nicht gern", meaning: "don't like to (do something)", example: "Ich sehe nicht gern fern.", translation: "I don't like watching TV.", note: "nicht gern travels together as one unit, right after the verb — different from the usual nicht placement near the end.", lessons: ["A1.1"] },
      { phrase: "gern + separable verb", meaning: "like to ... (prefix still goes to the end)", example: "Ich stehe gern früh auf.", translation: "I like getting up early.", note: "gern stays right after the conjugated verb (stehe); the separable prefix (auf) still moves to the very end.", lessons: ["A1.1"] },
      { phrase: "nicht gern + separable verb", meaning: "don't like to ... (prefix still goes to the end)", example: "Ich räume nicht gern auf.", translation: "I don't like tidying up.", note: "Same rule: nicht gern stays as a block after the verb, auf still goes last.", lessons: ["A1.1"] },
      { phrase: "Was machst du gern?", meaning: "What do you like to do?", example: "Was machst du gern? — Ich spiele gern Fussball.", translation: "What do you like to do? — I like playing football.", lessons: ["A1.1"] },
      { phrase: "Was machst du nicht gern?", meaning: "What don't you like to do?", example: "Was machst du nicht gern? — Ich stehe nicht gern früh auf.", translation: "What don't you like to do? — I don't like getting up early.", lessons: ["A1.1"] },
    ],
  },
  {
    id: "negation",
    label: "Negation",
    color: { bg: "#e0e7ff", fg: "#3730a3", dot: "#6366f1" },
    items: [
      { phrase: "nie", meaning: "never", example: "Ich stehe nie früh auf.", translation: "I never get up early.", lessons: ["A1.1"] },
      { phrase: "niemand", meaning: "nobody / no one", example: "Niemand ist zu Hause.", translation: "Nobody is home.", lessons: ["A1.1"] },
      { phrase: "nicht", meaning: "not", example: "Das ist nicht erlaubt.", translation: "That's not allowed.", note: "Usually goes near the end of the sentence, but right before what's being negated (an adjective, a prefix, etc.).", lessons: ["A1.1"] },
      { phrase: "kein/keine/kein", meaning: "no / not a(ny)", example: "Ich habe keine Zeit.", translation: "I don't have any time.", note: "Used instead of nicht when negating a noun that would otherwise take ein/eine — kein replaces the indefinite article.", lessons: ["A1.1"] },
      { phrase: "nichts", meaning: "nothing", example: "Ich sehe nichts.", translation: "I see nothing / I don't see anything.", lessons: ["A1.1"] },
    ],
  },
  {
    id: "einkaufen",
    label: "Einkaufen",
    color: { bg: "#fee2e2", fg: "#991b1b", dot: "#ef4444" },
    items: [
      { phrase: "Ich hätte gern ...", meaning: "I'd like ... (polite)", example: "Ich hätte gern Kartoffeln.", translation: "I'd like some potatoes.", note: "More polite/formal than ich möchte — very common way to open a request at a market or counter.", lessons: ["A1.1"] },
      { phrase: "Wo finde ich ...?", meaning: "Where do I find ...?", example: "Wo finde ich den Spinat?", translation: "Where do I find the spinach?", lessons: ["A1.1"] },
      { phrase: "Kann ich Ihnen helfen?", meaning: "Can I help you?", example: "Kann ich Ihnen helfen?", translation: "Can I help you?", note: "What the seller says to you — the polite Sie-form. Listen for this when you walk up to a counter.", lessons: ["A1.1"] },
      { phrase: "Sonst noch etwas?", meaning: "Anything else?", example: "Sonst noch etwas? — Nein, danke. Das ist alles.", translation: "Anything else? — No thanks, that's everything.", note: "Standard German. In Zürich you may hear a Swiss-German (Mundart) version instead, spelling varies — worth confirming the local form with a native speaker.", lessons: ["A1.1"] },
      { phrase: "Das macht dann ... Franken, bitte.", meaning: "That comes to ... francs, please.", example: "Das macht dann 12 Franken 50, bitte.", translation: "That comes to 12.50 francs, please.", lessons: ["A1.1"] },
      { phrase: "Nein, tut mir leid.", meaning: "No, I'm sorry.", example: "Haben Sie Eier? — Nein, tut mir leid.", translation: "Do you have eggs? — No, I'm sorry.", note: "Polite way to say something isn't available.", lessons: ["A1.1"] },
      { phrase: "Nein, danke. Das ist alles.", meaning: "No thanks, that's everything.", example: "Sonst noch etwas? — Nein, danke. Das ist alles.", translation: "Anything else? — No thanks, that's everything.", lessons: ["A1.1"] },
    ],
  },
  {
    id: "ort",
    label: "Ort (hier/dort)",
    color: { bg: "#ccfbf1", fg: "#115e59", dot: "#14b8a6" },
    items: [
      { phrase: "hier", meaning: "here", example: "Das Arbeitszimmer ist hier.", translation: "The study is here.", lessons: ["A1.1"] },
      { phrase: "dort", meaning: "there", example: "Die Küche ist dort.", translation: "The kitchen is there.", lessons: ["A1.1"] },
      { phrase: "Wo?", meaning: "Where?", example: "Wo ist die Küche? — Dort.", translation: "Where's the kitchen? — There.", note: "hier and dort are the two basic answers to wo? — pair them together when describing a room or apartment.", lessons: ["A1.1"] },
    ],
  },
  {
    id: "haben-ausdruecke",
    label: "Ausdrücke mit haben",
    color: { bg: "#ffe4e6", fg: "#9f1239", dot: "#f43f5e" },
    items: [
      { phrase: "Hunger haben", meaning: "to be hungry", example: "Mama, wir haben Hunger.", translation: "Mom, we're hungry.", note: "German uses haben + noun where English uses to be + adjective: ich habe Hunger, not 'ich bin hungrig' in everyday speech.", lessons: ["A1.1"] },
      { phrase: "Durst haben", meaning: "to be thirsty", example: "Ich habe Durst.", translation: "I'm thirsty.", note: "Same pattern as Hunger haben.", lessons: ["A1.1"] },
      { phrase: "Zeit haben", meaning: "to have time", example: "Ich habe keine Zeit.", translation: "I don't have time.", note: "Negated with keine, since Zeit is a noun — see the Negation category.", lessons: ["A1.1"] },
      { phrase: "Angst haben", meaning: "to be afraid", example: "Hab keine Angst!", translation: "Don't be afraid!", lessons: ["A1.1"] },
    ],
  },
  {
    id: "zeitangaben",
    label: "Zeitangaben (Wann?)",
    color: { bg: "#e0e7ff", fg: "#3730a3", dot: "#6366f1" },
    items: [
      { phrase: "am + Tag", meaning: "on (a day / part of day)", example: "Am Montag habe ich Deutsch.", translation: "On Monday I have German.", note: "an + dem → am. Used for days and parts of the day: am Montag, am Morgen, am Wochenende.", lessons: ["A1.1"] },
      { phrase: "um + Uhrzeit", meaning: "at (a clock time)", example: "Um zehn Uhr fängt der Kurs an.", translation: "The class starts at ten o'clock.", note: "um is the clock-time preposition: um 7 Uhr, um halb neun.", lessons: ["A1.1"] },
      { phrase: "von … bis …", meaning: "from … to / until …", example: "Ich arbeite von neun bis fünf.", translation: "I work from nine to five.", note: "Also for ranges of days: von Montag bis Freitag (Monday to Friday).", lessons: ["A1.1"] },
      { phrase: "am Wochenende", meaning: "on the weekend", example: "Am Wochenende schlafe ich lange.", translation: "On the weekend I sleep in.", note: "am Samstag + am Sonntag = am Wochenende. German uses am here, not 'in'.", lessons: ["A1.1"] },
      { phrase: "jetzt", meaning: "now", example: "Wie spät ist es jetzt?", translation: "What time is it now?", lessons: ["A1.1"] },
      { phrase: "heute", meaning: "today", example: "Heute koche ich.", translation: "Today I'm cooking.", note: "Fronted → verb second (V2): Heute koche ich. Family: gestern / heute / morgen.", lessons: ["A1.1"] },
      { phrase: "morgen", meaning: "tomorrow", example: "Morgen habe ich frei.", translation: "Tomorrow I'm off.", note: "Lowercase morgen = tomorrow; capitalised der Morgen = the morning.", lessons: ["A1.1"] },
      { phrase: "gestern", meaning: "yesterday", example: "Gestern war ich im Kino.", translation: "Yesterday I was at the cinema.", lessons: ["A1.1"] },
    ],
  },
  {
    id: "uhrzeit",
    label: "Uhrzeit (Wie spät?)",
    color: { bg: "#fae8ff", fg: "#86198f", dot: "#d946ef" },
    items: [
      { phrase: "Wie spät ist es?", meaning: "What time is it?", example: "Wie spät ist es jetzt? — Es ist zehn Uhr.", translation: "What time is it now? — It's ten o'clock.", note: "Also: Wie viel Uhr ist es? Answer with Es ist …", lessons: ["A1.1"] },
      { phrase: "schon", meaning: "already", example: "Es ist schon zehn Uhr!", translation: "It's already ten o'clock!", note: "schon signals it's later than expected — the opposite feeling to erst.", lessons: ["A1.1"] },
      { phrase: "erst", meaning: "only / not until", example: "Es ist erst acht Uhr.", translation: "It's only eight o'clock.", note: "erst plays the time down (earlier than expected): erst acht. Also 'not until': Ich komme erst um zehn.", lessons: ["A1.1"] },
      { phrase: "Oh je!", meaning: "Oh no! / Oh dear!", example: "Oh je, ich bin spät dran!", translation: "Oh no, I'm running late!", note: "Mild dismay; also spelled Oje!. spät dran sein = to be running late.", lessons: ["A1.1"] },
      { phrase: "Noch so lange!", meaning: "Still so long to go!", example: "Noch so lange bis zur Pause!", translation: "Still so long until the break!", note: "noch = still / yet. (Heard as 'nach so lange' in class — the word is noch.)", lessons: ["A1.1"] },
    ],
  },
  {
    id: "aufgaben",
    label: "Aufgaben · Anweisungen",
    color: { bg: "#e7e5e4", fg: "#44403c", dot: "#78716c" },
    items: [
      { phrase: "Was passt?", meaning: "What fits? / Which matches?", example: "Was passt? Ordnen Sie zu.", translation: "What matches? Match them up.", note: "Classic matching-exercise prompt; usually paired with Ordnen Sie zu.", lessons: ["A1.1"] },
      { phrase: "Ordnen Sie zu.", meaning: "Match / assign.", example: "Ordnen Sie die Bilder den Wörtern zu.", translation: "Match the pictures to the words.", note: "From zuordnen (separable) — the prefix zu goes to the end. du-form: Ordne zu.", lessons: ["A1.1"] },
      { phrase: "Ergänzen Sie.", meaning: "Complete / fill in.", example: "Ergänzen Sie die Sätze.", translation: "Complete the sentences.", note: "du-form: Ergänze.", lessons: ["A1.1"] },
      { phrase: "Kreuzen Sie an.", meaning: "Tick / check (a box).", example: "Kreuzen Sie an: richtig oder falsch?", translation: "Tick the box: true or false?", note: "From ankreuzen (separable). du-form: Kreuz an.", lessons: ["A1.1"] },
      { phrase: "Markieren Sie.", meaning: "Mark / highlight.", example: "Markieren Sie das richtige Wort.", translation: "Mark the correct word.", note: "du-form: Markiere.", lessons: ["A1.1"] },
      { phrase: "Hören Sie.", meaning: "Listen.", example: "Hören Sie und wiederholen Sie.", translation: "Listen and repeat.", note: "du-form: Hör(e).", lessons: ["A1.1"] },
      { phrase: "Lesen Sie.", meaning: "Read.", example: "Lesen Sie den Text.", translation: "Read the text.", note: "du-form: Lies (stem change e → ie).", lessons: ["A1.1"] },
      { phrase: "Schreiben Sie.", meaning: "Write.", example: "Schreiben Sie die Antwort.", translation: "Write the answer.", note: "du-form: Schreib(e).", lessons: ["A1.1"] },
      { phrase: "Richtig oder falsch?", meaning: "True or false?", example: "Richtig oder falsch? Kreuzen Sie an.", translation: "True or false? Tick the box.", note: "Common comprehension-check prompt.", lessons: ["A1.1"] },
    ],
  },
  {
    id: "adverbien",
    label: "Adverbien (Häufigkeit & Grad)",
    color: { bg: "#e0f2fe", fg: "#075985", dot: "#0ea5e9" },
    items: [
      { phrase: "sehr", meaning: "very", example: "Das ist sehr gut.", translation: "That's very good.", note: "Intensifier before adjectives/adverbs: sehr gut, sehr schnell. (Not used with verbs — there you'd use a different word.)", lessons: ["A1.1"] },
      { phrase: "nur", meaning: "only / just", example: "Ich habe nur fünf Franken.", translation: "I only have five francs.", note: "General 'only'. For clock time German prefers erst: Es ist erst acht (see Uhrzeit).", lessons: ["A1.1"] },
      { phrase: "immer", meaning: "always", example: "Er kommt immer zu spät.", translation: "He's always late.", note: "Frequency scale: immer > oft > manchmal > selten > nie.", lessons: ["A1.1"] },
      { phrase: "oft", meaning: "often", example: "Ich koche oft.", translation: "I cook often.", lessons: ["A1.1"] },
      { phrase: "manchmal", meaning: "sometimes", example: "Manchmal spiele ich Fussball.", translation: "Sometimes I play football.", note: "Fronted → verb second (V2): Manchmal spiele ich …", lessons: ["A1.1", "A1.2-L08"] },
      { phrase: "wieder", meaning: "again", example: "Er ruft wieder an.", translation: "He's calling again.", note: "schon wieder = yet again (often with a touch of annoyance).", lessons: ["A1.1"] },
      { phrase: "natürlich", meaning: "of course / naturally", example: "Natürlich! Kein Problem.", translation: "Of course! No problem.", lessons: ["A1.1"] },
      { phrase: "eigentlich", meaning: "actually / really", example: "Wann bist du eigentlich geboren?", translation: "When were you actually born?", note: "Adverb / modal particle. In questions it makes the tone casual ('by the way, …'); in statements it means 'actually / in fact': Eigentlich habe ich keine Zeit.", lessons: ["A1.2-L08"] },
      { phrase: "später", meaning: "later", example: "Ich habe in Florenz und später in Rom gelebt.", translation: "I lived in Florence and later in Rome.", note: "Time adverb; it is the comparative of spät, used as an adverb. Opposite: früher (earlier). Also as a goodbye: Bis später! (See you later!).", lessons: ["A1.2-L08"] },
      { phrase: "wenig", meaning: "little / not much / few", example: "Ich hatte wenig Arbeit.", translation: "I had little work.", note: "Degree word, mostly used as a quantity adverb before a noun without an ending (wenig Arbeit, wenig Zeit). Opposite: viel. Don't mix up with ein wenig (a little).", lessons: ["A1.2-L08"] },
      { phrase: "dreimal", meaning: "three times", example: "Ich gehe dreimal pro Woche in den Deutschkurs.", translation: "I go to the German course three times a week.", note: "Frequency adverb: number + -mal, written as one word: einmal, zweimal, dreimal. pro Woche = per week.", lessons: ["A1.2-L08"] },
      { phrase: "ganztags", meaning: "full-time / all day", example: "Ich arbeite ganztags.", translation: "I work full time.", note: "Adverb of time: the whole day. Opposite: halbtags. Similar to in Vollzeit arbeiten (see die Vollzeit).", lessons: ["A1.2-L08"] },
      { phrase: "halbtags", meaning: "half-time / part of the day", example: "Sie arbeitet halbtags.", translation: "She works half days.", note: "Adverb of time: only half the day. Opposite: ganztags. Similar to in Teilzeit arbeiten.", lessons: ["A1.2-L08"] },
      { phrase: "vormittags", meaning: "in the mornings", example: "Vormittags arbeite ich von 7 bis 14 Uhr.", translation: "In the mornings I work from 7 to 2 pm.", note: "Time adverb for something that repeats (every morning, 'before noon'). Compare der Vormittag (noun) and am Vormittag (once).", lessons: ["A1.2-L08"] },
      { phrase: "nachmittags", meaning: "in the afternoons", example: "Nachmittags arbeite ich von 13 bis 20 Uhr.", translation: "In the afternoons I work from 1 to 8 pm.", note: "Time adverb for something that repeats every afternoon. Compare der Nachmittag (noun) and am Nachmittag (once).", lessons: ["A1.2-L08"] },
      { phrase: "abends", meaning: "in the evenings", example: "Abends gehe ich in den Deutschkurs.", translation: "In the evenings I go to the German course.", note: "Time adverb for something that repeats every evening. Compare der Abend (noun): am Abend (once, e.g. this evening).", lessons: ["A1.2-L08"] },
      { phrase: "montags", meaning: "on Mondays", example: "Montags habe ich Deutschkurs.", translation: "On Mondays I have German class.", note: "Days + -s = on that day every week. Lowercase adverb: montags (every Monday) vs. am Montag (this coming or one specific Monday).", lessons: ["A1.2-L08"] },
      { phrase: "dienstags", meaning: "on Tuesdays", example: "Dienstags von 15 bis 19 Uhr.", translation: "On Tuesdays from 3 to 7 pm.", note: "Same pattern: day + -s = every week on that day. Compare am Dienstag (one Tuesday).", lessons: ["A1.2-L08"] },
      { phrase: "mittwochs", meaning: "on Wednesdays", example: "Mittwochs arbeite ich zu Hause.", translation: "On Wednesdays I work at home.", note: "Same pattern: day + -s = every week on that day. Compare am Mittwoch (one Wednesday).", lessons: ["A1.2-L08"] },
      { phrase: "donnerstags", meaning: "on Thursdays", example: "Donnerstags gehe ich zum Deutschkurs.", translation: "On Thursdays I go to the German course.", note: "Same pattern: day + -s = every week on that day. Compare am Donnerstag (one Thursday).", lessons: ["A1.2-L08"] },
      { phrase: "freitags", meaning: "on Fridays", example: "Freitags habe ich frei.", translation: "On Fridays I have the day off.", note: "Same pattern: day + -s = every week on that day. Compare am Freitag (one Friday).", lessons: ["A1.2-L08"] },
      { phrase: "samstags", meaning: "on Saturdays", example: "Samstags arbeite ich von 10 bis 18 Uhr.", translation: "On Saturdays I work from 10 am to 6 pm.", note: "Same pattern: day + -s = every week on that day. Compare am Samstag (one Saturday).", lessons: ["A1.2-L08"] },
      { phrase: "sonntags", meaning: "on Sundays", example: "Sonntags schlafe ich lange.", translation: "On Sundays I sleep in.", note: "Same pattern: day + -s = every week on that day. Compare am Sonntag (one Sunday).", lessons: ["A1.2-L08"] },
      { phrase: "jeweils", meaning: "each time / in each case", example: "Jeweils samstags von 10 bis 18 Uhr.", translation: "Each Saturday from 10 am to 6 pm.", note: "Adverb: 'in each case / each time'. Often with times or numbers, and often before a day adverb (jeweils samstags = every Saturday).", lessons: ["A1.2-L08"] },
    ],
  },
  {
    id: "beruf-sprechen",
    label: "Über den Beruf sprechen",
    color: { bg: "#fef3c7", fg: "#92400e", dot: "#f59e0b" },
    items: [
      { phrase: "Was sind Sie von Beruf?", meaning: "What is your job? (formal)", example: "Was sind Sie von Beruf? — Ich bin Ärztin.", translation: "What is your job? — I am a doctor.", note: "Formal Sie-form and the classic way to ask about a profession. Jobs after sein take no article: Ich bin Ärztin.", lessons: ["A1.2-L08"] },
      { phrase: "Was bist du von Beruf?", meaning: "What is your job? (informal)", example: "Was bist du von Beruf? — Ich bin Polizist.", translation: "What is your job? — I am a police officer.", lessons: ["A1.2-L08"] },
      { phrase: "Was machen Sie beruflich?", meaning: "What do you do for a living? (formal)", example: "Was machen Sie beruflich? — Ich arbeite als Kellner.", translation: "What do you do for a living? — I work as a waiter.", note: "beruflich = job-related. Same question as Was sind Sie von Beruf?", lessons: ["A1.2-L08"] },
      { phrase: "Was machst du beruflich?", meaning: "What do you do for a living? (informal)", example: "Was machst du beruflich? — Ich bin Student.", translation: "What do you do for a living? — I am a student.", lessons: ["A1.2-L08"] },
      { phrase: "Ich arbeite als … bei …", meaning: "I work as … at …", example: "Ich arbeite als Hauswart bei «Immowohl».", translation: "I work as a caretaker at 'Immowohl'.", note: "als + job (no article) says what you do; bei + company says where: bei «Immowohl», bei einer Bank.  Short version without a company: Ich bin Mechatronikerin.", lessons: ["A1.2-L08"] },
      { phrase: "Ich bin Schüler(in).", meaning: "I am a pupil / school student.", example: "Ich bin Schülerin.", translation: "I am a (female) pupil.", note: "(in) = add -in for a woman: Schüler / Schülerin.", lessons: ["A1.2-L08"] },
      { phrase: "Ich bin Student(in).", meaning: "I am a university student.", example: "Ich bin Student.", translation: "I am a student.", note: "(in) = add -in for a woman: Student / Studentin.", lessons: ["A1.2-L08"] },
      { phrase: "Ich gehe noch zur Schule.", meaning: "I still go to school.", example: "Ich gehe noch zur Schule. Ich bin 15.", translation: "I still go to school. I am 15.", note: "zur = zu der. Answer for pupils.", lessons: ["A1.2-L08"] },
      { phrase: "Ich studiere noch.", meaning: "I am still studying.", example: "Ich studiere noch. Ich mache bald meinen Abschluss.", translation: "I am still studying. I will soon get my degree.", lessons: ["A1.2-L08"] },
      { phrase: "Ich mache eine Ausbildung als …", meaning: "I am doing training as a …", example: "Ich mache eine Ausbildung als Koch.", translation: "I am doing training as a cook.", note: "eine Ausbildung machen = to do vocational training; als + job.", lessons: ["A1.2-L08"] },
      { phrase: "Ich habe einen Job / eine Stelle als …", meaning: "I have a job / a position as a …", example: "Ich habe eine Stelle als Ärztin.", translation: "I have a job as a doctor.", note: "Job (der) = casual work, Stelle (die) = a position: einen Job, but eine Stelle.", lessons: ["A1.2-L08"] },
      { phrase: "Ich bin angestellt.", meaning: "I am employed.", example: "Ich bin angestellt. Ich arbeite bei einer Bank.", translation: "I am employed. I work at a bank.", note: "Opposite: Ich bin selbstständig.", lessons: ["A1.2-L08"] },
      { phrase: "Ich bin selbstständig.", meaning: "I am self-employed.", example: "Ich bin selbstständig. Ich habe eine eigene Praxis.", translation: "I am self-employed. I have my own practice.", lessons: ["A1.2-L08"] },
      { phrase: "Ich arbeite jetzt nicht.", meaning: "I am not working at the moment.", example: "Ich arbeite jetzt nicht. Ich habe ein Kind.", translation: "I am not working now. I have a child.", lessons: ["A1.2-L08"] },
      { phrase: "Ich bin nicht berufstätig.", meaning: "I am not employed.", example: "Ich bin nicht berufstätig.", translation: "I am not employed.", lessons: ["A1.2-L08"] },
      { phrase: "Ich bin im Moment arbeitslos.", meaning: "I am unemployed at the moment.", example: "Ich bin im Moment arbeitslos.", translation: "I am unemployed at the moment.", note: "im Moment = at the moment. Similar: zurzeit, jetzt.", lessons: ["A1.2-L08"] },
    ],
  },
  {
    id: "privates-sprechen",
    label: "Über Privates sprechen",
    color: { bg: "#ecfccb", fg: "#3f6212", dot: "#84cc16" },
    items: [
      { phrase: "Wann bist du geboren?", meaning: "When were you born?", example: "Wann bist du geboren? — 1988.", translation: "When were you born? — 1988.", note: "ich bin geboren = I was born (sein + geboren). Answer with the year: 1988, or with a date: Am 5. Mai 1988.", lessons: ["A1.2-L08"] },
      { phrase: "Wo bist du geboren?", meaning: "Where were you born?", example: "Wo bist du geboren? — In Madrid.", translation: "Where were you born? — In Madrid.", lessons: ["A1.2-L08"] },
      { phrase: "Wo hast du gelebt / gewohnt?", meaning: "Where did you live?", example: "Wo hast du gelebt? — In Florenz und in Rom.", translation: "Where did you live? — In Florence and in Rome.", note: "Perfekt with haben: hast gelebt / hast gewohnt. Answer with In … und in …", lessons: ["A1.2-L08"] },
      { phrase: "Wann bist du in die Schweiz gekommen?", meaning: "When did you come to Switzerland?", example: "Wann bist du in die Schweiz gekommen? — Vor einem Jahr.", translation: "When did you come to Switzerland? — A year ago.", note: "kommen takes sein in the Perfekt: bist gekommen. in die Schweiz = to (into) Switzerland.", lessons: ["A1.2-L08"] },
      { phrase: "Vor einem Jahr.", meaning: "A year ago.", example: "Ich bin vor einem Jahr in die Schweiz gekommen.", translation: "I came to Switzerland a year ago.", note: "vor + Dativ = ago: vor einem Jahr, vor sechs Monaten, vor zwei Wochen.", lessons: ["A1.2-L08"] },
      { phrase: "Seit wann lernst du schon Deutsch?", meaning: "Since when have you been learning German?", example: "Seit wann lernst du schon Deutsch? — Seit zwei Jahren.", translation: "Since when have you been learning German? — For two years.", note: "seit + Dativ for something that started in the past and still goes on: seit zwei Jahren. German uses Präsens where English uses 'have been'.", lessons: ["A1.2-L08"] },
      { phrase: "Wie lange lernst du schon Deutsch?", meaning: "How long have you been learning German?", example: "Wie lange lernst du schon Deutsch? — Zwei Jahre.", translation: "How long have you been learning German? — Two years.", note: "Same question as Seit wann …?, answered with a length of time: Zwei Jahre.", lessons: ["A1.2-L08"] },
      { phrase: "Seit zwei Jahren.", meaning: "For two years.", example: "Ich lerne seit zwei Jahren Deutsch.", translation: "I have been learning German for two years.", note: "seit + Dativ (plural -n): seit zwei Jahren, seit einem Monat.", lessons: ["A1.2-L08"] },
    ],
  },
  {
    id: "berufserfahrungen",
    label: "Über Berufserfahrungen sprechen",
    color: { bg: "#cffafe", fg: "#155e75", dot: "#06b6d4" },
    items: [
      { phrase: "Ich war Verkäufer(in).", meaning: "I was a shop assistant.", example: "Ich war Verkäuferin in einem Supermarkt.", translation: "I was a shop assistant in a supermarket.", note: "war = Präteritum of sein. (in) = add -in for a woman.", lessons: ["A1.2-L08"] },
      { phrase: "Ich war Architekt(in).", meaning: "I was an architect.", example: "Ich war Architektin.", translation: "I was an architect.", lessons: ["A1.2-L08"] },
      { phrase: "Ich war Koch / Köchin.", meaning: "I was a cook.", example: "Ich war Koch.", translation: "I was a cook.", note: "Koch (man) / Köchin (woman).", lessons: ["A1.2-L08"] },
      { phrase: "Ich war Mitarbeiter(in) bei … / in …", meaning: "I was an employee at … / in …", example: "Ich war Mitarbeiterin bei einer Bank.", translation: "I was an employee at a bank.", note: "bei + company, in + place or department.", lessons: ["A1.2-L08"] },
      { phrase: "Ich hatte viel Arbeit.", meaning: "I had a lot of work.", example: "Ich hatte viel Arbeit und oft Stress.", translation: "I had a lot of work and often stress.", note: "hatte = Präteritum of haben.", lessons: ["A1.2-L08"] },
      { phrase: "Ich hatte wenig Arbeit.", meaning: "I had little work.", example: "Ich hatte wenig Arbeit.", translation: "I had little work.", lessons: ["A1.2-L08"] },
      { phrase: "Ich hatte keine Berufserfahrung.", meaning: "I had no work experience.", example: "Ich hatte ja noch fast keine Berufserfahrung.", translation: "I had almost no work experience yet.", note: "keine (not nicht) negates a noun without an article.", lessons: ["A1.2-L08"] },
      { phrase: "Ich hatte viel Spass.", meaning: "I had a lot of fun.", example: "Ich hatte viel Spass im Job.", translation: "I had a lot of fun at work.", note: "Swiss spelling: Spass (with ss).", lessons: ["A1.2-L08"] },
      { phrase: "Ich hatte keinen Spass.", meaning: "I had no fun.", example: "Ich hatte keinen Spass.", translation: "I had no fun.", note: "keinen because Spass is masculine (Akkusativ).", lessons: ["A1.2-L08"] },
      { phrase: "Der Job war (nicht) einfach.", meaning: "The job was (not) easy.", example: "Der Job war nicht einfach.", translation: "The job was not easy.", note: "war = Präteritum of sein.", lessons: ["A1.2-L08"] },
      { phrase: "Der Chef war (nicht) sehr nett / gut.", meaning: "The boss was (not) very nice / good.", example: "Der Chef war sehr nett.", translation: "The boss was very nice.", lessons: ["A1.2-L08"] },
      { phrase: "Die Arbeitskollegen waren (nicht) sehr nett / gut.", meaning: "The colleagues were (not) very nice / good.", example: "Die Arbeitskollegen waren nett.", translation: "The colleagues were nice.", note: "waren = plural of war.", lessons: ["A1.2-L08"] },
    ],
  },
  {
    id: "telefon-stelle",
    label: "Am Telefon nach einer Stelle fragen",
    color: { bg: "#ffedd5", fg: "#9a3412", dot: "#f97316" },
    items: [
      { phrase: "Guten Tag, mein Name ist …", meaning: "Hello, my name is …", example: "Guten Tag, mein Name ist Szabo.", translation: "Hello, my name is Szabo.", note: "Standard way to start a formal call: give your name first.", lessons: ["A1.2-L08"] },
      { phrase: "Ich habe Ihre Stellenanzeige gelesen.", meaning: "I have read your job advert.", example: "Ich habe Ihre Stellenanzeige gelesen.", translation: "I have read your job advert.", note: "Perfekt: habe … gelesen. Ihre (capital I) = your, formal.", lessons: ["A1.2-L08"] },
      { phrase: "Ich habe Ihr Inserat gelesen.", meaning: "I have read your advert.", example: "Ich habe Ihr Inserat gelesen.", translation: "I have read your advert.", note: "Inserat is the Swiss word for an advert in a newspaper; same as Stellenanzeige.", lessons: ["A1.2-L08"] },
      { phrase: "Sie suchen eine(n) …", meaning: "You are looking for a …", example: "Sie suchen eine Aushilfe.", translation: "You are looking for a temporary worker.", note: "eine(n): eine for feminine nouns (eine Aushilfe), einen for masculine (einen Koch).", lessons: ["A1.2-L08"] },
      { phrase: "Ist die Stelle noch frei?", meaning: "Is the job still available?", example: "Ist die Stelle noch frei?", translation: "Is the job still available?", note: "frei = vacant. The key question when you call about an advert.", lessons: ["A1.2-L08"] },
      { phrase: "Wie ist denn die Arbeitszeit?", meaning: "What are the working hours?", example: "Wie ist denn die Arbeitszeit?", translation: "What are the working hours?", note: "denn softens the question. Answers: ganztags, halbtags, montags bis freitags …", lessons: ["A1.2-L08"] },
      { phrase: "Dann kommen Sie doch mal vorbei.", meaning: "Then come by sometime.", example: "Dann kommen Sie doch mal vorbei.", translation: "Then come by sometime.", note: "vorbeikommen is separable: Sie kommen vorbei. doch mal makes it a friendly invitation.", lessons: ["A1.2-L08"] },
      { phrase: "Können Sie am … um … Uhr?", meaning: "Can you (make it) on … at … o'clock?", example: "Können Sie am Montag um 10 Uhr?", translation: "Can you make it on Monday at 10 o'clock?", note: "Short for Können Sie am … um … Uhr kommen? am + day, um + time.", lessons: ["A1.2-L08"] },
    ],
  },
];
