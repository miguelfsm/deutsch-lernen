import { Link } from 'react-router-dom'
import type { CatalogEntry } from '../lib/catalog/types'
import { font } from '../lib/theme'

// Inline chips linking an example to a word the app teaches elsewhere: a card
// whose sentence uses a known verb gets a "→ Konjugation" chip, a known noun a
// "→ Nomen" chip. Only verbs and nouns are ever link targets (see resolver), so
// those are the only labels needed.
const CHIP: Record<string, { label: string; bg: string; fg: string }> = {
  verben: { label: 'Konjugation', bg: '#dbeafe', fg: '#1e40af' },
  nomen: { label: 'Nomen', bg: '#d1fae5', fg: '#065f46' },
}

// `entries` are already-resolved catalog entries (from linksForText). An unknown
// slug never reaches here — the resolver only ever yields real entries — so an
// empty list simply renders nothing (no dead chip, no crash).
export default function CrossLinks({ entries }: { entries: CatalogEntry[] }) {
  if (entries.length === 0) return null
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
      }}
    >
      {entries.map((e) => {
        const chip = CHIP[e.toolId]
        if (!chip) return null
        return (
          <Link
            key={e.id}
            to={`${e.route}?sel=${encodeURIComponent(e.slug)}`}
            aria-label={`${e.term} — ${chip.label} öffnen`}
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 99,
              background: chip.bg,
              color: chip.fg,
              textDecoration: 'none',
              fontFamily: font.sans,
              fontSize: 12,
            }}
          >
            <span style={{ fontWeight: 700 }}>→ {e.term}</span>
            <span
              style={{
                fontSize: 9.5,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                opacity: 0.75,
              }}
            >
              {chip.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
