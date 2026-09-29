import type { LessonId } from '../../content/lessons'

// The word class a catalog entry belongs to. Exists because a lesson page
// groups by word class, not by owning tool (e.g. adverbs live inside the
// Phrases tool under category `adverbien`, but project as kind: 'adverb'
// without moving files). See plans/LESSONS_PLAN_A1_2.md §3.3.
export type EntryKind =
  | 'verb'
  | 'noun'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'strategy'
  | 'pattern'
  | 'preposition'
  | 'grammar'

// The one shape every learnable item across every tool is projected into. Search,
// practice and cross-linking consume this — they never import a tool's data.ts.
// See plans/FEATURE_PLAN_2026-07.md → "Shared foundation".
export interface CatalogEntry {
  /** Stable, unique WITHIN the app, e.g. "nomen:familie/bild". */
  id: string
  /** Owning tool, e.g. "verben" | "nomen" — also the route minus its slash. */
  toolId: string
  /** Router path the deep-select link points at, e.g. "/verben". */
  route: string
  /** URL-safe unique selector used by `?sel=` (distinct from the display term). */
  slug: string
  /**
   * German headword in its ORIGINAL case — "schlafen", "Bild", "weil". Never
   * lowercased here: capitalisation is meaning in German (essen ≠ Essen). Case
   * folding is allowed only in search matching (UX), never in identity/linking.
   */
  term: string
  /** English gloss, e.g. "to sleep". */
  gloss: string
  /** Category, needed to resolve noun identity (singular + category). */
  category?: string
  /** Extra text to match on in search, e.g. a noun's article "das". */
  keywords?: string[]
  /**
   * Further German spellings that identify THIS entry (not separate entries),
   * matched by search and by the vocab check. Used for a noun's feminine job
   * form: der Arzt carries "Ärztin".
   */
  aliases?: string[]
  /** Word class, for grouping a lesson page by kind rather than by tool. */
  kind: EntryKind
  /** Lessons this item belongs to, copied from the item by the tool's catalog.ts. */
  lessons: LessonId[]
}
