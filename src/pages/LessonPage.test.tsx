import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LessonPage from './LessonPage'

function renderLesson(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/lektionen/${id}`]}>
      <Routes>
        <Route path="/lektionen/:id" element={<LessonPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LessonPage', () => {
  it('renders the lesson header, sections and a content chip linking to its tool', () => {
    renderLesson('A1.2-L08')

    expect(screen.getByText('Beruf und Arbeit')).toBeInTheDocument()
    // Section A's title, straight from the registry.
    expect(screen.getAllByText(/Berufe benennen/).length).toBeGreaterThan(0)
    // Präpositionen is the one kind currently tagged for L8 (verbs/nouns are
    // backfilled per-lesson later, plan §5 Phase 8+) — its chip deep-links.
    expect(screen.getByRole('heading', { name: 'Präpositionen' })).toBeInTheDocument()
    const chip = screen.getByRole('link', { name: /^vor/ })
    expect(chip).toHaveAttribute('href', '/praepositionen?sel=vor')
  })

  it('shows the practice-this-lesson link with the lektion query param', () => {
    renderLesson('A1.2-L08')
    expect(screen.getByRole('link', { name: /Diese Lektion üben/ })).toHaveAttribute(
      'href',
      '/uben?lektion=A1.2-L08',
    )
  })

  it('shows "not checked yet" when no Lernwortschatz file has been transcribed', () => {
    renderLesson('A1.2-L08')
    expect(screen.getByText('Wortschatz noch nicht geprüft')).toBeInTheDocument()
  })

  it('shows a friendly not-found for an unknown lesson id, with a link back to the index', () => {
    renderLesson('A1.2-L99')
    expect(screen.getByText(/keine bekannte Lektion/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Lektionen/ })).toHaveAttribute('href', '/lektionen')
  })
})
