import { describe, it, expect } from 'vitest'
import { prepositionData } from './data'
import { fallDrillData, fallDrillFor, checkFallDrill } from './drills'

describe('fallDrillData shape', () => {
  it('every item has exactly 4 options that include the answer', () => {
    for (const item of fallDrillData) {
      expect(item.options).toHaveLength(4)
      expect(item.options).toContain(item.answer)
    }
  })

  it('the sentence has exactly one blank', () => {
    for (const item of fallDrillData) {
      expect(item.sentence.split('___')).toHaveLength(2)
    }
  })

  it('every item drills a real preposition word', () => {
    const words = new Set(prepositionData.map((p) => p.word))
    for (const item of fallDrillData) {
      expect(words.has(item.word)).toBe(true)
    }
  })

  it('covers every Dativ/Akkusativ preposition with a clear article, except bis (see drills.ts note: no idiomatic bare-article sentence, and für already covers Akkusativ)', () => {
    const clearCase = prepositionData.filter(
      (p) => (p.case === 'Dativ' || p.case === 'Akkusativ') && p.word !== 'bis',
    )
    const drilled = new Set(fallDrillData.map((d) => d.word))
    for (const p of clearCase) {
      expect(drilled.has(p.word), `missing a drill item for ${p.word}`).toBe(true)
    }
  })

  it('a Wechsel preposition can still carry a drill item, for a use that is always one case (vor, temporal)', () => {
    expect(prepositionData.find((p) => p.word === 'vor')?.case).toBe('Wechsel')
    expect(fallDrillFor('vor')).toBeDefined()
  })

  it('has no duplicate words', () => {
    const words = fallDrillData.map((d) => d.word)
    expect(new Set(words).size).toBe(words.length)
  })
})

describe('fallDrillFor', () => {
  it('finds the item for a drilled word', () => {
    expect(fallDrillFor('seit')?.answer).toBe('einem')
  })

  it('returns undefined for a word with no drill (Wechsel/ohne)', () => {
    expect(fallDrillFor('in')).toBeUndefined()
    expect(fallDrillFor('als')).toBeUndefined()
    expect(fallDrillFor('nonexistent')).toBeUndefined()
  })
})

describe('checkFallDrill', () => {
  const item = fallDrillData[0]

  it('accepts the correct answer', () => {
    expect(checkFallDrill(item, item.answer)).toBe(true)
  })

  it('rejects any wrong option', () => {
    for (const wrong of item.options.filter((o) => o !== item.answer)) {
      expect(checkFallDrill(item, wrong)).toBe(false)
    }
  })
})
