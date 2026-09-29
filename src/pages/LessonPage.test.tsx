import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LessonPage from './LessonPage'

// The "not checked yet" test must not depend on which real lessons happen to
// have a transcribed file (that changes with every intake), so the lws module
// can be overridden per test; by default the real files are used.
const override = vi.hoisted(() => ({ files: undefined as Record<string, string> | undefined }))
vi.mock('../content/lws', async (importOriginal) => {
  const real = await importOriginal<typeof import('../content/lws')>()
  return {
    get lwsFiles() {
      return override.files ?? real.lwsFiles
    },
  }
})
afterEach(() => {
  override.files = undefined
})

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
    // Präpositionen is the one word-class kind currently tagged for L8
    // (verbs/nouns are backfilled per-lesson later, plan §5 Phase 8+) — its
    // chip deep-links. Found by href, since a grammar topic's title also
    // starts with "vor" (vor-seit), making the chip text ambiguous.
    expect(screen.getByRole('heading', { name: 'Präpositionen' })).toBeInTheDocument()
    const chip = screen
      .getAllByRole('link')
      .find((el) => el.getAttribute('href') === '/praepositionen?sel=vor')
    expect(chip).toBeDefined()
  })

  it('shows the lesson\'s grammar topics as the first content group (Phase 7 follow-up)', () => {
    renderLesson('A1.2-L08')

    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings[0]).toBe('Grammatik')

    // All five L8 grammar topics (Appendix B), each deep-linking to /grammatik.
    for (const [slug, title] of [
      ['wortbildung', 'Nomen: Wortbildung'],
      ['bei-als', 'bei (lokal) · als (modal)'],
      ['vor-seit', 'vor, seit + Dativ'],
      ['fuer', 'für + Akkusativ'],
      ['praeteritum-sein-haben', 'Präteritum: sein und haben'],
    ]) {
      // Function matcher (not a RegExp) since a couple of these titles contain
      // regex-special characters ("für + Akkusativ", "bei (lokal) · ...").
      const chip = screen.getByRole('link', { name: (name) => name.startsWith(title) })
      expect(chip).toHaveAttribute('href', `/grammatik?sel=${slug}`)
    }
  })

  it('lists verbs, nouns, adjectives, adverbs and phrases for L8 and a full Lernwortschatz coverage', () => {
    renderLesson('A1.2-L08')
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    for (const label of ['Grammatik', 'Verben', 'Nomen', 'Adjektive', 'Adverbien', 'Präpositionen']) {
      expect(headings).toContain(label)
    }
    expect(headings.some((h) => /Redemittel|Phrasen/.test(h ?? ''))).toBe(true)
    // Every Lernwortschatz headword of the lesson is in the app and tagged.
    const [tagged, total] = screen.getByText(/^\d+ \/ \d+$/).textContent!.split(' / ').map(Number)
    expect(total).toBeGreaterThan(0)
    expect(tagged).toBe(total)
    // A profession card deep-links to its noun (and the feminine form rides along).
    expect(
      screen.getAllByRole('link').some((el) => el.getAttribute('href') === '/nomen?sel=berufe%2Farzt'),
    ).toBe(true)
  })

  it('shows the practice-this-lesson link with the lektion query param', () => {
    renderLesson('A1.2-L08')
    expect(screen.getByRole('link', { name: /Diese Lektion üben/ })).toHaveAttribute(
      'href',
      '/uben?lektion=A1.2-L08',
    )
  })

  it('shows "not checked yet" when no Lernwortschatz file has been transcribed', () => {
    // No lesson has a file in this test, whatever exists on disk.
    override.files = {}
    renderLesson('A1.2-L09')
    expect(screen.getByText('Wortschatz noch nicht geprüft')).toBeInTheDocument()
  })

  it('shows a friendly not-found for an unknown lesson id, with a link back to the index', () => {
    renderLesson('A1.2-L99')
    expect(screen.getByText(/keine bekannte Lektion/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Lektionen/ })).toHaveAttribute('href', '/lektionen')
  })
})
