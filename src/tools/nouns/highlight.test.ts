import { describe, it, expect } from 'vitest'
import { getPluralParts } from './highlight.js'

describe('noun plural helper', () => {
  it('marks uncountable nouns (no plural)', () => {
    expect(getPluralParts('Milch', '—')).toEqual({ unchanged: '', changed: '—' })
  })

  it('marks an unchanged plural', () => {
    expect(getPluralParts('Zimmer', 'Zimmer')).toEqual({
      unchanged: 'Zimmer',
      changed: '',
    })
  })

  it('splits an umlaut-only plural with no shared prefix', () => {
    expect(getPluralParts('Apfel', 'Äpfel')).toEqual({
      unchanged: '',
      changed: 'Äpfel',
    })
  })

  it('splits a suffix-only plural', () => {
    expect(getPluralParts('Hund', 'Hunde')).toEqual({
      unchanged: 'Hund',
      changed: 'e',
    })
  })
})
