import { describe, it, expect } from 'vitest'
import { grammarTopics } from './data'
import { grammarCatalog } from './catalog'
import { catalog } from '../../lib/catalog'
import { lessons, type LessonId } from '../../content/lessons'

describe('grammar content', () => {
  it('has no duplicate topic ids', () => {
    const ids = grammarTopics.map((g) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every topic belongs to at least one real lesson', () => {
    const knownLessonIds = new Set<LessonId>(lessons.map((l) => l.id))
    for (const g of grammarTopics) {
      expect(g.lessons.length).toBeGreaterThan(0)
      for (const id of g.lessons) expect(knownLessonIds.has(id)).toBe(true)
    }
  })

  // Unknown related ids must fail the build, not render a broken link — so
  // this test resolves every `related` id against the REAL assembled catalog
  // (not just this tool's own projection).
  it('every related id resolves to a real catalog entry', () => {
    const catalogIds = new Set(catalog.map((e) => e.id))
    for (const g of grammarTopics) {
      for (const id of g.related ?? []) {
        expect(catalogIds.has(id), `${g.id} related id "${id}" is not in the catalog`).toBe(true)
      }
    }
  })

  it('every table block\'s rows match the header width', () => {
    for (const g of grammarTopics) {
      for (const block of g.blocks) {
        if (block.type !== 'table') continue
        for (const row of block.rows) {
          expect(row.cells.length, `${g.id}: row length must match head length`).toBe(block.head.length)
        }
      }
    }
  })

  it('every examples block has a translation for every item', () => {
    for (const g of grammarTopics) {
      for (const block of g.blocks) {
        if (block.type !== 'examples') continue
        for (const ex of block.items) {
          expect(ex.de.trim()).not.toBe('')
          expect(ex.en.trim()).not.toBe('')
        }
      }
    }
  })
})

describe('grammarCatalog', () => {
  const entries = grammarCatalog()

  it('projects one entry per topic, all kind "grammar"', () => {
    expect(entries).toHaveLength(grammarTopics.length)
    expect(entries.every((e) => e.kind === 'grammar')).toBe(true)
    expect(entries.every((e) => e.toolId === 'grammatik')).toBe(true)
  })

  it('carries the source lessons through unchanged', () => {
    const byId = new Map(grammarTopics.map((g) => [g.title, g]))
    for (const e of entries) {
      expect(e.lessons).toEqual(byId.get(e.term)!.lessons)
    }
  })

  it('has unique ids and slugs', () => {
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length)
    expect(new Set(entries.map((e) => e.slug)).size).toBe(entries.length)
  })
})
