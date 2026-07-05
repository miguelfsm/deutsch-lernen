import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock the engine so the button is tested in isolation from the Web Speech API.
vi.mock('../lib/speak', () => ({
  isSpeechSupported: vi.fn(() => true),
  speak: vi.fn(),
}))

import { isSpeechSupported, speak } from '../lib/speak'
import SpeakButton from './SpeakButton'

describe('SpeakButton', () => {
  beforeEach(() => {
    vi.mocked(isSpeechSupported).mockReturnValue(true)
    vi.mocked(speak).mockClear()
  })

  it('renders a labelled button and speaks the text on click', () => {
    render(<SpeakButton text="schlafen" />)
    const btn = screen.getByRole('button', { name: /schlafen/ })
    fireEvent.click(btn)
    expect(speak).toHaveBeenCalledWith('schlafen')
  })

  it('uses an explicit label when provided', () => {
    render(<SpeakButton text="das Bild" label="das Bild vorlesen" />)
    expect(
      screen.getByRole('button', { name: 'das Bild vorlesen' }),
    ).toBeInTheDocument()
  })

  it('renders nothing when speech is unsupported', () => {
    vi.mocked(isSpeechSupported).mockReturnValue(false)
    const { container } = render(<SpeakButton text="schlafen" />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('button')).toBeNull()
  })
})
