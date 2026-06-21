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

## Stack (target)

Vite + React (JSX) · Tailwind CSS · react-router · vite-plugin-pwa · deployed to
GitHub Pages via GitHub Actions. (Confirmed/expanded as real files land.)

## Conventions

- One learning tool per folder under `src/tools/<tool>/`, mounted at its own
  route. Adding a tool must not require changing unrelated tools.
- Shared UI in `src/components/`, shared helpers in `src/lib/`.
- Keep tools self-contained and client-side (no backend in current scope).

## Commands

> Placeholder until the app is scaffolded.

```
npm install      # install deps
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview  # preview the production build
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
