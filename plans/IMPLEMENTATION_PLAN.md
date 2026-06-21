# Implementation Plan — Deutsch Lernen

> **Status:** Active plan. Execute **one phase at a time**, committing at the end
> of each phase. Each phase must satisfy the commit gate in
> [CLAUDE.md](../CLAUDE.md) (100% tests passing, no lint errors, no TypeScript
> errors once TS is introduced).
> **Companion docs:** [PRD](../docs/PRD.md) · [Solution Design](../docs/SOLUTION_DESIGN.md)
> **Last updated:** 2026-06-21

## Goal

Consolidate the four existing German-learning JSX artifacts (verbs, nouns,
adjectives, phrases) into one Vite + React app with a navigation shell, migrate
the codebase to mandatory TypeScript, deploy free to GitHub Pages, and make it
installable as a PWA on desktop / iPhone / iPad.

## Source artifacts

Located in `claude exported files/` (reference only — not shipped as-is):

| Tool | Source file | Component | Pattern |
| ---- | ----------- | --------- | ------- |
| Verbs | `german-verbs.jsx` | `GermanVerbs` | pill selector → conjugation table w/ stem-change highlighting |
| Nouns | `german-nouns.jsx` | `GermanNouns` | category tabs → pill selector → singular/plural card |
| Adjectives | `german-adjectives.jsx` | `GermanAdjectives` | category pills → list of cards |
| Phrases | `german-phrases.jsx` | `GermanPhrases` | category pills → list of cards |

**Key facts that shape the plan:**
- All four are **pure inline-styled React** (`style={{}}`), **zero dependencies
  beyond `react`**. No Tailwind, no icon library, no UI kit. The port is
  therefore near-verbatim.
- They share a strong design system (Georgia serif, `#faf9f7` canvas, centered
  ~520–560px column, eyebrow+title header, rounded pills, white cards, 💡 note
  row, shared palette) and two near-duplicate helpers
  (`getHighlightParts` / `getPluralParts`) — earmarked for Phase 6 unification.

## TypeScript safety note

Making TypeScript mandatory does **not** conflict with the PWA or a future
iPhone app: TS compiles to JS, and Vite, `vite-plugin-pwa` (Workbox), and
Capacitor all support TypeScript first-class. The condition in the request
("unless this causes issues") is therefore resolved — **TypeScript is adopted
and made mandatory.**

## Engineering constraints (apply to every phase)

See [CLAUDE.md](../CLAUDE.md) → *Engineering principles*. In short: SOLID,
composition over inheritance, DRY-by-functionality (not incidental code),
high-ROI tests with every change (no trivial getter/setter tests), and the
commit gate (green tests + clean lint + clean typecheck).

---

## Phases

### Phase 1 — Project scaffold & tooling
**Goal:** a runnable, tested, lintable empty app shell.
- Scaffold Vite + React (JS to start; TS arrives in Phase 3 per request).
- Add ESLint + Prettier.
- Add Vitest + React Testing Library + jsdom; wire `npm test`, `npm run lint`.
- Minimal `App` + router mount + placeholder `Home`.
- **Tests:** smoke test — app renders without crashing.
- **Exit:** `npm run lint` clean, `npm test` green, `npm run build` succeeds.
- **Commit:** `Phase 1: scaffold Vite + React app with lint and test tooling`

### Phase 2 — Port the four tools + navigation shell
**Goal:** all four tools live behind one navigable app, rendered verbatim.
- Drop each component into `src/tools/<tool>/` (verbs, nouns, adjectives, phrases).
- Split each component's large data array into a co-located `data.js`
  (presentation/data separation; makes future content edits low-risk).
- Build the shell in `App.jsx`: slim sticky top nav (Verben / Nomen / Adjektive /
  Redemittel) + a `Home` landing page with four cards.
- Wire routes with `react-router-dom`.
- **Tests (high-ROI):**
  - each tool renders its first item without crashing;
  - Home lists all four tools and links navigate to the right route;
  - unit-test the pure helpers (`getHighlightParts`, `getPluralParts`) — clear
    inputs/outputs, high value.
- **Exit:** all four tools reachable and visually match the artifacts; gate green.
- **Commit:** `Phase 2: port four learning tools behind a navigation shell`

### Phase 3 — TypeScript migration (mandatory)
**Goal:** the entire codebase is TypeScript, strictly typed, enforced.
- Add `typescript`, `tsconfig.json` (strict), `@types/*`, and TS-aware ESLint.
- Rename `.jsx → .tsx`, `.js → .ts`; type the data models (`Verb`, `Noun`,
  `Adjective`, `Phrase`, category/colour shapes) and component props.
- Add `npm run typecheck` (`tsc --noEmit`); make it part of the commit gate and CI.
- Update CLAUDE.md commands to include `typecheck`.
- **Tests:** existing tests still green under TS; add types-level safety where it
  has ROI (e.g. data arrays satisfy their model types).
- **Exit:** `tsc --noEmit` clean, lint clean, tests green; no remaining JS source.
- **Commit:** `Phase 3: migrate codebase to mandatory strict TypeScript`

### Phase 4 — Deployment (GitHub Pages)
**Goal:** site auto-deploys on push to `main`.
- Add `.github/workflows/deploy.yml`: install → lint → typecheck → test → build →
  deploy `dist/` to GitHub Pages.
- Set Vite `base` to the repo path for project Pages.
- Enable Pages (source = GitHub Actions) on the repo.
- **Tests:** CI itself is the gate; verify a green run and a live URL.
- **Exit:** pushing to `main` publishes the site; URL loads all four tools.
- **Commit:** `Phase 4: deploy to GitHub Pages via GitHub Actions`

### Phase 5 — PWA / installable
**Goal:** installable, full-screen on iPhone/iPad.
- Add `vite-plugin-pwa`; generate manifest (name, theme/background, `standalone`)
  and icons (192, 512, maskable); precache the app shell.
- **Tests:** manifest + icons present in build output; service worker registers;
  verify "Add to Home Screen" launches standalone (manual check on device).
- **Exit:** Lighthouse PWA installable criteria met; home-screen launch works.
- **Commit:** `Phase 5: make the app an installable PWA`

### Phase 6 — Refactor & unify (DRY by functionality)
**Goal:** remove genuine duplication without changing behaviour or visuals.
- Extract shared primitives to `src/components/` (`Header`, `Pill`, `Card`,
  `Note`) and tokens/helpers to `src/lib/` (theme palette, the shared
  prefix-diff highlighter used by verbs + nouns).
- Collapse the phrases/adjectives near-duplicate into a shared list view while
  keeping their distinct data and any unique rows (e.g. adjective "opposite").
- Apply only where it removes *functional* duplication — not to deduplicate
  incidental look-alike code.
- **Tests:** all prior tests stay green (regression safety); add focused tests
  for the extracted pure helpers/components.
- **Exit:** no visual change; gate green; reduced duplication.
- **Commit:** `Phase 6: extract shared components and helpers`

---

## Out of scope (future)
- Native iOS app via Capacitor (documented in Solution Design §7).
- Backend / cross-device progress sync.
- Offline-first beyond app-shell precache.

## Progress log
- [x] Phase 1 — scaffold & tooling
- [x] Phase 2 — port tools + shell
- [x] Phase 3 — TypeScript migration
- [x] Phase 4 — GitHub Pages deploy
- [ ] Phase 5 — PWA
- [ ] Phase 6 — refactor & unify
