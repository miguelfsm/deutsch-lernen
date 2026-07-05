import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router-dom'
import GlobalSearch from './GlobalSearch'

// HashRouter (not MemoryRouter) so we can assert the rendered link href takes the
// `#/verben?sel=…` form — the query string lives AFTER the hash, and it is easy to
// get wrong (a `?sel=` before the `#` would break deep-select).
function renderSearch() {
  return render(
    <HashRouter>
      <GlobalSearch />
    </HashRouter>,
  )
}

describe('GlobalSearch', () => {
  it('shows no results until the user types', () => {
    renderSearch()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('groups matching results by tool and links to the deep-select target', async () => {
    const user = userEvent.setup()
    renderSearch()

    await user.type(screen.getByLabelText('Alles durchsuchen'), 'schlafen')

    // Grouped under the Verben heading.
    expect(screen.getByRole('heading', { name: 'Verben' })).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /schlafen/ })
    // HashRouter form: query string is INSIDE the hash.
    expect(link).toHaveAttribute('href', '#/verben?sel=schlafen')
  })

  it('shows a gentle no-match hint for an unmatched query', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.type(screen.getByLabelText('Alles durchsuchen'), 'zzzznope')
    expect(screen.getByText(/Keine Treffer/)).toBeInTheDocument()
  })
})
