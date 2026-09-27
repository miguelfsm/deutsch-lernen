import type { LessonId } from '../../content/lessons'
import { color } from '../theme'

// Book colours per lesson (mock's `LC` table, plan §5 Phase 4 row) — used for
// the lesson index cards and the lesson page's header band. A1.1 (the
// untagged pre-lesson-tagging bucket, decision D3) gets a neutral colour
// rather than a book colour, since it isn't one lesson.
const LESSON_COLOR: Partial<Record<LessonId, string>> = {
  'A1.2-L08': '#3b6fb6',
  'A1.2-L09': '#3f9a4a',
  'A1.2-L10': '#d0453f',
  'A1.2-L11': '#c99a1e',
  'A1.2-L12': '#2a9bb0',
  'A1.2-L13': '#7b3f8c',
  'A1.2-L14': '#4f9a6a',
}

export function lessonColor(id: LessonId): string {
  return LESSON_COLOR[id] ?? color.muted
}
