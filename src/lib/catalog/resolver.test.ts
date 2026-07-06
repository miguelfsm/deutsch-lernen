import { describe, it, expect } from 'vitest'
import type { CatalogEntry } from './types'
import { catalog } from './index'
import { findEntryBySlug, findNoun, linksForText, linksForCard } from './resolver'

// A small fixture that mirrors the real corpus' shape, including the essen/Essen
// homograph, so the identity + POS-gating behaviour is tested without coupling to
// live content. Terms keep their original German case.
const fixture: CatalogEntry[] = [
  { id: 'verben:lernen', toolId: 'verben', route: '/verben', slug: 'lernen', term: 'lernen', gloss: 'to learn' },
  { id: 'verben:kommen', toolId: 'verben', route: '/verben', slug: 'kommen', term: 'kommen', gloss: 'to come' },
  { id: 'verben:essen', toolId: 'verben', route: '/verben', slug: 'essen', term: 'essen', gloss: 'to eat' },
  { id: 'verben:heissen', toolId: 'verben', route: '/verben', slug: 'heissen', term: 'heißen', gloss: 'to be called' },
  { id: 'nomen:familie/bruder', toolId: 'nomen', route: '/nomen', slug: 'familie/bruder', term: 'Bruder', gloss: 'brother', category: 'Familie' },
  { id: 'nomen:lebensmittel/essen', toolId: 'nomen', route: '/nomen', slug: 'lebensmittel/essen', term: 'Essen', gloss: 'food', category: 'Lebensmittel' },
  { id: 'nomen:zeit/tag', toolId: 'nomen', route: '/nomen', slug: 'zeit/tag', term: 'Tag', gloss: 'day', category: 'Zeit' },
]

describe('findEntryBySlug', () => {
  it('finds an entry by its exact slug', () => {
    expect(findEntryBySlug('lernen', fixture)?.term).toBe('lernen')
    expect(findEntryBySlug('familie/bruder', fixture)?.term).toBe('Bruder')
  })

  it('returns undefined for an unknown slug (so no dead cross-link renders)', () => {
    expect(findEntryBySlug('does-not-exist', fixture)).toBeUndefined()
  })

  it('does not case-fold: verb "essen" and noun "Essen" are distinct entries', () => {
    // They differ by slug (the noun carries its category), and the lookup is exact.
    const verb = findEntryBySlug('essen', fixture)
    const noun = findEntryBySlug('lebensmittel/essen', fixture)
    expect(verb?.term).toBe('essen')
    expect(noun?.term).toBe('Essen')
    expect(verb).not.toBe(noun)
  })
})

describe('findNoun', () => {
  it('resolves a noun by (singular, category)', () => {
    expect(findNoun('Bruder', 'Familie', fixture)?.id).toBe('nomen:familie/bruder')
  })

  it('is case-sensitive on the German side (Essen the noun, not essen the verb)', () => {
    expect(findNoun('Essen', 'Lebensmittel', fixture)?.gloss).toBe('food')
    // Lower-case singular must not resolve — identity keeps German case.
    expect(findNoun('essen', 'Lebensmittel', fixture)).toBeUndefined()
  })

  it('returns undefined when the category does not match', () => {
    expect(findNoun('Bruder', 'Zeit', fixture)).toBeUndefined()
  })
})

describe('linksForText (disciplined auto-scan)', () => {
  it('matches an inflected verb to its lemma (lernst → lernen)', () => {
    // The plan's flagship example.
    const links = linksForText('Warum lernst du Deutsch?', fixture)
    expect(links.map((e) => e.term)).toEqual(['lernen'])
  })

  it('matches a capitalised noun by exact form and by a tight plural fold', () => {
    expect(linksForText('Ich habe einen Bruder.', fixture).map((e) => e.term)).toEqual(['Bruder'])
    // Plural: "Tage" → Tag.
    expect(linksForText('Die Woche hat sieben Tage.', fixture).map((e) => e.term)).toEqual(['Tag'])
  })

  it('does NOT link the capitalised noun "Essen" to the verb "essen" (POS gate)', () => {
    const links = linksForText('Das Essen ist sehr gut.', fixture)
    expect(links.map((e) => e.id)).toEqual(['nomen:lebensmittel/essen'])
    expect(links.some((e) => e.toolId === 'verben')).toBe(false)
  })

  it('does NOT link the adjective "heiß" to the verb "heißen" (needs an inflectional ending)', () => {
    expect(linksForText('Der Tee ist heiß.', fixture)).toEqual([])
  })

  it('ignores unknown and short tokens', () => {
    expect(linksForText('Er ist zu alt.', fixture)).toEqual([])
  })

  it('de-duplicates and finds several references in one sentence', () => {
    const links = linksForText('Am Tag kommt mein Bruder.', fixture)
    expect(links.map((e) => e.term).sort()).toEqual(['Bruder', 'Tag', 'kommen'])
  })
})

describe('linksForCard', () => {
  it('strips the card’s own item from its cross-links', () => {
    // A verb card whose example uses the verb itself must not link to itself.
    const links = linksForCard('Ich lerne Deutsch mit meinem Bruder.', 'lernen', 'verben', fixture)
    expect(links.map((e) => e.term)).toEqual(['Bruder'])
  })
})

describe('linksForText on the live catalog', () => {
  it('finds the intended cross-links on real example sentences', () => {
    // Real phrases example → the verb we teach.
    expect(linksForText('Warum lernst du Deutsch?').some((e) => e.id === 'verben:lernen')).toBe(true)
    // Real noun example → the verb it uses.
    expect(linksForText('Mein Vater arbeitet viel.').some((e) => e.toolId === 'verben' && e.term === 'arbeiten')).toBe(true)
  })

  it('never emits a verb link for a capitalised nominalised homograph', () => {
    // "Das Essen ist sehr gut." (an adjectives example) must not link the verb essen.
    const links = linksForText('Das Essen ist sehr gut.')
    expect(links.some((e) => e.toolId === 'verben' && e.term === 'essen')).toBe(false)
  })

  it('only ever targets verbs and nouns (no phrases/adjectives/satzbau chips)', () => {
    for (const e of catalog) {
      const links = linksForText(e.gloss) // arbitrary text; assert the invariant on any output
      expect(links.every((l) => l.toolId === 'verben' || l.toolId === 'nomen')).toBe(true)
    }
  })
})
