import type { CatalogEntry } from '../catalog/types'
import { lessons as defaultLessons, type Lesson } from '../../content/lessons'
import { parseLessonQuery } from './parseLessonQuery'
import { entriesForLesson, type LessonGroup } from './entriesForLesson'

/** How many items to preview per word-class group in a lesson search hit
 * (plan §4.2, mock U7: "3 items per word type"). */
const PREVIEW_PER_GROUP = 3

export interface LessonSearchHit {
  lesson: Lesson
  /** Up to `PREVIEW_PER_GROUP` entries per group, same order as the lesson page. */
  preview: LessonGroup[]
  /** Every tagged entry across all groups, for the "+ N weitere" count. */
  totalCount: number
}

/**
 * Lesson-query handling for global search (plan §4.2), kept as its own pure
 * function so `searchCatalog` stays untouched — the search UI composes this
 * with the ordinary text search rather than the two being tangled together.
 * A lesson query (see `parseLessonQuery`) returns one hit per matching
 * lesson; anything else returns [] and the UI falls back to plain text search.
 */
export function searchLessons(
  query: string,
  catalog: CatalogEntry[],
  allLessons: Lesson[] = defaultLessons,
): LessonSearchHit[] {
  const ids = parseLessonQuery(query, allLessons)
  return ids.flatMap((id) => {
    const lesson = allLessons.find((l) => l.id === id)
    if (!lesson) return []
    const full = entriesForLesson(catalog, id)
    const totalCount = full.reduce((n, g) => n + g.entries.length, 0)
    const preview = full.map((g) => ({ label: g.label, entries: g.entries.slice(0, PREVIEW_PER_GROUP) }))
    return [{ lesson, preview, totalCount }]
  })
}
