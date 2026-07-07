import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App.jsx'

// speechSynthesis is stubbed in src/test/setup.ts, so SpeakButton renders.
afterEach(() => localStorage.clear())

// Symmetry: in a DE→EN quiz the German PROMPT already carries a 🔊. In EN→DE the
// German is the ANSWER, so the prompt is silent — a speaker must appear once the
// user has picked, so both directions can hear the German.
describe('Quiz audio symmetry (EN→DE)', () => {
  it('offers a 🔊 for the German answer only after the user picks', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Üben' }))
    await user.click(screen.getByRole('button', { name: /Quiz/ }))
    await user.click(screen.getByRole('button', { name: /English → Deutsch/ }))
    await user.click(screen.getByRole('button', { name: /Karten üben/ }))

    // Prompt is English → no speaker yet; the only buttons are the choices.
    expect(screen.queryByRole('button', { name: /vorlesen/ })).not.toBeInTheDocument()
    const choices = screen.getAllByRole('button')
    expect(choices.length).toBeGreaterThan(0)

    // Pick any option → the German answer's speaker appears.
    await user.click(choices[0])
    expect(screen.getByRole('button', { name: /vorlesen/ })).toBeInTheDocument()
  })
})
