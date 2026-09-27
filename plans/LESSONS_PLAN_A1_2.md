# Lessons Plan — A1.2 Data Architecture Refactor

> **Status:** Proposed — awaiting review. Nothing here is implemented yet.
> **Execute one phase = one PR**, each satisfying the commit gate in
> [CLAUDE.md](../CLAUDE.md) (100% tests pass · no lint errors · no TypeScript errors).
> **Companion docs:** [PRD](../docs/PRD.md) · [Solution Design](../docs/SOLUTION_DESIGN.md) ·
> [Feature Plan 2026-07](./FEATURE_PLAN_2026-07.md)
> **Design & interaction target:** [`LESSONS_PLAN_A1_2.mock.html`](./LESSONS_PLAN_A1_2.mock.html)
> (open in a browser; see §2a). This plan says *what data and logic* to build; the
> mock says *how it looks and behaves*. Keep them in step: change one, update the other.
> **Author:** Claude Code, with Miguel · **Created:** 2026-09-27

---

## 1. Purpose

Make the app **lesson-aware** so the course book (Swiss edition, A1.2 =
Lektion 8–14) can be fed in lesson by lesson, and so the structure keeps working
for A2 and beyond.

What Miguel wants, in his words turned into requirements:

| # | Requirement |
|---|---|
| R1 | Search a lesson number ("Lektion 8", "L8") and see **everything** from that lesson: verbs, nouns, adjectives, adverbs, prepositions, grammar, strategies/Redemittel. |
| R2 | Every verb shows **Präsens, Präteritum and Perfekt**. |
| R3 | Prepositions carry their **case** (Dativ / Akkusativ / Wechsel) and **use** (temporal / lokal / modal), e.g. *vor/seit + Dativ*, *für + Akkusativ*. |
| R4 | Grammar summaries ("Grammatik und Kommunikation" page at the end of each lesson) live in the app. |
| R5 | A repeatable **Lernwortschatz check**: from a photo, report what the app already has, what is missing, and what exists but lacks the lesson tag — then add after approval. |
| R6 | Ready for future lessons/levels without editing unrelated code. |

## 2. Decisions (agreed 2026-09-27)

| Decision | Choice | Why |
|---|---|---|
| D1 Spelling | **Swiss `ss`** — no `ß` in content. | Match the book. Safe: slugs already fold `ß→ss` (`slugify`), so practice progress keys do not change. |
| D2 Storage | **By word type + lesson tags.** Verbs stay in `verbs/data.ts`, nouns in `nouns/data.ts`… each item gets `lessons: LessonId[]`. A lesson page *queries* by tag. | A word recurs across lessons (e.g. *helfen*: L9 grammar, L13 Dativ verb). One record, many tags, no copies. |
| D3 Existing content | Tag everything already in the app **`A1.1`** (a level-wide pseudo-lesson). | Precise L1–7 tags can come later by retagging only. |
| D4 Vocab check | **Report first, add after OK.** | Keeps Miguel in control of what goes in. |

## 2a. Design & interaction target (the mock)

[`plans/LESSONS_PLAN_A1_2.mock.html`](./LESSONS_PLAN_A1_2.mock.html) is a
clickable, self-contained mock of the finished feature set (published copy:
<https://claude.ai/artifact/Ps4i5mQBHemzEyTQbC1qEr>). Miguel reviewed it on
2026-09-27 and approved it as the target.

**How the two documents work together**

- **Plan = source of truth for data, logic, phases and tests.** Mock = source of
  truth for **layout, labels, interaction and states**.
- Every phase in §5 names the mock screen(s) it must match. A phase is not done
  until the real screen matches its mock screen (same sections, same order, same
  controls and states; exact pixels are not required).
- The mock is **throwaway reference code**: vanilla JS, sample data, not shipped,
  not linted, not tested. The real app keeps its own conventions (React, inline
  `style={{}}`, `src/lib/theme.ts` tokens). Never copy mock code into `src/`.
- Mock sample data (counts like "118 / 142", the vocab-check word lists) is
  illustrative. Real content comes from Miguel's photos.
- If implementation shows the mock is wrong or impractical, **update the mock
  and this plan in the same PR** and say so in the PR description.
- The dashed amber outline and the notes column in the mock are review aids, not
  UI. Do not build them.

**Mock screen → plan section**

| Mock screen | Plan section | Phase |
|---|---|---|
| Home | §4 (new tiles), registry | 4, 6, 7 |
| Suche „Lektion 8" | §4.2 | 4 |
| Lektionen | §4.1 index | 4 |
| Lektion 8 | §4.1 lesson page | 4 (+7 for the grammar row) |
| Verben · 3 Zeiten | §3.4 | 5 |
| Präpositionen | §3.5 | 6 |
| Grammatik | §3.6 | 7 |
| Üben | §4.4, §3.4 drill, §3.5 drill | 4, 5, 6 |
| Wortschatz-Check | §4.3 (chat report, not an app screen) | 3 |

**UI defaults taken from the mock review** (Claude's recommendations; Miguel
can still overturn any of them before the relevant phase starts):

| # | Question | Default |
|---|---|---|
| U1 | Nav grows from 6 to 9 links. Merge Präpositionen into Grammatik? | **Keep separate.** Prepositions are words you drill; grammar is tables you read. The nav row scrolls sideways on phones. |
| U2 | Verb tenses: switch or side by side? | **Switch** (Präsens · Präteritum · Perfekt). Side by side is too wide on a phone. |
| U3 | Lesson page: group by word type or by book part A–E? | **By word type.** The book's word list isn't split by part. |
| U4 | Practice lesson filter: one lesson or several? | **One lesson** for now. Multi-select later if missed. |
| U5 | Show the ✅/❌ Lernwortschatz list inside the app? | **No** (not in scope). Only the coverage bar on the lesson page and lesson list. |
| U6 | Grammar explanations: English or German? | **Short English rules** beside the book's German tables, like the rest of the app. |
| U7 | Search dropdown for a lesson query | **Lesson hit first**, then a short preview (3 items per word type) and a link to the full lesson page. |

## 3. Target data model

### 3.1 Lesson registry — `src/content/lessons.ts` (new)

The one list of lessons. Pure data + types, no React.

```ts
export type Level = 'A1.1' | 'A1.2' | 'A2.1'            // extend when a new book starts
// Book numbering restarts per volume in some series, so the id is level-scoped.
export type LessonId = 'A1.1' | 'A1.2-L08' | 'A1.2-L09' | … | 'A1.2-L14'

export interface LessonSection {       // one column A–E of the Kursbuch table
  key: 'A' | 'B' | 'C' | 'D' | 'E'
  title: string                        // "Ich bin Physiotherapeutin."
  goals: string[]                      // "Berufe benennen und erfragen"
}

export interface Lesson {
  id: LessonId
  level: Level
  number?: number                      // 8 … 14 (absent for the 'A1.1' bucket)
  title: string                        // "Beruf und Arbeit"
  folge?: string                       // "Total fotogen"
  sections: LessonSection[]
  wortfelder: string[]                 // "Berufe", "Arbeit"
  grammar: string[]                    // book's Grammatik bullets, as printed
  phonetik?: string[]                  // from the Arbeitsbuch TOC
  pruefung?: string[]                  // "Sprechen, Teil 2"
  fokus?: string[]                     // "Fokus Beruf: Ein Inserat schreiben"
  pages?: { kb?: number; ab?: number; lws?: number }
}
```

`LessonId` is a **string-literal union**, so a typo in any `lessons: [...]` tag
is a compile error. Adding a lesson = one registry entry + one union member.

### 3.2 Tag every learnable item

Each data item (verb, noun, adjective, phrase, satzbau pattern, and the new
preposition/grammar items) gains:

```ts
lessons: LessonId[]        // required after the backfill (see Phase 1)
```

Rollout uses the proven **optional → backfill → required** pattern from
Feature B, so the build never goes red mid-way.

### 3.3 `CatalogEntry` gains two fields

```ts
lessons: LessonId[]        // copied from the item by each tool's catalog.ts
kind: EntryKind            // 'verb' | 'noun' | 'adjective' | 'adverb' | 'phrase'
                           // | 'strategy' | 'pattern' | 'preposition' | 'grammar'
```

`kind` exists because a lesson page groups by **word class**, not by tool
(adverbs currently live inside the Phrases tool, category `adverbien`; after
this they project as `kind: 'adverb'` without moving files).

Nothing that consumes the catalog (search, practice, cross-links) imports a
tool's `data.ts` — that rule stays.

### 3.4 Verbs: three tenses — `src/tools/verbs/data.ts`

```ts
export interface Verb {
  infinitive: string
  english: string
  type: VerbType
  conjugations: Conjugation[]          // Präsens (unchanged name → no churn)
  praeteritum: Conjugation[]           // 6 persons, stemChange-highlighted
  perfekt: { auxiliary: 'haben' | 'sein'; partizip: string }
  separable?: string                   // prefix, e.g. 'auf' (aufmachen) — from L12
  governs?: 'Dativ' | 'Akkusativ'      // gefallen/gehören/passen/helfen — L13
  lessons: LessonId[]
  …existing fields (note, example, translation)
}
```

- **Perfekt is stored as aux + Partizip II only.** The six full forms
  ("ich habe gearbeitet") are **derived** by a pure `perfektForms(verb)` that
  reuses the Präsens table of *haben*/*sein*. DRY by knowledge: the aux
  conjugation exists once.
- **Präteritum is stored in full** (irregular stems can't be derived reliably).
- UI: a tense switch (Präsens · Präteritum · Perfekt) above the existing table.
  Deep links: `?sel=schlafen&tense=perfekt` (optional param, default Präsens).
- Practice: the conjugation drill gets a tense picker. `checkConjugation`
  takes a tense; Perfekt accepts the full form ("habe gearbeitet").

### 3.5 Prepositions — new tool `src/tools/prepositions/` → `/praepositionen`

```ts
// Wechsel = Dat (Wo?) / Akk (Wohin?). 'ohne' = takes no case, e.g. "als" (L8:
// Ich arbeite als Hauswart) — found while building the mock.
export type Case = 'Dativ' | 'Akkusativ' | 'Wechsel' | 'ohne'
export type PrepUse = 'temporal' | 'lokal' | 'modal'

export interface Preposition {
  word: string                         // "seit"
  case: Case
  use: PrepUse[]                       // "in" is both lokal and temporal
  question: string                     // "Seit wann? / Wie lange?"
  meaning: string
  contractions?: string[]              // "im", "am", "zum", "zur", "beim"
  examples: { de: string; en: string }[]
  note?: string
  lessons: LessonId[]
}
```

- UI (mock screen *Präpositionen*): filter pills by **case** (incl. "ohne Fall")
  and by **use**; each card shows a colour-coded case badge and lesson tags, and
  expands to the article table for that case (einem/einer/einem/—n), or the
  Wo?/Wohin? rule for Wechsel, plus examples and contraction notes.
- The existing `praep` category in `phrases/data.ts` **moves here** (its items
  are prepositions, not phrases). Slugs change from `praep/…` to the new tool;
  add a one-entry progress migration (version bump in `lib/progress.ts`) so no
  stored progress is lost.
- New drill: **"Welcher Fall?"** — show *seit ___ Jahr* → pick *einem*.
  Pure checker in `practice/drills.ts`, same shell as the other drills.

### 3.6 Grammar — new tool `src/tools/grammar/` → `/grammatik`

Grammar summaries are tables and rules, not word lists. One small block model
renders all of them:

```ts
export type GrammarBlock =
  | { type: 'table'; caption?: string; head: string[]; rows: string[][]; highlight?: [number, number][] }
  | { type: 'examples'; items: { de: string; en: string }[] }
  | { type: 'rule'; text: string }

export interface GrammarTopic {
  id: string                           // "praeteritum-sein-haben"
  title: string                        // "Präteritum: sein und haben"
  ugRef?: string                       // "UG 5.06" (book's grammar reference)
  summary: string
  blocks: GrammarBlock[]
  related?: string[]                   // catalog slugs, e.g. the verbs sein/haben
  lessons: LessonId[]
}
```

- One `GrammarTopicView` renders the three block types — no per-topic components.
- Topics link to the tools that hold the words (preposition cards, verb tenses)
  via `related`, reusing the existing cross-link chips.
- Where a grammar point is *also* a word (e.g. *vor + Dativ*), the Preposition
  item is the source of truth and the grammar topic references it — no copy.

### 3.7 Nouns — small additions

- `feminine?: string` for professions (Arzt → Ärztin, Hausmann → Hausfrau) — L8
  Wortbildung. Shown on the noun card and searchable.
- New categories as lessons require them (Beruf, Amt, Krankheiten, Stadt &
  Verkehr, Feste & Monate…). Categories stay free strings, as today.
- `nouns/data.ts` is 1 335 lines. **Split into `nouns/data/<category>.ts` only
  when it passes ~2 000 lines** (YAGNI until then).

### 3.8 Swiss vocabulary

Swiss words (Velo, Tram, parkieren, Grüezi) are stored as the headword the book
uses. **Add** an optional `standard?: string` (German-German equivalent, shown +
searchable) **the first time** such a word arrives — not before.

## 4. Features built on the model

### 4.1 Lesson pages — `/lektionen` and `/lektionen/:id`

- **Index:** one card per lesson (number, colour, title, Folge), grouped by level.
- **Lesson page:**
  1. Header from the registry: A–E section titles + goals, Wortfelder,
     Phonetik, Prüfung, Fokus.
  2. **Grammatik** — the lesson's grammar topics (rendered inline).
  3. **Content by kind** — Verben, Nomen, Adjektive, Adverbien, Präpositionen,
     Redemittel/Strategien, Satzbau — each item a link to its tool (`?sel=`).
  4. **"Diese Lektion üben"** → `/uben?lektion=A1.2-L08` (practice deck
     filtered by tag).
  5. **Coverage line**: "Lernwortschatz: 142 / 150 words in the app" (from §4.3).
- Pure selector `entriesForLesson(catalog, id)` grouped by `kind` — tested; the
  page just renders it.

### 4.2 Search by lesson

`searchCatalog` recognises lesson queries: `lektion 8`, `lektion8`, `l8`, `L08`,
`a1.2 l8`. A lesson query returns a **lesson hit first** (links to the lesson
page), then the lesson's items. Plain `8` stays a normal text search (avoids
noise). If two levels share a number later, both lesson hits show.

Search also folds `ß`/`ss` both ways, so "gross" and "groß" both match.

### 4.3 Lernwortschatz check — `scripts/vocab-check.ts`

The repeatable workflow for every vocab photo:

1. Miguel sends the LWS photo(s) for a lesson.
2. Claude transcribes them to **`content/lws/A1.2-L08.txt`** (one entry per
   line, as printed: `der Arzt, -"e`, `arbeiten`, `seit`). This file is
   committed — it is the lesson's official word list.
3. `npm run vocab:check -- A1.2-L08` prints three lists:
   - ✅ **have + tagged**
   - 🏷️ **have, but missing this lesson tag** (just add the tag)
   - ❌ **missing** (grouped by guessed kind: noun if it has an article, etc.)
4. Claude shows the report. **Miguel approves.** Claude adds the items (with
   example + translation, Swiss spelling, lesson tag) and re-runs the check.
5. The check result feeds the coverage line on the lesson page.

The matching core is a **pure, tested** `checkVocab(lines, catalog, lessonId)`:
strips articles and plural markers, folds `ß/ss`, matches case-sensitively on
the German side (essen ≠ Essen) with a case-insensitive fallback flagged as
"maybe".

### 4.4 Practice by lesson

Practice deck builder accepts an optional `lessonId` filter. All existing modes
(flashcard, quiz, article, conjugation) work on the filtered deck; new modes
(tense conjugation, "Welcher Fall?") appear when the deck has matching items.

## 5. Phases (one PR each)

Order is chosen so Miguel can start sending lesson photos after **Phase 3**.

| Phase | Scope | Done when (incl. mock screen to match) |
|---|---|---|
| **0 — Docs** | Record D1–D4 and this model in `docs/SOLUTION_DESIGN.md` (decisions log) and `docs/PRD.md` (R1–R6). Link this plan from `CLAUDE.md`. | Docs merged; mock linked from the Solution Design. |
| **1 — Lesson registry + tags** | `src/content/lessons.ts` with A1.1 bucket + L8–L14 filled from the TOC photos (Appendix A). `lessons?` on every item; backfill all existing items to `['A1.1']`; flip to required. `CatalogEntry.lessons` + `kind` in every `catalog.ts`. | Typecheck forces every item to carry a tag; catalog test asserts every entry has ≥1 lesson and a valid kind. |
| **2 — Swiss spelling** | Replace `ß → ss` in all content. Test: no `ß` in any content string. Search folds both ways. | Progress keys unchanged (slug test proves it). |
| **3 — Vocab check** | `checkVocab` + `scripts/vocab-check.ts` + `npm run vocab:check`. `content/lws/` folder. | Tests cover article/plural stripping, ß/ss, case, "tag missing" vs "missing". Report shape matches mock: *Wortschatz-Check*. |
| **4 — Lesson pages + lesson search** | `/lektionen`, `/lektionen/:id`, `entriesForLesson`, lesson queries in search, `?lektion=` practice filter. Registry entry → nav + Home card. | Searching "Lektion 8" lands on the L8 page. Matches mock: *Home*, *Suche*, *Lektionen*, *Lektion 8*, *Üben* (lesson filter). |
| **5 — Verb tenses** | `praeteritum?` + `perfekt?` fields, `perfektForms()`, tense switch UI, `&tense=` deep link, drill tense picker. Backfill all 73 verbs, then flip to required. | Every verb shows 3 tenses; drill tests per tense. Matches mock: *Verben · 3 Zeiten*, *Üben → Konjugation*. |
| **6 — Prepositions tool** | New tool + data (A1.1 ones + L8 temporal + L11 lokal + L12 temporal). Move `praep` out of Phrases with progress migration. "Welcher Fall?" drill. | Filter by case/use works; migration test keeps old progress. Matches mock: *Präpositionen*, *Üben → Welcher Fall?*. |
| **7 — Grammar tool** | Block model, `GrammarTopicView`, first topics from the L8 summary (Appendix B). Grammar section on lesson pages. | L8 page shows all five L8 grammar topics. Matches mock: *Grammatik*, grammar row on *Lektion 8*. |
| **8+ — Lesson intake (repeat per lesson)** | For L8 → L14: LWS check → approve → add items + tags; add that lesson's grammar topics from the "Grammatik und Kommunikation" photo. | Lesson coverage ≈ 100%. |

Phases 5, 6 and 7 are independent of each other and may be reordered.

### Per-lesson intake recipe (Phase 8+, repeat)

1. Photos: Lernwortschatz pages + "Grammatik und Kommunikation" page (+ any
   important lesson pages).
2. Transcribe → `content/lws/<lesson>.txt` → `npm run vocab:check`.
3. Show report → **OK from Miguel**.
4. Add/tag words; new verbs come with all three tenses; new prepositions with case.
5. Add grammar topics; link `related` items.
6. Commit gate → PR.

## 6. Tests (high-ROI only)

- Catalog: every entry has ≥1 valid `LessonId` and a `kind`; ids unique.
- `perfektForms`: haben-verb, sein-verb, separable verb (aufgemacht).
- `checkConjugation` per tense; "Welcher Fall?" checker.
- `entriesForLesson` grouping; lesson-query parsing in search.
- `checkVocab`: the matching rules listed in §4.3.
- Progress migration for moved preposition slugs.
- Content guard: no `ß`; every Präteritum table has 6 persons.
- Not tested: rendering of static tables, registry constants.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Backfilling 73 verbs × 2 tenses has typos. | Claude drafts, tests check shape; Miguel spot-checks the irregular list. Optional/required flip keeps build green. |
| Moving `praep` changes slugs → lost progress. | Versioned progress envelope already exists; add a migration step. |
| Lesson ids collide across books (A2 restarting at L1). | Ids are level-scoped (`A1.2-L08`). |
| Grammar block model too rigid for some page. | Start with 3 block types; add a 4th only when a real page needs it. |

---

## Appendix A — A1.2 lessons (from the Kursbuch + Arbeitsbuch TOC)

| L | Titel · Folge | Sections A–E (short) | Wortfelder | Grammatik |
|---|---|---|---|---|
| 8 | **Beruf und Arbeit** · Total fotogen | A Berufe benennen · B über Vergangenheit/Gegenwart austauschen · C von Ereignissen in der Vergangenheit berichten · D Stelleninserate, Stellengesuch | Berufe, Arbeit | Wortbildung Nomen (-in); *bei* (lokal); *als* (modal); *vor, seit* + Dat, *für* + Akk; Präteritum *sein, haben* |
| 9 | **Ämter** · Komm mit! | A Abläufe erklären · B Aufforderungen · C Erlaubtes/Verbotenes · D Umzugsmeldung · E Einreise in die Schweiz | Amt, Regeln Verkehr/Umwelt, Umzugsmeldung | Modalverben *müssen, dürfen*; Satzklammer; *man*; Imperativ (*Warten Sie bitte!*); *helfen* |
| 10 | **Gesundheit, Krankheit und Unfall** · Unsere Augen sind so blau | A Körperteile, Befinden · B Befinden anderer · C Anweisungen/Ratschläge · D Krankmeldung · E Arzt/Notfall | Körperteile, Krankheiten, Brief | Possessivartikel *dein, sein, ihr, unser…*; *sollen*; Satzklammer |
| 11 | **In der Stadt unterwegs** · Alles im grünen Bereich | A Weg fragen/beschreiben · B Verkehrsmittel · C Ortsangaben · D Orte & Richtungen · E Am Bahnhof | Einrichtungen in der Stadt, Verkehrsmittel | *mit* + Dat; lokal *an, auf, bei, hinter, in, neben, über, unter, vor, zwischen* (Wo?); *zu, nach, in* (Wohin?) |
| 12 | **Kundenservice** · Super Service! | A Zeitangaben, Tagesabläufe · B zeitliche Bezüge · C höfliche Bitten · D Telefonbeantworter · E Hilfe im Alltag | Kundenservice, Telekommunikation | temporal *vor, nach, bei, in, bis, ab*; Konjunktiv II *würde, könnte*; Satzklammer; Präfixverben *auf-/zumachen, ein-/ausschalten* |
| 13 | **Neue Kleider** · Das ist aber kalt heute! | A Kleidungsstücke · B Gefallen/Missfallen · C Vorlieben, Bewertungen · D Auswahl treffen · E Im Warenhaus | Kleider & Gegenstände, Landschaften | Demonstrativ *der, das, die*; *welch-*; Personalpronomen Dativ; Verben mit Dativ *gefallen, gehören, passen*; Komparation *gut, gern, viel*; *mögen* |
| 14 | **Feste** · Ende gut, alles gut | A Datum, Feste · B über Personen sprechen, um Hilfe bitten · C Gründe, Termine absagen/zusagen · D Einladungen · E Glückwünsche | Monate, Feste, Glückwünsche | Ordinalzahlen; Personalpronomen Akkusativ; Konjunktion *denn*; *werden* |

**Arbeitsbuch extras per lesson** (Phonetik · Prüfung · Fokus):

- **8** e/ä, -e/-er · Sprechen T2 · Inserat schreiben; Aufgabenverteilung fragen
- **9** Satzakzent Modalverben, Satzmelodie Frage/Aufforderung · Schreiben T1 · Genossenschaftswohnungen; Arbeitsplan absprechen
- **10** Laut h, Vokalneueinsatz · Hören T1 · Packungsbeilage; Sicherheitsvorschriften
- **11** Laut z · Hören T2 · Kinderbetreuung finden; Termin bei einer Firma
- **12** Satzakzent, Laut ng · Hören T3, Sprechen T3 · Angebote verstehen; Auf der Bank
- **13** Bindung · Lesen T3 · Rabatt aushandeln; Schutzkleidung
- **14** Satzmelodie Satzverbindungen · Lesen T2 · Veranstaltungshinweise; Um Hilfe bitten

**Lernwortschatz pages:** L8 178 · L9 183 · L10 187 · L11 190 · L12 193 · L13 196 · L14 200.

## Appendix B — L8 grammar topics (from the "Grammatik und Kommunikation" photo)

1. **Nomen: Wortbildung** (UG 11.01) — *-in*: der Mechatroniker → die
   Mechatronikerin (Pl. -innen); der Arzt → die Ärztin; ⚠ der Hausmann → die
   Hausfrau, der Pflegefachmann → die Pflegefachfrau.
2. **bei (lokal) / als (modal)** (UG 6.03) — *Ich arbeite als Hauswart. / bei «Immowohl».*
3. **vor, seit + Dativ** (UG 6.01) — Wann? *vor einem Monat / einem Jahr / einer
   Woche / zwei Monaten*; Seit wann? *seit einem Monat … zwei Jahren*.
4. **für + Akkusativ** (UG 6.01) — Für wie lange? *für einen Monat / ein Jahr /
   eine Woche / zwei Wochen*.
5. **Präteritum sein, haben** (UG 5.06) — war, warst, war, waren, wart, waren ·
   hatte, hattest, hatte, hatten, hattet, hatten.
