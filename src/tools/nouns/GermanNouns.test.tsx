import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GermanNouns from './GermanNouns'

describe('GermanNouns feminine form', () => {
  it('shows the female form on the male noun card, deep-linked from ?sel=', () => {
    render(
      <MemoryRouter initialEntries={['/nomen?sel=berufe%2Farzt']}>
        <GermanNouns />
      </MemoryRouter>,
    )
    const sign = screen.getByText('♀')
    expect(sign).toHaveAttribute('aria-hidden', 'true')
    expect(sign.parentElement).toHaveTextContent('♀ die Ärztin, -nen')
  })

  it('shows no female form on a noun without one', () => {
    render(
      <MemoryRouter>
        <GermanNouns />
      </MemoryRouter>,
    )
    expect(screen.queryByText(/♀/)).not.toBeInTheDocument()
  })

  it('shows "Nur Plural" instead of a singular for a plural-only noun', () => {
    render(
      <MemoryRouter initialEntries={['/nomen?sel=alltag%2Fsenioren']}>
        <GermanNouns />
      </MemoryRouter>,
    )
    expect(screen.getByText('Nur Plural')).toBeInTheDocument()
  })
})
