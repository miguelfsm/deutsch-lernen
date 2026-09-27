import { lessons as defaultLessons, type Lesson, type LessonId } from '../../content/lessons'

// Recognises a search query as a lesson reference (plan §4.2): "lektion 8",
// "lektion8", "l8", "L08", "a1.2 l8", "A1.2-L08". A plain number ("8") is
// deliberately NOT a lesson query — it would make ordinary text search noisy
// (plan explicitly calls this out). If several levels ever share the same
// lesson number, a query with no level prefix matches all of them.

/** Strip separators (`.`, `-`, whitespace) for a loose, punctuation-insensitive compare. */
function collapse(s: string): string {
  return s.replace(/[\s.-]+/g, '')
}

export function parseLessonQuery(
  query: string,
  allLessons: Lesson[] = defaultLessons,
): LessonId[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  // Normalise "." and "-" to spaces so "a1.2-l08", "a1.2 l8" and "A1.2L08"
  // all tokenise the same way before the level/number split below.
  const spaced = q.replace(/[.-]/g, ' ').replace(/\s+/g, ' ').trim()

  // [optional level] + ("lektion" | "l") + optional leading zeros + 1-2 digits.
  const m = spaced.match(/^(?:(.+?)\s+)?l(?:ektion)?\s*0*(\d{1,2})$/)
  if (!m) return []

  const [, levelPart, numStr] = m
  const number = Number(numStr)

  let candidates = allLessons.filter((l) => l.number === number)
  if (levelPart) {
    const levelNorm = collapse(levelPart)
    candidates = candidates.filter((l) => collapse(l.level.toLowerCase()) === levelNorm)
  }
  return candidates.map((l) => l.id)
}
