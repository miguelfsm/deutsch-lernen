import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalog } from '../lib/catalog'
import { searchCatalog } from '../lib/catalog/search'
import type { CatalogEntry } from '../lib/catalog/types'
import { tools } from '../tools/registry'
import { searchLessons, type LessonSearchHit } from '../lib/lessons/searchLessons'
import { lessonColor } from '../lib/lessons/colors'
import Header from './Header'
import { font, color } from '../lib/theme'

// Human-readable group heading per tool, in the registry's order, derived from
// the registry so a new searchable tool needs zero edits here.
const TOOL_LABEL = new Map(tools.map((t) => [t.path.replace(/^\//, ''), t.label]))
const TOOL_ORDER = tools.map((t) => t.path.replace(/^\//, ''))

function groupByTool(results: CatalogEntry[]): [string, CatalogEntry[]][] {
  const groups = new Map<string, CatalogEntry[]>()
  for (const r of results) {
    const list = groups.get(r.toolId)
    if (list) list.push(r)
    else groups.set(r.toolId, [r])
  }
  // Keep registry order; any unknown toolId (shouldn't happen) sorts last.
  return [...groups.entries()].sort(
    ([a], [b]) => TOOL_ORDER.indexOf(a) - TOOL_ORDER.indexOf(b),
  )
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchCatalog(catalog, query), [query])
  const groups = useMemo(() => groupByTool(results), [results])
  // A lesson query ("lektion 8", "l8", …) gets a lesson hit + preview ahead of
  // (or instead of) the ordinary by-tool results (plan §4.2, mock U7).
  const lessonHits = useMemo(() => searchLessons(query, catalog), [query])
  const trimmed = query.trim()
  const noResults = !!trimmed && results.length === 0 && lessonHits.length === 0

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
      <Header eyebrow="Suchen · Search" title="Search all tools" />

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Suchen… (z. B. schlafen, to sleep, das Bild)"
        aria-label="Alles durchsuchen"
        autoFocus
        style={{
          display: 'block',
          width: '100%',
          maxWidth: 340,
          margin: '0 auto 22px',
          padding: '9px 16px',
          borderRadius: 99,
          border: `1.5px solid ${color.cardBorder}`,
          background: '#ffffff',
          fontFamily: font.sans,
          fontSize: 14,
          color: color.ink,
          textAlign: 'center',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {/* Empty query → nothing (deliberate: no whole-catalog dump). */}
      {noResults && (
        <p
          style={{
            textAlign: 'center',
            fontFamily: font.sans,
            fontSize: 14,
            color: color.faint,
            fontStyle: 'italic',
          }}
        >
          Keine Treffer für „{trimmed}“
        </p>
      )}

      {lessonHits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {lessonHits.map((hit) => (
            <LessonHit key={hit.lesson.id} hit={hit} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map(([toolId, entries]) => (
          <section key={toolId}>
            <h2
              style={{
                fontFamily: font.sans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: color.faint,
                margin: '0 0 8px',
              }}
            >
              {TOOL_LABEL.get(toolId) ?? toolId}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {entries.map((e) => (
                <Link
                  key={e.id}
                  to={`${e.route}?sel=${encodeURIComponent(e.slug)}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 12,
                    padding: '10px 16px',
                    background: '#ffffff',
                    border: `1px solid ${color.cardBorder}`,
                    borderRadius: 12,
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: color.ink,
                      letterSpacing: '-0.3px',
                    }}
                  >
                    {e.term}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: color.muted,
                      fontStyle: 'italic',
                      fontFamily: font.sans,
                      textAlign: 'right',
                    }}
                  >
                    {e.gloss}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// A lesson search hit (plan §4.2, mock U7): the lesson itself, linking to its
// page, then a short preview (≤3 items per word-class group, from
// `searchLessons`) and a link to see everything on the lesson page.
function LessonHit({ hit }: { hit: LessonSearchHit }) {
  const { lesson, preview, totalCount } = hit
  const previewCount = preview.reduce((n, g) => n + g.entries.length, 0)
  const remaining = totalCount - previewCount

  return (
    <div
      style={{
        background: '#ffffff',
        border: `1px solid ${color.cardBorder}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      }}
    >
      <Link
        to={`/lektionen/${lesson.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '12px 16px',
          background: color.canvas,
          textDecoration: 'none',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: font.sans,
              fontSize: 11,
              fontWeight: 700,
              color: '#ffffff',
              background: lessonColor(lesson.id),
              borderRadius: 99,
              padding: '2px 9px',
            }}
          >
            {lesson.number !== undefined ? `L${lesson.number}` : lesson.id}
          </span>
          <span>
            <div style={{ fontFamily: font.serif, fontSize: 16, fontWeight: 700, color: color.ink }}>
              Lektion {lesson.number ?? lesson.id} · {lesson.title}
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 12, color: color.muted }}>
              {lesson.level}
              {lesson.folge ? ` · Folge ${lesson.number}: ${lesson.folge}` : ''} · {totalCount} Einträge
            </div>
          </span>
        </span>
        <span style={{ color: color.muted }}>→</span>
      </Link>

      {preview.map((g) => (
        <div key={g.label} style={{ borderTop: `1px solid ${color.line}` }}>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 10.5,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: color.faint,
              padding: '8px 16px 4px',
            }}
          >
            {g.label}
          </div>
          {g.entries.map((e) => (
            <Link
              key={e.id}
              to={`${e.route}?sel=${encodeURIComponent(e.slug)}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 10,
                padding: '7px 16px',
                fontFamily: font.sans,
                fontSize: 13.5,
                color: color.ink,
                textDecoration: 'none',
              }}
            >
              <span>{e.term}</span>
              <small style={{ color: color.faint, fontStyle: 'italic' }}>{e.gloss}</small>
            </Link>
          ))}
        </div>
      ))}

      {remaining > 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '10px 16px',
            borderTop: `1px solid ${color.line}`,
            fontFamily: font.sans,
            fontSize: 12.5,
            color: color.muted,
          }}
        >
          + {remaining} weitere ·{' '}
          <Link to={`/lektionen/${lesson.id}`} style={{ color: color.ink, fontWeight: 700 }}>
            Alle auf der Lektionsseite
          </Link>
        </div>
      )}
    </div>
  )
}
