import { describe, it, expect } from 'vitest'
import type { CatalogEntry } from '../catalog/types'
import { checkVocab } from './checkVocab'

// Small fixture, independent of live content (per repo test convention).
const entries: CatalogEntry[] = [
  { id: 'verben:arbeiten', toolId: 'verben', route: '/verben', slug: 'arbeiten', term: 'arbeiten', gloss: 'to work', kind: 'verb', lessons: ['A1.2-L08'] },
  { id: 'verben:essen', toolId: 'verben', route: '/verben', slug: 'essen', term: 'essen', gloss: 'to eat', kind: 'verb', lessons: ['A1.1'] },
  // Reflexive verbs are stored by their bare infinitive — the "sich " in the
  // book's printed list is a marker, not part of the identity (plan §4.3).
  { id: 'verben:bewerben', toolId: 'verben', route: '/verben', slug: 'bewerben', term: 'bewerben', gloss: 'to apply', kind: 'verb', lessons: ['A1.1'] },
  { id: 'nomen:lebensmittel/essen', toolId: 'nomen', route: '/nomen', slug: 'lebensmittel/essen', term: 'Essen', gloss: 'food', category: 'Lebensmittel', kind: 'noun', lessons: ['A1.1'] },
  { id: 'nomen:beruf/arzt', toolId: 'nomen', route: '/nomen', slug: 'beruf/arzt', term: 'Arzt', gloss: 'doctor', category: 'Beruf', kind: 'noun', lessons: ['A1.1'] },
  { id: 'nomen:koerper/gross', toolId: 'nomen', route: '/nomen', slug: 'koerper/gross', term: 'Gross', gloss: 'tall (noun use)', category: 'Koerper', kind: 'noun', lessons: ['A1.1'] },
  { id: 'redemittel:praep/seit', toolId: 'redemittel', route: '/redemittel', slug: 'praep/seit', term: 'seit', gloss: 'since', category: 'Präpositionen', kind: 'preposition', lessons: ['A1.2-L08'] },
]

describe('checkVocab', () => {
  it('skips blank lines and # comments', () => {
    const result = checkVocab(['', '   ', '# a comment', 'arbeiten'], entries, 'A1.2-L08')
    expect(result.tagged).toHaveLength(1)
    expect(result.missing).toHaveLength(0)
    expect(result.untagged).toHaveLength(0)
    expect(result.maybe).toHaveLength(0)
  })

  it('strips a leading article and plural/extra markers after the first comma', () => {
    const result = checkVocab(['der Arzt, -¨e'], entries, 'A1.2-L08')
    expect(result.untagged).toHaveLength(1)
    expect(result.untagged[0].entries.map((e) => e.id)).toEqual(['nomen:beruf/arzt'])
  })

  it('strips a leading reflexive "sich "', () => {
    const result = checkVocab(['sich bewerben'], entries, 'A1.2-L08')
    expect(result.untagged).toHaveLength(1)
    expect(result.untagged[0].entries.map((e) => e.id)).toEqual(['verben:bewerben'])
  })

  it('folds ß and ss so both spellings match the same entry', () => {
    const withEszett = checkVocab(['groß'], entries, 'A1.2-L08')
    const withSs = checkVocab(['gross'], entries, 'A1.2-L08')
    expect(withEszett.maybe[0]?.entries.map((e) => e.id)).toEqual(['nomen:koerper/gross'])
    expect(withSs.maybe[0]?.entries.map((e) => e.id)).toEqual(['nomen:koerper/gross'])
  })

  it('is case-sensitive on the exact match (essen the verb, not Essen the noun)', () => {
    const result = checkVocab(['essen'], entries, 'A1.1')
    expect(result.tagged[0].entries.map((e) => e.id)).toEqual(['verben:essen'])
  })

  it('matches "Essen" exactly (case-sensitive) rather than flagging it "maybe"', () => {
    // Sanity check for the case-sensitivity rule: the noun term IS "Essen", so
    // this is a real exact match, not a case-insensitive "maybe".
    const result = checkVocab(['Essen'], entries, 'A1.1')
    expect(result.tagged.map((m) => m.entries.map((e) => e.id))).toEqual([['nomen:lebensmittel/essen']])
    expect(result.maybe).toHaveLength(0)
  })

  it('flags a genuinely case-mismatched line as "maybe", listing every case-insensitive match', () => {
    // Neither entry's term is spelt "GROSS" verbatim.
    const result = checkVocab(['GROSS'], entries, 'A1.2-L08')
    expect(result.tagged).toHaveLength(0)
    expect(result.untagged).toHaveLength(0)
    expect(result.maybe).toHaveLength(1)
    expect(result.maybe[0].entries.map((e) => e.id)).toEqual(['nomen:koerper/gross'])
  })

  it('groups a match under "tagged" when it already carries this lesson tag', () => {
    const result = checkVocab(['arbeiten'], entries, 'A1.2-L08')
    expect(result.tagged.map((m) => m.entries.map((e) => e.id))).toEqual([['verben:arbeiten']])
  })

  it('groups a match under "untagged" when it exists but lacks this lesson tag', () => {
    const result = checkVocab(['arbeiten'], entries, 'A1.2-L09')
    expect(result.untagged.map((m) => m.entries.map((e) => e.id))).toEqual([['verben:arbeiten']])
    expect(result.tagged).toHaveLength(0)
  })

  it('reports several matching entries for one line when they all match', () => {
    const dup: CatalogEntry[] = [
      ...entries,
      { id: 'adjektive:koerper/gross2', toolId: 'adjektive', route: '/adjektive', slug: 'koerper/gross2', term: 'Gross', gloss: 'big', kind: 'adjective', lessons: ['A1.2-L08'] },
    ]
    const result = checkVocab(['Gross'], dup, 'A1.2-L08')
    const ids = [...result.tagged, ...result.untagged].flatMap((m) => m.entries.map((e) => e.id)).sort()
    expect(ids).toEqual(['adjektive:koerper/gross2', 'nomen:koerper/gross'])
  })

  it('guesses "noun" for a missing line with a leading article', () => {
    const result = checkVocab(['die Ärztin, -nen'], entries, 'A1.2-L08')
    expect(result.missing).toEqual([{ line: 'die Ärztin, -nen', kind: 'noun' }])
  })

  it('guesses "verb" for a missing lowercase line ending in -en/-ern/-eln', () => {
    const en = checkVocab(['suchen'], entries, 'A1.2-L08')
    const ern = checkVocab(['ändern'], entries, 'A1.2-L08')
    const eln = checkVocab(['sammeln'], entries, 'A1.2-L08')
    expect(en.missing[0].kind).toBe('verb')
    expect(ern.missing[0].kind).toBe('verb')
    expect(eln.missing[0].kind).toBe('verb')
  })

  it('guesses "verb" for a missing reflexive line', () => {
    const result = checkVocab(['sich freuen auf'], entries, 'A1.2-L08')
    // "sich " is stripped first, so this takes the sich branch even though
    // the remainder is multi-word.
    expect(result.missing[0].kind).toBe('verb')
  })

  it('guesses "phrase" for a missing multi-word line or one ending in ? or !', () => {
    const multiWord = checkVocab(['Guten Tag'], entries, 'A1.2-L08')
    const question = checkVocab(['Wie geht es dir?'], entries, 'A1.2-L08')
    expect(multiWord.missing[0].kind).toBe('phrase')
    expect(question.missing[0].kind).toBe('phrase')
  })

  it('guesses "unknown" for a missing single word with no other signal', () => {
    const result = checkVocab(['früher'], entries, 'A1.2-L08')
    expect(result.missing[0].kind).toBe('unknown')
  })

  it('keeps the original line text (with markers) on every result', () => {
    const result = checkVocab(['der Arzt, -¨e'], entries, 'A1.2-L08')
    expect(result.untagged[0].line).toBe('der Arzt, -¨e')
  })
})
