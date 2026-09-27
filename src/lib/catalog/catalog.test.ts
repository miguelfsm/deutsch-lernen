import { describe, it, expect } from 'vitest'
import type { CatalogEntry, EntryKind } from './types'
import { catalog } from './index'
import { nounSlug, cardSlug, slugify, verbSlug } from './slug'
import { lessons, type LessonId } from '../../content/lessons'

// Small fixtures keep the invariant tests decoupled from live content; a couple
// of guards below still run over the real `catalog` to catch actual collisions.
const fixture: CatalogEntry[] = [
  { id: 'verben:essen', toolId: 'verben', route: '/verben', slug: 'essen', term: 'essen', gloss: 'to eat', kind: 'verb', lessons: ['A1.1'] },
  { id: 'nomen:lebensmittel/essen', toolId: 'nomen', route: '/nomen', slug: 'lebensmittel/essen', term: 'Essen', gloss: 'food', category: 'Lebensmittel', kind: 'noun', lessons: ['A1.1'] },
  { id: 'nomen:familie/bild', toolId: 'nomen', route: '/nomen', slug: 'familie/bild', term: 'Bild', gloss: 'picture', category: 'Familie', kind: 'noun', lessons: ['A1.1'] },
]

function duplicates<T>(values: T[]): T[] {
  const seen = new Set<T>()
  const dupes = new Set<T>()
  for (const v of values) {
    if (seen.has(v)) dupes.add(v)
    seen.add(v)
  }
  return [...dupes]
}

describe('slug builders', () => {
  it('folds umlauts/ß and reduces to a URL-safe slug', () => {
    expect(slugify('schlafen')).toBe('schlafen')
    expect(slugify('heißen')).toBe('heissen')
    expect(slugify('Mengen & Einheiten')).toBe('mengen-einheiten')
  })

  it('encodes the category into a noun slug so identity is (singular, category)', () => {
    const slug = nounSlug('Bild', 'Familie')
    expect(slug).toBe('familie/bild')
    expect(slug).toContain('/')
    // Same singular in a different category → different slug.
    expect(nounSlug('Bild', 'Schule')).not.toBe(slug)
  })

  it('encodes the category into a card slug for category-cards tools', () => {
    expect(cardSlug('gegensaetze', 'schnell')).toBe('gegensaetze/schnell')
  })

  it('folds ß and ss to the same slug — content moved to Swiss ss (D1), but an old ß-spelled bookmark or ?sel= link must resolve to the same stored progress key', () => {
    expect(verbSlug('heißen')).toBe(verbSlug('heissen'))
    expect(nounSlug('Straße', 'Stadt')).toBe(nounSlug('Strasse', 'Stadt'))
  })

  it('keeps essen (verb) and Essen (noun) as distinct slugs via the noun category', () => {
    // The German case difference is NOT what separates them — the noun's category
    // segment is. Search may fold case, but slugs stay unambiguous.
    expect(nounSlug('Essen', 'Lebensmittel')).not.toBe(slugify('essen'))
  })
})

describe('catalog invariants (fixture)', () => {
  it('entries are unique by id and by slug within the fixture', () => {
    expect(duplicates(fixture.map((e) => e.id))).toEqual([])
    expect(duplicates(fixture.map((e) => e.slug))).toEqual([])
  })

  it('noun slugs encode their category', () => {
    for (const e of fixture.filter((e) => e.toolId === 'nomen')) {
      expect(e.slug).toBe(nounSlug(e.term, e.category!))
      expect(e.slug.startsWith(`${slugify(e.category!)}/`)).toBe(true)
    }
  })
})

describe('live catalog', () => {
  it('is non-empty and covers every searchable tool', () => {
    expect(catalog.length).toBeGreaterThan(0)
    const toolIds = new Set(catalog.map((e) => e.toolId))
    expect(toolIds).toEqual(
      new Set(['verben', 'nomen', 'adjektive', 'redemittel', 'praepositionen', 'grammatik', 'satzbau']),
    )
  })

  it('has no duplicate id or slug across live content', () => {
    expect(duplicates(catalog.map((e) => e.id))).toEqual([])
    // slug is only unique WITHIN a tool (essen verb vs a card could collide across
    // tools), so scope the check per tool — matching how `?sel=` is resolved.
    for (const toolId of new Set(catalog.map((e) => e.toolId))) {
      const slugs = catalog.filter((e) => e.toolId === toolId).map((e) => e.slug)
      expect(duplicates(slugs)).toEqual([])
    }
  })

  it('keeps German case in term and never in slug', () => {
    for (const e of catalog) {
      expect(e.slug).toBe(e.slug.toLowerCase())
    }
    // At least one capitalised noun term proves case is preserved.
    expect(catalog.some((e) => e.toolId === 'nomen' && /^[A-ZÄÖÜ]/.test(e.term))).toBe(true)
  })
})

// ── Lesson tagging (plan §3.3, §6) ──────────────────────────────────────────
describe('lesson registry', () => {
  it('has unique lesson ids', () => {
    expect(duplicates(lessons.map((l) => l.id))).toEqual([])
  })
})

const VALID_KINDS: EntryKind[] = [
  'verb',
  'noun',
  'adjective',
  'adverb',
  'phrase',
  'strategy',
  'pattern',
  'preposition',
  'grammar',
]

describe('catalog lesson tagging', () => {
  const knownLessonIds = new Set<LessonId>(lessons.map((l) => l.id))

  it('every entry has at least one lesson that exists in the registry', () => {
    for (const e of catalog) {
      expect(e.lessons.length).toBeGreaterThan(0)
      for (const id of e.lessons) {
        expect(knownLessonIds.has(id)).toBe(true)
      }
    }
  })

  it('every entry has a valid kind', () => {
    for (const e of catalog) {
      expect(VALID_KINDS).toContain(e.kind)
    }
  })

  it('maps phrases categories to the right kind (adverb/strategy/phrase)', () => {
    const kindByCategoryLabel = new Map(
      catalog
        .filter((e) => e.toolId === 'redemittel')
        .map((e) => [e.category, e.kind] as const),
    )
    expect(kindByCategoryLabel.get('Adverbien (Häufigkeit & Grad)')).toBe('adverb')
    expect(kindByCategoryLabel.get('Gesprächsstrategien')).toBe('strategy')
    // Prepositions moved out of Phrases in Phase 6 — the category no longer exists here.
    expect(kindByCategoryLabel.has('Präpositionen')).toBe(false)
    // Everything else in Phrases (e.g. W-Fragen) stays a plain phrase.
    expect(kindByCategoryLabel.get('W-Fragen')).toBe('phrase')
  })

  it('maps verbs, nouns, adjectives, prepositions and satzbau to their kind', () => {
    expect(catalog.filter((e) => e.toolId === 'verben').every((e) => e.kind === 'verb')).toBe(true)
    expect(catalog.filter((e) => e.toolId === 'nomen').every((e) => e.kind === 'noun')).toBe(true)
    expect(catalog.filter((e) => e.toolId === 'adjektive').every((e) => e.kind === 'adjective')).toBe(true)
    expect(catalog.filter((e) => e.toolId === 'praepositionen').every((e) => e.kind === 'preposition')).toBe(true)
    expect(catalog.filter((e) => e.toolId === 'satzbau').every((e) => e.kind === 'pattern')).toBe(true)
  })
})
