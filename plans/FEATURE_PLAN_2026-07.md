# Feature Plan — Learning & Navigation Upgrades (July 2026)

> **Status:** Proposed — awaiting review (revision 2). Nothing here is implemented yet.
> **Execute one PR at a time** (see *Branching & PR strategy* below), each
> satisfying the commit gate in [CLAUDE.md](../CLAUDE.md)
> (100% tests pass · no lint errors · no TypeScript errors).
> **Companion docs:** [PRD](../docs/PRD.md) · [Solution Design](../docs/SOLUTION_DESIGN.md) · [CLAUDE.md](../CLAUDE.md)
> **Author:** Claude Code, with Miguel · **Created:** 2026-07-05

## Revision history

- **rev 2 (2026-07-05)** — Incorporated an adversarial review. Material changes:
  replaced the mutable register-on-import catalog with a **static
  explicit-concatenation** module (kills HMR/test/tree-shaking hazards); made
  Feature B fields **optional-then-flip-required** so the build never goes red
  mid-backfill; **de-risked Feature D's auto-linking with a mandatory spike** and
  an explicit-links fallback (German inflection breaks naive headword matching);
  fixed Feature A to **detect voices lazily at click, never cache a negative**;
  stopped **case-folding the German side** (capitalisation distinguishes noun
  from verb); split D and E into separate PRs (E is the safe first consumer of
  the foundation); added a **cross-cutting gaps** section (accessibility, error
  states, PWA caching, test infra, localStorage versioning, cross-POS terms).
- **rev 1 (2026-07-05)** — Initial six-feature plan.

---

## Purpose

Six improvements, discussed and agreed, to make the app easier to navigate and
more effective for A1 learning, while staying inside the existing constraints:
static client-side PWA, inline `style={{}}` (no Tailwind/UI kit), strict
TypeScript, no backend, and **no unnecessary npm packages**.

## Engineering principles (apply to every feature below)

These come from [CLAUDE.md → Engineering principles](../CLAUDE.md) and govern
every design decision in this document:

- **SOLID** — single-responsibility modules; open for extension, closed for
  modification (adding a tool must never require editing search, TTS, etc.);
  small focused interfaces; depend on abstractions.
- **YAGNI** — build for today's requirement, not a speculative one. Simplest
  thing that works; add abstraction on the *second* real caller, not the first.
- **High-ROI tests** — every code change ships with tests, but only meaningful
  ones (pure logic, wiring, real flows). No tests for trivial getters/setters,
  data literals, or framework boilerplate.
- **DRY is about functionality** — de-duplicate *behaviour/knowledge*; some
  incidental code duplication is acceptable and preferable to a forced merge.
- **Composition over inheritance** — when both are viable, compose small units.
- **Modularity, tempered by YAGNI** — clear seams, but no indirection no current
  requirement needs.

## Recommended execution order

`A → B → (foundation + E) → C → D → F`. `G` is parked as a documented future
upgrade.

| # | Feature | Effort | Impact | Depends on |
|---|---------|--------|--------|-----------|
| A | Pronunciation audio (Web Speech API) | Low | High | — |
| B | Example sentence for every verb & noun | Med (content-heavy) | High | — |
| E | Global search | Low–Med | Medium | catalog foundation |
| C | Practice mode (flashcards / quiz) | Medium | Very High | catalog foundation, B (nicer) |
| D | Cross-linking backbone | Medium–High* | High | catalog foundation, deep-select |
| F | Targeted drills (article & conjugation) | Medium | High | C, D |
| G | Piper offline neural TTS (future) | High | Med (polish) | A |

A and B are independent and can land in any order. The **catalog foundation**
(static registry + deep-select routing) lands *with Feature E*, its safe first
consumer, and is then reused by C, D and F. C and D both need the foundation but
not each other; C ships first because it's the highest-impact learning feature
and carries no morphology risk. **D's effort is Medium–High, not Medium** — the
auto-linking is the one genuinely risky piece in this plan (see Feature D).

## Branching & PR strategy

Goal: keep `main` protected and every change reviewed, **without** stacked-PR
repointing. Rules:

1. **Work strictly sequentially, always branching off freshly-merged `main`.**
   Open the next PR only after the previous merges, so **every PR always targets
   `main` and never needs repointing.** With sequential-off-main, PR *count* no
   longer creates merge/repoint burden — so we optimise the split for
   **reviewability and de-risking**, not for a minimal count.
2. **The catalog foundation ships with its first consumer, Feature E** (global
   search), *plus its own unit tests*. Search is the safe consumer — it matches
   headwords against user queries and is unaffected by German inflection — so it
   validates the registry design before the risky consumer (D) is built. This is
   a deliberate relaxation of "never PR the foundation alone": the foundation is
   unit-tested in the same PR, so it is tested infrastructure, not dead code.
3. **Gate Feature D behind a spike.** Before starting the D PR, spike
   `linksForText` against the real example corpus (see Feature D). If it can't
   reliably match, D switches to explicit author-time links *before* any PR opens.
4. **Combine only what is meaningless apart.** F's two drills are one PR. D and E
   are now **separate** PRs (E is low-risk and validates the foundation; D is the
   morphology-risky consumer — keeping them apart stops a half-working auto-link
   from stalling the whole search+foundation delivery).

Six PRs, each independent-at-merge-time and targeting `main` directly:

| PR | Contents | Branch (suggested) | Notes |
|----|----------|--------------------|-------|
| PR-1 | Feature A — pronunciation audio | `feat/tts-web-speech` | independent |
| PR-2 | Feature B — verb & noun examples | `content/verb-noun-examples` | content-heavy; last commit flips fields to required |
| PR-3 | Catalog foundation + Feature E — global search | `feat/catalog-search` | foundation unit-tested here |
| PR-4 | Feature C — practice mode | `feat/practice-mode` | consumes catalog |
| PR-5 | Feature D — cross-linking | `feat/cross-links` | **gated on the linksForText spike** |
| PR-6 | Feature F — article & conjugation drills | `feat/practice-drills` | needs C + D |

A and B are mutually independent and may be reordered/parallelised. If Miguel
prefers to cap at five PRs, D's scope can be merged into PR-3 — but only *after*
the spike proves auto-linking works; otherwise keep them split.

---

## Shared foundation used by several features

Features E, C, D and F lean on **one catalog of learnable items** plus **one
routing convention**. Designed once here so no feature reinvents them.

### The catalog (`src/lib/catalog/`)

A single place that knows "what learnable items exist across all tools", built by
**static explicit concatenation** of per-tool adapters. Search/linking never
import tool `data.ts` directly.

```ts
// src/lib/catalog/types.ts
export interface CatalogEntry {
  id: string          // stable, unique WITHIN the app, e.g. "nomen:familie/bild"
  toolId: string      // "verben" | "nomen" | ...
  route: string       // "/verben"
  slug: string        // URL-safe unique selector used by ?sel= (see routing)
  term: string        // German headword, ORIGINAL CASE: "schlafen", "Bild", "weil"
  gloss: string       // English: "to sleep"
  category?: string   // "Familie" (nouns) — needed to resolve noun identity
  keywords?: string[] // extra match text for search (e.g. article "das")
}

// src/lib/catalog/index.ts  — the ONE place edited when adding a tool
import { verbsCatalog } from '../../tools/verbs/catalog'
import { nounsCatalog } from '../../tools/nouns/catalog'
// ...one import per tool
export const catalog: CatalogEntry[] = [
  ...verbsCatalog(),
  ...nounsCatalog(),
  // ...spread each tool's adapter
]
```

Each tool ships a pure `catalog.ts` exporting `xxxCatalog(): CatalogEntry[]` that
maps its `data.ts` into entries. Adding a new tool = write its `catalog.ts` and
add **one import + one spread** to `src/lib/catalog/index.ts`. Search, practice
and cross-linking need **zero** edits — the "inject a list of searchable
concepts" seam, achieved with plain data, not machinery.

> **Why not a `registerCatalogSource()` registry?** A global mutable `sources[]`
> populated by side-effecting imports has three real hazards: (1) a tool's
> adapter only registers if its module happens to be imported (tree-shaking / lazy
> routes can drop it silently); (2) Vite HMR re-runs modules and double-registers
> (duplicates in dev); (3) Vitest module isolation makes `getCatalog()`
> order-dependent and flaky. Static concatenation has none of these, is trivially
> testable (pure array), and is *more* YAGNI. One explicit import line per tool is
> an acceptable, visible cost.

**Identity & uniqueness rules (these matter):**
- **`term` keeps its original German capitalisation.** Do **not** lowercase it in
  the catalog — capitalisation is meaning in German (`essen` the verb vs. `Essen`
  the noun). Case-folding is allowed only in *search matching* (UX), never in
  *identity/linking*.
- **Nouns are identified by (singular, category), not by singular alone.** The
  noun view already keys selection on both (`GermanNouns.tsx` selects on
  `n.singular === … && n.category === …`). So a noun's `slug` encodes the
  category (e.g. `familie/bild`) and its `id`/`slug` are unique even if a singular
  ever recurs across categories. Verbs are unique by infinitive.
- **`slug` is the deep-select key**, distinct from the display `term`, precisely
  so `?sel=` is unambiguous and URL-safe.

### The routing convention (deep-select)

Every tool accepts an optional selection from the URL query string and
pre-selects that item, falling back to its current default:

```
#/verben?sel=schlafen
#/nomen?sel=familie%2Fbild      (slug encodes category; note it lives INSIDE the hash)
```

- We use **HashRouter** (`App.tsx`), so the query string lives *after* the hash
  (`#/verben?sel=…`). `react-router-dom`'s `useSearchParams` parses this
  correctly. Any hand-built link must be the router path `"/verben?sel=…"` and let
  the router prefix `#` — a test asserts a rendered link's `href` is
  `#/verben?sel=…` (easy to get wrong).
- `useDeepSelect(items, toSlug, param = 'sel')` in `src/lib/` reads the param and
  returns the matching item or `undefined`. **Seeding is via lazy initial state**
  (`useState(() => deepSelected ?? items[0])`), *not* a mount `useEffect` — this
  avoids the StrictMode double-invoke fighting the user's first click. Navigating
  between two `?sel=` targets is out of scope for v1 (YAGNI); the hook seeds the
  initial selection only, and tools keep their local `useState` for clicks.

---

## Feature A — Pronunciation audio (🔊)

### Functionality
A speaker button next to every German headword (verb infinitive, noun singular,
adjective, phrase, sentence pattern) and every example sentence. Tapping it
speaks the German text aloud in German, using the device's built-in voices —
offline where a German OS voice exists (macOS/iOS/Android typically ship one).

### Solution design
- New `src/lib/speak.ts` — a thin wrapper over the browser **Web Speech API**
  (`window.speechSynthesis`). No npm package, no network, no key.
  - `isSpeechSupported(): boolean` — feature-detects **`speechSynthesis`
    presence only** (not voice availability). This is what gates the button.
  - `speak(text: string, opts?: { rate?: number }): void` — cancels any current
    utterance, creates a `SpeechSynthesisUtterance`, sets `lang = 'de-DE'`,
    **picks a German voice lazily at call time** (see below), and speaks.
  - `pickGermanVoice(voices): SpeechSynthesisVoice | undefined` — pure, testable:
    prefer a `de-DE` / `de` voice, prefer `localService` (offline) when present,
    else `undefined` (the browser then falls back to its default voice for
    `lang='de-DE'`). Best-effort — `localService` is unreliable on some browsers.
- **iOS/async-voices handling (critical):** voices load asynchronously and iOS
  Safari frequently returns `[]` from `getVoices()` until a user gesture triggers
  speech. Therefore: **never compute or cache a "no German voice" result at load
  and hide the button on it.** Detect the voice *lazily at click time*; if none is
  found, still speak with `lang='de-DE'` and the default voice (an accented voice
  beats a silently-missing feature). `speak()` is always called from a user
  gesture (the button), satisfying iOS's autoplay restriction.
- New `src/components/SpeakButton.tsx` — presentational 🔊 button that renders
  when `isSpeechSupported()` and calls `speak(text)` on click. **Has an
  `aria-label`** (emoji-only buttons need one, matching the repo's existing
  `aria-label="Verb suchen"`). Inline styles matching the pill/button aesthetic.
- Wire `SpeakButton` into the verb/noun/adjective/phrase/satzbau card views +
  `CategoryCardsTool` (headword and example). One shared component, injected per
  view — composition, not duplication.
- **Test infra:** jsdom has **no** `speechSynthesis`/`SpeechSynthesisUtterance` —
  add stubs in `src/test/setup.ts` (or per-test) so `isSpeechSupported()` and
  `SpeakButton` are testable both ways.
- **Engineering-principle mapping:** SRP (engine vs. button vs. call sites); DIP
  (call sites depend on `speak()`, not on the Web Speech API — the seam that lets
  Feature G swap in Piper); YAGNI (no settings UI, no rate/pitch controls yet).

### Definition of Done
- [ ] A 🔊 button appears on verb, noun, adjective, phrase and satzbau headwords
      and on example sentences whenever `speechSynthesis` exists in the browser.
- [ ] Tapping it speaks the correct German text in German on a device with a
      German voice; on a supporting browser with no German voice it still speaks
      via the default voice (button is not silently dead).
- [ ] The button is absent only when `speechSynthesis` is entirely unsupported.
- [ ] No negative voice-availability result is cached at load (verified by the
      voice check living at click time).
- [ ] `speak()` is the only module referencing `speechSynthesis` (grep check) —
      the Feature G swap seam is intact.
- [ ] The 🔊 button exposes an `aria-label`.
- [ ] Unit tests (with `speechSynthesis` stubbed): `pickGermanVoice` (prefers
      `de-DE` + `localService`, returns `undefined` on no German voice),
      `isSpeechSupported()` both branches, `SpeakButton` renders/hides on support
      and calls `speak` on click.
- [ ] Commit gate green (typecheck, lint, tests, build).

---

## Feature B — Example sentence for every verb & noun

### Functionality
Every verb and every noun card shows one short, A1-appropriate German example
sentence with an English translation — matching adjectives, phrases and satzbau.
No item lacks an example when the feature is complete.

### Solution design
- **Two-step field migration to keep the build green throughout** (the commit
  gate requires 100% green on *every* commit, and there are **73 verbs + 216
  nouns = 289 entries** to backfill — too many for one atomic commit):
  1. Add `example?: string` and `translation?: string` as **optional** to the
     `Verb`/`Noun` interfaces. Render them when present.
  2. Backfill in reviewable batches — each batch is a green commit, each
     German-checked by Miguel (same workflow as the class-notes batches).
  3. Once every entry has both, a final one-line commit flips the fields to
     **required**, so the compiler thereafter *forces* completeness. This flip
     is the last commit of the PR.
- Render the example/translation block on `GermanVerbs.tsx` and `GermanNouns.tsx`
  (nouns: a slot below the 💡 note; verbs: a block under the conjugation table),
  reusing the visual styling from `CategoryCardsTool` — incidental duplication of
  a few style objects is fine (DRY-is-functionality); do **not** force
  verbs/nouns into the generic component just to share styles.
- A1 register: short SVO, present tense, using the headword; verbs conjugated to a
  natural pronoun; nouns with the correct article.
- **Engineering-principle mapping:** required-field flip is the OCP-friendly
  completeness enforcement; YAGNI keeps it to two fields (no example arrays, no
  per-example audio metadata — Feature A speaks whatever string is rendered).

### Definition of Done
- [ ] After the final commit, `Verb.example`/`Verb.translation`/`Noun.example`/
      `Noun.translation` are **required**; `npm run typecheck` fails if any of the
      289 entries omits them.
- [ ] Every verb and noun card renders its example + translation.
- [ ] All example sentences are A1-appropriate and German-verified by Miguel.
- [ ] Example text is picked up by Feature A's 🔊 button (if A already merged).
- [ ] Tests: a guard test asserting **no** verb/noun has an *empty-string*
      `example`/`translation` (the type guarantees presence, the test guarantees
      non-emptiness — these are different); a render test that the example block
      appears on each card.
- [ ] Every intermediate commit is green (build never red mid-backfill).
- [ ] Commit gate green.

---

## Feature E — Global search (ships with the catalog foundation)

### Functionality
A single search box (nav/header or a `/suchen` route) searching **all** tools at
once — type "schlafen", "to sleep", "Bild", "weil" and get results grouped by
tool (Verben / Nomen / …). Selecting a result deep-links to that item. Adding a
new tool later requires **zero** changes to search.

### Solution design
- Build the **catalog foundation** here (static `src/lib/catalog/index.ts`, the
  `CatalogEntry` type, and a `catalog.ts` adapter for each of the five current
  tools) plus its unit tests. Search consumes the `catalog` array — it never
  imports tool data.
- `src/lib/catalog/search.ts` — pure `searchCatalog(entries, query): CatalogEntry[]`.
  Case-insensitive substring over `term`, `gloss`, `keywords`. **Case-folding for
  matching is fine here (UX)** — a user typing "essen" may legitimately see both
  the verb and the noun; results are grouped by tool so the distinction stays
  clear. This is the *only* place German case is folded.
  - **Decision (was TBD):** an empty/whitespace query returns **`[]`** (no results
    list shown until the user types ≥1 non-space char). Simplest, avoids dumping
    the whole catalog.
- `filterVerbs` (`src/tools/verbs/filter.ts`) **stays as-is** — it narrows pills
  within a category context, a genuinely different flow from flat global search.
  No forced merge (DRY-is-functionality).
- `src/components/GlobalSearch.tsx` — input + results grouped by `toolId`; each
  result is a `react-router-dom` link to `route + '?sel=' + slug` (deep-select).
- **Engineering-principle mapping:** OCP/DIP (search depends on the catalog
  abstraction, not concrete tools); SRP (adapters vs. match vs. render); YAGNI
  (substring match first; fuzzy/ranked only if it proves necessary).

### Definition of Done
- [ ] A global search UI returns matching items across every tool, grouped by
      tool, for both German and English queries; empty query shows no results.
- [ ] Selecting a result navigates to and pre-selects the item (via `?sel=`).
- [ ] Adding a tool = one import + one spread in `catalog/index.ts` makes it
      searchable with **no edits to any search file** (asserted via a test using a
      fixture catalog).
- [ ] Tests: `searchCatalog` (German match, English match, keyword match,
      no-match, case-insensitivity, empty query → `[]`); a component test that
      typing a query shows grouped results and that a result link's `href` is
      `#/verben?sel=…` (HashRouter form).
- [ ] Foundation tests: catalog entries are unique by `id` and `slug`; noun slugs
      encode category.
- [ ] Commit gate green.

---

## Feature C — Practice mode (flashcards / quiz)

### Functionality
A practice tool showing a prompt (a German term or an English gloss); the user
recalls, reveals, and self-rates ("knew it" / "didn't"). At least two directions
(DE→EN / EN→DE); user picks which content sets to drill (verbs, nouns,
adjectives, phrases). Session progress is tracked; a lightweight "seen/known"
count persists across sessions via `localStorage`. No accounts, no backend,
offline.

### Solution design
- New tool `src/tools/practice/` at `/uben`, registered in `registry.ts` +
  `App.tsx` `ELEMENTS` (standard "add a tool" path — no other tool touched).
- **Card source:** the `catalog` array — Practice automatically covers any tool
  that contributes entries (`term` = German side, `gloss` = English side).
- **Session logic** `src/tools/practice/session.ts` — pure, React-free:
  deck build/shuffle from a filtered `CatalogEntry[]`, direction, advance,
  mark-known/unknown, summary. Shuffle takes an **injected RNG** so tests are
  deterministic; production passes `Math.random` (do not ship a seeded deck).
- **Persistence** `src/lib/progress.ts` — a typed `localStorage` wrapper storing a
  **versioned envelope** `{ version: 1, data: Record<slug, { seen; known }> }`.
  Versioning from day one so a future schema change can migrate rather than
  silently orphan progress. Keyed by catalog **`slug`** (stable), not display
  term. Guarded for environments without `localStorage`; only the pure
  merge/update/migrate logic is tested.
- **Presentation** `PracticeTool.tsx` — prompt card, reveal, know/don't buttons,
  end-of-round summary, and an **empty-deck state** (e.g. user deselected all
  content sets → a clear "nothing selected" message, not a crash). 🔊 button
  reused on the German side (manual tap only — no autoplay, which iOS blocks).
- **YAGNI boundaries for v1:** **Leitner-lite** (two buckets: due / known), *not*
  full SM-2. No streaks/gamification.
- **Engineering-principle mapping:** SRP (session vs. persistence vs. view);
  composition (Practice composes catalog + progress + SpeakButton); DIP (drills
  against `CatalogEntry`).
- **Test infra:** jsdom provides `localStorage` but does **not** auto-clear it —
  add teardown (`localStorage.clear()`) between tests.

### Definition of Done
- [ ] `/uben` route with a working flashcard round: prompt → reveal → self-rate →
      next, ending in a summary (e.g. "7 / 10 known").
- [ ] User can pick direction (DE→EN / EN→DE) and which content sets to include;
      deselecting everything shows a friendly empty-deck state.
- [ ] Deck is drawn from the catalog — verbs, nouns, adjectives and phrases are
      all drillable.
- [ ] "Seen/known" counts persist across a reload; the app still works if
      `localStorage` is unavailable; stored data carries a `version`.
- [ ] Tests: `session.ts` (deck build, deterministic shuffle via injected RNG,
      direction, mark-known/advance, summary, empty deck) and `progress.ts`
      (merge/update, missing-storage guard, version envelope round-trip).
- [ ] Commit gate green.

---

## Feature D — Cross-linking backbone

### Functionality
When a card references a word the app teaches elsewhere, show a small inline link
to it: a card whose example uses a known **verb** shows a "→ Konjugation" chip
opening that verb; one using a known **noun** shows a "→ Nomen" chip; etc.

### ⚠️ Mandatory spike before this PR opens
The naive design ("scan an example for known headwords") is undermined by German
morphology: headwords are lemmas (`lernen`, `Bild`) but examples contain
*inflected* forms — the real phrases data has `example: "Warum lernst du
Deutsch?"` (token `lernst`, headword `lernen`), and nouns appear declined/
pluralised. A token-equals-headword match would find almost nothing on exactly
the sentences meant to demo the feature.

**Spike:** run a candidate `linksForText` over the *real* example corpus (verbs,
nouns, adjectives, phrases, satzbau) and measure the hit rate against
hand-identified intended links.
- **If ≥ ~70% with light normalisation** (separable-prefix awareness, umlaut/
  plural folding, article stripping, case-aware noun detection): proceed with the
  auto-scan, scoped honestly as **Medium–High** effort.
- **If below that:** switch to **explicit author-time links** — an optional
  `links?: string[]` (catalog slugs) on the data entries we choose to cross-link,
  authored during the Feature B content pass. This contradicts "no hand-maintained
  link table" but is the only approach that reliably works; the trade-off is
  recorded in [SOLUTION_DESIGN.md](../docs/SOLUTION_DESIGN.md).

### Solution design
- **Deep-select routing** already exists from the foundation (`useDeepSelect`,
  `?sel=slug`). D adds the *resolver* and the *chip UI*.
- **Reference resolver** `src/lib/catalog/resolver.ts` — pure over the catalog:
  - `findEntryBySlug(slug)` and `findNoun(singular, category)` for exact,
    unambiguous lookup used by deep-select. **No case-folding on the German side**
    — `essen` (verb) and `Essen` (noun) must not collapse.
  - `linksForText(text): CatalogEntry[]` — implemented per the spike outcome
    (normalised auto-scan *or* a pass-through of explicit `links`).
- `<CrossLinks entries={…} />` renders chips as `react-router-dom` links to
  `route + '?sel=' + slug`. Injected into the card views.
- **Engineering-principle mapping:** OCP (resolver reads the catalog, so new
  tools become link targets automatically); SRP (routing vs. resolving vs.
  rendering); YAGNI (no bidirectional "what links here").

### Definition of Done
- [ ] The spike is done and its outcome (auto-scan vs. explicit links) is recorded
      before implementation; the DoD below is met by whichever path was chosen.
- [ ] Visiting `#/verben?sel=schlafen` (and the equivalent per tool, incl. a noun
      by its category-qualified slug) opens that tool with the item pre-selected;
      an unknown/absent `sel` falls back to the default without error.
- [ ] Example sentences that reference a known verb or noun render a working chip
      that navigates to and pre-selects that item, verified on **real** examples
      (not cherry-picked ones).
- [ ] `essen`/`Essen`-type case collisions do not occur (German side not
      case-folded).
- [ ] Adding a tool makes its items valid link targets with no edits to the
      resolver or existing tools.
- [ ] Tests: `resolver.ts` (`findEntryBySlug`, `findNoun` by (singular, category),
      case-sensitivity keeps verb/noun distinct; `linksForText` finds intended
      links on real fixtures, ignores unknown/short tokens); `useDeepSelect`
      (valid, invalid, empty `sel`; link `href` is the `#/…?sel=` HashRouter form).
- [ ] Commit gate green.

---

## Feature F — Targeted drills (article & conjugation trainers)

### Functionality
Two focused exercises inside Practice mode:
- **Article trainer** — show a noun, guess der/die/das, instant colour-coded
  feedback (reusing gender colours).
- **Conjugation drill** — show an infinitive + pronoun (e.g. *schlafen* + *du*),
  type the form, auto-checked against the conjugation data (stem-change highlight
  on reveal).

### Solution design
- Added as **modes within the Practice tool** (`/uben`), sharing the round/
  summary/persistence shell (composition + DRY of the session mechanics). A
  `mode` selector picks Flashcards / Articles / Conjugation.
- Pure checkers in `src/tools/practice/drills.ts`:
  - `checkArticle(noun, guess): boolean` — one-line equality; it earns a test
    only because the *content* (correct gender) is what's under test, not the
    comparison. No gold-plating beyond that.
  - `checkConjugation(verb, pronoun, input): { correct; expected }` — normalise
    whitespace/case, compare to the stored form.
- **Data path (decided, was TBD):** the article trainer uses the noun catalog;
  the conjugation drill **reads verb `data.ts` directly** for the conjugation
  table. Verbs are the only conjugating tool, so bloating `CatalogEntry` with
  verb-only `forms` would violate YAGNI — a direct import is the right seam here.
- **Engineering-principle mapping:** composition (drills reuse the Practice
  shell); SRP (checkers separate from view); YAGNI (two drills mapping to existing
  data; no free-text grammar grading).

### Definition of Done
- [x] From `/uben`, choose Article or Conjugation drill (a `mode` selector on the
      setup screen; drills hide the direction/content pickers they don't use).
- [x] Article trainer: pick der/die/das, correct/incorrect feedback in gender
      colours (reused from GermanNouns), tallied in the summary.
- [x] Conjugation drill: type a form for (infinitive, pronoun); correct answers
      accepted (case/whitespace-insensitive), wrong answers show the expected form
      with stem-change highlight (reused RED/BLUE from GermanVerbs).
- [x] Session summary and versioned `localStorage` progress work for these modes
      (drills reuse the same `Session`/`recordAndSave` shell, keyed by catalog slug).
- [x] Tests: `checkArticle` and `checkConjugation` (correct, wrong, normalisation,
      stem-change verbs) in `drills.test.ts`.
- [x] Commit gate green (typecheck, lint, 121 tests, build).

---

## Feature G — Piper offline neural TTS (parked / future)

### Functionality
Higher-quality, device-consistent German pronunciation that works fully offline
regardless of installed OS voices — an upgrade to Feature A.

### Solution design (sketch only — not scheduled)
- Swap the engine behind `speak()` for **Piper** compiled to WASM/ONNX
  (`@mintplex-labs/piper-tts-web` or a maintained `piper-plus` build), in-browser.
- **Honest caveat on the "single-file swap":** Piper inference is async (model
  load + WASM init), so `speak()` would move from sync fire-and-forget to
  async/awaitable — **an interface change that ripples to call sites.** Mitigate
  by giving Feature A's `speak()` an async-tolerant signature *now* (fire-and-
  forget that internally awaits), so G truly is a `speak.ts`-local swap later.
- **PWA caching:** a 20–75 MB model will **not** be precached — vite-plugin-pwa /
  Workbox default `maximumFileSizeToCacheInBytes` is ~2 MiB, and precaching it
  would bloat install anyway. G needs a **runtime-caching** rule (cache-on-demand)
  in the Workbox config, and likely an opt-in "high-quality voice" toggle that
  downloads/caches the model on first use, with Web Speech API as the default
  fallback.
- Other risk to evaluate: bundle/WASM footprint; upstream maintenance (original
  `rhasspy/piper` archived Oct 2025 — use an active fork); licence check (MIT
  expected).

### Definition of Done (when/if scheduled)
- [ ] A written spike/decision in [SOLUTION_DESIGN.md](../docs/SOLUTION_DESIGN.md)
      on model size, runtime-caching strategy, licence and fork choice.
- [ ] Behind an opt-in toggle, German audio is produced fully offline via Piper,
      with Web Speech API remaining the default fallback.
- [ ] Only `speak.ts` (and a new engine module) plus the Workbox runtime-caching
      config changed — the abstraction held.
- [ ] Commit gate green; PWA still installs and passes offline checks.

---

## Cross-cutting concerns (apply across features)

Called out so they aren't forgotten in any single feature:

- **Accessibility:** every icon/emoji-only control (🔊, reveal, rate, search) gets
  an `aria-label` and is keyboard-operable; search results and practice controls
  use sensible roles. The repo already sets this bar (`aria-label="Verb suchen"`).
- **Empty / error states:** no-results search (shows a gentle "keine Treffer",
  mirroring the existing verb empty-state), empty practice deck, and deep-select
  to a `sel` that exists in the catalog but is filtered out of the current view —
  all handled, none crash.
- **German case is meaning:** case-fold **only** in search matching (UX). Never in
  catalog identity, `findEntryBy*`, or link resolution (`essen` vs `Essen`).
- **Cross-POS / duplicate terms:** the same string can be a verb and a noun. The
  catalog keeps them as distinct entries (distinct `slug`/`id`, original case);
  search may surface both (grouped by tool), linking stays unambiguous via slug.
- **PWA offline caching:** A–F add only in-app routes/components, which
  `vite-plugin-pwa` (`registerType: 'autoUpdate'`) precaches automatically with
  the rest of the built JS/CSS — **no PWA config change needed for A–F.** Only
  Feature G needs a runtime-caching rule (large model).
- **Test infrastructure:** stub `speechSynthesis`/`SpeechSynthesisUtterance` in
  `src/test/setup.ts` (jsdom lacks them); clear `localStorage` between tests
  (jsdom keeps it across tests); provide small fixture catalogs so search/resolver
  tests don't couple to live content.
- **No new runtime npm dependency for A–F** (Web Speech API, `localStorage`, and
  existing `react-router-dom` only). Any dependency for G is an explicit decision.
- **Out of scope (explicit):** UI-shell i18n, learning analytics/telemetry,
  bundle-size budgeting, and full SRS scheduling are intentionally deferred for
  this personal app.

## Cross-cutting Definition of Done (whole plan)

- [x] Each PR (six; see *Branching & PR strategy*) landed via a reviewed PR into
      protected `main`, branched off freshly-merged `main` so no repointing was
      needed. **PR-1…PR-5 merged; PR-6 (this) is the last.**
- [x] [SOLUTION_DESIGN.md](../docs/SOLUTION_DESIGN.md) updated for the catalog
      foundation, deep-select routing, the `speak()` seam, the Feature D
      auto-scan-vs-explicit-links decision, and any new tool/route (incl. the
      Practice drill modes' data-path decision); [PRD.md](../docs/PRD.md)
      updated where scope grew (practice, audio, search).
- [x] The "add a learning tool" recipe in [CLAUDE.md](../CLAUDE.md) updated to
      mention adding a `catalog.ts` + one line in `catalog/index.ts` so new tools
      are searchable/linkable/drillable (added in the PR-3 catalog foundation).

> **Plan complete.** All six PRs (A, B, catalog+E, C, D, F) are delivered. Only
> Feature G (Piper offline neural TTS) remains, intentionally parked as a
> documented future upgrade.
