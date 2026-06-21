import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

describe('App shell', () => {
  it('renders the home page listing all four tools', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /deutsch lernen/i }),
    ).toBeInTheDocument()
    for (const label of ['Verben', 'Nomen', 'Adjektive', 'Redemittel']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
  })

  it('navigates to a tool when its nav link is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('link', { name: /nomen/i })[0])
    expect(
      screen.getByRole('heading', { name: /German Noun Reference/i }),
    ).toBeInTheDocument()
  })
})
