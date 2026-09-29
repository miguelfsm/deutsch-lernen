import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { font, color } from '../lib/theme'
import { lessons } from '../content/lessons'
import { lwsFiles } from '../content/lws'
import { catalog } from '../lib/catalog'
import { lessonCoverage, coveragePercent } from '../lib/lessons/coverage'
import { lessonColor } from '../lib/lessons/colors'
import { entriesForLesson } from '../lib/lessons/entriesForLesson'

// One lesson's page (plan §4.1, mock screen *Lektion 8*): the book's own
// table-of-contents header (sections A–E, Wortfelder/Phonetik/Prüfung/Fokus),
// a coverage line + practice shortcut, then everything tagged for this lesson
// grouped by word class. Every content chip deep-links into its own tool.
export default function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lesson = lessons.find((l) => l.id === id)

  if (!lesson) {
    return (
      <div
        style={{
          fontFamily: font.serif,
          maxWidth: 560,
          margin: '0 auto',
          padding: '20px 16px 40px',
          background: color.canvas,
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Header eyebrow="Kursbuch" title="Lektion nicht gefunden" />
        <p style={{ fontFamily: font.sans, fontSize: 14, color: color.muted }}>
          „{id}“ ist keine bekannte Lektion.
        </p>
        <Link
          to="/lektionen"
          style={{ fontFamily: font.sans, fontSize: 14, color: color.ink, fontWeight: 700 }}
        >
          ← Zurück zu den Lektionen
        </Link>
      </div>
    )
  }

  const bg = lessonColor(lesson.id)
  const raw = lwsFiles[lesson.id]
  const coverage = raw ? lessonCoverage(raw.split(/\r?\n/), catalog, lesson.id) : undefined
  const groups = entriesForLesson(catalog, lesson.id)

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
      <Link
        to="/lektionen"
        style={{
          display: 'inline-block',
          fontFamily: font.sans,
          fontSize: 13,
          color: color.muted,
          textDecoration: 'none',
          marginBottom: 12,
        }}
      >
        ← Lektionen
      </Link>

      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${color.cardBorder}`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ background: bg, color: '#ffffff', padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
          {lesson.number !== undefined && (
            <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1, fontFamily: font.sans }}>
              {lesson.number}
            </span>
          )}
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>{lesson.title}</div>
            {lesson.folge && (
              <div style={{ fontFamily: font.sans, fontSize: 13, opacity: 0.9, marginTop: 3 }}>
                {lesson.level}
                {lesson.number !== undefined ? ` · Folge ${lesson.number}: ${lesson.folge}` : ''}
              </div>
            )}
          </div>
        </div>

        {lesson.sections.length > 0 && (
          <div>
            {lesson.sections.map((s) => (
              <div
                key={s.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr',
                  gap: 8,
                  padding: '9px 22px',
                  borderTop: `1px solid ${color.line}`,
                  fontFamily: font.sans,
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: 700, color: color.faint }}>{s.key}</span>
                <div>
                  <div style={{ fontWeight: 700, color: color.ink, fontFamily: font.serif, fontSize: 14 }}>
                    {s.title}
                  </div>
                  {s.goals.length > 0 && (
                    <div style={{ color: color.muted, marginTop: 2 }}>{s.goals.join(' · ')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <MetaRow lesson={lesson} />

        <div
          style={{
            padding: '14px 22px',
            borderTop: `1px solid ${color.line}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontFamily: font.sans, fontSize: 12, color: color.muted, marginBottom: 5 }}>
              {coverage ? (
                <>
                  Lernwortschatz
                  {lesson.pages?.lws ? ` (S. ${lesson.pages.lws})` : ''}:{' '}
                  <b style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {coverage.tagged} / {coverage.total}
                  </b>{' '}
                  Wörter in der App
                </>
              ) : (
                'Wortschatz noch nicht geprüft'
              )}
            </div>
            {coverage && (
              <div style={{ height: 7, background: '#eeeae4', borderRadius: 99, overflow: 'hidden' }}>
                <span
                  style={{
                    display: 'block',
                    height: '100%',
                    borderRadius: 99,
                    // Clamped to ≤100% as a safety net (see coveragePercent).
                    width: `${coveragePercent(coverage)}%`,
                    background: bg,
                  }}
                />
              </div>
            )}
          </div>
          <Link
            to={`/uben?lektion=${encodeURIComponent(lesson.id)}`}
            style={{
              fontFamily: font.sans,
              fontSize: 13.5,
              fontWeight: 700,
              padding: '10px 16px',
              borderRadius: 12,
              background: color.ink,
              color: '#faf9f7',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Diese Lektion üben →
          </Link>
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.label} style={{ marginTop: 22 }}>
          <h2
            style={{
              fontFamily: font.sans,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: color.muted,
              fontWeight: 700,
              margin: '0 0 10px',
            }}
          >
            {g.label}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {g.entries.map((e) => (
              <Link
                key={e.id}
                to={`${e.route}?sel=${encodeURIComponent(e.slug)}`}
                style={{
                  fontFamily: font.sans,
                  fontSize: 13,
                  padding: '6px 11px',
                  borderRadius: 10,
                  border: `1px solid ${color.cardBorder}`,
                  background: '#ffffff',
                  color: color.ink,
                  textDecoration: 'none',
                }}
              >
                {e.term}
                <small style={{ color: color.faint, fontStyle: 'italic', marginLeft: 4 }}>{e.gloss}</small>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function MetaRow({ lesson }: { lesson: (typeof lessons)[number] }) {
  const rows: [string, string][] = []
  if (lesson.wortfelder.length > 0) rows.push(['Wortfelder', lesson.wortfelder.join(' · ')])
  if (lesson.phonetik && lesson.phonetik.length > 0) rows.push(['Phonetik', lesson.phonetik.join(' · ')])
  if (lesson.pruefung && lesson.pruefung.length > 0) rows.push(['Prüfung', lesson.pruefung.join(' · ')])
  if (lesson.fokus && lesson.fokus.length > 0) rows.push(['Fokus', lesson.fokus.join(' · ')])
  if (rows.length === 0) return null

  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr',
        gap: '6px 12px',
        padding: '12px 22px',
        borderTop: `1px solid ${color.line}`,
        background: color.cardRaise,
        fontFamily: font.sans,
        fontSize: 12.5,
        margin: 0,
      }}
    >
      {rows.map(([k, v]) => (
        <MetaEntry key={k} k={k} v={v} />
      ))}
    </dl>
  )
}

function MetaEntry({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt style={{ color: color.faint, textTransform: 'uppercase', letterSpacing: 1, fontSize: 10.5, paddingTop: 2 }}>
        {k}
      </dt>
      <dd style={{ margin: 0, color: color.muted }}>{v}</dd>
    </>
  )
}
