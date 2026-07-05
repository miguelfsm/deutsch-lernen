import { isSpeechSupported, speak } from '../lib/speak'

// Presentational 🔊 button: speaks its German `text` on click. Renders only when
// speech is supported (so the button is absent only where it can never work,
// never silently dead). Depends on speak()/isSpeechSupported(), not the Web
// Speech API itself — the Feature G swap seam. Emoji-only, so it carries an
// aria-label (matching the repo's existing `aria-label="Verb suchen"`).

interface Props {
  text: string
  // Optional override for the accessible label; defaults to reading the text.
  label?: string
  // Font size in px so call sites can match their headword vs. example scale.
  size?: number
}

export default function SpeakButton({ text, label, size = 14 }: Props) {
  if (!isSpeechSupported()) return null
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={label ?? `„${text}“ vorlesen`}
      title="Vorlesen"
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 2,
        margin: 0,
        fontSize: size,
        lineHeight: 1,
        color: '#78716c',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    >
      🔊
    </button>
  )
}
