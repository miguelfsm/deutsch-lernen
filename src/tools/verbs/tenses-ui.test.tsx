import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import GermanVerbs from './GermanVerbs.jsx'

// GermanVerbs reads `?sel=`/`?tense=` via useSearchParams, so it needs a Router.
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <GermanVerbs />
    </MemoryRouter>,
  )

// The conjugated form is split into an "unchanged" + a highlighted "changed"
// span, so it never appears as one text node — assert on the card's full text
// instead of a single getByText match.
function cardText(): string {
  return (document.querySelector('table')?.parentElement?.textContent ?? '') +
    (document.body.textContent ?? '')
}

// High-ROI: the one UI test the plan asks for — switching to Perfekt shows the
// derived aux + partizip for a known verb, plus the `&tense=` deep link.
describe('GermanVerbs tense switch', () => {
  it('shows Präsens by default, then Präteritum and Perfekt on tap', async () => {
    const user = userEvent.setup()
    renderAt('/verben?sel=arbeiten')

    // Präsens (default): the stored Präsens form for "du".
    expect(cardText()).toContain('arbeitest')

    await user.click(screen.getByRole('button', { name: 'Präteritum' }))
    expect(cardText()).toContain('arbeitete')

    await user.click(screen.getByRole('button', { name: 'Perfekt' }))
    // Derived Perfekt: aux "habe" (ich) + the stored Partizip II, plus the caption.
    expect(cardText()).toContain('habe')
    expect(cardText()).toContain('gearbeitet')
  })

  it('deep-links straight into Perfekt via &tense=perfekt for a sein-verb', () => {
    renderAt('/verben?sel=fahren&tense=perfekt')

    expect(screen.getByRole('button', { name: 'Perfekt' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(cardText()).toContain('bist')
    expect(cardText()).toContain('gefahren')
  })

  it('switches to Imperativ and shows du/ihr/Sie forms; deep link works', async () => {
    const user = userEvent.setup()
    renderAt('/verben?sel=nehmen')
    await user.click(screen.getByRole('button', { name: 'Imperativ' }))
    const text = document.body.textContent ?? ''
    expect(text).toContain('nimm!')
    expect(text).toContain('nehmt!')
    expect(text).toContain('nehmen Sie!')
  })

  it('shows "Kein Imperativ" for a modal verb', () => {
    renderAt('/verben?sel=koennen&tense=imperativ')
    expect(screen.getByText(/Kein Imperativ/)).toBeInTheDocument()
  })
})
