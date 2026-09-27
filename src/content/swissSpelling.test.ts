import { describe, it, expect } from 'vitest'
import { catalog } from '../lib/catalog'
import { categories as adjectiveCategories } from '../tools/adjectives/data'
import { nounData } from '../tools/nouns/data'
import { categories as phraseCategories } from '../tools/phrases/data'
import { prepositionData } from '../tools/prepositions/data'
import { fallDrillData } from '../tools/prepositions/drills'
import { categories as satzbauCategories } from '../tools/satzbau/data'
import { verbData } from '../tools/verbs/data'
import { lessons } from './lessons'

// D1 (plan §2): content is Swiss-spelled — no ß anywhere, `ss` instead. Walks every
// raw data export (not just the catalog, which only projects a few fields) plus the
// lesson registry, so a stray ß in an untouched field (e.g. a note or an example
// nested inside a conjugation table) fails the build instead of shipping quietly.
function findSs(value: unknown, path: string, hits: string[]): void {
  if (typeof value === 'string') {
    if (value.includes('ß')) hits.push(`${path}: ${JSON.stringify(value)}`)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => findSs(v, `${path}[${i}]`, hits))
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      findSs(v, `${path}.${k}`, hits)
    }
  }
}

function assertNoSs(name: string, data: unknown): void {
  const hits: string[] = []
  findSs(data, name, hits)
  expect(hits, `found ß in ${name}:\n${hits.join('\n')}`).toEqual([])
}

describe('Swiss spelling content guard (plan D1: no ß anywhere)', () => {
  it('the catalog (term, gloss, keywords) has no ß', () => {
    assertNoSs('catalog', catalog)
  })

  it('every tool\'s raw data export has no ß', () => {
    assertNoSs('adjectives.categories', adjectiveCategories)
    assertNoSs('nouns.nounData', nounData)
    assertNoSs('phrases.categories', phraseCategories)
    assertNoSs('prepositions.prepositionData', prepositionData)
    assertNoSs('prepositions.fallDrillData', fallDrillData)
    assertNoSs('satzbau.categories', satzbauCategories)
    assertNoSs('verbs.verbData', verbData)
  })

  it('the lesson registry has no ß', () => {
    assertNoSs('lessons', lessons)
  })
})
