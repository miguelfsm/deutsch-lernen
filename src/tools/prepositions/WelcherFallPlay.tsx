import { useState } from 'react'
import { font, color } from '../../lib/theme'
import { currentCard, type Session } from '../practice/session'
import { fallDrillFor, checkFallDrill } from './drills'

// "Welcher Fall?" play view (mock screen Üben → Welcher Fall?). Lives in its own
// file/tool folder — not inside PracticeTool.tsx — so the shared shell only
// needs a `case 'fall':` dispatch line, and this file only ever changes for
// preposition-drill reasons.

const bigButton = (bg: string, fg: string) => ({
  flex: 1,
  padding: '12px 16px',
  borderRadius: 12,
  border: 'none',
  background: bg,
  color: fg,
  fontSize: 15,
  fontFamily: font.sans,
  fontWeight: 700,
  cursor: 'pointer',
})

export default function WelcherFallPlay({
  session,
  onAnswer,
}: {
  session: Session
  onAnswer: (known: boolean) => void
}) {
  const card = currentCard(session)
  const item = card ? fallDrillFor(card.term) : undefined
  const [picked, setPicked] = useState<string | null>(null)

  // The deck for this mode is pre-filtered to prepositions that have a drill
  // item (see PracticeTool's buildDeck), so a missing item here would be a bug
  // upstream rather than a normal state — guard and bail rather than crash.
  if (!card || !item) return null

  const correct = picked !== null && checkFallDrill(item, picked)
  const blank = picked ? (correct ? picked : '?') : '     '

  function optionStyle(o: string) {
    const base = {
      padding: '14px 8px',
      borderRadius: 12,
      border: `1.5px solid ${color.cardBorder}`,
      background: '#ffffff',
      color: color.ink,
      fontSize: 16,
      fontFamily: font.sans,
      fontWeight: 700,
      cursor: picked ? 'default' : 'pointer',
      transition: 'all 0.12s',
    }
    if (!picked || !item) return base
    if (o === item.answer) return { ...base, background: '#d1fae5', color: '#065f46', borderColor: '#10b981' }
    if (o === picked) return { ...base, background: '#fee2e2', color: '#991b1b', borderColor: '#ef4444' }
    return { ...base, opacity: 0.5 }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          fontFamily: font.sans,
          fontSize: 12,
          color: color.faint,
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        Karte {session.index + 1} / {session.cards.length}
      </div>

      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${color.cardBorder}`,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '28px 22px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: font.sans,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: color.faint,
          }}
        >
          Welcher Fall?
        </div>
        <div style={{ fontSize: 21, fontWeight: 700, color: color.ink, marginTop: 8, lineHeight: 1.4 }}>
          {item.sentence.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span style={{ borderBottom: `2px solid ${color.ink}`, padding: '0 6px' }}>{blank}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {item.options.map((o) => (
          <button key={o} disabled={picked !== null} onClick={() => setPicked(o)} style={optionStyle(o)}>
            {o}
          </button>
        ))}
      </div>

      {picked && (
        <>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 14,
              textAlign: 'center',
              color: correct ? '#065f46' : '#991b1b',
              fontWeight: 600,
            }}
          >
            {correct ? '✅ Richtig! ' : '❌ Nicht ganz. '}
            {item.why}
          </div>
          <button
            onClick={() => onAnswer(correct)}
            style={{ ...bigButton('#1c1917', '#faf9f7'), flex: 'unset' }}
          >
            Weiter →
          </button>
        </>
      )}
    </div>
  )
}
