import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App.jsx'

// jsdom keeps localStorage across tests (PR-4 convention); clear it so a round
// started here can't leak progress into another test.
afterEach(() => localStorage.clear())

// Regression: re-tapping the "Üben" nav link while a round is running did nothing,
// because the same route doesn't remount PracticeTool. The location.key reset must
// bring the user back to the selection (setup) screen on that same-path click.
describe('Practice nav reset', () => {
  it('returns to the setup screen when the Üben nav link is re-tapped mid-round', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Enter practice and start a flashcard round (default mode).
    await user.click(screen.getByRole('link', { name: 'Üben' }))
    await user.click(screen.getByRole('button', { name: /Karten üben/ }))

    // We're now in a round: the reveal control is showing, not the setup screen.
    expect(screen.getByRole('button', { name: /Aufdecken/ })).toBeInTheDocument()

    // Re-tap the same nav link — must reset back to the mode/start selection.
    await user.click(screen.getByRole('link', { name: 'Üben' }))

    expect(screen.getByRole('button', { name: /Karten üben/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Aufdecken/ })).not.toBeInTheDocument()
  })
})
