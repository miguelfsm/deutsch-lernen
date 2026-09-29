import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PracticeTool from './PracticeTool'

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

// Random 0.999 makes the shuffle a no-op, so the Konjugation deck runs in
// catalog order: sein, haben, werden, können (no imperative), sagen, …
describe('Konjugation: switching to Imperativ mid-round', () => {
  it('skips a verb without an imperative, resets the input, and never shrinks the deck', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/uben']}>
        <PracticeTool />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: /Konjugation/ }))
    await user.click(screen.getByRole('button', { name: /Karten üben/ }))

    const total = screen.getByText(/^Karte 1 \/ \d+$/).textContent!.split('/')[1].trim()

    // Answer sein, haben, werden in Präsens → the current card is können.
    for (let i = 0; i < 3; i++) {
      await user.type(screen.getByPlaceholderText('Form eingeben…'), 'x')
      await user.click(screen.getByRole('button', { name: 'Prüfen · Check' }))
      await user.click(screen.getByRole('button', { name: 'Weiter →' }))
    }
    expect(screen.getByText(`Karte 4 / ${total}`)).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText('Form eingeben…'), 'abc')

    // Imperativ: können has none → müssen too, so move on to sagen (card 6), fresh input.
    await user.click(screen.getByRole('button', { name: 'Imperativ' }))
    expect(screen.getByText(`Karte 6 / ${total}`)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/z\.B\. komm/)).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Weiter →' })).not.toBeInTheDocument()

    // Back to Präsens: same deck, same position, nothing dropped.
    await user.click(screen.getByRole('button', { name: 'Präsens' }))
    expect(screen.getByText(`Karte 6 / ${total}`)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Form eingeben…')).toHaveValue('')
  })
})
