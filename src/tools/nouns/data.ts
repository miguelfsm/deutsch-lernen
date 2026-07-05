// ─── DATA ────────────────────────────────────────────────────────────────────
// plural: "—" = kein Plural (uncountable / no standard plural form)
export type Article = 'der' | 'die' | 'das'

export interface Noun {
  singular: string
  english: string
  article: Article
  plural: string
  category: string
  note: string
  // A1 example sentence using the noun (with its article) + its English
  // translation. Optional during the Feature B backfill; flipped to required
  // once every noun has one (the final commit of that PR) so the compiler
  // enforces completeness.
  example?: string
  translation?: string
}

export const nounData: Noun[] = [

  // ── Familie ────────────────────────────────────────────────────────────────
  {
    singular: "Vater",      english: "father",              article: "der", plural: "Väter",
    example: "Mein Vater arbeitet viel.", translation: "My father works a lot.",
    category: "Familie",
    note: "Umlaut only — vowel -a- becomes -ä-. Same pattern as Mutter, Bruder, Großvater.",
  },
  {
    singular: "Mutter",     english: "mother",              article: "die", plural: "Mütter",
    example: "Meine Mutter kocht gern.", translation: "My mother likes cooking.",
    category: "Familie",
    note: "Umlaut only. Note: die Eltern (parents) exists only in the plural — there is no singular.",
  },
  {
    singular: "Sohn",       english: "son",                 article: "der", plural: "Söhne",
    example: "Mein Sohn ist fünf Jahre alt.", translation: "My son is five years old.",
    category: "Familie",
    note: "Umlaut + -e ending. A very common masculine plural pattern.",
  },
  {
    singular: "Tochter",    english: "daughter",            article: "die", plural: "Töchter",
    example: "Meine Tochter geht zur Schule.", translation: "My daughter goes to school.",
    category: "Familie",
    note: "Umlaut only — same pattern as Mutter and Schwester.",
  },
  {
    singular: "Bruder",     english: "brother",             article: "der", plural: "Brüder",
    example: "Mein Bruder spielt Fußball.", translation: "My brother plays football.",
    category: "Familie",
    note: "Umlaut only. Contrast with die Schwester → Schwestern (no umlaut, -n ending).",
  },
  {
    singular: "Schwester",  english: "sister",              article: "die", plural: "Schwestern",
    example: "Meine Schwester wohnt in Berlin.", translation: "My sister lives in Berlin.",
    category: "Familie",
    note: "No umlaut — just adds -n. Feminine nouns very rarely take an umlaut in the plural.",
  },
  {
    singular: "Mann",       english: "man / husband",       article: "der", plural: "Männer",
    example: "Der Mann trinkt Kaffee.", translation: "The man is drinking coffee.",
    category: "Familie",
    note: "Umlaut + -er ending. Also means husband in context: mein Mann.",
  },
  {
    singular: "Frau",       english: "woman / wife",        article: "die", plural: "Frauen",
    example: "Die Frau kauft Brot.", translation: "The woman is buying bread.",
    category: "Familie",
    note: "No umlaut, adds -en. Also means wife in context: meine Frau.",
  },
  {
    singular: "Kind",       english: "child",               article: "das", plural: "Kinder",
    example: "Das Kind spielt im Garten.", translation: "The child is playing in the garden.",
    category: "Familie",
    note: "-er ending, no umlaut. One of the most essential neuter nouns in German.",
  },
  {
    singular: "Großvater",  english: "grandfather",         article: "der", plural: "Großväter",
    example: "Mein Großvater wohnt auf dem Land.", translation: "My grandfather lives in the countryside.",
    category: "Familie",
    note: "Compound: groß + Vater. The plural follows Vater → Väter.",
  },
  {
    singular: "Großmutter", english: "grandmother",         article: "die", plural: "Großmütter",
    example: "Meine Großmutter backt einen Kuchen.", translation: "My grandmother is baking a cake.",
    category: "Familie",
    note: "Compound: groß + Mutter. Follows Mutter → Mütter.",
  },
  {
    singular: "Onkel",      english: "uncle",               article: "der", plural: "Onkel",
    example: "Mein Onkel wohnt in Hamburg.", translation: "My uncle lives in Hamburg.",
    category: "Familie",
    note: "No change in the plural! Many masculine nouns ending in -el stay the same.",
  },
  {
    singular: "Tante",      english: "aunt",                article: "die", plural: "Tanten",
    example: "Meine Tante trinkt gern Tee.", translation: "My aunt likes drinking tea.",
    category: "Familie",
    note: "Adds -n. Borrowed from French tante.",
  },
  {
    singular: "Cousin",     english: "male cousin",         article: "der", plural: "Cousins",
    example: "Mein Cousin ist sehr nett.", translation: "My (male) cousin is very nice.",
    category: "Familie",
    note: "Borrowed from French — takes -s in the plural, like most foreign loanwords.",
  },
  {
    singular: "Cousine",    english: "female cousin",       article: "die", plural: "Cousinen",
    example: "Meine Cousine lernt Deutsch.", translation: "My (female) cousin is learning German.",
    category: "Familie",
    note: "Also from French. Note the -e ending for the feminine form.",
  },

  // ── Supermarkt ─────────────────────────────────────────────────────────────
  {
    singular: "Brot",       english: "bread",               article: "das", plural: "Brote",
    example: "Das Brot ist frisch.", translation: "The bread is fresh.",
    category: "Supermarkt",
    note: "Adds -e. A common pattern for many one-syllable neuter nouns.",
  },
  {
    singular: "Brötchen",   english: "bread roll",          article: "das", plural: "Brötchen",
    example: "Ich esse ein Brötchen.", translation: "I am eating a bread roll.",
    category: "Supermarkt",
    note: "No change — all -chen diminutives are unchanged in the plural.",
  },
  {
    singular: "Milch",      english: "milk",                article: "die", plural: "—",
    example: "Die Milch ist kalt.", translation: "The milk is cold.",
    category: "Supermarkt",
    note: "Uncountable. If counting servings, use: eine Tüte Milch (a carton of milk).",
  },
  {
    singular: "Käse",       english: "cheese",              article: "der", plural: "Käse",
    example: "Der Käse kommt aus der Schweiz.", translation: "The cheese comes from Switzerland.",
    category: "Supermarkt",
    note: "No change. Most masculine nouns ending in -e stay the same in the plural.",
  },
  {
    singular: "Fleisch",    english: "meat",                article: "das", plural: "—",
    example: "Ich esse kein Fleisch.", translation: "I don't eat meat.",
    category: "Supermarkt",
    note: "Uncountable. Use ein Stück Fleisch (a piece of meat) if you need to portion it.",
  },
  {
    singular: "Fisch",      english: "fish",                article: "der", plural: "Fische",
    example: "Der Fisch ist frisch.", translation: "The fish is fresh.",
    category: "Supermarkt",
    note: "Adds -e. As food: Ich esse Fisch. As animals: die Fische.",
  },
  {
    singular: "Ei",         english: "egg",                 article: "das", plural: "Eier",
    example: "Ich koche ein Ei.", translation: "I am boiling an egg.",
    category: "Supermarkt",
    note: "Adds -er. Common neuter plural pattern — same as Buch → Bücher, Kind → Kinder.",
  },
  {
    singular: "Butter",     english: "butter",              article: "die", plural: "—",
    example: "Die Butter ist im Kühlschrank.", translation: "The butter is in the fridge.",
    category: "Supermarkt",
    note: "Uncountable. Regional dialects sometimes use die Buttern but avoid it in standard German.",
  },
  {
    singular: "Joghurt",    english: "yogurt",              article: "der", plural: "Joghurts",
    example: "Ich esse einen Joghurt.", translation: "I am eating a yogurt.",
    category: "Supermarkt",
    note: "Takes -s — typical for foreign loanwords. Also das Joghurt in Austrian German.",
  },
  {
    singular: "Sandwich",   english: "sandwich",            article: "das", plural: "Sandwiches",
    example: "Ich mache ein Sandwich.", translation: "I am making a sandwich.",
    category: "Supermarkt",
    note: "English loanword — keeps the English plural. Also acceptable: die Sandwichs.",
  },
  {
    singular: "Wurst",      english: "sausage",             article: "die", plural: "Würste",
    example: "Die Wurst ist lecker.", translation: "The sausage is delicious.",
    category: "Supermarkt",
    note: "Umlaut + -e. One of the most iconic German food words!",
  },
  {
    singular: "Würstchen",  english: "small sausage",       article: "das", plural: "Würstchen",
    example: "Das Kind isst ein Würstchen.", translation: "The child is eating a small sausage.",
    category: "Supermarkt",
    note: "Diminutive of Wurst with -chen suffix → no plural change.",
  },
  {
    singular: "Apfel",      english: "apple",               article: "der", plural: "Äpfel",
    example: "Der Apfel ist rot.", translation: "The apple is red.",
    category: "Supermarkt",
    note: "Umlaut only — same pattern as Vater, Bruder, Mantel.",
  },
  {
    singular: "Banane",     english: "banana",              article: "die", plural: "Bananen",
    example: "Ich esse eine Banane.", translation: "I am eating a banana.",
    category: "Supermarkt",
    note: "Adds -n. Standard feminine -e noun plural.",
  },
  {
    singular: "Saft",       english: "juice",               article: "der", plural: "Säfte",
    example: "Ich trinke einen Saft.", translation: "I am drinking a juice.",
    category: "Supermarkt",
    note: "Umlaut + -e. Very common: masculine one-syllable nouns often follow this pattern.",
  },
  {
    singular: "Wasser",     english: "water",               article: "das", plural: "Wasser",
    example: "Ich trinke viel Wasser.", translation: "I drink a lot of water.",
    category: "Supermarkt",
    note: "No change as a substance. Countable for types or bottles: zwei Wasser, bitte.",
  },
  {
    singular: "Wein",       english: "wine",                article: "der", plural: "Weine",
    example: "Der Wein ist rot.", translation: "The wine is red.",
    category: "Supermarkt",
    note: "Adds -e. Simple and very regular.",
  },
  {
    singular: "Bier",       english: "beer",                article: "das", plural: "Biere",
    example: "Das Bier ist kalt.", translation: "The beer is cold.",
    category: "Supermarkt",
    note: "Adds -e. Zwei Biere, bitte! A common phrase at any Biergarten.",
  },
  {
    singular: "Kaffee",     english: "coffee",              article: "der", plural: "Kaffees",
    example: "Ich trinke einen Kaffee.", translation: "I am drinking a coffee.",
    category: "Supermarkt",
    note: "Adds -s — the loanword plural pattern. Also: einen Kaffee, bitte (ordering one coffee).",
  },
  {
    singular: "Tee",        english: "tea",                 article: "der", plural: "Tees",
    example: "Der Tee ist heiß.", translation: "The tea is hot.",
    category: "Supermarkt",
    note: "Adds -s — same loanword pattern as Kaffee. Borrowed via Dutch thee from Mandarin chá.",
  },

  // ── Zuhause ────────────────────────────────────────────────────────────────
  {
    singular: "Haus",       english: "house",               article: "das", plural: "Häuser",
    category: "Zuhause",
    note: "Umlaut + -er. One of the most common neuter nouns — every learner needs this one.",
  },
  {
    singular: "Wohnung",    english: "apartment / flat",    article: "die", plural: "Wohnungen",
    category: "Zuhause",
    note: "Adds -en. Feminine nouns with the -ung suffix always take -en in the plural.",
  },
  {
    singular: "Zimmer",     english: "room",                article: "das", plural: "Zimmer",
    category: "Zuhause",
    note: "No change. Neuter nouns ending in -er are unchanged in the plural.",
  },
  {
    singular: "Küche",      english: "kitchen",             article: "die", plural: "Küchen",
    category: "Zuhause",
    note: "Adds -n. Also means cuisine: die deutsche Küche (German cuisine).",
  },
  {
    singular: "Badezimmer", english: "bathroom",            article: "das", plural: "Badezimmer",
    category: "Zuhause",
    note: "Compound: das Bad + das Zimmer. Both parts neuter, result is unchanged in the plural.",
  },
  {
    singular: "Wohnzimmer", english: "living room",         article: "das", plural: "Wohnzimmer",
    category: "Zuhause",
    note: "Compound: wohnen (to live) + Zimmer. Unchanged in the plural.",
  },
  {
    singular: "Tisch",      english: "table",               article: "der", plural: "Tische",
    category: "Zuhause",
    note: "Adds -e. A very regular masculine one-syllable noun.",
  },
  {
    singular: "Stuhl",      english: "chair",               article: "der", plural: "Stühle",
    category: "Zuhause",
    note: "Umlaut + -e. Contrast with der Tisch → Tische (same ending, but no umlaut).",
  },
  {
    singular: "Bett",       english: "bed",                 article: "das", plural: "Betten",
    category: "Zuhause",
    note: "Adds -en. Common neuter noun.",
  },
  {
    singular: "Schrank",    english: "cupboard / wardrobe", article: "der", plural: "Schränke",
    category: "Zuhause",
    note: "Umlaut + -e. Der Kühlschrank (fridge) follows the exact same pattern.",
  },
  {
    singular: "Tür",        english: "door",                article: "die", plural: "Türen",
    category: "Zuhause",
    note: "Adds -en. Short feminine nouns often take -en in the plural.",
  },
  {
    singular: "Fenster",    english: "window",              article: "das", plural: "Fenster",
    category: "Zuhause",
    note: "No change. Neuter noun ending in -er.",
  },
  {
    singular: "Wand",       english: "wall",                article: "die", plural: "Wände",
    category: "Zuhause",
    note: "Umlaut + -e. Refers to an interior wall. An exterior/outdoor wall is die Mauer instead.",
  },
  {
    singular: "Treppe",     english: "stairs / staircase",  article: "die", plural: "Treppen",
    category: "Zuhause",
    note: "Adds -n. Regular feminine noun ending in -e.",
  },
  {
    singular: "Schlüssel",  english: "key",                 article: "der", plural: "Schlüssel",
    category: "Zuhause",
    note: "No change — masculine nouns ending in -el often stay the same (like Onkel).",
  },
  {
    singular: "Lampe",      english: "lamp",                article: "die", plural: "Lampen",
    category: "Zuhause",
    note: "Adds -n. Very regular feminine -e noun.",
  },
  {
    singular: "Sofa",          english: "sofa / couch",           article: "das", plural: "Sofas",
    category: "Zuhause",
    note: "Adds -s — the loanword plural pattern. Italian origin via Arabic ṣuffa.",
  },
  {
    singular: "Regal",         english: "shelf / bookcase",       article: "das", plural: "Regale",
    category: "Zuhause",
    note: "Adds -e. Das Regal — neuter, not der or die. From Latin regalis (royal), via French. A common learner mistake is the gender!",
  },
  {
    singular: "Fernseher",     english: "television / TV",        article: "der", plural: "Fernseher",
    category: "Zuhause",
    note: "No change. Compound: fern (far) + sehen (to see) + -er (device suffix). Der Fernseher läuft (the TV is on).",
  },
  {
    singular: "Sessel",        english: "armchair",               article: "der", plural: "Sessel",
    category: "Zuhause",
    note: "No change — masculine -el noun. Distinct from der Stuhl (upright chair): a Sessel is padded and comfortable.",
  },
  {
    singular: "Teppich",       english: "carpet / rug",           article: "der", plural: "Teppiche",
    category: "Zuhause",
    note: "Adds -e. Der Teppichboden is wall-to-wall carpet. Der Teppich is a freestanding rug.",
  },
  {
    singular: "Schreibtisch",  english: "desk / writing table",   article: "der", plural: "Schreibtische",
    category: "Zuhause",
    note: "Adds -e. Compound: schreiben (to write) + Tisch (table). Am Schreibtisch sitzen (to sit at the desk).",
  },
  {
    singular: "Dusche",        english: "shower",                 article: "die", plural: "Duschen",
    category: "Zuhause",
    note: "Adds -n. Also used as a verb: duschen (to shower). Ich dusche jeden Morgen.",
  },
  {
    singular: "Badewanne",     english: "bathtub",                article: "die", plural: "Badewannen",
    category: "Zuhause",
    note: "Adds -n. Compound: das Bad (bath) + die Wanne (tub/basin). In der Badewanne liegen (to lie in the bath).",
  },
  {
    singular: "Waschbecken",   english: "sink / washbasin",       article: "das", plural: "Waschbecken",
    category: "Zuhause",
    note: "No change. Compound: waschen (to wash) + das Becken (basin). Neuter -en noun — unchanged in plural.",
  },
  {
    singular: "Toilette",      english: "toilet",                 article: "die", plural: "Toiletten",
    category: "Zuhause",
    note: "Adds -en. Borrowed from French toilette. Wo ist die Toilette? is essential A1 vocabulary!",
  },
  {
    singular: "Waschmaschine", english: "washing machine",        article: "die", plural: "Waschmaschinen",
    category: "Zuhause",
    note: "Adds -n. Compound: waschen + die Maschine. Die Wäsche waschen (to do the laundry) often pairs with this.",
  },
  {
    singular: "Elektrogerät",  english: "electrical appliance",   article: "das", plural: "Elektrogeräte",
    category: "Zuhause",
    note: "Adds -e. Compound: elektro- + das Gerät (device/appliance). A useful umbrella term for all household electronics.",
  },

  // ── Tiere ──────────────────────────────────────────────────────────────────
  {
    singular: "Hund",       english: "dog",                 article: "der", plural: "Hunde",
    category: "Tiere",
    note: "Adds -e. One of the first nouns every German learner meets.",
  },
  {
    singular: "Katze",      english: "cat",                 article: "die", plural: "Katzen",
    category: "Tiere",
    note: "Adds -n. Feminine nouns ending in -e almost always follow this pattern.",
  },
  {
    singular: "Vogel",      english: "bird",                article: "der", plural: "Vögel",
    category: "Tiere",
    note: "Umlaut only — same pattern as der Apfel → Äpfel. Vowel -o- becomes -ö-.",
  },
  {
    singular: "Pferd",      english: "horse",               article: "das", plural: "Pferde",
    category: "Tiere",
    note: "Adds -e. Note the gender: das Pferd (neuter), not der or die.",
  },
  {
    singular: "Kuh",        english: "cow",                 article: "die", plural: "Kühe",
    category: "Tiere",
    note: "Umlaut + -e. Short feminine noun.",
  },
  {
    singular: "Schwein",    english: "pig",                 article: "das", plural: "Schweine",
    category: "Tiere",
    note: "Adds -e. Also heard colloquially in Schwein gehabt! (got lucky!).",
  },
  {
    singular: "Löwe",       english: "lion",                article: "der", plural: "Löwen",
    category: "Tiere",
    note: "Adds -n. A weak masculine noun (N-Deklination) — takes -n/-en in all cases except nominative.",
  },
  {
    singular: "Bär",        english: "bear",                article: "der", plural: "Bären",
    category: "Tiere",
    note: "Adds -en. Also a weak masculine noun. The bear is the symbol of Berlin.",
  },
  {
    singular: "Maus",       english: "mouse",               article: "die", plural: "Mäuse",
    category: "Tiere",
    note: "Umlaut + -e. Also the computer mouse: die Computermaus → die Computermäuse.",
  },
  {
    singular: "Affe",       english: "monkey / ape",        article: "der", plural: "Affen",
    category: "Tiere",
    note: "Adds -n. Another weak masculine noun.",
  },
  {
    singular: "Schlange",   english: "snake",               article: "die", plural: "Schlangen",
    category: "Tiere",
    note: "Adds -n. Also means queue or line: in der Schlange stehen (to queue).",
  },
  {
    singular: "Elefant",    english: "elephant",            article: "der", plural: "Elefanten",
    category: "Tiere",
    note: "Adds -en. Weak masculine noun.",
  },
  {
    singular: "Ente",       english: "duck",                article: "die", plural: "Enten",
    category: "Tiere",
    note: "Adds -n. Often heard at ponds: Enten füttern! (feeding the ducks).",
  },
  {
    singular: "Hase",       english: "rabbit / hare",       article: "der", plural: "Hasen",
    category: "Tiere",
    note: "Adds -n. Weak masculine noun. The Easter Bunny is der Osterhase.",
  },

  // ── Kleidung ───────────────────────────────────────────────────────────────
  {
    singular: "Hemd",       english: "shirt",               article: "das", plural: "Hemden",
    category: "Kleidung",
    note: "Adds -en. Das Hemd is a dress shirt; das T-Shirt is the casual one.",
  },
  {
    singular: "Hose",       english: "trousers / pants",    article: "die", plural: "Hosen",
    category: "Kleidung",
    note: "Adds -n. Die Hose is grammatically singular in German — one pair, one noun.",
  },
  {
    singular: "Rock",       english: "skirt",               article: "der", plural: "Röcke",
    category: "Kleidung",
    note: "Umlaut + -e. Also means music genre (der Rock) or a coat (archaic).",
  },
  {
    singular: "Jacke",      english: "jacket",              article: "die", plural: "Jacken",
    category: "Kleidung",
    note: "Adds -n. Regular feminine -e noun.",
  },
  {
    singular: "Mantel",     english: "coat / overcoat",     article: "der", plural: "Mäntel",
    category: "Kleidung",
    note: "Umlaut only — same pattern as Apfel and Vogel (short vowel + -el ending).",
  },
  {
    singular: "Schuh",      english: "shoe",                article: "der", plural: "Schuhe",
    category: "Kleidung",
    note: "Adds -e. Usually comes in pairs: die Schuhe.",
  },
  {
    singular: "Socke",      english: "sock",                article: "die", plural: "Socken",
    category: "Kleidung",
    note: "Adds -n. Usually in pairs: ein Paar Socken.",
  },
  {
    singular: "Mütze",      english: "hat / beanie",        article: "die", plural: "Mützen",
    category: "Kleidung",
    note: "Adds -n. Specifically a knitted or soft hat — die Kappe is a baseball cap.",
  },
  {
    singular: "Kleid",      english: "dress",               article: "das", plural: "Kleider",
    category: "Kleidung",
    note: "Adds -er. Plural die Kleider can also mean clothes in general.",
  },
  {
    singular: "Pullover",   english: "sweater / jumper",    article: "der", plural: "Pullover",
    category: "Kleidung",
    note: "No change — loanword ending in -er stays the same. From English pull-over.",
  },
  {
    singular: "Bluse",      english: "blouse",              article: "die", plural: "Blusen",
    category: "Kleidung",
    note: "Adds -n. Borrowed from French blouse.",
  },
  {
    singular: "T-Shirt",    english: "T-shirt",             article: "das", plural: "T-Shirts",
    category: "Kleidung",
    note: "Adds -s — English loanword takes the English plural.",
  },

  // ── Körper ─────────────────────────────────────────────────────────────────
  {
    singular: "Kopf",       english: "head",                article: "der", plural: "Köpfe",
    category: "Körper",
    note: "Umlaut + -e. Also means leader or top: der Bahnhofskopf (station end).",
  },
  {
    singular: "Auge",       english: "eye",                 article: "das", plural: "Augen",
    category: "Körper",
    note: "Adds -n. Das Auge is neuter but takes the -n plural — an exception to watch for.",
  },
  {
    singular: "Nase",       english: "nose",                article: "die", plural: "Nasen",
    category: "Körper",
    note: "Adds -n. Regular feminine -e noun.",
  },
  {
    singular: "Mund",       english: "mouth",               article: "der", plural: "Münder",
    category: "Körper",
    note: "Umlaut + -er. A less common plural pattern for masculine nouns.",
  },
  {
    singular: "Ohr",        english: "ear",                 article: "das", plural: "Ohren",
    category: "Körper",
    note: "Adds -en. Neuter noun with -en plural — another exception to note.",
  },
  {
    singular: "Arm",        english: "arm",                 article: "der", plural: "Arme",
    category: "Körper",
    note: "Adds -e. Very regular masculine noun.",
  },
  {
    singular: "Hand",       english: "hand",                article: "die", plural: "Hände",
    category: "Körper",
    note: "Umlaut + -e. Die Hände is very common: Hände waschen! (wash your hands!).",
  },
  {
    singular: "Bein",       english: "leg",                 article: "das", plural: "Beine",
    category: "Körper",
    note: "Adds -e. Also means bone in some compounds: das Gebein.",
  },
  {
    singular: "Fuß",        english: "foot",                article: "der", plural: "Füße",
    category: "Körper",
    note: "Umlaut + -e. Common phrase: zu Fuß gehen (to go on foot).",
  },
  {
    singular: "Finger",     english: "finger",              article: "der", plural: "Finger",
    category: "Körper",
    note: "No change. Masculine nouns ending in -er are almost always unchanged in the plural.",
  },
  {
    singular: "Bauch",      english: "belly / stomach",     article: "der", plural: "Bäuche",
    category: "Körper",
    note: "Umlaut + -e.",
  },
  {
    singular: "Gesicht",    english: "face",                article: "das", plural: "Gesichter",
    category: "Körper",
    note: "Adds -er. Same pattern as das Kind → Kinder and das Haus → Häuser.",
  },

  // ── Schule ─────────────────────────────────────────────────────────────────
  {
    singular: "Schule",       english: "school",                article: "die", plural: "Schulen",
    category: "Schule",
    note: "Adds -n. Die Schule also refers to the school building itself: Ich gehe zur Schule.",
  },
  {
    singular: "Lehrer",       english: "(male) teacher",        article: "der", plural: "Lehrer",
    category: "Schule",
    note: "No change — masculine nouns ending in -er are unchanged in the plural.",
  },
  {
    singular: "Lehrerin",     english: "(female) teacher",      article: "die", plural: "Lehrerinnen",
    category: "Schule",
    note: "Adds -nen. The standard way to make a feminine job title: Lehrer → Lehrerin → Lehrerinnen.",
  },
  {
    singular: "Buch",         english: "book",                  article: "das", plural: "Bücher",
    category: "Schule",
    note: "Umlaut + -er. Same pattern as das Haus → Häuser and das Fach → Fächer.",
  },
  {
    singular: "Heft",         english: "exercise book / notebook", article: "das", plural: "Hefte",
    category: "Schule",
    note: "Adds -e. Very common word — every German pupil carries several Hefte.",
  },
  {
    singular: "Stift",        english: "pen / pencil",          article: "der", plural: "Stifte",
    category: "Schule",
    note: "Adds -e. Generic term for any writing instrument. Bleistift is specifically a pencil.",
  },
  {
    singular: "Tafel",        english: "board (black- or white-)", article: "die", plural: "Tafeln",
    category: "Schule",
    note: "Adds -n. Also means bar of chocolate: eine Tafel Schokolade.",
  },
  {
    singular: "Rucksack",     english: "backpack / rucksack",   article: "der", plural: "Rucksäcke",
    category: "Schule",
    note: "Umlaut + -e. Compound: der Rücken (back) + der Sack (bag).",
  },
  {
    singular: "Klasse",       english: "class / year group",    article: "die", plural: "Klassen",
    category: "Schule",
    note: "Adds -n. Also means classroom in context: Wir gehen in die Klasse.",
  },
  {
    singular: "Hausaufgabe",  english: "homework (one task)",   article: "die", plural: "Hausaufgaben",
    category: "Schule",
    note: "Adds -n. Compound: das Haus + die Aufgabe (task). Usually used in the plural: die Hausaufgaben.",
  },
  {
    singular: "Prüfung",      english: "exam / test",           article: "die", plural: "Prüfungen",
    category: "Schule",
    note: "Adds -en. Feminine -ung nouns always take -en in the plural — same as Wohnung, Besprechung.",
  },
  {
    singular: "Note",         english: "grade / mark",          article: "die", plural: "Noten",
    category: "Schule",
    note: "Adds -n. Also means musical note. German grades run 1 (very good) to 6 (unsatisfactory).",
  },
  {
    singular: "Fach",         english: "subject",               article: "das", plural: "Fächer",
    category: "Schule",
    note: "Umlaut + -er. Also means compartment or drawer. Mein Lieblingsfach is my favourite subject.",
  },
  {
    singular: "Pause",        english: "break / recess",        article: "die", plural: "Pausen",
    category: "Schule",
    note: "Adds -n. Also used at work and in music: eine Pause machen (to take a break).",
  },

  // ── Arbeit ─────────────────────────────────────────────────────────────────
  {
    singular: "Büro",         english: "office",                article: "das", plural: "Büros",
    category: "Arbeit",
    note: "Adds -s — loanword plural. Borrowed from French bureau. Ins Büro gehen (to go to the office).",
  },
  {
    singular: "Beruf",        english: "profession / occupation", article: "der", plural: "Berufe",
    category: "Arbeit",
    note: "Adds -e. Was sind Sie von Beruf? (What do you do for a living?) is a key A1 phrase.",
  },
  {
    singular: "Chef",         english: "boss / manager",        article: "der", plural: "Chefs",
    category: "Arbeit",
    note: "Adds -s — loanword plural. Borrowed from French chef. Die Chefin is the female form.",
  },
  {
    singular: "Kollege",      english: "(male) colleague",      article: "der", plural: "Kollegen",
    category: "Arbeit",
    note: "Adds -n. A weak masculine noun (N-Deklination). Die Kollegin is the female form.",
  },
  {
    singular: "Kollegin",     english: "(female) colleague",    article: "die", plural: "Kolleginnen",
    category: "Arbeit",
    note: "Adds -nen. Standard feminine form — same pattern as Lehrerin → Lehrerinnen.",
  },
  {
    singular: "Gehalt",       english: "salary / wage",         article: "das", plural: "Gehälter",
    category: "Arbeit",
    note: "Umlaut + -er. Distinct from der Lohn (hourly wage): Gehalt is a fixed monthly salary.",
  },
  {
    singular: "Besprechung",  english: "meeting / discussion",  article: "die", plural: "Besprechungen",
    category: "Arbeit",
    note: "Adds -en. Feminine -ung noun. More formal than das Meeting (loanword).",
  },
  {
    singular: "Computer",     english: "computer",              article: "der", plural: "Computer",
    category: "Arbeit",
    note: "No change — masculine loanwords ending in -er are unchanged in the plural.",
  },
  {
    singular: "Termin",       english: "appointment / deadline", article: "der", plural: "Termine",
    category: "Arbeit",
    note: "Adds -e. Very common: einen Termin machen (to make an appointment).",
  },
  {
    singular: "Projekt",      english: "project",               article: "das", plural: "Projekte",
    category: "Arbeit",
    note: "Adds -e. International loanword — same root as the English word.",
  },
  {
    singular: "Urlaub",       english: "holiday / vacation",    article: "der", plural: "Urlaube",
    category: "Arbeit",
    note: "Adds -e. Im Urlaub sein (to be on holiday). Usually used in the singular: Ich mache Urlaub.",
  },
  {
    singular: "Stelle",       english: "job / position",        article: "die", plural: "Stellen",
    category: "Arbeit",
    note: "Adds -n. Eine Stelle suchen means to look for a job. Distinct from der Job (casual work).",
  },
  {
    singular: "E-Mail",       english: "email",                 article: "die", plural: "E-Mails",
    category: "Arbeit",
    note: "Adds -s. Always feminine in German: eine E-Mail schreiben (to write an email).",
  },
  {
    singular: "Vertrag",      english: "contract",              article: "der", plural: "Verträge",
    category: "Arbeit",
    note: "Umlaut + -e. Einen Vertrag unterschreiben (to sign a contract).",
  },

  // ── Freizeit ───────────────────────────────────────────────────────────────
  {
    singular: "Hobby",        english: "hobby",                 article: "das", plural: "Hobbys",
    category: "Freizeit",
    note: "Adds -s — loanword plural. Was sind Ihre Hobbys? (What are your hobbies?) is a classic A1 question.",
  },
  {
    singular: "Film",         english: "film / movie",          article: "der", plural: "Filme",
    category: "Freizeit",
    note: "Adds -e. Einen Film anschauen (to watch a film). Der Lieblingsfilm is one's favourite film.",
  },
  {
    singular: "Kino",         english: "cinema",                article: "das", plural: "Kinos",
    category: "Freizeit",
    note: "Adds -s. Ins Kino gehen (to go to the cinema). Short for Kinematograph.",
  },
  {
    singular: "Musik",        english: "music",                 article: "die", plural: "—",
    category: "Freizeit",
    note: "Uncountable. Ich höre Musik (I listen to music) is one of the most useful A1 sentences.",
  },
  {
    singular: "Konzert",      english: "concert",               article: "das", plural: "Konzerte",
    category: "Freizeit",
    note: "Adds -e. Ins Konzert gehen (to go to a concert). Also used for classical recitals.",
  },
  {
    singular: "Spiel",        english: "game",                  article: "das", plural: "Spiele",
    category: "Freizeit",
    note: "Adds -e. Covers board games, video games, and sports matches. Ein Spiel spielen (to play a game).",
  },
  {
    singular: "Reise",        english: "trip / journey",        article: "die", plural: "Reisen",
    category: "Freizeit",
    note: "Adds -n. Eine Reise machen (to go on a trip). Gute Reise! is the German for 'have a good journey!'.",
  },
  {
    singular: "Fahrrad",      english: "bicycle",               article: "das", plural: "Fahrräder",
    category: "Freizeit",
    note: "Umlaut + -er. Compound: fahren (to travel) + das Rad (wheel). Rad is also used informally.",
  },
  {
    singular: "Fußball",      english: "football / soccer",     article: "der", plural: "Fußbälle",
    category: "Freizeit",
    note: "Umlaut + -e. Can mean the sport (kein Plural) or the ball itself: der Fußball → die Fußbälle.",
  },
  {
    singular: "Theater",      english: "theatre",               article: "das", plural: "Theater",
    category: "Freizeit",
    note: "No change. Ins Theater gehen (to go to the theatre). Also used idiomatically: Mach kein Theater! (Don't make a fuss!).",
  },
  {
    singular: "Party",        english: "party",                 article: "die", plural: "Partys",
    category: "Freizeit",
    note: "Adds -s — loanword plural. Eine Party feiern (to throw a party).",
  },
  {
    singular: "Foto",         english: "photo",                 article: "das", plural: "Fotos",
    category: "Freizeit",
    note: "Adds -s. Short for das Fotograf. Ein Foto machen (to take a photo).",
  },
  {
    singular: "Verein",       english: "club / association",    article: "der", plural: "Vereine",
    category: "Freizeit",
    note: "Adds -e. Central to German social life — sports clubs, choirs, community groups. Im Verein sein (to be in a club).",
  },
  {
    singular: "Museum",       english: "museum",                article: "das", plural: "Museen",
    category: "Freizeit",
    note: "Latin origin — replaces -um with -en in the plural, like Datum → Daten, Zentrum → Zentren.",
  },

  // ── Lebensmittel ───────────────────────────────────────────────────────────
  // (Das Lebensmittel-Alphabet — A bis Z)
  {
    singular: "Aprikose",     english: "apricot",               article: "die", plural: "Aprikosen",
    category: "Lebensmittel",
    note: "Adds -n. A — from Arabic al-barqūq via Portuguese albricoque. Summer stone fruit, popular in jams.",
  },
  {
    singular: "Birne",        english: "pear",                  article: "die", plural: "Birnen",
    category: "Lebensmittel",
    note: "Adds -n. B — also colloquial for a light bulb: die Glühbirne (literally: glowing pear).",
  },
  {
    singular: "Chinakohl",    english: "Chinese cabbage / napa cabbage", article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable as a food. C — compound: China + der Kohl (cabbage). Very common in Asian cooking.",
  },
  {
    singular: "Dattel",       english: "date (fruit)",          article: "die", plural: "Datteln",
    category: "Lebensmittel",
    note: "Adds -n. D — typically sold and used in the plural: Ich kaufe Datteln. Comes from Greek dáktylos (finger).",
  },
  {
    singular: "Essig",        english: "vinegar",               article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable in everyday use. E — Essig und Öl (vinegar and oil) is a classic salad dressing. Technically plural die Essige exists for types of vinegar.",
  },
  {
    singular: "Feige",        english: "fig",                   article: "die", plural: "Feigen",
    category: "Lebensmittel",
    note: "Adds -n. F — from Latin ficus. Feigenbaum is a fig tree. Used fresh or dried.",
  },
  {
    singular: "Gurke",        english: "cucumber",              article: "die", plural: "Gurken",
    category: "Lebensmittel",
    note: "Adds -n. G — die Gewürzgurke is a pickled gherkin, a classic German condiment.",
  },
  {
    singular: "Hackfleisch",  english: "ground / minced meat",  article: "das", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. H — compound: hacken (to chop/mince) + Fleisch (meat). Sold by weight: 500 Gramm Hackfleisch, never pluralized.",
  },
  {
    singular: "Honig",        english: "honey",                 article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. H — no umlaut: Honig, not Hönig. Plural die Honige exists for varieties (Waldhonig, Blütenhonig…).",
  },
  {
    singular: "Ingwer",       english: "ginger",                article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. I — no change in the plural for types. Ingwertee (ginger tea) is very popular in German-speaking countries.",
  },
  {
    singular: "Kiwi",         english: "kiwi (fruit)",          article: "die", plural: "Kiwis",
    category: "Lebensmittel",
    note: "Adds -s — loanword plural. K — named after the kiwi bird from New Zealand. Officially die Kiwifrucht.",
  },
  {
    singular: "Knoblauch",    english: "garlic",                article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. K — eine Knoblauchzehe is a clove of garlic. Knoblauch is an old compound: Knob (ball) + Lauch (leek).",
  },
  {
    singular: "Koriander",    english: "coriander / cilantro",  article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. K — both the herb (leaf) and the spice (seed) are called Koriander.",
  },
  {
    singular: "Kartoffel",    english: "potato",                article: "die", plural: "Kartoffeln",
    category: "Lebensmittel",
    note: "Adds -n. K — essential German staple. From Italian tartufolo (little truffle). Synonyms: die Erdäpfel (southern Germany, Austria).",
  },
  {
    singular: "Lachs",        english: "salmon",                article: "der", plural: "Lachse",
    category: "Lebensmittel",
    note: "Adds -e. L — very popular in German cuisine. Räucherlachs (smoked salmon) is a Frühstück classic.",
  },
  {
    singular: "Lauch",        english: "leek",                  article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable in everyday use. L — ein Kilo Lauch (a kilo of leek), no plural marker even with a quantity. Der Knoblauch (garlic) shares this root.",
  },
  {
    singular: "Mehl",         english: "flour",                 article: "das", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable in everyday use. M — Weizenmehl (wheat flour) is most common. Types add context: Mehl Type 405, 550…",
  },
  {
    singular: "Nudel",        english: "noodle / pasta",        article: "die", plural: "Nudeln",
    category: "Lebensmittel",
    note: "Adds -n. N — almost always used in the plural: Ich esse Nudeln. The singular die Nudel is rare.",
  },
  {
    singular: "Orange",       english: "orange (fruit)",        article: "die", plural: "Orangen",
    category: "Lebensmittel",
    note: "Adds -n. O — also called die Apfelsine in northern Germany. Pronounced oh-RAHN-zheh.",
  },
  {
    singular: "Pfeffer",      english: "pepper (spice)",        article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. P — Salz und Pfeffer (salt and pepper) — the classic pair. Pfeffermühle is a pepper mill.",
  },
  {
    singular: "Petersilie",   english: "parsley",               article: "die", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. P — one of the most-used herbs in German cooking. From Greek petros (stone) + selinon (celery).",
  },
  {
    singular: "Peperoni",     english: "chili pepper",          article: "die", plural: "Peperoni",
    category: "Lebensmittel",
    note: "No change in plural. P — important: in German die Peperoni means hot chili, NOT bell pepper. Bell pepper is die Paprika.",
  },
  {
    singular: "Quitte",       english: "quince",                article: "die", plural: "Quitten",
    category: "Lebensmittel",
    note: "Adds -n. Q — the only common German food word starting with Q. Too hard to eat raw; usually made into jam (Quittenmarmelade).",
  },
  {
    singular: "Reis",         english: "rice",                  article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. R — Ich koche Reis (I am cooking rice). Plural die Reissorten exists for varieties.",
  },
  {
    singular: "Salat",        english: "salad / lettuce",       article: "der", plural: "Salate",
    category: "Lebensmittel",
    note: "Adds -e. S — can mean the dish (ein gemischter Salat) or the leafy vegetable (ein Kopf Salat).",
  },
  {
    singular: "Speck",        english: "bacon",                 article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable in everyday use. S — sold and used by weight, not by count: 100 Gramm Speck, no plural marker even in larger amounts.",
  },
  {
    singular: "Spinat",       english: "spinach",               article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. S — from Persian aspanāḫ via Arabic. Popeye (Popeye der Seemann) made it famous!",
  },
  {
    singular: "Tomate",       english: "tomato",                article: "die", plural: "Tomaten",
    category: "Lebensmittel",
    note: "Adds -n. T — from Nahuatl tomatl. Tomatensoße (tomato sauce) and Tomatensalat are staples.",
  },
  {
    singular: "Udon",         english: "udon noodles",          article: "die", plural: "Udon",
    category: "Lebensmittel",
    note: "No change. U — Japanese loanword, often used as die Udon-Nudeln. One of the few food words for U in German!",
  },
  {
    singular: "Vollkornbrot", english: "wholegrain bread",      article: "das", plural: "Vollkornbrote",
    category: "Lebensmittel",
    note: "Adds -e. V — compound: voll (whole) + Korn (grain) + Brot (bread). Germany has hundreds of bread varieties; Vollkornbrot is among the healthiest.",
  },
  {
    singular: "Xylit",        english: "xylitol",               article: "das", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. X — a natural sugar substitute found in birch bark. Often used in chewing gum. One of very few German food words starting with X!",
  },
  {
    singular: "Yuzu",         english: "yuzu (citrus fruit)",   article: "die", plural: "Yuzus",
    category: "Lebensmittel",
    note: "Adds -s. Y — a Japanese citrus with a floral, tart flavour. Increasingly popular in European fine dining.",
  },
  {
    singular: "Zitrone",      english: "lemon",                 article: "die", plural: "Zitronen",
    category: "Lebensmittel",
    note: "Adds -n. Z — from Arabic al-laymūn. Zitronensaft (lemon juice) and Zitronentee (lemon tea) are very common.",
  },
  {
    singular: "Zucker",       english: "sugar",                 article: "der", plural: "—",
    category: "Lebensmittel",
    note: "Uncountable. Z — Zucker und Salz (sugar and salt) are paired in many recipes. Plural die Zucker exists only for chemistry/types of sugar.",
  },
  {
    singular: "Zwiebel",      english: "onion",                 article: "die", plural: "Zwiebeln",
    category: "Lebensmittel",
    note: "Adds -n. Z — from Latin cepa duplex (double onion). Zwiebelsuppe (onion soup) and Zwiebelkuchen (onion tart) are German classics.",
  },
  {
    singular: "Geschmack",    english: "taste / flavour",       article: "der", plural: "Geschmäcke",
    category: "Lebensmittel",
    note: "Umlaut + -e. Der Geschmack von Schokolade (the taste of chocolate). Also used abstractly: Geschmackssache (a matter of taste).",
  },

  // ── Geografie ──────────────────────────────────────────────────────────────
  {
    singular: "Berg",         english: "mountain",              article: "der", plural: "Berge",
    category: "Geografie",
    note: "Adds -e. No umlaut — a regular masculine one-syllable noun. In die Berge fahren (to go to the mountains).",
  },
  {
    singular: "Fluss",        english: "river",                 article: "der", plural: "Flüsse",
    category: "Geografie",
    note: "Umlaut + -e. Vowel -u- becomes -ü-. Der Rhein and die Donau are two of Europe's major Flüsse.",
  },
  {
    singular: "Hauptstadt",   english: "capital (city)",        article: "die", plural: "Hauptstädte",
    category: "Geografie",
    note: "Umlaut + -e. Compound: Haupt- (main/head) + die Stadt (city), which follows the same Stadt → Städte pattern.",
  },
  {
    singular: "Land",         english: "country",               article: "das", plural: "Länder",
    category: "Geografie",
    note: "Umlaut + -er. Aus welchem Land kommen Sie? is a key A1 question. Also means 'state' within Germany (Bundesland).",
  },
  {
    singular: "Dorf",         english: "village",               article: "das", plural: "Dörfer",
    category: "Geografie",
    note: "Umlaut + -er. Same pattern as Land → Länder, Haus → Häuser. Auf dem Dorf means 'in the countryside.'",
  },
  {
    singular: "Stadt",        english: "city / town",           article: "die", plural: "Städte",
    category: "Geografie",
    note: "Umlaut + -e. In die Stadt gehen (to go into town) is common everyday phrasing.",
  },
  {
    singular: "See",          english: "lake",                  article: "der", plural: "Seen",
    category: "Geografie",
    note: "Adds -n. Watch the gender switch: der See (lake) vs. die See (sea) — same word, different meaning and article!",
  },
  {
    singular: "Insel",        english: "island",                article: "die", plural: "Inseln",
    category: "Geografie",
    note: "Adds -n. Masculine/feminine -el nouns are mixed: dieser one takes -n, unlike der Schlüssel which stays unchanged.",
  },
  {
    singular: "Wald",         english: "forest / woods",        article: "der", plural: "Wälder",
    category: "Geografie",
    note: "Umlaut + -er. In den Wald gehen (to go into the forest). The Black Forest is der Schwarzwald.",
  },
  {
    singular: "Tal",          english: "valley",                article: "das", plural: "Täler",
    category: "Geografie",
    note: "Umlaut + -er. Same pattern as Land → Länder. Found in many place names, e.g. Neandertal.",
  },
  {
    singular: "Grenze",       english: "border / boundary",     article: "die", plural: "Grenzen",
    category: "Geografie",
    note: "Adds -n. An der Grenze (at the border). Also used figuratively: Grenzen setzen (to set boundaries).",
  },
  {
    singular: "Kontinent",    english: "continent",             article: "der", plural: "Kontinente",
    category: "Geografie",
    note: "Adds -e. International loanword from Latin continens.",
  },
  {
    singular: "Straße",       english: "street / road",         article: "die", plural: "Straßen",
    category: "Geografie",
    note: "Adds -n. The most common word for a street — appears in nearly every German address.",
  },
  {
    singular: "Weg",          english: "way / path / road",     article: "der", plural: "Wege",
    category: "Geografie",
    note: "Adds -e. Used for paths, routes, and directions: Welcher Weg führt zum Bahnhof? (Which way leads to the station?)",
  },
  {
    singular: "Gasse",        english: "alley / lane",          article: "die", plural: "Gassen",
    category: "Geografie",
    note: "Adds -n. A narrow street, common in old town centers (Altstadt). Common in Swiss and Austrian street names.",
  },
  {
    singular: "Allee",        english: "avenue",                article: "die", plural: "Alleen",
    category: "Geografie",
    note: "Adds -n. Borrowed from French allée — typically a wide, tree-lined street or boulevard.",
  },

  // ── Alltag ─────────────────────────────────────────────────────────────────
  {
    singular: "Abkürzung",    english: "abbreviation / shortcut", article: "die", plural: "Abkürzungen",
    category: "Alltag",
    note: "Adds -en. Feminine -ung noun. Has two meanings: a shortened word/phrase, or a shorter physical route.",
  },
  {
    singular: "Unfall",       english: "accident",               article: "der", plural: "Unfälle",
    category: "Alltag",
    note: "Umlaut + -e. Einen Unfall haben (to have an accident). Compound: un- (negative prefix) + der Fall (fall/case).",
  },

  // ── Mengen & Einheiten ─────────────────────────────────────────────────────
  {
    singular: "Pfund",        english: "pound (unit of weight)", article: "das", plural: "Pfund",
    category: "Mengen & Einheiten",
    note: "No change in plural. After a number, the unit stays unchanged: ein Pfund Brot, zwei Pfund Butter — not 'zwei Pfunde.'",
  },
  {
    singular: "Kilo",         english: "kilo / kilogram",        article: "das", plural: "Kilo",
    category: "Mengen & Einheiten",
    note: "Usually unchanged after a number: ein Kilo Lauch, zwei Kilo Kartoffeln. The form Kilos exists but is less common in measurements.",
  },
  {
    singular: "Gramm",        english: "gram",                   article: "das", plural: "Gramm",
    category: "Mengen & Einheiten",
    note: "No change in plural. Almost always paired directly with a number and no article: 100 Gramm Speck, 250 Gramm Mehl.",
  },

  // ── Aus dem Unterricht / from class notes ────────────────────────────────────
  {
    singular: "Sitzungszimmer", english: "conference / meeting room", article: "das", plural: "Sitzungszimmer",
    category: "Arbeit",
    note: "From das Zimmer, so the gender is das (not die — die Sitzungszimmer is the plural). No change in the plural. Common in Switzerland; everyday alternative: der Besprechungsraum.",
  },
  {
    singular: "Bild",          english: "picture / image",         article: "das", plural: "Bilder",
    category: "Alltag",
    note: "-er ending, no umlaut: das Bild → die Bilder. Same plural pattern as Kind → Kinder.",
  },
  {
    singular: "Sonnenaufgang", english: "sunrise",                 article: "der", plural: "Sonnenaufgänge",
    category: "Geografie",
    note: "Umlaut + -e plural: a → ä. Opposite: der Sonnenuntergang (sunset). Compound of die Sonne + der Aufgang — the last part (Aufgang, masc.) fixes the gender.",
  },

  // ── Zeit ─────────────────────────────────────────────────────────────────────
  {
    singular: "Tag",       english: "day",                  article: "der", plural: "Tage",
    category: "Zeit",
    note: "Parts of the day are mostly masculine: der Morgen, der Mittag, der Abend — but die Nacht. Guten Tag!",
  },
  {
    singular: "Woche",     english: "week",                 article: "die", plural: "Wochen",
    category: "Zeit",
    note: "Regular -n plural. diese Woche = this week, nächste Woche = next week.",
  },
  {
    singular: "Monat",     english: "month",                article: "der", plural: "Monate",
    category: "Zeit",
    note: "-e plural, no umlaut. im Monat / dieser Monat.",
  },
  {
    singular: "Jahr",      english: "year",                 article: "das", plural: "Jahre",
    category: "Zeit",
    note: "-e plural. dieses Jahr = this year; Ich bin … Jahre alt.",
  },
  {
    singular: "Stunde",    english: "hour",                 article: "die", plural: "Stunden",
    category: "Zeit",
    note: "-n plural. eine Stunde = an hour. Don't confuse with die Uhr (clock / o'clock).",
  },
  {
    singular: "Minute",    english: "minute",               article: "die", plural: "Minuten",
    category: "Zeit",
    note: "-n plural. fünf Minuten. Same pattern as Stunde, Woche.",
  },
  {
    singular: "Morgen",    english: "morning",              article: "der", plural: "Morgen",
    category: "Zeit",
    note: "No change in the plural (der Morgen → die Morgen). am Morgen = in the morning. Note: lowercase morgen = tomorrow.",
  },
  {
    singular: "Abend",     english: "evening",              article: "der", plural: "Abende",
    category: "Zeit",
    note: "-e plural. am Abend = in the evening; Guten Abend!",
  },
  {
    singular: "Nacht",     english: "night",                article: "die", plural: "Nächte",
    category: "Zeit",
    note: "Umlaut + -e: a → ä. Feminine, unlike the masculine parts of the day. Gute Nacht!",
  },
  {
    singular: "Uhr",       english: "clock / o'clock",      article: "die", plural: "Uhren",
    category: "Zeit",
    note: "-en plural. die Uhr = clock/watch; also 'o'clock': um drei Uhr. Wie viel Uhr ist es?",
  },
  {
    singular: "Zeit",      english: "time",                 article: "die", plural: "Zeiten",
    category: "Zeit",
    note: "-en plural, but often uncountable: Ich habe keine Zeit. See the phrase 'Zeit haben'.",
  },
];
