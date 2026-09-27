import { useState } from 'react'
import Header from '../../components/Header'
import SpeakButton from '../../components/SpeakButton'
import CrossLinks from '../../components/CrossLinks'
import { font, color } from '../../lib/theme'
import { useDeepSelect } from '../../lib/useDeepSelect'
import { slugify } from '../../lib/catalog/slug'
import { linksForText } from '../../lib/catalog/resolver'
import { prepositionData, type Case } from './data'
import { filterPrepositions, type CaseFilter, type UseFilter } from './filter'

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const CASE_META: Record<Case, { bg: string; fg: string; label: string }> = {
  Dativ: { bg: '#dbeafe', fg: '#1e40af', label: 'Dativ' },
  Akkusativ: { bg: '#ffe4e6', fg: '#9f1239', label: 'Akkusativ' },
  Wechsel: { bg: '#f3e8ff', fg: '#6b21a8', label: 'Wechsel' },
  ohne: { bg: '#f5f5f4', fg: '#57534e', label: 'ohne Fall' },
}

const CASE_OPTIONS: CaseFilter[] = ['Alle', 'Dativ', 'Akkusativ', 'Wechsel', 'ohne']
const USE_OPTIONS: UseFilter[] = ['Alle', 'temporal', 'lokal', 'modal']

// The article table for the two fixed-case groups — bestimmt (definite) and
// unbestimmt (indefinite) — shown when a card for that case expands.
const ARTICLE_TABLE: Record<'Dativ' | 'Akkusativ', { g: string; def: string; indef: string }[]> = {
  Dativ: [
    { g: 'm', def: 'dem', indef: 'einem' },
    { g: 'n', def: 'dem', indef: 'einem' },
    { g: 'f', def: 'der', indef: 'einer' },
    { g: 'Pl', def: 'den …n', indef: '— …n' },
  ],
  Akkusativ: [
    { g: 'm', def: 'den', indef: 'einen' },
    { g: 'n', def: 'das', indef: 'ein' },
    { g: 'f', def: 'die', indef: 'eine' },
    { g: 'Pl', def: 'die', indef: '—' },
  ],
}

const pill = (active: boolean, meta?: { bg: string; fg: string }) => ({
  padding: '6px 14px',
  borderRadius: 99,
  border: active ? `2px solid ${meta?.fg ?? '#78716c'}` : '2px solid transparent',
  background: active ? (meta?.bg ?? '#1c1917') : '#e7e5e0',
  color: active ? (meta?.fg ?? '#faf9f7') : '#57534e',
  fontSize: 13,
  fontFamily: font.sans,
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
  transition: 'all 0.12s',
})

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function GermanPrepositions() {
  const deepSelected = useDeepSelect(prepositionData, (p) => slugify(p.word))
  const [caseFilter, setCaseFilter] = useState<CaseFilter>('Alle')
  const [useFilter, setUseFilter] = useState<UseFilter>('Alle')
  const [openWord, setOpenWord] = useState<string | null>(() => deepSelected?.word ?? null)

  const visible = filterPrepositions(prepositionData, caseFilter, useFilter)

  function toggleOpen(word: string) {
    setOpenWord((prev) => (prev === word ? null : word))
  }

  function pickCase(c: CaseFilter) {
    setCaseFilter(c)
  }

  function pickUse(u: UseFilter) {
    setUseFilter(u)
  }

  return (
    <div
      style={{
        fontFamily: font.serif,
        maxWidth: 560,
        margin: '0 auto',
        padding: '20px 16px 40px',
        background: color.canvas,
        minHeight: '100vh',
      }}
    >
      <Header eyebrow="A1 · Präpositionen" title="Präpositionen" />

      <FilterLabel>Fall</FilterLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {CASE_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => pickCase(c)}
            aria-pressed={caseFilter === c}
            style={pill(caseFilter === c, c !== 'Alle' ? CASE_META[c] : undefined)}
          >
            {c === 'ohne' ? 'ohne Fall' : c}
          </button>
        ))}
      </div>

      <FilterLabel>Gebrauch</FilterLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {USE_OPTIONS.map((u) => (
          <button key={u} onClick={() => pickUse(u)} aria-pressed={useFilter === u} style={pill(useFilter === u)}>
            {u}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ fontFamily: font.sans, fontSize: 14, color: color.faint, fontStyle: 'italic', textAlign: 'center' }}>
          Keine Präposition mit diesem Filter.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visible.map((p) => {
            const open = openWord === p.word
            const meta = CASE_META[p.case]
            return (
              <div
                key={p.word}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${color.cardBorder}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                }}
              >
                {/* A `div[role=button]`, not a real `<button>`: the row also
                    hosts SpeakButton, and a `<button>` cannot nest another
                    interactive `<button>` (invalid HTML / a11y tree). */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleOpen(p.word)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleOpen(p.word)
                    }
                  }}
                  aria-expanded={open}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: color.ink, letterSpacing: '-0.5px' }}>
                        {p.word}
                      </span>
                      {/* Stop the click from also toggling the card open/closed. */}
                      <span onClick={(e) => e.stopPropagation()}>
                        <SpeakButton text={p.word} size={16} />
                      </span>
                    </span>
                    <div style={{ fontFamily: font.sans, fontSize: 12.5, color: color.muted, marginTop: 2 }}>
                      {p.question} · {p.use.join(', ')}
                    </div>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
                    <span
                      style={{
                        fontFamily: font.sans,
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        padding: '3px 9px',
                        borderRadius: 99,
                        background: meta.bg,
                        color: meta.fg,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.case === 'ohne' ? 'ohne Fall' : `+ ${p.case}`}
                    </span>
                    <LessonTags lessons={p.lessons} />
                  </span>
                </div>

                {open && (
                  <div style={{ borderTop: `1px solid ${color.line}` }}>
                    {p.case === 'Wechsel' && (
                      <div
                        style={{
                          padding: '12px 18px',
                          borderBottom: `1px solid ${color.line}`,
                          background: CASE_META.Wechsel.bg,
                          color: CASE_META.Wechsel.fg,
                          fontFamily: font.sans,
                          fontSize: 13.5,
                          lineHeight: 1.55,
                        }}
                      >
                        <b>Wo?</b> → Dativ (im Park) · <b>Wohin?</b> → Akkusativ (in den Park)
                      </div>
                    )}
                    {(p.case === 'Dativ' || p.case === 'Akkusativ') && (
                      <ArticleTable rows={ARTICLE_TABLE[p.case]} />
                    )}

                    {p.examples.map((ex, i) => (
                      <div key={i} style={{ padding: '10px 18px', fontFamily: font.sans, borderTop: i > 0 ? `1px solid ${color.line}` : undefined }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: color.ink, fontWeight: 600 }}>
                          <span>{ex.de}</span>
                          <SpeakButton text={ex.de} />
                        </div>
                        <div style={{ fontSize: 12.5, color: color.faint, marginTop: 2, fontStyle: 'italic' }}>
                          {ex.en}
                        </div>
                        <CrossLinks entries={linksForText(ex.de)} />
                      </div>
                    ))}

                    {p.contractions && p.contractions.length > 0 && (
                      <div
                        style={{
                          padding: '10px 18px',
                          borderTop: `1px solid ${color.line}`,
                          fontSize: 12.5,
                          color: color.muted,
                          fontFamily: font.sans,
                        }}
                      >
                        <span style={{ marginRight: 6 }}>🔗</span>
                        Auch als Kontraktion: {p.contractions.join(' · ')}
                      </div>
                    )}

                    {p.note && (
                      <div
                        style={{
                          padding: '10px 18px',
                          background: color.canvas,
                          borderTop: `1px solid ${color.line}`,
                          fontSize: 12.5,
                          color: color.muted,
                          lineHeight: 1.6,
                          fontFamily: font.sans,
                        }}
                      >
                        <span style={{ marginRight: 6 }}>💡</span>
                        {p.note}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: font.sans,
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: color.faint,
        marginBottom: 5,
      }}
    >
      {children}
    </div>
  )
}

function LessonTags({ lessons }: { lessons: string[] }) {
  return (
    <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      {lessons.map((l) => (
        <span
          key={l}
          style={{
            fontFamily: font.sans,
            fontSize: 9.5,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 99,
            background: color.canvas,
            color: color.muted,
            border: `1px solid ${color.cardBorder}`,
          }}
        >
          {l}
        </span>
      ))}
    </span>
  )
}

function ArticleTable({ rows }: { rows: { g: string; def: string; indef: string }[] }) {
  return (
    <div style={{ overflowX: 'auto', borderBottom: `1px solid ${color.line}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: color.cardRaise }}>
            <th style={thStyle}></th>
            <th style={thStyle}>bestimmt</th>
            <th style={thStyle}>unbestimmt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.g} style={{ borderTop: `1px solid ${color.line}` }}>
              <td style={{ ...tdStyle, fontFamily: font.sans, color: color.faint, fontStyle: 'italic' }}>{r.g}</td>
              <td style={tdStyle}>{r.def}</td>
              <td style={tdStyle}>{r.indef}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = {
  padding: '7px 18px',
  textAlign: 'left' as const,
  fontSize: 10,
  color: color.faint,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  fontFamily: font.sans,
}

const tdStyle = {
  padding: '8px 18px',
  fontSize: 15,
  color: color.ink,
}
