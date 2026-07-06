import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GermanVerbs from './GermanVerbs.jsx'

// High-ROI: proves the card view actually renders CrossLinks (the pure resolver
// tests don't). Deep-select the verb "kaufen" whose example "Ich kaufe Brot."
// references a noun we teach → a "→ Brot" chip must appear, and the verb's own
// self-reference must NOT (linksForCard strips it).
describe('GermanVerbs cross-links', () => {
  it('renders a cross-link chip for a noun used in the example', () => {
    render(
      <MemoryRouter initialEntries={['/verben?sel=kaufen']}>
        <GermanVerbs />
      </MemoryRouter>,
    )
    const chip = screen.getByRole('link', { name: /Brot/ })
    expect(chip.getAttribute('href')).toMatch(/sel=[^&]*brot/)
    // No self-link back to kaufen.
    expect(screen.queryByRole('link', { name: /kaufen/ })).not.toBeInTheDocument()
  })
})
