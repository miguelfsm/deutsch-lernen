import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
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
  type PracticeMode,
  type Session,
} from './session'
import { buildChoices, type Choice } from './quiz'
import { checkArticle, checkConjugation } from './drills'
import { nounData, type Article } from '../nouns/data'
import { verbData } from '../verbs/data'
import { getHighlightParts } from '../verbs/highlight'
import { nounSlug } from '../../lib/catalog/slug'
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

const MODES: { id: PracticeMode; label: string }[] = [
  { id: 'flashcard', label: 'Karten · Flashcards' },
  { id: 'quiz', label: 'Quiz · Multiple choice' },
  { id: 'article', label: 'Artikel · der/die/das' },
  { id: 'conjugation', label: 'Konjugation · type it' },
]

// The two drills bind to exactly one content set each (articles → nouns,
// conjugation → verbs), so they ignore the direction / content-set pickers. A
// blank means "not a drill" (flashcards/quiz use the user's picks instead).
const DRILL_TOOL: Partial<Record<PracticeMode, string>> = {
  article: 'nomen',
  conjugation: 'verben',
}

// Gender colours reused from GermanNouns so the article feedback matches the
// noun tool (der=blue, die=red, das=green).
const ARTICLE_COLOR: Record<Article, { bg: string; fg: string; border: string }> = {
  der: { bg: '#dbeafe', fg: '#1e40af', border: '#3b82f6' },
  die: { bg: '#fee2e2', fg: '#991b1b', border: '#ef4444' },
  das: { bg: '#d1fae5', fg: '#065f46', border: '#10b981' },
}
const ARTICLES: Article[] = ['der', 'die', 'das']

// Stem-change highlight colours reused from GermanVerbs (red = vowel/stem change,
// blue = regular ending) for the conjugation reveal.
const STEM_RED = '#e03e2d'
const STEM_BLUE = '#1d6ef5'

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
  const [mode, setMode] = useState<PracticeMode>('flashcard')
  const [session, setSession] = useState<Session | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [lifetime, setLifetime] = useState<ProgressEntry>(() =>
    totals(loadProgress()),
  )

  // Re-tapping the "Üben" nav link while already on /uben doesn't remount this
  // component, so a running round would otherwise stay put. Each nav click mints a
  // fresh location.key (react-router does a history.replace even for the same
  // path), so keying on it returns the user to the selection menu — and refreshes
  // the lifetime tally, which a completed round may have advanced.
  const location = useLocation()
  useEffect(() => {
    setSession(null)
    setRevealed(false)
    setLifetime(totals(loadProgress()))
  }, [location.key])

  // A drill fixes its deck to one content set; flashcards/quiz use the picks.
  const drillTool = DRILL_TOOL[mode]
  const deckSets = drillTool ? new Set([drillTool]) : selected
  const deckSize = filterByTools(catalog, deckSets).length

  function toggleSet(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function start() {
    setSession(createSession(filterByTools(catalog, deckSets), direction, mode))
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
      <Header eyebrow="Üben · Practice" title="Übungen" />

      {session === null && (
        <SetupScreen
          selected={selected}
          onToggle={toggleSet}
          direction={direction}
          onDirection={setDirection}
          mode={mode}
          onMode={setMode}
          isDrill={!!drillTool}
          deckSize={deckSize}
          onStart={start}
          lifetime={lifetime}
        />
      )}

      {session !== null &&
        !isComplete(session) &&
        !isEmpty(session) &&
        renderPlay(session, revealed, setRevealed, rate)}

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

// Dispatch the active mode to its play view. Drills key on session.index so each
// item's local state (picked article / typed input) resets between cards.
function renderPlay(
  session: Session,
  revealed: boolean,
  setRevealed: (v: boolean) => void,
  rate: (known: boolean) => void,
) {
  switch (session.mode) {
    case 'flashcard':
      return (
        <FlashcardPlay
          session={session}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onRate={rate}
        />
      )
    case 'quiz':
      return <QuizPlay key={session.index} session={session} onAnswer={rate} />
    case 'article':
      return <ArticlePlay key={session.index} session={session} onAnswer={rate} />
    case 'conjugation':
      return (
        <ConjugationPlay key={session.index} session={session} onAnswer={rate} />
      )
  }
}

// ─── Setup ──────────────────────────────────────────────────────────────────────
function SetupScreen({
  selected,
  onToggle,
  direction,
  onDirection,
  mode,
  onMode,
  isDrill,
  deckSize,
  onStart,
  lifetime,
}: {
  selected: Set<string>
  onToggle: (id: string) => void
  direction: Direction
  onDirection: (d: Direction) => void
  mode: PracticeMode
  onMode: (m: PracticeMode) => void
  isDrill: boolean
  deckSize: number
  onStart: () => void
  lifetime: ProgressEntry
}) {
  // Drills pick their own content set and have no DE↔EN direction, so those
  // fields are hidden — and their deck is never empty, so no empty-state applies.
  const nothingSelected = !isDrill && selected.size === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Field label="Modus · Mode">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => onMode(m.id)}
              style={pill(mode === m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Field>

      {!isDrill && (
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
      )}

      {!isDrill && (
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
      )}

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

// ─── Flashcard play (reveal + self-rate) ───────────────────────────────────────
function FlashcardPlay({
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

// ─── Quiz play (multiple choice, objectively graded) ───────────────────────────
function QuizPlay({
  session,
  onAnswer,
}: {
  session: Session
  onAnswer: (known: boolean) => void
}) {
  const card = currentCard(session)
  // Choices are built once per card (not per render) so they don't reshuffle when
  // the user picks. Injected RNG defaults to Math.random here; the pure builder is
  // unit-tested deterministically.
  const choices = useMemo(
    () => (card ? buildChoices(card, session.cards, session.direction) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [card?.id],
  )
  const [picked, setPicked] = useState<Choice | null>(null)

  if (!card) return null

  const prompt = promptText(card, session.direction)
  const promptIsGerman = session.direction === 'de-en'

  function choiceStyle(c: Choice) {
    const base = {
      padding: '12px 16px',
      borderRadius: 12,
      border: `1.5px solid ${color.cardBorder}`,
      background: '#ffffff',
      color: color.ink,
      fontSize: 15,
      fontFamily: font.sans,
      fontWeight: 600,
      cursor: picked ? 'default' : 'pointer',
      textAlign: 'left' as const,
      transition: 'all 0.12s',
    }
    if (!picked) return base
    // After answering: correct → green; the wrong one the user picked → red; rest dim.
    if (c.correct) return { ...base, background: '#d1fae5', color: '#065f46', borderColor: '#10b981' }
    if (c === picked) return { ...base, background: '#fee2e2', color: '#991b1b', borderColor: '#ef4444' }
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: color.ink,
            letterSpacing: '-0.5px',
          }}
        >
          {prompt}
        </span>
        {promptIsGerman && <SpeakButton text={card.term} size={20} />}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {choices.map((c) => (
          <button
            key={c.text}
            disabled={picked !== null}
            onClick={() => setPicked(c)}
            style={choiceStyle(c)}
          >
            {c.text}
          </button>
        ))}
      </div>

      {picked && (
        <>
          {/* When the German is the ANSWER (en-de), the prompt carried no 🔊 —
              offer it here on reveal so both directions can hear the German,
              mirroring the German-prompt speaker in de-en. */}
          {!promptIsGerman && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: font.sans,
                fontSize: 16,
                fontWeight: 700,
                color: '#065f46',
              }}
            >
              <span>{card.term}</span>
              <SpeakButton text={card.term} size={18} />
            </div>
          )}
          <button
            onClick={() => onAnswer(picked.correct)}
            style={{ ...bigButton('#1c1917', '#faf9f7'), flex: 'unset' }}
          >
            Weiter →
          </button>
        </>
      )}
    </div>
  )
}

// ─── Article drill (guess der/die/das) ─────────────────────────────────────────
function ArticlePlay({
  session,
  onAnswer,
}: {
  session: Session
  onAnswer: (known: boolean) => void
}) {
  const card = currentCard(session)
  // Resolve the full Noun (the catalog entry carries no gender). Match on the
  // slug so identity is (singular, category), never the ambiguous singular alone.
  const noun = card
    ? nounData.find((n) => nounSlug(n.singular, n.category) === card.slug)
    : undefined
  const [picked, setPicked] = useState<Article | null>(null)

  if (!card || !noun) return null
  const target = noun // narrowed binding the style closure can safely capture
  const correct = picked !== null && checkArticle(target, picked)

  function articleStyle(a: Article) {
    const c = ARTICLE_COLOR[a]
    const base = {
      flex: 1,
      padding: '14px 8px',
      borderRadius: 12,
      border: `1.5px solid ${color.cardBorder}`,
      background: '#ffffff',
      color: color.ink,
      fontSize: 17,
      fontFamily: font.sans,
      fontWeight: 700,
      cursor: picked ? 'default' : 'pointer',
      transition: 'all 0.12s',
    }
    if (!picked) return base
    // After answering: the correct article always lights up green-in-its-own
    // colour; a wrong pick the user made is outlined in its gender colour; rest dim.
    if (a === target.article) return { ...base, background: c.bg, color: c.fg, borderColor: c.border }
    if (a === picked) return { ...base, background: c.bg, color: c.fg, borderColor: c.border, opacity: 0.85 }
    return { ...base, opacity: 0.45 }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProgressCounter session={session} />

      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${color.cardBorder}`,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '28px 22px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 700, color: color.ink, letterSpacing: '-0.5px' }}>
          {noun.singular}
        </span>
        <SpeakButton text={`${noun.article} ${noun.singular}`} size={20} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {ARTICLES.map((a) => (
          <button key={a} disabled={picked !== null} onClick={() => setPicked(a)} style={articleStyle(a)}>
            {a}
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
              fontWeight: 700,
            }}
          >
            {correct ? 'Richtig!' : `${noun.article} ${noun.singular}`}
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

// ─── Conjugation drill (type the form) ─────────────────────────────────────────
function ConjugationPlay({
  session,
  onAnswer,
}: {
  session: Session
  onAnswer: (known: boolean) => void
}) {
  const card = currentCard(session)
  const verb = card ? verbData.find((v) => v.infinitive === card.term) : undefined
  // One pronoun is drilled per card; pick it once so it survives re-renders and
  // the input's controlled state. Keyed by card via the parent's `key`.
  const conj = useMemo(
    () => (verb ? verb.conjugations[Math.floor(Math.random() * verb.conjugations.length)] : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [card?.id],
  )
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!card || !verb || !conj) return null

  const result = checkConjugation(verb, conj.pronoun, input)
  // On reveal, split the expected form into stem (unchanged) + the highlighted
  // ending/vowel change, coloured red for a stem change and blue for a regular one.
  const parts = getHighlightParts(verb.infinitive, result.expected, verb.customStem)
  const hlColor = conj.stemChange ? STEM_RED : STEM_BLUE

  function submit(e: FormEvent) {
    e.preventDefault()
    if (input.trim() === '' || submitted) return
    setSubmitted(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProgressCounter session={session} />

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
          placeholder="Form eingeben…"
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
                  <span style={{ fontWeight: 700, color: color.ink }}>
                    {parts.unchanged}
                    <span style={{ color: hlColor }}>{parts.changed}</span>
                  </span>
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

// Shared "Karte n / total" counter used by every play view.
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
