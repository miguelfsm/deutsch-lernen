import { useMemo, useState, type FormEvent } from 'react'
import SpeakButton from '../../components/SpeakButton'
import { font, color } from '../../lib/theme'
import { verbData, type Verb } from '../verbs/data'
import { getHighlightParts } from '../verbs/highlight'
import type { Tense } from '../verbs/tenses'
import { checkConjugation } from './drills'
import type { Session } from './session'

// Kept as its own component (rather than inline in PracticeTool.tsx) so a
// second drill being built in parallel elsewhere doesn't collide with this
// file — PracticeTool.tsx only imports it and owns the `tense` state (which
// must survive the per-card remount, so it can't live inside this component).

const STEM_RED = '#e03e2d'
const STEM_BLUE = '#1d6ef5'

const TENSES: { id: Tense; label: string }[] = [
  { id: 'praesens', label: 'Präsens' },
  { id: 'praeteritum', label: 'Präteritum' },
  { id: 'perfekt', label: 'Perfekt' },
]

// Whether the reveal for this pronoun/tense should use the red (stem change)
// or blue (regular ending) highlight. Präsens/Präteritum each carry their own
// per-pronoun `stemChange` flag — grading Präteritum must NOT reuse the
// Präsens table's flag, since the two tenses can disagree (e.g. essen: ich
// "esse" is regular in Präsens but "ass" is a strong-verb stem change in
// Präteritum). Perfekt has no per-pronoun flag (the aux form comes from
// haben/sein's own Präsens table, which is regular either way); its colour
// follows the Partizip II's own ending instead, the same heuristic
// GermanVerbs.tsx uses (-en = strong/irregular, -t = weak/regular).
function stemChangeFor(verb: Verb, pronoun: string, tense: Tense): boolean {
  if (tense === 'perfekt') return verb.perfekt.partizip.endsWith('en')
  const table = tense === 'praeteritum' ? verb.praeteritum : verb.conjugations
  return table.find((c) => c.pronoun === pronoun)?.stemChange ?? false
}

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

// Shared "Karte n / total" counter — duplicated from PracticeTool's private
// ProgressCounter (incidental style resemblance, not shared behaviour; see
// CLAUDE.md's DRY-of-behaviour principle).
function ProgressCounter({ session }: { session: Session }) {
  return (
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
  )
}

export default function ConjugationPlay({
  session,
  tense,
  onTense,
  onAnswer,
}: {
  session: Session
  tense: Tense
  onTense: (t: Tense) => void
  onAnswer: (known: boolean) => void
}) {
  const card = session.cards[session.index]
  const verb = card ? verbData.find((v) => v.infinitive === card.term) : undefined
  // One pronoun is drilled per card; pick it once so it survives re-renders and
  // the input's controlled state. Keyed by card via the parent's `key`. The
  // pronoun set is the same across all three tenses, so Präsens's table is a
  // fine source regardless of which tense is being drilled.
  const conj = useMemo(
    () => (verb ? verb.conjugations[Math.floor(Math.random() * verb.conjugations.length)] : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [card?.id],
  )
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!card || !verb || !conj) return null

  const result = checkConjugation(verb, conj.pronoun, input, tense)
  // On reveal, Präsens/Präteritum split into stem (unchanged) + the highlighted
  // ending/vowel change; Perfekt's expected is a two-word phrase ("bist
  // gefahren"), so it's split on the space into aux + partizip instead (the
  // partizip is always a single token, so this is exact, not a heuristic).
  const parts =
    tense !== 'perfekt'
      ? getHighlightParts(verb.infinitive, result.expected, verb.customStem)
      : null
  const perfektReveal =
    tense === 'perfekt' ? { aux: result.expected.slice(0, -verb.perfekt.partizip.length - 1), partizip: verb.perfekt.partizip } : null
  const hlColor = stemChangeFor(verb, conj.pronoun, tense) ? STEM_RED : STEM_BLUE

  function submit(e: FormEvent) {
    e.preventDefault()
    if (input.trim() === '' || submitted) return
    setSubmitted(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProgressCounter session={session} />

      <div
        role="group"
        aria-label="Zeitform"
        style={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          background: '#e7e5e0',
          borderRadius: 99,
          padding: 4,
          width: 'fit-content',
          margin: '0 auto',
          fontFamily: font.sans,
        }}
      >
        {TENSES.map((t) => {
          const active = t.id === tense
          return (
            <button
              key={t.id}
              onClick={() => onTense(t.id)}
              aria-pressed={active}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                border: 'none',
                background: active ? '#1c1917' : 'transparent',
                color: active ? '#faf9f7' : '#57534e',
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${color.cardBorder}`,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '28px 22px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: color.ink, letterSpacing: '-0.5px' }}>
            {verb.infinitive}
          </span>
          <SpeakButton text={verb.infinitive} size={20} />
        </div>
        <span style={{ fontFamily: font.sans, fontSize: 16, color: color.muted, fontStyle: 'italic' }}>
          {conj.pronoun} …
        </span>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitted}
          aria-label={`Konjugation von ${verb.infinitive} für ${conj.pronoun}`}
          placeholder={tense === 'perfekt' ? 'z.B. bist gefahren' : 'Form eingeben…'}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: `1.5px solid ${
              submitted ? (result.correct ? '#10b981' : '#ef4444') : color.cardBorder
            }`,
            background: submitted ? (result.correct ? '#d1fae5' : '#fee2e2') : '#ffffff',
            color: color.ink,
            fontSize: 17,
            fontFamily: font.sans,
            fontWeight: 600,
            textAlign: 'center',
            outline: 'none',
          }}
        />

        {!submitted ? (
          <button
            type="submit"
            disabled={input.trim() === ''}
            style={{
              ...bigButton('#e7e5e0', '#1c1917'),
              flex: 'unset',
              opacity: input.trim() === '' ? 0.5 : 1,
            }}
          >
            Prüfen · Check
          </button>
        ) : (
          <>
            <div style={{ fontFamily: font.sans, fontSize: 15, textAlign: 'center', color: color.muted }}>
              {result.correct ? (
                <span style={{ color: '#065f46', fontWeight: 700 }}>Richtig!</span>
              ) : (
                <span>
                  {conj.pronoun}{' '}
                  {parts ? (
                    <span style={{ fontWeight: 700, color: color.ink }}>
                      {parts.unchanged}
                      <span style={{ color: hlColor }}>{parts.changed}</span>
                    </span>
                  ) : (
                    perfektReveal && (
                      <span style={{ fontWeight: 700, color: color.ink }}>
                        {perfektReveal.aux}{' '}
                        <span style={{ color: hlColor }}>{perfektReveal.partizip}</span>
                      </span>
                    )
                  )}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onAnswer(result.correct)}
              style={{ ...bigButton('#1c1917', '#faf9f7'), flex: 'unset' }}
            >
              Weiter →
            </button>
          </>
        )}
      </form>
    </div>
  )
}
