import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import type { CatalogEntry } from '../lib/catalog/types'
import CrossLinks from './CrossLinks'

// HashRouter so we can assert the rendered href takes the `#/route?sel=…` form —
// the query string must live INSIDE the hash for deep-select to work.
function renderChips(entries: CatalogEntry[]) {
  return render(
    <HashRouter>
      <CrossLinks entries={entries} />
    </HashRouter>,
  )
}

const verb: CatalogEntry = {
  id: 'verben:lernen', toolId: 'verben', route: '/verben', slug: 'lernen', term: 'lernen', gloss: 'to learn',
}
const noun: CatalogEntry = {
  id: 'nomen:familie/bild', toolId: 'nomen', route: '/nomen', slug: 'familie/bild', term: 'Bild', gloss: 'picture', category: 'Familie',
}

describe('CrossLinks', () => {
  it('renders a chip per entry with the #/route?sel=slug href', () => {
    renderChips([verb, noun])

    const verbLink = screen.getByRole('link', { name: /lernen/ })
    expect(verbLink).toHaveAttribute('href', '#/verben?sel=lernen')

    const nounLink = screen.getByRole('link', { name: /Bild/ })
    // The category slug segment is URL-encoded (the "/" becomes %2F).
    expect(nounLink).toHaveAttribute('href', '#/nomen?sel=familie%2Fbild')
  })

  it('labels chips by part of speech (Konjugation for verbs, Nomen for nouns)', () => {
    renderChips([verb, noun])
    expect(screen.getByText('Konjugation')).toBeInTheDocument()
    expect(screen.getByText('Nomen')).toBeInTheDocument()
  })

  it('renders nothing for an empty list (no dead chip when nothing resolves)', () => {
    const { container } = renderChips([])
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
