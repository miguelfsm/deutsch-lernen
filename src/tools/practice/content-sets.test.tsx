import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App.jsx'

// jsdom keeps localStorage across tests (PR-4 convention); clear it so a run
// here can't leak progress into another test.
afterEach(() => localStorage.clear())

// Regression: PracticeTool derives its "Inhalte · Content sets" pills from
// every toolId present in the catalog, so a naive fix would let grammar
// topics (kind 'grammar') show up as a drillable word-pair set — a topic
// title and its English summary are not a term↔gloss flashcard pair.
describe('Practice content sets', () => {
  it('never offers "Grammatik" as a content set', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Üben' }))
    expect(screen.queryByRole('button', { name: 'Grammatik' })).not.toBeInTheDocument()
  })
})
