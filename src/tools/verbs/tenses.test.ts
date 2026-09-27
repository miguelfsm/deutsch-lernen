import { describe, it, expect } from 'vitest'
import { verbData } from './data'
import { perfektForms } from './tenses'

function find(infinitive: string) {
  const v = verbData.find((v) => v.infinitive === infinitive)
  if (!v) throw new Error(`fixture verb missing from verbData: ${infinitive}`)
  return v
}

describe('perfektForms', () => {
  it('derives a haben-verb from haben’s own Präsens table', () => {
    const forms = perfektForms(find('arbeiten'))
    expect(forms).toEqual([
      { pronoun: 'ich', auxForm: 'habe', partizip: 'gearbeitet' },
      { pronoun: 'du', auxForm: 'hast', partizip: 'gearbeitet' },
      { pronoun: 'er/sie/es', auxForm: 'hat', partizip: 'gearbeitet' },
      { pronoun: 'wir', auxForm: 'haben', partizip: 'gearbeitet' },
      { pronoun: 'ihr', auxForm: 'habt', partizip: 'gearbeitet' },
      { pronoun: 'sie/Sie', auxForm: 'haben', partizip: 'gearbeitet' },
    ])
  })

  it('derives a sein-verb from sein’s own Präsens table', () => {
    const forms = perfektForms(find('fahren'))
    expect(forms[0]).toEqual({ pronoun: 'ich', auxForm: 'bin', partizip: 'gefahren' })
    expect(forms[1]).toEqual({ pronoun: 'du', auxForm: 'bist', partizip: 'gefahren' })
    expect(forms.every((f) => f.partizip === 'gefahren')).toBe(true)
  })

  it('derives a separable verb (ge- sits between prefix and stem)', () => {
    const forms = perfektForms(find('aufmachen'))
    expect(forms[2]).toEqual({ pronoun: 'er/sie/es', auxForm: 'hat', partizip: 'aufgemacht' })
  })

  it('derives an -ieren verb (no ge- prefix)', () => {
    const forms = perfektForms(find('studieren'))
    expect(forms[0].partizip).toBe('studiert')
    expect(forms[0].partizip.startsWith('ge')).toBe(false)
  })
})
