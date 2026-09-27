# CLAUDE.md — Deutsch Lernen

Guidance for Claude Code working in this repository. Keep this file short and
operational; the **canonical product and design intent lives in `docs/`**.

## Canonical references (read before structural changes)

- **`docs/PRD.md`** — what we are building and why (goals, scope, requirements).
- **`docs/SOLUTION_DESIGN.md`** — how it is built (architecture, stack, structure,
  deploy, PWA, decisions log).

When a change affects scope or architecture, update the relevant doc in the same
change. These documents are the source of truth; this file only summarizes.

## What this project is

A personal German-learning web app that consolidates several React/JSX learning
tools into one installable (PWA) static site, deployed free and extended
iteratively with Claude Code. See the PRD for details.

## Stack

Vite + React + **TypeScript (mandatory)** · `react-router-dom` ·
`vite-plugin-pwa` · deployed to GitHub Pages via GitHub Actions.

**Styling:** the learning tools use **inline `style={{}}` objects** (no Tailwind,
no icon library, no UI kit) — keep this approach; do not introduce Tailwind
without an explicit decision recorded in the Solution Design.

> Active build sequence lives in [`plans/IMPLEMENTATION_PLAN.md`](./plans/IMPLEMENTATION_PLAN.md).
> Lesson-aware (A1.2+) refactor plan: [`plans/LESSONS_PLAN_A1_2.md`](./plans/LESSONS_PLAN_A1_2.md),
> with its design & interaction target [`plans/LESSONS_PLAN_A1_2.mock.html`](./plans/LESSONS_PLAN_A1_2.mock.html) (keep both in step).

## Engineering principles

These are how Miguel wants the system built — apply them to every change:

- **SOLID** — single-responsibility modules, open for extension, small focused
  interfaces, depend on abstractions.
- **Composition over inheritance** — when both are viable, build behaviour by
  composing small units, not by deep class/inheritance hierarchies.
- **DRY is about functionality, not code** — remove duplication of *behaviour/
  knowledge*. Do **not** force-merge code that merely looks similar but serves
  different purposes; incidental resemblance (some code duplication) is fine.
- **YAGNI** — build for the requirement in front of you, not a speculative
  future one. Prefer the simplest thing that works now; add abstraction when a
  second real caller demands it, not before. This tempers the modularity and
  SOLID points below — don't gold-plate.
- **Modularity (tempered by YAGNI)** — favour small, focused, replaceable
  modules with clear seams (so e.g. a new tool can register into search without
  editing search). But do not fragment code into indirection that no current
  requirement needs.
- **Tests accompany every code change** — but keep them **high-ROI**: cover
  important flows and real logic. Do **not** test trivial getters/setters or
  framework boilerplate.
- **Commit gate (hard rule):** no commit is allowed unless **100% of tests
  pass**, there are **no lint errors**, and (once TypeScript is in) there are
  **no TypeScript errors**. Run the gate before every commit.

## Conventions

- One learning tool per folder under `src/tools/<tool>/`, mounted at its own
  route. Adding a tool must not require changing unrelated tools.
- Separate data from presentation (co-locate a `data.ts` per tool).
- Shared UI in `src/components/`, shared helpers in `src/lib/`.
- Keep tools self-contained and client-side (no backend in current scope).

## Commands

```
npm install        # install deps
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # preview the production build
npm test           # run the test suite (Vitest)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit (app), + tests, + scripts — see note below
npm run vocab:check -- <LessonId>   # Lernwortschatz check, e.g. A1.2-L08
```

Three `tsconfig*.json` keep Node globals out of the shipped app: `tsconfig.json`
(app code in `src/`, no Node types), `tsconfig.test.json` (`*.test.ts(x)` +
`src/test/`, which run under Vitest/Node), `tsconfig.scripts.json` (`scripts/` +
`vite.config.ts`, Node-only tooling) — `npm run typecheck` runs all three;
project references weren't used since they need `composite`, which clashes with
`noEmit`. Most editors default to `tsconfig.json`, so a file under `scripts/` or
a `*.test.ts(x)` may show a stray red squiggle in the editor even though its own
`tsc --noEmit -p <config>` is clean — trust the npm script.

## Common tasks

- **Add a learning tool:** create `src/tools/<tool>/` (a component + co-located
  `data.ts`), add one entry to `src/tools/registry.ts`, and add its element to
  `ELEMENTS` in `src/App.tsx`. Nav link and Home card appear automatically from
  the registry. The Adjectives/Phrases-style "category → cards" tools can reuse
  `src/components/CategoryCardsTool.tsx`. To make the tool **searchable /
  linkable / drillable**, also add a pure `catalog.ts` exporting
  `xxxCatalog(): CatalogEntry[]` and **one import + one spread** in
  `src/lib/catalog/index.ts` — search, practice and cross-linking then need zero
  edits. Keep `term` in original German case (case is meaning: `essen` ≠ `Essen`)
  and build the `slug` with the helpers in `src/lib/catalog/slug.ts`; wire
  deep-select from `?sel=` with `useDeepSelect` (lazy `useState` seed).
- **Add/edit content** (more verbs, nouns, phrases…): edit the relevant
  `src/tools/<tool>/data.ts`; the data is typed, so `npm run typecheck` catches
  shape mistakes. Every item requires a `lessons: LessonId[]` tag (existing
  content is tagged `['A1.1']`; see
  [`plans/LESSONS_PLAN_A1_2.md`](./plans/LESSONS_PLAN_A1_2.md)). Content is
  **Swiss-spelled — no `ß`, use `ss`** (D1); a content guard test enforces this,
  and `searchCatalog` still matches a query typed with `ß`.
- **Add a lesson:** one entry in `src/content/lessons.ts` plus one new
  `LessonId` union member there — a typo in a `lessons: [...]` tag is then a
  compile error.
- **Lernwortschatz check** (report first, add only after Miguel's OK): transcribe
  the vocab-list photo to `content/lws/<LessonId>.txt` (one entry per line, see
  its `README.md`), run `npm run vocab:check -- <LessonId>`, show Miguel the
  report, then add the approved items with the lesson tag.
- **Change the app icon:** edit `public/icon.svg`, then regenerate the PWA
  rasters with `node scripts/gen-icons.mjs`.

## Cloud sessions & Azure

- `.claude/hooks/session-start.sh` logs the Azure CLI in as a least-privilege
  service principal **only** in remote sessions (`CLAUDE_CODE_REMOTE=true`);
  it skips locally and when the `AZURE_*` secrets are unset, and never prints
  secrets.
- Required secrets (set in Claude Code's environment config, **never** in the
  repo): `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`,
  `AZURE_SUBSCRIPTION_ID`.
- **Never** commit secrets or credentials. Hosting (GitHub Pages) does not depend
  on Azure.
