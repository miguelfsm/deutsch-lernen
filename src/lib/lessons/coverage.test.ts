import { describe, it, expect } from 'vitest'
import type { CatalogEntry } from '../catalog/types'
import { lessonCoverage } from './coverage'

const entries: CatalogEntry[] = [
  { id: 'verben:arbeiten', toolId: 'verben', route: '/verben', slug: 'arbeiten', term: 'arbeiten', gloss: 'to work', kind: 'verb', lessons: ['A1.2-L08'] },
  { id: 'nomen:beruf/arzt', toolId: 'nomen', route: '/nomen', slug: 'beruf/arzt', term: 'Arzt', gloss: 'doctor', category: 'Beruf', kind: 'noun', lessons: ['A1.1'] },
  { id: 'redemittel:praep/seit', toolId: 'redemittel', route: '/redemittel', slug: 'praep/seit', term: 'seit', gloss: 'since', category: 'Präpositionen', kind: 'preposition', lessons: ['A1.2-L08'] },
]

describe('lessonCoverage', () => {
  it('counts tagged entries against every non-blank, non-comment line', () => {
    const lines = ['arbeiten', 'seit', 'der Arzt, -¨e', 'komplettFehlend']
    // arbeiten + seit → tagged for A1.2-L08; der Arzt → in the app but only
    // tagged A1.1 (untagged); komplettFehlend → missing. 4 headwords total.
    expect(lessonCoverage(lines, entries, 'A1.2-L08')).toEqual({ tagged: 2, total: 4 })
  })

  it('ignores blank lines and # comments in the total', () => {
    const lines = ['# Lernwortschatz S. 178', '', 'arbeiten', '   ', '# another note']
    expect(lessonCoverage(lines, entries, 'A1.2-L08')).toEqual({ tagged: 1, total: 1 })
  })

  it('is 0/0 for an empty file', () => {
    expect(lessonCoverage([], entries, 'A1.2-L08')).toEqual({ tagged: 0, total: 0 })
  })

  it('an entry present but tagged for a different lesson does not count as tagged', () => {
    expect(lessonCoverage(['der Arzt, -¨e'], entries, 'A1.2-L08')).toEqual({ tagged: 0, total: 1 })
  })
})
