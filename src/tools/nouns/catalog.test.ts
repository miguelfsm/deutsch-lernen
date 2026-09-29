import { describe, it, expect } from 'vitest'
import { catalog } from '../../lib/catalog'
import { searchCatalog } from '../../lib/catalog/search'
import { nounData } from './data'
import { nounsCatalog } from './catalog'

const L8 = 'A1.2-L08'

describe('feminine job forms', () => {
  it('projects the feminine form as an alias, not as a separate entry', () => {
    const arzt = nounsCatalog().find((e) => e.term === 'Arzt')!
    expect(arzt.aliases).toEqual(['Ärztin'])
    expect(nounsCatalog().some((e) => e.term === 'Ärztin')).toBe(false)
  })

  it('searching the feminine form finds the male noun', () => {
    for (const [q, term] of [['Ärztin', 'Arzt'], ['Hausfrau', 'Hausmann'], ['Pflegefachfrau', 'Pflegefachmann'], ['Chefin', 'Chef']]) {
      const hits = searchCatalog(catalog, q).filter((e) => e.kind === 'noun')
      expect(hits.map((e) => e.term), q).toContain(term)
    }
  })

  it('every profession pair from the book has a feminine form on the male noun', () => {
    const pairs: Record<string, string> = {
      Chef: 'Chefin', Patient: 'Patientin', Hauswart: 'Hauswartin', Journalist: 'Journalistin',
      Mechatroniker: 'Mechatronikerin', Hausmann: 'Hausfrau', Polizist: 'Polizistin',
      Pflegefachmann: 'Pflegefachfrau', Student: 'Studentin', Leiter: 'Leiterin',
      Reiseführer: 'Reiseführerin', Tourist: 'Touristin', Kellner: 'Kellnerin',
      Architekt: 'Architektin', Koch: 'Köchin', Fahrer: 'Fahrerin', Arzt: 'Ärztin',
    }
    for (const [m, f] of Object.entries(pairs)) {
      expect(nounData.find((n) => n.singular === m)?.feminine, m).toBe(f)
    }
  })
})

describe('Lektion 8 nouns', () => {
  const l8 = nounData.filter((n) => n.lessons.includes(L8))

  it('are complete: article, plural, category, example, translation and note', () => {
    expect(l8.length).toBeGreaterThan(40)
    for (const n of l8) {
      expect(['der', 'die', 'das'], n.singular).toContain(n.article)
      for (const f of [n.plural, n.category, n.example, n.translation, n.note]) {
        expect(f.trim(), n.singular).not.toBe('')
      }
    }
  })

  it('keeps Kollege and Kollegin as separate nouns and tags the existing ones', () => {
    for (const s of ['Stelle', 'Chef', 'Kollege', 'Kollegin', 'Stunde']) {
      const n = nounData.find((x) => x.singular === s)!
      expect(n.lessons, s).toEqual(['A1.1', L8])
    }
    expect(nounData.find((n) => n.singular === 'Kollege')?.feminine).toBeUndefined()
  })
})
