# Practice v2 — richer drills & a real learning loop (backlog)

> **Status:** Backlog / exploratory. Nothing here is scheduled.
> **Created:** 2026-07-06 · **Author:** Claude Code, with Miguel
> **Companion docs:** [Feature plan](./FEATURE_PLAN_2026-07.md) · [Solution Design](../docs/SOLUTION_DESIGN.md) · [CLAUDE.md](../CLAUDE.md)

## Why this doc exists

Practice mode shipped in two steps:

- **v1 (PR-4)** — self-rated **flashcards**: prompt → reveal → *Gewusst / Nicht
  gewusst* → next, tallied in a summary, with per-slug `seen/known` persisted to
  `localStorage` (versioned envelope).
- **v1.1 (same PR, after review)** — an objectively-graded **multiple-choice
  quiz** mode (pick the right answer from 4; immediate colour-coded feedback).

The honest gap that remains after v1.1: the self-rating and the stored
`seen/known` are still **write-only** — nothing reads them back to change what you
see next. A flashcard's rating only *feels* meaningful when it closes a loop
(wrong cards return; weak cards are drilled more). And for **A1 German
specifically**, the highest-value practice isn't plain vocab recall at all — it's
**gender (der/die/das)** and **verb conjugation**, which are mechanical and hard.

This doc captures the ideas discussed so they aren't lost, roughly ordered by
value-for-effort. Each is independent; pick per appetite. Several overlap with
**Feature F** in the main plan — fold them together when scheduling.

---

## Idea 1 — Close the spaced-repetition loop (Leitner-lite, for real)

The single change that makes v1's buttons *mean* something.

- **Within a round:** re-queue a missed card (flashcard "Nicht gewusst" or a wrong
  quiz answer) to reappear later in the same session, instead of a one-and-done
  linear pass. A simple requeue (push to the back, or after *k* cards) is enough;
  no full scheduler needed.
- **Across sessions:** build each new deck **weighted toward weak cards** using the
  persisted `seen/known` — e.g. sort/sample by a "due-ness" score
  (`seen - known`, or `known/seen` accuracy). This is the "two buckets: due /
  known" the original plan named but never wired up.
- **Design note:** keep `session.ts` pure — the requeue is a deck-transform; the
  weighting is a deck-builder that reads a `ProgressEnvelope`. Both unit-testable
  with fixtures + injected RNG. No new dependency.

## Idea 2 — Typed recall (free-text answer, checked)

Stronger than recognition: the user *produces* the answer.

- Show the prompt, user types the answer, checked with normalisation
  (trim/lowercase, maybe tolerate missing final punctuation). On a miss, reveal the
  expected answer.
- **German caveats:** capitalisation is meaning (nouns are capitalised) and umlaut
  typing is awkward on some keyboards — decide whether to accept `ae/oe/ue/ss` for
  `ä/ö/ü/ß`. Article correctness (der/die/das) is really Idea 4, not this.
- Pure `checkTyped(expected, input)` in the practice folder, unit-tested for
  normalisation and near-miss policy. Reuses the round/summary/persistence shell.

## Idea 3 — Conjugation drill  *(overlaps Feature F)*

Show an infinitive + pronoun (e.g. *schlafen* + *du*), type the form, auto-check
against the verb `data.ts` conjugation table; highlight the stem change on reveal.

- Reads verb `data.ts` **directly** (verbs are the only conjugating tool, so
  bloating `CatalogEntry` with verb-only `forms` would violate YAGNI).
- Pure `checkConjugation(verb, pronoun, input): { correct; expected }`.
- This is **Feature F**'s conjugation trainer — implement there.

## Idea 4 — Article / gender trainer  *(overlaps Feature F)*

Show a noun, guess **der / die / das**, instant colour-coded feedback reusing the
existing gender colours; tally in the summary.

- Uses the noun catalog (article is already available; add it as data if needed).
- Pure `checkArticle(noun, guess): boolean`.
- Also **Feature F**'s article trainer — implement there.

## Idea 5 — Polish & motivation (only if it earns its keep)

- Mode/direction/content-set choices **remembered** across visits (localStorage).
- A lightweight per-card history glimpse ("seen 4× · known 3×") on the flashcard.
- Deep-link a wrong quiz card to its tool via the existing `?sel=` deep-select, so
  "I got this wrong → show me the full entry" is one tap (needs Feature D-style
  linking or just a direct `route?sel=slug` link).
- **Explicitly out for now:** streaks, XP, leaderboards, full SM-2 scheduling,
  audio-only listening drills. Revisit only if the core loop proves sticky.

---

## Suggested sequencing when scheduled

1. **Idea 1** (close the loop) — small, and it retroactively justifies everything
   already built.
2. **Feature F** (Ideas 3 + 4) — the genuinely A1-valuable drills; they already
   have a home in the main plan.
3. **Idea 2** (typed recall) — if recognition proves too easy.
4. **Idea 5** (polish) — last, and only what earns its keep.

Keep the invariants from v1: pure `session`/`quiz`/checker logic split from the
view and from `lib/progress`; injected RNG; versioned `localStorage`; no new
runtime dependency; inline styles.
