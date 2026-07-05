import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isSpeechSupported, pickGermanVoice, speak } from './speak'

// Build a SpeechSynthesisVoice-shaped object; jsdom has none.
function voice(partial: Partial<SpeechSynthesisVoice>): SpeechSynthesisVoice {
  return {
    lang: 'en-US',
    name: 'Default',
    localService: false,
    default: false,
    voiceURI: 'x',
    ...partial,
  } as SpeechSynthesisVoice
}

describe('pickGermanVoice', () => {
  it('prefers an offline (localService) German voice', () => {
    const remote = voice({ lang: 'de-DE', name: 'Remote', localService: false })
    const local = voice({ lang: 'de-DE', name: 'Anna', localService: true })
    expect(pickGermanVoice([remote, local])).toBe(local)
  })

  it('falls back to any German voice when none is local', () => {
    const de = voice({ lang: 'de-AT', name: 'Otto', localService: false })
    const en = voice({ lang: 'en-GB', name: 'Kate', localService: true })
    expect(pickGermanVoice([en, de])).toBe(de)
  })

  it('returns undefined when there is no German voice', () => {
    expect(pickGermanVoice([voice({ lang: 'en-US' })])).toBeUndefined()
    expect(pickGermanVoice([])).toBeUndefined()
  })
})

describe('isSpeechSupported', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('is true when speechSynthesis is present', () => {
    vi.stubGlobal('speechSynthesis', { getVoices: () => [] })
    expect(isSpeechSupported()).toBe(true)
  })

  it('is false when speechSynthesis is absent', () => {
    vi.stubGlobal('speechSynthesis', undefined)
    expect(isSpeechSupported()).toBe(false)
  })
})

describe('speak', () => {
  const speakSpy = vi.fn()
  const cancelSpy = vi.fn()
  let utterances: Array<{ text: string; lang: string; voice: unknown }> = []

  function stubSynth(voices: SpeechSynthesisVoice[]) {
    vi.stubGlobal('speechSynthesis', {
      speak: speakSpy,
      cancel: cancelSpy,
      getVoices: () => voices,
    })
  }

  beforeEach(() => {
    utterances = []
    speakSpy.mockClear()
    cancelSpy.mockClear()
    class U {
      text: string
      lang = ''
      rate = 1
      voice: unknown = null
      constructor(text: string) {
        this.text = text
        utterances.push(this)
      }
    }
    vi.stubGlobal('SpeechSynthesisUtterance', U)
  })

  afterEach(() => vi.unstubAllGlobals())

  it('cancels in-flight speech, sets lang de-DE, picks a German voice and speaks', () => {
    const german = voice({ lang: 'de-DE', name: 'Anna', localService: true })
    stubSynth([german])

    speak('Hallo')

    expect(cancelSpy).toHaveBeenCalledOnce()
    expect(speakSpy).toHaveBeenCalledOnce()
    expect(utterances).toHaveLength(1)
    expect(utterances[0].text).toBe('Hallo')
    expect(utterances[0].lang).toBe('de-DE')
    expect(utterances[0].voice).toBe(german)
  })

  it('still speaks with the default voice when no German voice exists', () => {
    stubSynth([voice({ lang: 'en-US' })])

    speak('Hallo')

    expect(speakSpy).toHaveBeenCalledOnce()
    expect(utterances[0].lang).toBe('de-DE')
    // No German voice found → left unset so the browser uses its de-DE default.
    expect(utterances[0].voice).toBeNull()
  })

  it('does nothing when speech is unsupported', () => {
    vi.stubGlobal('speechSynthesis', undefined)
    expect(() => speak('Hallo')).not.toThrow()
    expect(speakSpy).not.toHaveBeenCalled()
  })
})
