import { describe, it, expect } from 'vitest'
import { verbData } from './data'

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
