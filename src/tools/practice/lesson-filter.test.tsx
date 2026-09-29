import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PracticeTool from './PracticeTool'

afterEach(() => localStorage.clear())

// Plan §4.4, mock U4: a single-select "Lektion" dropdown at the top of Üben,
// preselected from `?lektion=` (the lesson page's "Diese Lektion üben" link).
describe('Practice lesson filter', () => {
  it('preselects the lesson from ?lektion= and narrows the deck to that lesson', () => {
    render(
      <MemoryRouter initialEntries={['/uben?lektion=A1.2-L08']}>
        <PracticeTool />
      </MemoryRouter>,
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('A1.2-L08')

    // The deck is narrowed to the cards tagged A1.2-L08: some, but fewer than
    // with no lesson filter. (No exact count — it grows with every intake.)
    const narrowed = Number(screen.getByText(/^\d+ Karten$/).textContent!.match(/\d+/)![0])
    cleanup()
    render(
      <MemoryRouter initialEntries={['/uben']}>
        <PracticeTool />
      </MemoryRouter>,
    )
    const all = Number(screen.getByText(/^\d+ Karten$/).textContent!.match(/\d+/)![0])
    expect(narrowed).toBeGreaterThan(0)
    expect(narrowed).toBeLessThan(all)
  })

  it('ignores an unknown ?lektion= value and falls back to "every lesson"', () => {
    render(
      <MemoryRouter initialEntries={['/uben?lektion=not-a-real-lesson']}>
        <PracticeTool />
      </MemoryRouter>,
    )
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('defaults to every lesson with no ?lektion=', () => {
    render(
      <MemoryRouter initialEntries={['/uben']}>
        <PracticeTool />
      </MemoryRouter>,
    )
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('')
  })

  // Regression: a lesson + mode with no cards (L14 has no nouns tagged yet;
  // it is the last lesson to be taken in) — Start must be disabled with an
  // inline note, not silently create a 0-card round.
  it('disables Start and shows an inline note for a lesson + mode with no cards', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/uben?lektion=A1.2-L14']}>
        <PracticeTool />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /Artikel/ }))

    expect(screen.getByText(/Keine Karten für .* in diesem Modus/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /0 Karten üben/ })).toBeDisabled()
  })
})
