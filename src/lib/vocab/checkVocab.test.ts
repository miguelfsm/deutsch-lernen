import { describe, it, expect } from 'vitest'
import type { CatalogEntry } from '../catalog/types'
import { checkVocab } from './checkVocab'

// Small fixture, independent of live content (per repo test convention).
const entries: CatalogEntry[] = [
  { id: 'verben:arbeiten', toolId: 'verben', route: '/verben', slug: 'arbeiten', term: 'arbeiten', gloss: 'to work', kind: 'verb', lessons: ['A1.2-L08'] },
  { id: 'verben:essen', toolId: 'verben', route: '/verben', slug: 'essen', term: 'essen', gloss: 'to eat', kind: 'verb', lessons: ['A1.1'] },
  // The catalog is free to store a reflexive verb either way (bare infinitive
  // or the full "sich ..." form) — checkVocab tries both, so this fixture
  // deliberately keeps one of each rather than asserting a storage rule the
  // plan doesn't make (see the "reflexive verbs" tests below).
  { id: 'verben:bewerben', toolId: 'verben', route: '/verben', slug: 'bewerben', term: 'bewerben', gloss: 'to apply', kind: 'verb', lessons: ['A1.1'] },
  { id: 'verben:freuen', toolId: 'verben', route: '/verben', slug: 'freuen', term: 'sich freuen', gloss: 'to be glad', kind: 'verb', lessons: ['A1.1'] },
  { id: 'verben:anrufen', toolId: 'verben', route: '/verben', slug: 'anrufen', term: 'anrufen', gloss: 'to call', kind: 'verb', lessons: ['A1.1'] },
  { id: 'verben:helfen', toolId: 'verben', route: '/verben', slug: 'helfen', term: 'helfen', gloss: 'to help', kind: 'verb', lessons: ['A1.1'] },
  { id: 'nomen:lebensmittel/essen', toolId: 'nomen', route: '/nomen', slug: 'lebensmittel/essen', term: 'Essen', gloss: 'food', category: 'Lebensmittel', kind: 'noun', lessons: ['A1.1'] },
  { id: 'nomen:beruf/arzt', toolId: 'nomen', route: '/nomen', slug: 'beruf/arzt', term: 'Arzt', gloss: 'doctor', category: 'Beruf', kind: 'noun', lessons: ['A1.1'] },
  { id: 'nomen:beruf/kollege', toolId: 'nomen', route: '/nomen', slug: 'beruf/kollege', term: 'Kollege', gloss: 'colleague (m)', category: 'Beruf', kind: 'noun', lessons: ['A1.1'] },
  { id: 'nomen:beruf/kollegin', toolId: 'nomen', route: '/nomen', slug: 'beruf/kollegin', term: 'Kollegin', gloss: 'colleague (f)', category: 'Beruf', kind: 'noun', lessons: ['A1.2-L08'] },
  { id: 'nomen:familie/eltern', toolId: 'nomen', route: '/nomen', slug: 'familie/eltern', term: 'Eltern', gloss: 'parents', category: 'Familie', kind: 'noun', lessons: ['A1.1'] },
  { id: 'nomen:koerper/gross', toolId: 'nomen', route: '/nomen', slug: 'koerper/gross', term: 'Gross', gloss: 'tall (noun use)', category: 'Koerper', kind: 'noun', lessons: ['A1.1'] },
  { id: 'redemittel:praep/seit', toolId: 'redemittel', route: '/redemittel', slug: 'praep/seit', term: 'seit', gloss: 'since', category: 'Präpositionen', kind: 'preposition', lessons: ['A1.2-L08'] },
  // A real catalog term whose parens are part of the word, not a printed note
  // to strip (mirrors the live phrases/data.ts entry) — see the "wie viel(e)"
  // test below.
  { id: 'redemittel:frage/wieviel', toolId: 'redemittel', route: '/redemittel', slug: 'frage/wieviel', term: 'wie viel(e)', gloss: 'how much / how many', category: 'W-Fragen', kind: 'phrase', lessons: ['A1.1'] },
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
    expect(result.missing).toEqual([{ line: 'die Ärztin, -nen', form: 'die Ärztin, -nen', kind: 'noun' }])
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
    const result = checkVocab(['sich ärgern über'], entries, 'A1.2-L08')
    // The leading "sich " alone decides it, even though the remainder is
    // multi-word and wouldn't otherwise look like a verb.
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
    expect(result.untagged[0].form).toBe('der Arzt, -¨e')
  })

  // ── Review fixes ───────────────────────────────────────────────────────

  it('splits a multi-form line on " / " and checks each headword separately, keeping the original line for context', () => {
    const line = 'der Kollege, -n / die Kollegin, -nen'
    const result = checkVocab([line], entries, 'A1.2-L08')

    // "Kollege" is in the app but not tagged for L08; "Kollegin" is.
    expect(result.untagged).toHaveLength(1)
    expect(result.untagged[0]).toMatchObject({ line, form: 'der Kollege, -n' })
    expect(result.untagged[0].entries.map((e) => e.id)).toEqual(['nomen:beruf/kollege'])

    expect(result.tagged).toHaveLength(1)
    expect(result.tagged[0]).toMatchObject({ line, form: 'die Kollegin, -nen' })
    expect(result.tagged[0].entries.map((e) => e.id)).toEqual(['nomen:beruf/kollegin'])
  })

  it('reports a missing form from a multi-form line on its own, with the full line for context', () => {
    const line = 'der Arzt, -¨e / die Zahnärztin, -nen'
    const result = checkVocab([line], entries, 'A1.2-L08')
    expect(result.untagged[0]).toMatchObject({ line, form: 'der Arzt, -¨e' })
    expect(result.missing[0]).toMatchObject({ line, form: 'die Zahnärztin, -nen', kind: 'noun' })
  })

  it('strips separable-verb "·" and "|" so the notation matches the plain infinitive', () => {
    const withDot = checkVocab(['an·rufen'], entries, 'A1.2-L08')
    const withPipe = checkVocab(['an|rufen'], entries, 'A1.2-L08')
    expect(withDot.untagged[0]?.entries.map((e) => e.id)).toEqual(['verben:anrufen'])
    expect(withPipe.untagged[0]?.entries.map((e) => e.id)).toEqual(['verben:anrufen'])
  })

  it('strips leading valency placeholders ("jemandem", "jemanden", "jemand", "etwas")', () => {
    const dative = checkVocab(['jemandem helfen'], entries, 'A1.2-L08')
    expect(dative.untagged[0]?.entries.map((e) => e.id)).toEqual(['verben:helfen'])
  })

  it('strips a trailing "(+ Dat.)"/"(+ Akk.)" government marker', () => {
    const result = checkVocab(['helfen (+ Dat.)'], entries, 'A1.2-L08')
    expect(result.untagged[0]?.entries.map((e) => e.id)).toEqual(['verben:helfen'])
  })

  it('strips a trailing "(Pl.)" plural-only marker', () => {
    const result = checkVocab(['die Eltern (Pl.)'], entries, 'A1.2-L08')
    expect(result.untagged[0]?.entries.map((e) => e.id)).toEqual(['nomen:familie/eltern'])
  })

  it('matches a reflexive line whether the catalog stores the bare infinitive or the full "sich " form', () => {
    const bareInCatalog = checkVocab(['sich bewerben'], entries, 'A1.2-L08')
    expect(bareInCatalog.untagged[0]?.entries.map((e) => e.id)).toEqual(['verben:bewerben'])

    const fullInCatalog = checkVocab(['sich freuen'], entries, 'A1.2-L08')
    expect(fullInCatalog.untagged[0]?.entries.map((e) => e.id)).toEqual(['verben:freuen'])
  })

  // ── Re-review fixes ────────────────────────────────────────────────────

  it('matches a catalog term whose parens are part of the word itself, not a note to strip', () => {
    // "wie viel(e)" must match as printed — the un-stripped candidate is
    // tried alongside the paren-stripped one, not instead of it.
    const result = checkVocab(['wie viel(e)'], entries, 'A1.2-L08')
    expect(result.untagged[0]?.entries.map((e) => e.id)).toEqual(['redemittel:frage/wieviel'])
    expect(result.missing).toHaveLength(0)
  })

  it('still guesses "phrase" for a missing multi-word placeholder line, not "unknown"', () => {
    // The multi-word signal must come from BEFORE the placeholder strip, so
    // "etwas Wichtiges" reads as two words rather than collapsing to one
    // ("Wichtiges") once "etwas" is stripped for matching purposes.
    const result = checkVocab(['etwas Wichtiges'], entries, 'A1.2-L08')
    expect(result.missing).toEqual([{ line: 'etwas Wichtiges', form: 'etwas Wichtiges', kind: 'phrase' }])
  })
})
