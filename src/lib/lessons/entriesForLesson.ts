import type { CatalogEntry, EntryKind } from '../catalog/types'
import type { LessonId } from '../../content/lessons'

/** One kind-group on a lesson page, e.g. "Verben" with its entries. */
export interface LessonGroup {
  label: string
  entries: CatalogEntry[]
}

// Fixed display order + label for a lesson page's content-by-kind section
// (plan §4.1, §5 Phase 4, grammar row added in the Phase 7 follow-up). Two
// kinds share a label — Phrases and Strategien both read as
// "Redemittel/Strategien" on the page, matching the mock, since the book
// doesn't separate them either. `grammar` comes first, per the mock's
// `lesson()` screen — the "Grammatik und Kommunikation" summary is the
// lesson's own headline content, read before the word lists.
const GROUP_ORDER: { kind: EntryKind; label: string }[] = [
  { kind: 'grammar', label: 'Grammatik' },
  { kind: 'verb', label: 'Verben' },
  { kind: 'noun', label: 'Nomen' },
  { kind: 'adjective', label: 'Adjektive' },
  { kind: 'adverb', label: 'Adverbien' },
  { kind: 'preposition', label: 'Präpositionen' },
  { kind: 'phrase', label: 'Redemittel/Strategien' },
  { kind: 'strategy', label: 'Redemittel/Strategien' },
  { kind: 'pattern', label: 'Satzbau' },
]

/**
 * All catalog entries tagged with `lessonId`, grouped by word class (`kind`)
 * in the fixed order above, with empty groups skipped. A lesson page just
 * renders this — the grouping/order logic is pure and tested here.
 */
export function entriesForLesson(
  catalog: CatalogEntry[],
  lessonId: LessonId,
): LessonGroup[] {
  const tagged = catalog.filter((e) => e.lessons.includes(lessonId))
  const groups: LessonGroup[] = []

  for (const { kind, label } of GROUP_ORDER) {
    const existing = groups.find((g) => g.label === label)
    const entries = tagged.filter((e) => e.kind === kind)
    if (entries.length === 0) continue
    if (existing) {
      existing.entries.push(...entries)
    } else {
      groups.push({ label, entries: [...entries] })
    }
  }

  return groups
}
