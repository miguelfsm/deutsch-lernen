import type { CatalogEntry } from '../catalog/types'
import type { LessonId } from '../../content/lessons'
import { checkVocab } from '../vocab/checkVocab'

export interface LessonCoverage {
  /** Entries already tagged for this lesson in the catalog. */
  tagged: number
  /** Total transcribed Lernwortschatz entries for this lesson (headwords). */
  total: number
}

/**
 * Pure, count-only view of the Lernwortschatz check (plan §4.3) for the
 * lesson page's coverage line ("142 / 150 Wörter in der App"). Reuses the
 * same `checkVocab` core as `npm run vocab:check`, and the same blank-/
 * comment-line skipping rule for the total, so the two always agree.
 *
 * Takes `lines` (not a file path) so it stays React/Vite-free and trivially
 * testable; the caller (the lesson page) supplies them from `content/lws.ts`.
 */
export function lessonCoverage(
  lines: string[],
  catalog: CatalogEntry[],
  lessonId: LessonId,
): LessonCoverage {
  const total = lines
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('#')).length
  const { tagged } = checkVocab(lines, catalog, lessonId)
  return { tagged: tagged.length, total }
}
