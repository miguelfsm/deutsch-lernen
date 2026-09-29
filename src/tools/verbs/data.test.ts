import { describe, it, expect } from 'vitest'
import { verbData, VERBS_WITHOUT_IMPERATIV } from './data'

const PRON_ORDER = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie']

// Content guard (plan §5 Phase 5, §6): every verb must carry a complete,
// correctly-shaped Präteritum table and a non-empty Perfekt, so a future
// content edit that drops a person or leaves a blank partizip fails the build
// instead of shipping a broken tense switch.
describe('verbData tense shape', () => {
  it('every verb has 6 Präteritum persons in the standard pronoun order', () => {
    for (const v of verbData) {
      expect(v.praeteritum.map((c) => c.pronoun), `${v.infinitive}: pronoun order`).toEqual(
        PRON_ORDER,
      )
      for (const c of v.praeteritum) {
        expect(c.form.trim(), `${v.infinitive} ${c.pronoun}: non-empty form`).not.toBe('')
      }
    }
  })

  it('every verb has a non-empty Perfekt (auxiliary + partizip)', () => {
    for (const v of verbData) {
      expect(['haben', 'sein'], `${v.infinitive}: auxiliary`).toContain(v.perfekt.auxiliary)
      expect(v.perfekt.partizip.trim(), `${v.infinitive}: non-empty partizip`).not.toBe('')
    }
  })

  it('every separable verb\'s Perfekt partizip contains its prefix (ge- sits inside it)', () => {
    for (const v of verbData) {
      if (!v.separable) continue
      expect(
        v.perfekt.partizip.startsWith(v.separable),
        `${v.infinitive}: partizip "${v.perfekt.partizip}" should start with prefix "${v.separable}"`,
      ).toBe(true)
    }
  })
})

const byInf = (inf: string) => {
  const v = verbData.find((x) => x.infinitive === inf)
  if (!v) throw new Error(`verb ${inf} missing`)
  return v
}

describe('verbData Imperativ', () => {
  it('every verb has a complete imperativ or is on the explicit no-imperativ list', () => {
    for (const v of verbData) {
      if (VERBS_WITHOUT_IMPERATIV.includes(v.infinitive)) {
        expect(v.imperativ, `${v.infinitive}: should have no imperativ`).toBeUndefined()
        continue
      }
      expect(v.imperativ, `${v.infinitive}: missing imperativ`).toBeDefined()
      for (const k of ['du', 'ihr', 'Sie'] as const) {
        const f = v.imperativ![k]
        expect(f.trim(), `${v.infinitive} ${k}`).not.toBe('')
        expect(f, `${v.infinitive} ${k}: no "!" stored`).not.toContain('!')
      }
      expect(v.imperativ!.Sie, `${v.infinitive}: Sie keeps the pronoun`).toContain(' Sie')
    }
    for (const inf of VERBS_WITHOUT_IMPERATIV) byInf(inf) // list has no typos
  })

  it('has the right forms for regular, e→i, a→ä, separable and sein', () => {
    expect(byInf('machen').imperativ).toEqual({ du: 'mach', ihr: 'macht', Sie: 'machen Sie' })
    expect(byInf('nehmen').imperativ).toEqual({ du: 'nimm', ihr: 'nehmt', Sie: 'nehmen Sie' })
    expect(byInf('fahren').imperativ).toEqual({ du: 'fahr', ihr: 'fahrt', Sie: 'fahren Sie' }) // no umlaut
    expect(byInf('aufmachen').imperativ).toEqual({ du: 'mach auf', ihr: 'macht auf', Sie: 'machen Sie auf' })
    expect(byInf('sein').imperativ).toEqual({ du: 'sei', ihr: 'seid', Sie: 'seien Sie' })
  })
})

describe('new A1.2 verbs', () => {
  it.each([
    ['warten', 'gewartet', 'haben', 'A1.2-L09', undefined],
    ['holen', 'geholt', 'haben', 'A1.2-L11', undefined],
    ['mitbringen', 'mitgebracht', 'haben', 'A1.2-L14', 'mit'],
  ])('%s has all tenses and required fields', (inf, partizip, aux, lesson, separable) => {
    const v = byInf(inf)
    expect(v.conjugations).toHaveLength(6)
    expect(v.praeteritum).toHaveLength(6)
    expect(v.perfekt).toEqual({ auxiliary: aux, partizip })
    expect(v.lessons).toEqual([lesson])
    expect(v.separable).toBe(separable)
    expect(v.example && v.translation && v.note).toBeTruthy()
    expect(v.imperativ).toBeDefined()
  })

  it('warten inserts the extra -e- and mitbringen is a mixed separable verb', () => {
    expect(byInf('warten').conjugations.map((c) => c.form)).toEqual(
      ['warte', 'wartest', 'wartet', 'warten', 'wartet', 'warten'])
    expect(byInf('mitbringen').type).toBe('irregular')
    expect(byInf('mitbringen').praeteritum[0].form).toBe('brachte')
  })
})

describe('Lektion 8 verbs', () => {
  it.each([
    ['dauern', 'gedauert', ['dauert', 'dauerte']],
    ['heiraten', 'geheiratet', ['heiratet', 'heiratete']],
    ['bekommen', 'bekommen', ['bekommt', 'bekam']],
    ['zahlen', 'gezahlt', ['zahlt', 'zahlte']],
  ])('%s has all three tenses (Perfekt with haben)', (inf, partizip, [er, erPrae]) => {
    const v = byInf(inf)
    expect(v.lessons).toEqual(['A1.2-L08'])
    expect(v.perfekt).toEqual({ auxiliary: 'haben', partizip })
    expect(v.conjugations[2].form).toBe(er)
    expect(v.praeteritum[2].form).toBe(erPrae)
    expect(v.example && v.translation && v.note).toBeTruthy()
  })

  it('dauern has no imperativ; the others do; bekommen has no ge- in the Partizip', () => {
    expect(VERBS_WITHOUT_IMPERATIV).toContain('dauern')
    expect(byInf('heiraten').imperativ?.du).toBe('heirate')
    expect(byInf('zahlen').imperativ?.du).toBe('zahl')
    expect(byInf('bekommen').perfekt.partizip).not.toMatch(/^ge/)
  })

  it('studieren and zeigen keep A1.1 and gain L8', () => {
    expect(byInf('studieren').lessons).toEqual(['A1.1', 'A1.2-L08'])
    expect(byInf('zeigen').lessons).toEqual(['A1.1', 'A1.2-L08'])
  })
})

