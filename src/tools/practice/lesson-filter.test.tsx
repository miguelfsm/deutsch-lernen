import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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

    // Only the prepositions tagged A1.2-L08 (als, bei, für, seit, vor) are in
    // the deck today — verbs/nouns aren't per-lesson tagged yet (Phase 8+).
    expect(screen.getByText(/^5 Karten$/)).toBeInTheDocument()
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
})
