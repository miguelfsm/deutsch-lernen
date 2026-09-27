import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { font, color } from '../lib/theme'
import { lessons } from '../content/lessons'
import { lwsFiles } from '../content/lws'
import { catalog } from '../lib/catalog'
import { lessonCoverage } from '../lib/lessons/coverage'
import { lessonColor } from '../lib/lessons/colors'

// Index of every lesson (plan §4.1, mock screen *Lektionen*): one card per
// A1.2 lesson in the book's colours, plus the A1.1 "everything so far" bucket.
export default function LessonsIndex() {
  const a1_2 = lessons.filter((l) => l.level === 'A1.2')
  const a1_1 = lessons.find((l) => l.level === 'A1.1' && l.id === 'A1.1')

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
      <Header eyebrow="Kursbuch" title="Lektionen" />
      <p
        style={{
          fontFamily: font.sans,
          fontSize: 13.5,
          color: color.muted,
          textAlign: 'center',
          margin: '0 0 22px',
        }}
      >
        Pick a lesson to see everything it covers.
      </p>

      <SectionLabel>A1.2 · Lektion 8–14</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {a1_2.map((l) => {
          const raw = lwsFiles[l.id]
          const cov = raw ? lessonCoverage(raw.split(/\r?\n/), catalog, l.id) : undefined
          return (
            <Link
              key={l.id}
              to={`/lektionen/${l.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                alignItems: 'stretch',
                gap: 0,
                textDecoration: 'none',
                background: '#ffffff',
                border: `1px solid ${color.cardBorder}`,
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              }}
            >
              <span
                style={{
                  background: lessonColor(l.id),
                  color: '#ffffff',
                  fontFamily: font.sans,
                  fontWeight: 700,
                  fontSize: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {l.number}
              </span>
              <span style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: color.ink, letterSpacing: '-0.3px' }}>
                  {l.title}
                </span>
                <div style={{ fontFamily: font.sans, fontSize: 13, color: color.muted, marginTop: 2 }}>
                  Folge {l.number}{l.folge ? `: ${l.folge}` : ''}
                </div>
                {cov ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                    <span style={{ flex: 1, height: 7, background: '#eeeae4', borderRadius: 99, overflow: 'hidden' }}>
                      <span
                        style={{
                          display: 'block',
                          height: '100%',
                          borderRadius: 99,
                          width: `${cov.total > 0 ? Math.round((cov.tagged / cov.total) * 100) : 0}%`,
                          background: lessonColor(l.id),
                        }}
                      />
                    </span>
                    <span
                      style={{
                        fontFamily: font.sans,
                        fontSize: 11.5,
                        color: color.muted,
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cov.tagged}/{cov.total} Wörter
                    </span>
                  </div>
                ) : (
                  <div style={{ fontFamily: font.sans, fontSize: 11.5, color: color.faint, marginTop: 6 }}>
                    Wortschatz noch nicht geprüft
                  </div>
                )}
              </span>
            </Link>
          )
        })}
      </div>

      {a1_1 && (
        <>
          <SectionLabel>A1.1</SectionLabel>
          <Link
            to={`/lektionen/${a1_1.id}`}
            style={{
              display: 'block',
              textDecoration: 'none',
              background: '#ffffff',
              border: `1px solid ${color.cardBorder}`,
              borderRadius: 14,
              padding: '14px 18px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: color.ink }}>Alles aus A1.1</span>
              <LessonTag id="A1.1" />
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 13, color: color.muted, marginTop: 4 }}>
              Everything already in the app, in one bucket. Can be split into Lektion 1–7 later.
            </div>
          </Link>
        </>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
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
      {children}
    </h2>
  )
}

export function LessonTag({ id }: { id: string }) {
  return (
    <span
      style={{
        fontFamily: font.sans,
        fontSize: 10.5,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 99,
        background: color.canvas,
        color: color.muted,
        border: `1px solid ${color.cardBorder}`,
      }}
    >
      {id}
    </span>
  )
}
