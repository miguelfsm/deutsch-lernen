import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CatalogEntry } from '../../lib/catalog/types'
import type { Session } from './session'
import ConjugationPlay from './ConjugationPlay'

afterEach(() => localStorage.clear())

// A single-card deck fixed to a known verb, so the drilled pronoun is
// deterministic-ish to reason about (we just check the tense picker itself,
// not which pronoun got picked).
const fahrenCard: CatalogEntry = {
  id: 'verben:fahren',
  toolId: 'verben',
  route: '/verben',
  slug: 'fahren',
  term: 'fahren',
  gloss: 'to drive',
  kind: 'verb',
  lessons: ['A1.1'],
}

const session: Session = {
  cards: [fahrenCard],
  direction: 'de-en',
  mode: 'conjugation',
  index: 0,
  known: 0,
  unknown: 0,
}

describe('ConjugationPlay tense picker', () => {
  it('defaults to Präsens and switches placeholder/behaviour when Perfekt is picked', async () => {
    const user = userEvent.setup()
    const onTense = vi.fn()
    const { rerender } = render(
      <ConjugationPlay session={session} tense="praesens" onTense={onTense} onAnswer={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: 'Präsens' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByPlaceholderText('Form eingeben…')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Perfekt' }))
    expect(onTense).toHaveBeenCalledWith('perfekt')

    // The picker's own state lives in the parent (PracticeTool); simulate that
    // round-trip here by re-rendering with the new tense, as PracticeTool would.
    rerender(<ConjugationPlay session={session} tense="perfekt" onTense={onTense} onAnswer={vi.fn()} />)
    expect(screen.getByPlaceholderText('z.B. bist gefahren')).toBeInTheDocument()
  })

  it('grades a Perfekt answer against the full derived form', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(
      <ConjugationPlay session={session} tense="perfekt" onTense={vi.fn()} onAnswer={onAnswer} />,
    )

    const input = screen.getByPlaceholderText('z.B. bist gefahren')
    // fahren's pronoun is random per card; type a form that's only right for
    // "du" and check the button correctly reports right/wrong either way by
    // reading back which pronoun was shown.
    const pronoun = screen.getByText(/…/).textContent?.replace(' …', '').trim()
    const expected: Record<string, string> = {
      ich: 'bin gefahren',
      du: 'bist gefahren',
      'er/sie/es': 'ist gefahren',
      wir: 'sind gefahren',
      ihr: 'seid gefahren',
      'sie/Sie': 'sind gefahren',
    }
    await user.type(input, expected[pronoun ?? 'du'])
    await user.click(screen.getByRole('button', { name: 'Prüfen · Check' }))
    await user.click(screen.getByRole('button', { name: 'Weiter →' }))

    expect(onAnswer).toHaveBeenCalledWith(true)
  })
})

// essen: Präsens "ich esse" is regular (stemChange: false), but Präteritum
// "ich ass" is a strong-verb stem change (stemChange: true) — the two tenses
// disagree, so grading/colouring Präteritum must read ITS OWN table, not
// reuse the Präsens flag (the bug this test guards against).
const essenCard: CatalogEntry = {
  id: 'verben:essen',
  toolId: 'verben',
  route: '/verben',
  slug: 'essen',
  term: 'essen',
  gloss: 'to eat',
  kind: 'verb',
  lessons: ['A1.1'],
}

const essenSession: Session = {
  cards: [essenCard],
  direction: 'de-en',
  mode: 'conjugation',
  index: 0,
  known: 0,
  unknown: 0,
}

// jsdom normalises inline hex colours to rgb() when serialising style.
const STEM_RED = 'rgb(224, 62, 45)'
const STEM_BLUE = 'rgb(29, 110, 245)'

describe('ConjugationPlay per-tense highlight colour', () => {
  it('reveals essen/ich in Präteritum as a stem change (red), not the Präsens regular colour (blue)', async () => {
    const user = userEvent.setup()
    // Force the drilled pronoun to "ich" (verb.conjugations[0]).
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    const { container } = render(
      <ConjugationPlay session={essenSession} tense="praeteritum" onTense={vi.fn()} onAnswer={vi.fn()} />,
    )

    expect(screen.getByText('ich …')).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Form eingeben…')
    await user.type(input, 'esste') // wrong, forces the reveal
    await user.click(screen.getByRole('button', { name: 'Prüfen · Check' }))

    // Reveal shows the correct Präteritum form "ass" in the STEM-CHANGE
    // colour, never the Präsens (regular, blue) colour.
    expect(container.innerHTML).toContain(STEM_RED)
    expect(container.innerHTML).not.toContain(STEM_BLUE)
    expect(screen.getAllByText('ass').length).toBeGreaterThan(0)

    randomSpy.mockRestore()
  })
})

describe('ConjugationPlay Imperativ', () => {
  it('asks for du/ihr/Sie and grades the stored form, accepting a trailing "!"', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    vi.spyOn(Math, 'random').mockReturnValue(0) // → du
    render(<ConjugationPlay session={session} tense="imperativ" onTense={vi.fn()} onAnswer={onAnswer} />)

    expect(screen.getByText(/Imperativ – du \/ ihr \/ Sie/)).toBeInTheDocument()
    await user.type(screen.getByLabelText('Imperativ von fahren für du'), 'Fahr!')
    await user.click(screen.getByRole('button', { name: 'Prüfen · Check' }))
    await user.click(screen.getByRole('button', { name: 'Weiter →' }))
    expect(onAnswer).toHaveBeenCalledWith(true)
    vi.restoreAllMocks()
  })
})
