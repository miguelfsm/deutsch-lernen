import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GermanGrammar from './GermanGrammar.jsx'

// High-ROI: proves one topic renders all block types (table, rule, examples)
// plus a working "Verwandt" cross-link chip — the pure catalog/data tests
// don't exercise rendering at all. Deep-select "vor-seit", whose blocks are a
// qtable-shaped table + a rule, and whose related chips point at the
// prepositions vor/seit.
describe('GermanGrammar', () => {
  it('renders the vor-seit topic: table, rule and a related preposition link', () => {
    render(
      <MemoryRouter initialEntries={['/grammatik?sel=vor-seit']}>
        <GermanGrammar />
      </MemoryRouter>,
    )

    // Appears both as the (active) topic pill and the card's own title.
    expect(screen.getAllByText('vor, seit + Dativ').length).toBeGreaterThanOrEqual(2)
    // Table: qtable question rows.
    expect(screen.getByText('Wann?')).toBeInTheDocument()
    expect(screen.getByText('Seit wann? / Wie lange?')).toBeInTheDocument()
    // Rule block (distinct from the summary, which also mentions "ago").
    expect(screen.getByText(/Plural dative adds -n/)).toBeInTheDocument()
    // Related cross-link chips resolve to real prepositions.
    const vorChip = screen.getByRole('link', { name: /vor.*Präposition/ })
    expect(vorChip.getAttribute('href')).toMatch(/\/praepositionen\?sel=vor/)
    const seitChip = screen.getByRole('link', { name: /seit.*Präposition/ })
    expect(seitChip.getAttribute('href')).toMatch(/\/praepositionen\?sel=seit/)
  })

  it('renders the Präteritum topic with an examples block', () => {
    render(
      <MemoryRouter initialEntries={['/grammatik?sel=praeteritum-sein-haben']}>
        <GermanGrammar />
      </MemoryRouter>,
    )
    expect(screen.getAllByText('Präteritum: sein und haben').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/Früher war ich Koch/)).toBeInTheDocument()
  })
})
