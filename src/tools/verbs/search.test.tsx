import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GermanVerbs from './GermanVerbs.jsx'

// High-ROI: confirms the search box is wired to the pill list — typing narrows
// the visible verbs and an empty result shows the "no matches" hint.
describe('GermanVerbs search box', () => {
  it('filters the verb pills as you type', async () => {
    const user = userEvent.setup()
    render(<GermanVerbs />)

    // "kommen" is present before filtering.
    expect(
      screen.getByRole('button', { name: 'kommen' }),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('Verb suchen'), 'koch')

    // The matching verb stays, a non-matching one is gone.
    expect(screen.getByRole('button', { name: 'kochen' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'kommen' }),
    ).not.toBeInTheDocument()
  })

  it('shows a no-matches hint when nothing matches', async () => {
    const user = userEvent.setup()
    render(<GermanVerbs />)
    await user.type(screen.getByLabelText('Verb suchen'), 'zzz')
    expect(screen.getByText(/Keine Treffer/)).toBeInTheDocument()
  })
})
