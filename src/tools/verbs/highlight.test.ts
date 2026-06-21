import { describe, it, expect } from 'vitest'
import { getStem, getHighlightParts } from './highlight.js'

describe('verb highlight helpers', () => {
  it('getStem strips the -en infinitive ending', () => {
    expect(getStem('machen')).toBe('mach')
    expect(getStem('arbeiten')).toBe('arbeit')
  })

  it('splits the unchanged prefix from the changed suffix', () => {
    expect(getHighlightParts('machen', 'machst')).toEqual({
      unchanged: 'mach',
      changed: 'st',
    })
  })

  it('flags a fully changed form (no shared prefix)', () => {
    expect(getHighlightParts('sein', 'bin')).toEqual({
      unchanged: '',
      changed: 'bin',
    })
  })

  it('honours a custom stem for separable verbs', () => {
    expect(getHighlightParts('anschauen', 'schaust', 'schau')).toEqual({
      unchanged: 'schau',
      changed: 'st',
    })
  })
})
