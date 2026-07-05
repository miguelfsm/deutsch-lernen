import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom ships no Web Speech API, so isSpeechSupported() and any component that
// renders a SpeakButton would otherwise be untestable. Provide a minimal default
// stub here (getVoices returns [] — the realistic pre-gesture state). Tests that
// exercise speak()/voice selection or the unsupported branch override these
// globals themselves (see src/lib/speak.test.ts).
class StubUtterance {
  text: string
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null
  constructor(text: string) {
    this.text = text
  }
}

vi.stubGlobal('speechSynthesis', {
  speak: () => {},
  cancel: () => {},
  getVoices: () => [] as SpeechSynthesisVoice[],
})
vi.stubGlobal('SpeechSynthesisUtterance', StubUtterance)
