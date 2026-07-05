import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalog } from '../lib/catalog'
import { searchCatalog } from '../lib/catalog/search'
import type { CatalogEntry } from '../lib/catalog/types'
import { tools } from '../tools/registry'
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
  const trimmed = query.trim()

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
      {trimmed && results.length === 0 && (
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
