import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import GermanVerbs from './verbs/GermanVerbs.jsx'
import GermanNouns from './nouns/GermanNouns.jsx'
import GermanAdjectives from './adjectives/GermanAdjectives.jsx'
import GermanPhrases from './phrases/GermanPhrases.jsx'
import GermanSatzbau from './satzbau/GermanSatzbau.jsx'

// Tools read `?sel=` via useSearchParams (deep-select), so they need a Router in
// tests just as they have HashRouter in the app.
const renderInRouter = (ui: ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

// High-ROI: each tool mounts and shows its first item. These guard the data
// imports and the verbatim port, not styling details.
describe('learning tools render their first item', () => {
  it('Verbs renders the conjugator with the first verb', () => {
    renderInRouter(<GermanVerbs />)
    expect(
      screen.getByRole('heading', { name: /German Verb Conjugator/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('sein').length).toBeGreaterThan(0)
  })

  it('Nouns renders the reference', () => {
    renderInRouter(<GermanNouns />)
    expect(
      screen.getByRole('heading', { name: /German Noun Reference/i }),
    ).toBeInTheDocument()
  })

  it('Adjectives renders', () => {
    renderInRouter(<GermanAdjectives />)
    expect(
      screen.getByRole('heading', { name: /Adjectives & Opposites/i }),
    ).toBeInTheDocument()
  })

  it('Phrases renders', () => {
    renderInRouter(<GermanPhrases />)
    expect(
      screen.getByRole('heading', { name: /Connectors & Strategies/i }),
    ).toBeInTheDocument()
  })

  it('Satzbau renders', () => {
    renderInRouter(<GermanSatzbau />)
    expect(
      screen.getByRole('heading', { name: /Word Order & Patterns/i }),
    ).toBeInTheDocument()
  })
})
