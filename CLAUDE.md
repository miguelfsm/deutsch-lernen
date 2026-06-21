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

## Engineering principles

These are how Miguel wants the system built — apply them to every change:

- **SOLID** — single-responsibility modules, open for extension, small focused
  interfaces, depend on abstractions.
- **Composition over inheritance** — build behaviour by composing small units,
  not by deep class/inheritance hierarchies.
- **DRY is about functionality, not code** — remove duplication of *behaviour/
  knowledge*. Do **not** force-merge code that merely looks similar but serves
  different purposes; incidental resemblance is fine.
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

> Filled in during Phase 1; `typecheck` added in Phase 3.

```
npm install        # install deps
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # preview the production build
npm test           # run the test suite (Vitest)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit (after Phase 3)
```

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
