# Word Icons Plan — a picture as a second memory hook

> **Status:** Proposed 2026-09-29, for Miguel's review. Nothing here is implemented yet.
> **Execute one phase = one PR**, each satisfying the commit gate in
> [CLAUDE.md](../CLAUDE.md) (100% tests pass · no lint errors · no TypeScript errors).
> **Companion docs:** [PRD](../docs/PRD.md) · [Solution Design](../docs/SOLUTION_DESIGN.md) ·
> [Lessons Plan A1.2](./LESSONS_PLAN_A1_2.md)
> **Design & interaction target:** [`WORD_ICONS_PLAN.mock.html`](./WORD_ICONS_PLAN.mock.html)
> (open in a browser; see §2a). This plan says *what data, assets and logic* to build;
> the mock says *how it looks and behaves*. Keep them in step: change one, update the other.
> **Evidence:** [`word-icons-candidates.json`](./word-icons-candidates.json) (hand-written word → icon map) and
> [`scripts/icon-coverage.ts`](../scripts/icon-coverage.ts) (reproduces every number in §4).
> **Author:** Claude Code, with Miguel · **Created:** 2026-09-29

---

## 1. Purpose and requirements

Give as many words as sensible a small picture (a body part, a mountain, a house,
a knife), so recall has a **second hook** besides the letters. Not every word can
have one; abstract words (*weil*, *nicht*, *eigentlich*) simply have none. Miguel
rejected the course book's photos (copyright) and chose **an open-licence icon
set** rather than emoji *characters* (which look different on every phone).

| # | Requirement |
|---|---|
| W1 | Show a picture beside a word wherever the word is shown: cards, category views, flashcards, lesson chips, search. |
| W2 | Pictures come from **one** open-licence set, bundled in the repo (works offline as a PWA), with the licence obligations met. |
| W3 | A word without a picture looks exactly like today: no empty box, no placeholder, no layout jump. |
| W4 | Adding words (the lesson intake, Lessons Plan §5 Phase 8+) stays cheap: pictures are proposed and reviewed in the same step, not a separate chore. |
| W5 | The picture must never spoil a recall exercise (no icon on the prompt side of *Deutsch → English*), and must never mislead (a wrong picture is worse than none). |
| W6 | Optional, later: a mode **Bild → Wort** (see the picture, recall the German word and article). |
| W7 | Respect the engineering principles: no new UI library, inline styles, data separate from presentation, YAGNI. |

**Interpreting "not emoji characters":** the recommended sets are *artwork* files
(SVG) whose subjects follow the Unicode emoji list. The app never renders an emoji
character; it shows a fixed image file, identical on every device. If Miguel
dislikes the *emoji look* itself, the line-icon runner-up in §3 covers only about
half as many words (§4). See open question Q1.

### 2a. How the plan and the mock work together

Same rules as [Lessons Plan §2a](./LESSONS_PLAN_A1_2.md): the plan is the source of
truth for data, logic, phases and tests; the mock for layout, labels, interaction and
states. Each phase in §11 names the mock screen(s) it must match. The mock is
throwaway vanilla JS with sample data, not shipped, not linted; never copy its code
into `src/`. Its dashed amber outline and notes column are review aids, not UI.
**Unlike the lessons mock it uses real artwork** (extracted from the packages in §3)
so the style can be judged; that is a preview, the app ships vendored files.

| Mock screen | Plan section | Phase |
|---|---|---|
| Nomen · Karte | §7 word cards | 3 (1 for the first slice) |
| Nomen · Bilder | §7.2 picture grid | 3 |
| Verben | §7 word cards | 3 |
| Üben · Karten | §7.3 flashcards | 3 |
| Üben · Bild → Wort | §8 | 5 |
| Lektion 10 | §7 chips | 3 |
| Suche | §7 search rows | 3 |
| Kein Bild | §7.5 fallback | 1 |
| Bildnachweis | §9 | 1 |
| Stil-Vergleich | §3 (decision Q1) | 0 |

## 2. Decisions proposed (recommendation in bold; Miguel confirms in §12)

| # | Decision | Why |
|---|---|---|
| D1 | **Set: Fluent Emoji Flat (Microsoft, MIT).** Runner-up: **Noto Emoji (Google, Apache-2.0)**. | Only permissive licences without share-alike, plus the widest concrete-word coverage (§3, §4). Fluent is 3x lighter and calmer than Noto. |
| D2 | **Central map `src/content/wordIcons.ts`** keyed by catalog id; **no `icon?` field on the items.** | §5. Zero edits to the four `data.ts` files, one reviewable file, one place for the coverage tooling. |
| D3 | **Icon key = Unicode short name in kebab-case** (`red-apple`), not a codepoint and not a set-specific file name. | The four emoji sets share these names, so the set is a build-time parameter: switching Fluent ↔ Noto ↔ OpenMoji ↔ Twemoji is one command, zero data change (verified, §4). |
| D4 | **Vendor only the used SVGs** into `src/assets/word-icons/` from a **pinned** devDependency; show them with `<img>`, resolve URLs with `import.meta.glob`. | §6. Assets, not a library. |
| D5 | **Two tiers: strong and weak.** Weak = a loose hook (*Kopf* → a head-and-shoulders silhouette). Strong = the picture *is* the word. | §4 shows ~40% of words are strong and ~38% only weak. The tier decides the Bild → Wort pool and lets Miguel hide weak ones. |
| D6 | **A word with no good picture gets none** (`null` = reviewed, skipped). | W3, W5. |

## 3. Licence and set comparison

Everything below was checked on **2026-09-29** against (a) the licence text in the
upstream repository, fetched, or (b) the licence metadata of the matching
`@iconify-json/*` npm package (which I unpacked and used for the coverage numbers).
Rows marked *to verify* rest on a secondary source. Not legal advice; for a
personal, free, public app the differences are small, but attribution is not optional.

| Set (artwork) | Licence | Attribution | Share-alike | NC | Look at 32-48 px | Concrete-word probe¹ | Format · size/icon² |
|---|---|---|---|---|---|---|---|
| **Fluent Emoji Flat** (Microsoft) | **MIT** (repo `LICENSE`, fetched) | Keep the copyright + permission notice with the assets: show it on the credits page (§9) | none | no | Flat, calm, consistent; clear at 32 px (see mock *Stil-Vergleich*) | 109/113 | SVG · **1.2 KB** avg, 5.6 KB max |
| **Noto Emoji** (Google) | **Apache-2.0** for images and tools; **OFL-1.1 for the fonts** (README + `LICENSE`, fetched) | Keep licence text and any NOTICE; state changes if any | none | no | Most detailed and glossy; best at 48 px, busy at 24 | 109/113 | SVG · 3.6 KB avg, **21 KB max** |
| **OpenMoji** | **CC BY-SA 4.0** (README, fetched; the repo `LICENSE.md` path 404'd, package metadata agrees) | Yes, suggested wording: "All emojis designed by OpenMoji – the open-source emoji and icon project. License: CC BY-SA 4.0" | **Yes, for adapted artwork.** Bundling unmodified files does not adapt them; whether an app that embeds them is a "collection" or an adaptation is the open point (*to verify*, see D-risk R7) | no | Dark outline, very legible when small; plainest look | 111/113 (has the most extras) | SVG · 1.5 KB avg |
| **Twemoji** (jdecked fork v17) | **CC BY 4.0** for graphics, MIT for code (`LICENSE-GRAPHICS`, fetched) | Yes: a mention in an About/credits page or footer is accepted (README) | none | no | Flat, friendly, similar to Fluent | 110/113³ | SVG · 1.3 KB avg |
| **Phosphor** | MIT (repo `LICENSE`, fetched) | notice as MIT | none | no | Monochrome line icons, very consistent; nothing colour-codes meaning | 79/113 | SVG · 0.5 KB |
| **Tabler Icons** | MIT (fetched) | as MIT | none | no | Line icons | 79/113 | SVG · small (not measured) |
| **Lucide** | ISC (fetched) | keep the notice | none | no | Line icons | 70/113 | SVG · small (not measured) |
| **Material Symbols** | Apache-2.0 (package metadata; *to verify* against the repo) | as Apache | none | no | Line/filled glyphs | 60/113 | SVG · small (not measured) |
| **Font Awesome Free** | Icons **CC BY 4.0**, fonts OFL, code MIT (`LICENSE.txt`, fetched) | Yes for the SVG icons | none | no | Solid glyphs, UI-flavoured | 74/113 | SVG · small (not measured) |
| **Game-icons.net** | CC BY 3.0 (package metadata) | Yes, per author | none | no | Dark, fantasy-flavoured silhouettes | 111/113 (name hits, poor fit) | SVG · not measured |
| **ARASAAC** pictograms | **CC BY-NC-SA 4.0**, owned by the Government of Aragon (secondary source, *to verify*: the site was not reachable from this environment) | Yes, with a fixed sentence and, per one source, the ARASAAC logo | **Yes** | **Yes** | Illustrated pictograms for communication aids, hundreds of verbs and adjectives | not measured (API blocked) | PNG/SVG via API |

¹ *Concrete-word probe:* how many of 113 plain English concept names (cow, key, coat,
mountain, bed …) appear as a whole-word token in the set's icon names. Crude (it says
"a name exists", not "a good picture exists") and generous to sets with descriptive
names; use it only to see the gap between emoji sets and line-icon sets. The real
per-word numbers are in §4. The line sets miss most animals (*pig, lion, bear, elephant,
monkey, duck*), fruit/vegetables and body parts (*nose, mouth, foot, leg*).
² Measured on the 209 icons the candidate map uses (§4), as raw SVG.
³ The `@iconify-json/twemoji` package may lag jdecked's v17; upstream direct would need a re-check.

**ARASAAC and non-commercial.** NC does not strictly rule it out for a personal, free
site: Miguel earns nothing from it. Three things still argue against: (1) NC forbids
ever putting the app behind a price or an ad; (2) ShareAlike would bind adapted
pictograms, and an app that ships them is a grey zone; (3) it needs the ARASAAC
logo/sentence and a bulk download from an API. Its real advantage is verbs and
adjectives in a consistent illustrated style. **Not recommended now**; a possible
future supplement for verbs if Miguel accepts NC (I could not measure it here).

### 3.1 Recommendation

**Fluent Emoji Flat (MIT).** Licence fit: MIT is the least demanding, no share-alike,
no NC, and needs only the notice on a credits page. Coverage: it is a full emoji set
(3 174 icons; about 1 300 base emoji once skin-tone, gendered-person and flag variants are left out), so animals, food, body parts, clothes,
buildings, transport, professions and weather are all there (§4). Weight: 1.2 KB per
icon. Style: flat, uniform, readable at 32 px.

**Runner-up: Noto Emoji (Apache-2.0).** Same coverage (identical names), the most
detailed drawings, also permissive. Costs: 3x heavier (740 KB raw for the 209 icons vs
254 KB) and busier at small sizes. Because of D3 the switch is one command, so the
choice is cheap to reverse.

**Not chosen:** OpenMoji and Twemoji are fine artwork but ask for attribution/share-alike
that MIT/Apache do not; the line-icon sets (Phosphor, Tabler, Lucide, Material, FA) cover
about half as many of Miguel's words and almost no animals or food (§4); ARASAAC see above;
Game-icons has the wrong tone.

## 4. Coverage analysis (real numbers)

**Method.** `npx tsx scripts/icon-coverage.ts` loads the live catalog (429 entries) and
[`plans/word-icons-candidates.json`](./word-icons-candidates.json). I mapped **every**
noun (214), verb (75), adjective (18) and adverb (7), i.e. all 314 words, plus the
phrase categories where a picture is imaginable (*Hunger haben*, *gern* …), so nothing
is extrapolated for the current content. Each icon name is checked to exist in the
unpacked sets; `--sets-dir` does that (see the script header for the four `npm pack` lines).
All names were found in Fluent, Noto, OpenMoji and Twemoji (0 missing) and the Phosphor
ones in Phosphor.

**Tiers.** *Strong*: the picture is the word (*Hund* → dog, *Schlüssel* → key).
*Weak*: a generic or symbolic hook (*Vater* → man, *Chef* → necktie, *Woche* → calendar).
*None*: abstract, or the nearest picture misleads. The judgement is mine and is the
main uncertainty; Miguel reviews the weak list before anything ships (Q2).

**Results, Fluent Flat** (Noto, OpenMoji and Twemoji are identical because the names are
the same Unicode names). Cells are **strong % / strong+weak %** of all words in the group.

| Group | n | Fluent (rec.) | Phosphor (line) |
|---|---|---|---|
| Nomen · Tiere | 14 | 100 / 100 | 43 / 43 |
| Nomen · Supermarkt | 20 | 75 / 100 | 40 / 40 |
| Nomen · Kleidung | 12 | 58 / 83 | 58 / 75 |
| Nomen · Körper | 12 | 58 / 92 | 25 / 42 |
| Nomen · Freizeit | 14 | 57 / 93 | 50 / 86 |
| Nomen · Schule | 14 | 50 / 71 | 57 / 86 |
| Nomen · Zuhause | 28 | 43 / 71 | 57 / 93 |
| Nomen · Lebensmittel | 36 | 42 / 69 | 3 / 8 |
| Nomen · Zeit | 11 | 36 / 91 | 27 / 73 |
| Nomen · Geografie | 17 | 24 / 76 | 24 / 59 |
| Nomen · Familie | 15 | 20 / 60 | 0 / 0 |
| Nomen · Arbeit | 15 | 13 / 80 | 20 / 60 |
| Nomen · Alltag, Mengen | 6 | 17 / 67 | 17 / 33 |
| **Nomen total** | **214** | **46 / 80** | 31 / 51 |
| **Verben** | **75** | **23 / 68** | 13 / 41 |
| **Adjektive** | **18** | **28 / 89** | 22 / 67 |
| **Adverbien** | **7** | **0 / 43** | 0 / 0 |
| **All words (n / v / adj / adv)** | **314** | **39 / 77** | 26 / 49 |
| Phrases (69 entries; 4 categories considered) | 69 | 1 / 13 | 0 / 0 |
| Whole catalog incl. grammar and patterns | 429 | 28 / 58 | 19 / 36 |

### Honest estimate

- **About 4 in 10 words (39%) get a picture that is the word; about 8 in 10 (77%) get
  *some* picture; about 2 in 10 get none.** The "77%" includes 128 weak hooks that I would
  not all ship. My own sceptical figure: strong plus the weak hooks Miguel approves gives
  **55-65% of words**.
- **Nouns carry it** (46% strong): animals, food, clothes, body, home, leisure. **Verbs** are
  mostly weak (23% strong: schlafen, lesen, essen, kochen, gehen, fernsehen, anrufen). **Adjectives**
  and **adverbs** are mostly symbolic. Function words, Redemittel and grammar get none, by policy.
- **Second candidate (Noto)** scores the same on names; the difference is art and size, not coverage.
- **The best line set (Phosphor)** gets 26% strong / 49% any: fine for household objects
  (better than Fluent in *Zuhause*: armchair, rug, desk, washing-machine) but **near zero
  for food and animals** (Lebensmittel 3%).
- **Sharing:** 122 strong words use 118 distinct icons; 40 icons serve several words
  (`man`: *Vater*/*Mann*, `teacher`: *Lehrer*/*Lehrerin*, `eye`: *sehen*/*Auge*). Fine for
  cards, not for Bild → Wort (§8).
- **Extrapolation to A1.2 (L8-L14), assumption-based.** Same rates by category, adjusted by
  theme: L8 Berufe (professions exist as emoji: ~60% strong), L10 Körperteile ~70% but
  Krankheiten ~15%, L11 Stadt/Verkehr ~65%/90%, L13 Kleider ~70% and Landschaften ~60%,
  L9 Ämter and L12 Kundenservice ~10-20%, L14 Feste/Monate ~30%. Expect **~35-45% strong,
  55-70% with approved weak** on the next ~600-700 words. Weakest: L9, L12, and every grammar/phrase group.
- **Not counted:** words I did not think of. New words with Unicode-emoji subjects (profession
  names, buildings, vehicles) will do better than the A1.1 average.

## 5. Data model

### 5.1 Decision: a central map, not an `icon?` field on every item

| | Central map `src/content/wordIcons.ts` (**chosen**) | `icon?` on each item |
|---|---|---|
| Edits to existing content | none (the four `data.ts` stay as they are) | ~314 edits across `nouns`, `verbs`, `adjectives`, `phrases` |
| One review surface for Miguel | one file, grouped by category | scattered |
| Coverage / missing-file tooling | reads one map | must walk four data shapes |
| Presentation asset vs content | kept apart (matches "data separate from presentation") | mixes an asset key into learning content |
| Feminine forms and inflections | see 5.3 | duplicated key per item |
| Cost | one lookup by id at render | none |
| Where it hurts | a new word needs a second edit in another file (mitigated by the intake helper, §10) | none |

The catalog already gives every learnable item a stable, unique id (`nomen:familie/vater`,
`verben:schlafen`, `adjektive:…`); the map is keyed by that id. **YAGNI:** no per-item override
field. If a card ever needs a different icon from the catalog entry's, that is a second real
caller and we add it then.

```ts
// src/content/wordIcons.ts — pure data + types, no React.
export type IconKey = string            // Unicode short name, kebab-case: 'red-apple'
export interface WordIcon {
  key: IconKey                          // file stem in src/assets/word-icons/
  weak?: true                           // loose hook: hideable, never used as a picture prompt
}
// Catalog id → icon. `null` = reviewed, deliberately none. Absent = not decided yet.
export const WORD_ICONS: Record<string, WordIcon | null> = {
  'nomen:koerper/hand': { key: 'raised-hand' },
  'nomen:koerper/kopf': { key: 'bust-in-silhouette', weak: true },
  'nomen:koerper/bauch': null,          // no good picture
  // …
}
export function wordIconFor(id: string): WordIcon | undefined   // undefined for null and absent
```

Id construction is extracted **once** into `src/lib/catalog/ids.ts` (`nounEntryId(singular,
category)`, `verbEntryId(infinitive)`, `cardEntryId(toolId, categoryId, term)`), used by
the catalog adapters (which today build the strings inline) and by the views; that is
DRY of *knowledge* (how an id is made), not of code.

### 5.2 Why the map key is a catalog id, and the icon key a Unicode name

- The id is stable and disambiguates polysemy per catalog entry: *die Bank* (bench) and
  *die Bank* (bank) are two entries and can get two icons or none.
- The Unicode-name key (D3) makes the vendoring script and the coverage script trivial
  and makes the set swappable (§6).

### 5.3 Feminine forms and inflections

The **lemma is the unit**. Plural, case forms, verb conjugations, Präteritum/Perfekt
and separable prefixes are all *inside* one catalog entry, so they share its icon with
no work. *Lehrer* and *Lehrerin* are two catalog entries today; both map to `teacher`
(two lines, one file, cheaper than a share mechanism). When Lessons Plan §3.7's
`feminine?: string` lands on professions, it lives on the same entry and inherits the
icon automatically. Words that intentionally share one icon are legitimate; the
Bild → Wort pool filters them out (§8).

## 6. Assets

### 6.1 Assets, not a library (CLAUDE.md "no icon library")

The rule exists to keep the app free of an icon *dependency* (a runtime package, a component
kit, tree-shaking games). This plan adds **image files that are content**, like a
photograph in a book: ~200 small SVGs committed to `src/assets/word-icons/`, shown with
`<img>`. No icon package ships, no component library, no Tailwind, inline styles stay.
The pinned npm package is a **devDependency used only by the vendoring script**.
The rule's *letter* ("no icon library") is untouched; its *spirit* (no third-party UI
dependency in the shipped app) is too. Still, the rule says any change needs a recorded
decision, so **Phase 0 adds this to the Solution Design decisions log** (proposed row in §11).

### 6.2 Layout

```
src/assets/word-icons/
  red-apple.svg  dog.svg  …        # ONLY the keys used in WORD_ICONS, one file each
  SOURCE.json                       # { set, package, version, licence, copyright, files: [...] }
  LICENSE.txt                       # the upstream licence text, verbatim
scripts/vendor-word-icons.ts        # re-runnable; see 6.3
```

Files are named by Unicode short name (`red-apple.svg`), readable in a diff and
identical across the four emoji sets. A codepoint name (`1f34e.svg`) would be stable but
unreadable and set-specific.

### 6.3 Vendoring script (pinned, re-runnable)

`npm run icons:vendor [-- --set fluent|noto|openmoji|twemoji]`:

1. Read the used keys from `WORD_ICONS`.
2. Read them from the **exact-version devDependency** `@iconify-json/fluent-emoji-flat@1.2.6`
   (pinned without `^`; the lockfile pins the integrity hash). Verified today: 3 174 icons,
   viewBox `0 0 32 32`. The package records the upstream repo and licence in its `info.json`.
   (Alternative if we prefer upstream directly: download `microsoft/fluentui-emoji` at a
   recorded commit SHA; the vendored output is identical. The package is simpler and offline.)
3. Write each `<key>.svg` as `<svg xmlns=… viewBox=…>…</svg>` (no other edits; unmodified
   artwork matters for CC BY-SA sets), delete orphans, write `SOURCE.json` and `LICENSE.txt`.
4. `--check` (also run in CI/tests) fails if the folder differs from what the script would
   produce, so nobody edits an icon by hand.

The other three sets need their package as a devDependency only while being vendored
(`@iconify-json/noto@1.2.9`, `openmoji@1.2.29`, `twemoji@1.2.5`).

### 6.4 Bundling and PWA precache

- `src/lib/wordIcons.ts` (view side): `import.meta.glob('../assets/word-icons/*.svg',
  { eager: true, query: '?url', import: 'default' })` → `key → hashed URL`. Only URL
  strings enter the JS bundle (a few KB); the SVGs are separate files fetched by `<img
  loading="lazy">` when a card is actually shown, and honour Vite's `base` (`/deutsch-lernen/`).
  Rejected: inlining every SVG in JS (250 KB into the main bundle), base64, a sprite.
- **Offline:** `vite-plugin-pwa` precaches `**/*.{js,css,html}` by default, so emitted SVGs
  would *not* be cached. Phase 1 adds `workbox.globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}']`
  (to verify against the plugin version in `package.json`) and checks that `dist/sw.js`
  lists the icon URLs; manual offline test in the PR.
- **Budget:** today 209 distinct icons = **254 KB raw / ~119 KB gzipped** (Fluent). After A1.2
  expect ~450 icons ≈ **550 KB raw / ~260 KB gz**. A test enforces **≤ 600 KB raw total and
  ≤ 8 KB per file** (largest Fluent icon so far 5.6 KB), so a heavy icon or a set swap to Noto
  (740 KB today, 21 KB max) is a conscious decision, not an accident.

## 7. UI

Icons are **decorative by default** (`alt=""`, `aria-hidden`): the word is always
next to them and is what a screen reader should say. One component,
`src/components/WordIcon.tsx`: `<WordIcon id size />` renders `<img>` with explicit
`width`/`height` (no layout shift) or **`null`** when the word has no icon. Styling stays inline.

| Surface | Icon | Notes |
|---|---|---|
| Noun card header (`GermanNouns`) | 56 px, left of article + word | text block simply starts at the left edge when absent |
| Noun pills | 18 px, left of the word | most useful for weak/strong recall while scanning |
| Noun **Bilder** view (§7.2) | 48 px tile | new optional view |
| Verb card header (`GermanVerbs`) | 48 px | only action pictures (schlafen, lesen …) |
| Category-cards tools (Adjektive, Phrases via `CategoryCardsTool`) | 40 px on the card | one prop, not per-tool code |
| Flashcards (`FlashcardPlay`) | **de→en: back only; en→de: front and stays on the back**, 72 px | §7.3 |
| Quiz (`QuizPlay`) | prompt side when the prompt is English; after answering, next to the correct choice | never on a German prompt, never inside the choices |
| Lesson page chips | 20 px | only when present |
| Search dropdown rows | 24 px column | column left empty when absent so words align |
| Practice deck settings, grammar, prepositions, satzbau | none | no imagery for grammar |

**7.1 Sizes and layout shift.** Sizes 18/20/24/40/48/56/72; nothing below 18 px. Every
`<img>` carries explicit width and height; in lists the slot exists only in the dense
*Suche* rows. Elsewhere the icon is inline-flex content: present → it takes its box,
absent → nothing.

**7.2 Bilder view (optional, Phase 3b).** A `Liste · Bilder` switch on the Nomen page:
a grid of tiles (icon over article+word) per category, a picture dictionary. Tapping a
tile selects the noun and shows the normal card. Words without an icon keep the same
tile height with centred text (see mock).

**7.3 Flashcards (decision).** The picture is a hook, but on *Deutsch → English* the
front is the German word and the icon would reveal the meaning before recall. So: **de→en
front: no icon; back (after reveal): icon. en→de front: icon (it also disambiguates
the English prompt, e.g. *bank*) and stays after reveal.** A "picture first" experience
is deliberately **not** a flashcard variant; it is the separate *Bild → Wort* mode (§8).
Alternatives (icon on both sides, a "picture on front" toggle) are cheap later; not built now (YAGNI).

**7.4 Accessibility.** Decorative everywhere except Bild → Wort, where the picture is the
question: `role="img"` with `aria-label` = the English gloss ("Bild-Aufgabe: dog"), never the German word.
The credits link is a normal link in the footer. Contrast is not an issue (colour art on the light canvas;
the app is light-only). Respect `prefers-reduced-motion`: no animation on icons at all.

**7.5 No icon.** No placeholder, no dashed box, no "missing" glyph (W3). Mock screen *Kein Bild*.

**7.6 Weak icons setting.** `WordIcon` accepts weak icons by default. If Miguel decides to
hide them (Q2), one boolean in `lib/progress.ts` settings switches them off everywhere.

## 8. New practice mode "Bild → Wort" (optional Phase 5, separate from the core)

Show the icon large (112 px); the learner types the German word, with article for nouns.
A new `PracticeMode` `'bild'`, same session/deck/rating shell as the other modes
(Lessons Plan §4.4), pure checker `checkPictureAnswer(card, input)` in `practice/drills.ts`.

- **Pool:** entries whose icon is **strong** and whose `key` is **unique among strong entries**
  (so `man` never asks "Vater or Mann?"). Today ≈ 118 words; verbs like *schlafen* qualify.
  Lessons filter and lesson chips apply as for every mode.
- **Answer rules:** nouns need `article + noun`, other words the bare word. Accepted:
  `ß` for `ss`. A **capitalisation-only** mistake counts as correct with the hint "gross
  geschrieben: der Hund" (case is meaning in German, so we tell, not fail). Umlauts must be right.
- **Accessibility:** `aria-label` is the English gloss; the German answer is never in the DOM before the check.
- Tests: pool excludes weak and duplicated icons; checker (article, case hint, ß); deck builder respects the lesson filter.

## 9. Attribution

- **What is shown.** A page **Bildnachweis** at `/bildnachweis`, linked from a small footer
  on every page ("Bilder: Fluent Emoji, MIT · Bildnachweis") and from the Home page. It is
  **generated** from `src/assets/word-icons/SOURCE.json` + `LICENSE.txt` (imported `?raw`),
  so the text can never drift from the vendored set. It shows: set name, licensor, version,
  icon count, the **full licence text**, and "Änderungen: keine".
- **Exact obligations per set (so a swap needs no research):**
  - **MIT (Fluent, Phosphor):** the copyright line ("Copyright (c) Microsoft Corporation.") and
    the permission notice "The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software." → show the whole MIT text (as in the mock).
  - **Apache-2.0 (Noto):** licence text, keep any `NOTICE`, state modifications (none).
  - **CC BY 4.0 (Twemoji):** credit line: "Graphics: Twemoji, © Twitter, Inc. and other contributors,
    licensed under CC BY 4.0", the licence link, and "changes: none" (exact wording *to verify*
    against the README before shipping).
  - **CC BY-SA 4.0 (OpenMoji):** credit line "All emojis designed by OpenMoji – the open-source emoji and icon
    project. License: CC BY-SA 4.0" + licence link; **never modify artwork**; keep the vendored folder
    self-contained with its licence, so the share-alike scope stays clearly limited to the images (*to verify*).
- **Test:** the credits page contains the licence text from `LICENSE.txt` and the version from `SOURCE.json`.

## 10. Authoring workflow (lesson intake)

Extends Lessons Plan §4.3/§5 (Phase 8+). Goal: a new word costs one decision, made while
Miguel already approves the vocab list.

1. `npm run vocab:check -- A1.2-L10` gains a section **Bild-Vorschläge** for the ❌ words to add:
   for each, the best icon key(s) found by matching the English gloss against the set's icon names
   (e.g. *ear* → `ear`, *doctor* → `health-worker`), tier guess (strong/weak/none), or "kein Bild".
2. Miguel approves the vocab and the pictures in the same reply (skip = `null`).
3. Claude adds the words **and** their `WORD_ICONS` lines, runs `npm run icons:vendor`.
4. `npm run icons:check` (Node-only, next to `icon-coverage.ts`, which is its prototype) reports:
   words **without a decision** (per lesson, `--lesson A1.2-L10`), map keys that are **not in the catalog**,
   `key`s whose **file is missing** or **orphan files**, coverage by kind. The parts that can break
   things are also **Vitest tests** (§12), so the commit gate catches a broken map. "Undecided"
   is a *report*, not a gate, so adding a word never blocks on picking a picture.
5. `plans/word-icons-candidates.json` is the seed for Phase 2 (a one-off converter turns its
   kind/category/term entries into catalog ids); after that `WORD_ICONS` is the only source of truth
   and the JSON is archived as evidence.

## 11. Phases (one PR each)

| Phase | Scope | Done when (incl. mock screen to match) |
|---|---|---|
| **0 — Decision and docs** | Add the D1-D6 decision row to `docs/SOLUTION_DESIGN.md` (below), W1-W7 to `docs/PRD.md`, this plan + mock, the `CLAUDE.md` pointer (already in this PR). **Miguel picks the set (Q1) by looking at the mock's *Stil-Vergleich*.** | Docs merged; set confirmed. |
| **1 — Pipeline + first slice** | `wordIcons.ts` (type + ~12 Körper entries), `lib/catalog/ids.ts`, `WordIcon` component, `vendor-word-icons.ts` + pinned devDependency + assets folder + `SOURCE.json`/`LICENSE.txt`, PWA `globPatterns`, `/bildnachweis` + footer link, icons on the **noun card** and **pills** only. | Matches *Nomen · Karte*, *Kein Bild*, *Bildnachweis*. `dist/sw.js` lists the icons; offline check in the PR. |
| **2 — Populate** | Convert the candidates JSON to ids; add strong entries for all nouns (2a), then verbs + adjectives (2b); Miguel reviews the **weak** list in the PR description and each is kept, changed or nulled. | `icons:check` reports 0 broken keys; coverage within ±3 points of §4 after Miguel's edits. |
| **3 — All surfaces** | Verb card, `CategoryCardsTool`, lesson chips, search rows, flashcards (§7.3), quiz prompt + feedback; 3b optional **Bilder** view. | Matches *Verben*, *Üben · Karten*, *Lektion 10*, *Suche*, *Nomen · Bilder*. |
| **4 — Intake tooling** | `icons:check`, Bild-Vorschläge in `vocab:check`, optional weak-icons setting. | The next lesson intake uses it end to end. |
| **5 — Bild → Wort (optional)** | §8. | Matches *Üben · Bild → Wort*. |

Phases 3, 4 and 5 are independent of each other. The proposed Solution Design row:

> **2026-xx-xx · Word icons: vendored open-licence SVG artwork, not an icon library.** Fluent Emoji Flat (MIT)
> files, only the used ones, committed under `src/assets/word-icons/`, shown with `<img>`; mapped to catalog ids in
> `src/content/wordIcons.ts`; vendored from a pinned devDependency by a script. No icon package ships. *Why:* second
> memory hook; MIT needs only a credits notice; artwork is content, not UI chrome, so the "no icon library" rule is kept.

## 12. Tests (high-ROI only)

- **Map integrity:** every key in `WORD_ICONS` is a real catalog id; every non-null `key` has a vendored
  file; no orphan files; `--check` of the vendoring script is clean (protects against hand-edited icons).
- **Budget:** total raw size ≤ 600 KB, each file ≤ 8 KB, every file is an SVG with a `viewBox` and no `<script>`/external `href`.
- **Resolver:** `wordIconFor` returns `undefined` for `null` and absent ids; id helpers produce exactly the ids
  the catalogs produce (guards the extraction in §5.1).
- **`WordIcon`:** renders nothing without an icon; renders `<img alt="" aria-hidden>` with width/height when present.
- **Flashcard rule (§7.3):** no icon element on the front for de→en; present on the back; present on the en→de front.
- **Credits page:** contains the licence text and the version from `SOURCE.json`.
- **Bild → Wort (Phase 5):** pool excludes weak and duplicated icons; `checkPictureAnswer` (article, `ß`, case hint).
- **Not tested:** the artwork itself, pixel sizes, the precache list (checked once by hand in Phase 1), static layout.

## 13. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | **Style consistency.** Mixing sets makes a messy page. | One set only; a word missing from it gets none rather than an icon from another set. Set is swappable (D3). |
| R2 | **Ambiguous words** (*Bank*, *Schloss*, *Kohl*, *Leiter*, *Note*, *Pause*, *Land*). | The key is per catalog entry, so each sense decides on its own; if no picture fits the taught sense, `null`. The gloss stays next to the card. |
| R3 | **False friends and look-alikes.** *Aprikose* → peach, *Pfeffer* → hot pepper, *Rock* → the rock emoji, *Hase* hare vs rabbit, Swiss *Peperoni* (bell pepper) vs German (chilli). | Marked `null` in the candidate map where the picture misleads (Aprikose, Pfeffer, Rock); *Peperoni* is weak → `bell-pepper` and flagged. A wrong picture is worse than none (W5). |
| R4 | **Adult or sensitive imagery** (alcohol, cigarettes, weapons in some sets). | Only Bier and Wein use it, both taught A1 words; no other sensitive motifs are mapped. The review of the weak list catches the rest. |
| R5 | **Abstract words.** | "No icon" is a valid, expected result (>20% of words, all function words and grammar). |
| R6 | **Weak hooks interfere** (a loose picture attaches to the wrong word). | Tier flag; excluded from Bild → Wort; Miguel can hide them (Q2). Never put a weak icon on a de→en front. |
| R7 | **OpenMoji share-alike scope** if it were chosen. | Not chosen; if Miguel prefers it, ship the folder unmodified with its licence and get a proper legal reading first. |
| R8 | **Upstream drift / abandonment.** | We vendor a frozen, pinned snapshot; upstream changes never reach the app unless the script is re-run. |
| R9 | **PWA cache size.** | Budget test (§6.4); ~260 KB gzipped after A1.2. |
| R10 | **Overload:** pictures everywhere might distract. | Phase 3 surfaces are individually removable; search rows are first to drop. |

## 14. Open questions for Miguel (max 3)

**Q1 — Which style?** Fluent Emoji Flat (MIT, light, calm) vs Noto (Apache, richer, 3x heavier); see mock *Stil-Vergleich*
(also OpenMoji and a line set). **Recommendation: Fluent Flat.** Switching later is one command.

**Q2 — Loose ("weak") pictures: show them?** About 128 words only get a loose hook (*Kopf* → silhouette, *Woche* → calendar).
**Recommendation: yes, but I list them for your review in the Phase 2 PR, you veto or null each, and they are never used in
Bild → Wort.** The mock has a "lose Bilder zeigen" switch to compare.

**Q3 — Flashcards: picture on the German front?** **Recommendation: no.** Picture on the back (after reveal) for de→en, and on
the front for en→de; the picture-first drill is the separate *Bild → Wort* mode (Phase 5, optional).

## Appendix A — Reproduce the numbers

```
# once, in any scratch folder: unpack the packages the script verifies against
npm pack @iconify-json/fluent-emoji-flat@1.2.6 @iconify-json/noto@1.2.9 @iconify-json/openmoji@1.2.29 \
         @iconify-json/twemoji@1.2.5 @iconify-json/ph@1.2.2
# extract each .tgz and rename its `package` folder to fluent | noto | openmoji | twemoji | ph, then:
npx tsx scripts/icon-coverage.ts --sets-dir <that folder>
```

Without `--sets-dir` the script still reports coverage but says names are unverified. It exits 1 if the map names a
word that is not in the catalog, or (when verifying) an icon that a set does not have.

## Appendix B — What I checked, and what is still "to verify"

Verified 2026-09-29: licence texts of Twemoji graphics (CC BY 4.0), Noto (OFL for fonts), Fluent (MIT), Phosphor (MIT),
Tabler (MIT), Lucide (ISC), Font Awesome Free (CC BY 4.0 / OFL / MIT), fetched from upstream; OpenMoji CC BY-SA 4.0 and code LGPL-3.0
and its suggested attribution line from the README; Noto image licence (Apache-2.0) from the README; Twemoji attribution wording
policy from the README; licence metadata of all eleven `@iconify-json` packages; existence of every cited icon name in
the four emoji sets (0 missing of 209) and Phosphor (0 missing of 134); icon sizes measured on the real files.

To verify before shipping: exact Twemoji credit wording; that Fluent's README adds no terms beyond the MIT `LICENSE`;
Material Symbols and Game-icons licence text; ARASAAC terms (site unreachable here; secondary source only); the
`vite-plugin-pwa` default `globPatterns` for the installed version; any legal reading of CC BY-SA scope (only if OpenMoji is chosen).

Sources: [Twemoji graphics licence](https://github.com/jdecked/twemoji), [OpenMoji](https://github.com/hfg-gmuend/openmoji),
[Noto Emoji](https://github.com/googlefonts/noto-emoji), [Fluent UI Emoji](https://github.com/microsoft/fluentui-emoji),
[Iconify JSON packages](https://www.npmjs.com/org/iconify-json),
[ARASAAC licence summary (secondary)](https://openassistive.org/item/arasaacpictograms/).
