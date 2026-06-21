import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GermanVerbs from './verbs/GermanVerbs.jsx'
import GermanNouns from './nouns/GermanNouns.jsx'
import GermanAdjectives from './adjectives/GermanAdjectives.jsx'
import GermanPhrases from './phrases/GermanPhrases.jsx'

// High-ROI: each tool mounts and shows its first item. These guard the data
// imports and the verbatim port, not styling details.
describe('learning tools render their first item', () => {
  it('Verbs renders the conjugator with the first verb', () => {
    render(<GermanVerbs />)
    expect(
      screen.getByRole('heading', { name: /German Verb Conjugator/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('sein').length).toBeGreaterThan(0)
  })

  it('Nouns renders the reference', () => {
    render(<GermanNouns />)
    expect(
      screen.getByRole('heading', { name: /German Noun Reference/i }),
    ).toBeInTheDocument()
  })

  it('Adjectives renders', () => {
    render(<GermanAdjectives />)
    expect(
      screen.getByRole('heading', { name: /Adjectives & Opposites/i }),
    ).toBeInTheDocument()
  })

  it('Phrases renders', () => {
    render(<GermanPhrases />)
    expect(
      screen.getByRole('heading', { name: /Connectors & Strategies/i }),
    ).toBeInTheDocument()
  })
})
