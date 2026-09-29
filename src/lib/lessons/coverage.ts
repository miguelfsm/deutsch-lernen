import type { CatalogEntry } from '../catalog/types'
import type { LessonId } from '../../content/lessons'
import { checkVocab } from '../vocab/checkVocab'

export interface LessonCoverage {
  /** Entries already tagged for this lesson in the catalog. */
  tagged: number
  /** Total Lernwortschatz headwords (forms) of this lesson, on the same basis as `tagged`. */
  total: number
}

/**
 * Pure, count-only view of the Lernwortschatz check (plan §4.3) for the
 * lesson page's coverage line ("142 / 150 Wörter in der App"). Reuses the
 * same `checkVocab` core as `npm run vocab:check` (same blank-/comment-line
 * skipping), so the two always agree.
 *
 * Takes `lines` (not a file path) so it stays React/Vite-free and trivially
 * testable; the caller (the lesson page) supplies them from `content/lws.ts`.
 */
export function lessonCoverage(
  lines: string[],
  catalog: CatalogEntry[],
  lessonId: LessonId,
): LessonCoverage {
  // One basis on both sides: checkVocab "forms" (a line like "der Kollege, -n /
  // die Kollegin, -nen" is two headwords). Every form lands in exactly one
  // bucket, so a missing word can never be masked by surplus forms.
  const r = checkVocab(lines, catalog, lessonId)
  const total = r.tagged.length + r.untagged.length + r.missing.length + r.maybe.length
  return { tagged: r.tagged.length, total }
}

/**
 * `tagged/total` as a whole-number percentage for a coverage bar, clamped to
 * 0–100 as a safety net (`tagged` and `total` share one basis, so tagged <= total).
 */
export function coveragePercent({ tagged, total }: LessonCoverage): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((tagged / total) * 100))
}
