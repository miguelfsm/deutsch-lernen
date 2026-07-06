import { useState, type ReactNode } from 'react'
import Header from '../../components/Header'
import SpeakButton from '../../components/SpeakButton'
import { font, color } from '../../lib/theme'
import { tools } from '../registry'
import { catalog } from '../../lib/catalog'
import {
  createSession,
  filterByTools,
  currentCard,
  isComplete,
  isEmpty,
  answer,
  summary,
  promptText,
  answerText,
  type Direction,
  type Session,
} from './session'
import {
  loadProgress,
  recordAndSave,
  totals,
  type ProgressEntry,
} from '../../lib/progress'

// Which content sets can be drilled = the tools that contribute catalog entries,
// labelled from the registry. A new searchable tool becomes drillable here with
// zero edits (it just appears in this list). Computed once — catalog/tools are
// static module data.
const PRESENT = new Set(catalog.map((e) => e.toolId))
const CONTENT_SETS = tools
  .map((t) => ({ id: t.path.replace(/^\//, ''), label: t.label }))
  .filter((c) => PRESENT.has(c.id))

const DIRECTIONS: { id: Direction; label: string }[] = [
  { id: 'de-en', label: 'Deutsch → English' },
  { id: 'en-de', label: 'English → Deutsch' },
]

// ─── Shared style helpers ──────────────────────────────────────────────────────
const pill = (active: boolean) => ({
  padding: '6px 14px',
  borderRadius: 99,
  border: active ? '2px solid #78716c' : '2px solid transparent',
  background: active ? '#1c1917' : '#e7e5e0',
  color: active ? '#faf9f7' : '#57534e',
  fontSize: 13,
  fontFamily: font.sans,
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
  transition: 'all 0.12s',
})

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

export default function PracticeTool() {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(CONTENT_SETS.map((c) => c.id)),
  )
  const [direction, setDirection] = useState<Direction>('de-en')
  const [session, setSession] = useState<Session | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [lifetime, setLifetime] = useState<ProgressEntry>(() =>
    totals(loadProgress()),
  )

  const deckSize = filterByTools(catalog, selected).length

  function toggleSet(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function start() {
    setSession(createSession(filterByTools(catalog, selected), direction))
    setRevealed(false)
  }

  function rate(wasKnown: boolean) {
    if (!session) return
    const card = currentCard(session)
    if (card) recordAndSave(card.slug, wasKnown)
    const next = answer(session, wasKnown)
    setSession(next)
    setRevealed(false)
    if (isComplete(next)) setLifetime(totals(loadProgress()))
  }

  return (
    <div
      style={{
        fontFamily: font.serif,
        maxWidth: 520,
        margin: '0 auto',
        padding: '20px 16px 40px',
        background: color.canvas,
        minHeight: '100vh',
      }}
    >
      <Header eyebrow="Üben · Practice" title="Flashcards" />

      {session === null && (
        <SetupScreen
          selected={selected}
          onToggle={toggleSet}
          direction={direction}
          onDirection={setDirection}
          deckSize={deckSize}
          onStart={start}
          lifetime={lifetime}
        />
      )}

      {session !== null && !isComplete(session) && !isEmpty(session) && (
        <PlayScreen
          session={session}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onRate={rate}
        />
      )}

      {session !== null && (isComplete(session) || isEmpty(session)) && (
        <DoneScreen
          session={session}
          lifetime={lifetime}
          onAgain={start}
          onBack={() => setSession(null)}
        />
      )}
    </div>
  )
}

// ─── Setup ──────────────────────────────────────────────────────────────────────
function SetupScreen({
  selected,
  onToggle,
  direction,
  onDirection,
  deckSize,
  onStart,
  lifetime,
}: {
  selected: Set<string>
  onToggle: (id: string) => void
  direction: Direction
  onDirection: (d: Direction) => void
  deckSize: number
  onStart: () => void
  lifetime: ProgressEntry
}) {
  const nothingSelected = selected.size === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Field label="Richtung · Direction">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DIRECTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => onDirection(d.id)}
              style={pill(direction === d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Inhalte · Content sets">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CONTENT_SETS.map((c) => (
            <button
              key={c.id}
              onClick={() => onToggle(c.id)}
              aria-pressed={selected.has(c.id)}
              style={pill(selected.has(c.id))}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Field>

      {nothingSelected ? (
        <p
          style={{
            fontFamily: font.sans,
            fontSize: 14,
            color: color.faint,
            fontStyle: 'italic',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Nichts ausgewählt — wähle mindestens einen Inhalt zum Üben.
        </p>
      ) : (
        <button
          onClick={onStart}
          style={{
            ...bigButton('#1c1917', '#faf9f7'),
            flex: 'unset',
          }}
        >
          {deckSize} Karten üben →
        </button>
      )}

      {lifetime.seen > 0 && (
        <p
          style={{
            fontFamily: font.sans,
            fontSize: 12.5,
            color: color.faint,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Bisher: {lifetime.seen} Karten gesehen · {lifetime.known} gewusst
        </p>
      )}
    </div>
  )
}

// ─── Play ─────────────────────────────────────────────────────────────────────
function PlayScreen({
  session,
  revealed,
  onReveal,
  onRate,
}: {
  session: Session
  revealed: boolean
  onReveal: () => void
  onRate: (known: boolean) => void
}) {
  const card = currentCard(session)
  if (!card) return null

  const prompt = promptText(card, session.direction)
  const revealAnswer = answerText(card, session.direction)
  // The German side is always card.term — only speak it when it is on screen.
  const promptIsGerman = session.direction === 'de-en'

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
          padding: '32px 22px',
          textAlign: 'center',
          minHeight: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: color.ink,
              letterSpacing: '-0.5px',
            }}
          >
            {prompt}
          </span>
          {promptIsGerman && <SpeakButton text={card.term} size={22} />}
        </div>

        {revealed && (
          <>
            <div style={{ height: 1, background: color.line }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  color: color.muted,
                  fontFamily: font.sans,
                }}
              >
                {revealAnswer}
              </span>
              {!promptIsGerman && <SpeakButton text={card.term} size={20} />}
            </div>
          </>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={onReveal}
          style={{ ...bigButton('#e7e5e0', '#1c1917'), flex: 'unset' }}
        >
          Aufdecken · Reveal
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => onRate(false)} style={bigButton('#fee2e2', '#991b1b')}>
            Nicht gewusst
          </button>
          <button onClick={() => onRate(true)} style={bigButton('#d1fae5', '#065f46')}>
            Gewusst
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Done ─────────────────────────────────────────────────────────────────────
function DoneScreen({
  session,
  lifetime,
  onAgain,
  onBack,
}: {
  session: Session
  lifetime: ProgressEntry
  onAgain: () => void
  onBack: () => void
}) {
  const s = summary(session)
  const empty = s.total === 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${color.cardBorder}`,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '28px 22px',
        }}
      >
        {empty ? (
          <p
            style={{
              fontFamily: font.sans,
              fontSize: 15,
              color: color.muted,
              margin: 0,
            }}
          >
            Kein Deck — wähle Inhalte zum Üben.
          </p>
        ) : (
          <>
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: color.ink,
                letterSpacing: '-1px',
              }}
            >
              {s.known} / {s.total}
            </div>
            <div
              style={{
                fontFamily: font.sans,
                fontSize: 14,
                color: color.muted,
                marginTop: 4,
              }}
            >
              gewusst · {s.unknown} zum Wiederholen
            </div>
          </>
        )}
      </div>

      {lifetime.seen > 0 && (
        <p
          style={{
            fontFamily: font.sans,
            fontSize: 12.5,
            color: color.faint,
            margin: 0,
          }}
        >
          Insgesamt: {lifetime.seen} gesehen · {lifetime.known} gewusst
        </p>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={bigButton('#e7e5e0', '#1c1917')}>
          Zurück
        </button>
        {!empty && (
          <button onClick={onAgain} style={bigButton('#1c1917', '#faf9f7')}>
            Nochmal üben
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Small labelled field wrapper ──────────────────────────────────────────────
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: font.sans,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: color.faint,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}
