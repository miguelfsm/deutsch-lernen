import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import GermanVerbs from './verbs/GermanVerbs.jsx'
import GermanNouns from './nouns/GermanNouns.jsx'
import { verbData } from './verbs/data.js'
import { nounData } from './nouns/data.js'

// Tools read `?sel=` via useSearchParams, so they need a Router in tests.
const renderInRouter = (ui: ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

// Feature B — every verb & noun ships an A1 example sentence + translation.
//
// Two complementary guards (both needed): once the fields are flipped to
// REQUIRED, the *type* guarantees presence — but the compiler is happy with an
// empty string. These tests guarantee NON-emptiness, which the type cannot.

describe('example/translation content is non-empty', () => {
  it('no verb has a blank example or translation', () => {
    for (const v of verbData) {
      // Optional during backfill; whenever present it must be real content.
      if (v.example !== undefined) expect(v.example.trim()).not.toBe('')
      if (v.translation !== undefined) expect(v.translation.trim()).not.toBe('')
    }
  })

  it('no noun has a blank example or translation', () => {
    for (const n of nounData) {
      if (n.example !== undefined) expect(n.example.trim()).not.toBe('')
      if (n.translation !== undefined) expect(n.translation.trim()).not.toBe('')
    }
  })
})

describe('example block renders with a 🔊 button', () => {
  it('Verbs shows the selected verb’s example and can speak it', () => {
    const first = verbData[0]
    // The first card is the default selection; it must carry an example so the
    // block (and its SpeakButton) is exercised. This doubles as a completeness
    // check for the entry the view opens on.
    expect(first.example).toBeTruthy()
    expect(first.translation).toBeTruthy()

    renderInRouter(<GermanVerbs />)
    expect(screen.getByText(first.example!)).toBeInTheDocument()
    expect(screen.getByText(first.translation!)).toBeInTheDocument()
    expect(
      screen.getByLabelText(`„${first.example}“ vorlesen`),
    ).toBeInTheDocument()
  })

  it('Nouns shows the selected noun’s example and can speak it', () => {
    const first = nounData[0]
    expect(first.example).toBeTruthy()
    expect(first.translation).toBeTruthy()

    renderInRouter(<GermanNouns />)
    expect(screen.getByText(first.example!)).toBeInTheDocument()
    expect(screen.getByText(first.translation!)).toBeInTheDocument()
    expect(
      screen.getByLabelText(`„${first.example}“ vorlesen`),
    ).toBeInTheDocument()
  })
})
