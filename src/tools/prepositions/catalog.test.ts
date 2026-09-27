import { describe, it, expect } from 'vitest'
import { prepositionData } from './data'
import { prepositionsCatalog } from './catalog'
import { lessons, type LessonId } from '../../content/lessons'

describe('preposition content', () => {
  it('has no duplicate preposition words', () => {
    const words = prepositionData.map((p) => p.word)
    expect(new Set(words).size).toBe(words.length)
  })

  it('every preposition has at least one example with a translation', () => {
    for (const p of prepositionData) {
      expect(p.examples.length).toBeGreaterThan(0)
      for (const ex of p.examples) {
        expect(ex.de.trim()).not.toBe('')
        expect(ex.en.trim()).not.toBe('')
      }
    }
  })

  it('every preposition belongs to at least one real lesson', () => {
    const knownLessonIds = new Set<LessonId>(lessons.map((l) => l.id))
    for (const p of prepositionData) {
      expect(p.lessons.length).toBeGreaterThan(0)
      for (const id of p.lessons) expect(knownLessonIds.has(id)).toBe(true)
    }
  })
})

describe('prepositionsCatalog', () => {
  const entries = prepositionsCatalog()

  it('projects one entry per preposition, all kind "preposition"', () => {
    expect(entries).toHaveLength(prepositionData.length)
    expect(entries.every((e) => e.kind === 'preposition')).toBe(true)
    expect(entries.every((e) => e.toolId === 'praepositionen')).toBe(true)
  })

  it('carries the source lessons through unchanged', () => {
    const byWord = new Map(prepositionData.map((p) => [p.word, p]))
    for (const e of entries) {
      expect(e.lessons).toEqual(byWord.get(e.term)!.lessons)
    }
  })

  it('has unique ids and slugs', () => {
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length)
    expect(new Set(entries.map((e) => e.slug)).size).toBe(entries.length)
  })
})
