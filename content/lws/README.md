# content/lws/

Transcribed **Lernwortschatz** (vocab-list) pages, one file per lesson, used by
`npm run vocab:check -- <LessonId>` (see
[`plans/LESSONS_PLAN_A1_2.md`](../../plans/LESSONS_PLAN_A1_2.md) §4.3, §5 Phase 3).

## File naming

`<LessonId>.txt`, where `LessonId` matches an id in `src/content/lessons.ts`
exactly (e.g. `A1.2-L08.txt`).

## Format

- **One entry per line**, exactly as printed in the book: `der Arzt, -¨e`,
  `arbeiten`, `sich bewerben`, `seit`, `Wie geht es dir?`.
- Blank lines are ignored.
- Lines starting with `#` are comments and are ignored (use them to note the
  source page, a word you're unsure how to transcribe, etc.).
- **Swiss spelling** (`ss`, never `ß`) — matches the book (decision D1) and
  keeps the file consistent with the rest of the app's content, though the
  checker also folds `ß` to `ss` when comparing, so either spelling matches.

## Workflow

1. Miguel sends the Lernwortschatz photo(s) for a lesson.
2. Claude transcribes it here, one line per entry.
3. `npm run vocab:check -- <LessonId>` reports what the app already has (with
   or without this lesson's tag) and what's missing.
4. Miguel reviews and approves. Claude adds the missing words (with example,
   translation, Swiss spelling and the lesson tag) and re-runs the check.

These files are committed — each one is the lesson's official word list.
