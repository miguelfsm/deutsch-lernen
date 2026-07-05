import { useState, type ReactNode } from 'react'
import Header from './Header'
import SpeakButton from './SpeakButton'
import { font, color } from '../lib/theme'
import { useDeepSelect } from '../lib/useDeepSelect'
import { cardSlug } from '../lib/catalog/slug'

// Shared "category pills → list of cards" layout. Both the Adjectives and the
// Phrases tools are this exact view; they differ only in the headword field and
// an optional extra row (adjective opposites), passed in as props.

interface CardItem {
  meaning: string
  example: string
  translation: string
  note?: string
}

interface Category<T> {
  id: string
  label: string
  color: { bg: string; fg: string; dot: string }
  items: T[]
}

interface Props<T extends CardItem> {
  eyebrow: string
  title: string
  categories: Category<T>[]
  term: (item: T) => string
  extra?: (item: T) => ReactNode
}

export default function CategoryCardsTool<T extends CardItem>({
  eyebrow,
  title,
  categories,
  term,
  extra,
}: Props<T>) {
  // Deep-select seeds the active category from `?sel=categoryId/term`. These tools
  // list every item in a category at once, so a card is "pre-selected" by opening
  // its category (per-item highlight/scroll is out of scope for v1).
  const deepSelected = useDeepSelect(
    categories.flatMap((c) => c.items.map((item) => ({ catId: c.id, item }))),
    (f) => cardSlug(f.catId, term(f.item)),
  )
  const [activeCat, setActiveCat] = useState(
    () => deepSelected?.catId ?? categories[0].id,
  )
  const current = categories.find((c) => c.id === activeCat) ?? categories[0]

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
      <Header eyebrow={eyebrow} title={title} />

      {/* Category pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          justifyContent: 'center',
          marginBottom: 22,
        }}
      >
        {categories.map((c) => {
          const active = c.id === activeCat
          return (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 99,
                border: active
                  ? `2px solid ${c.color.dot}`
                  : '2px solid transparent',
                background: c.color.bg,
                color: c.color.fg,
                fontSize: 13,
                fontFamily: font.serif,
                fontWeight: active ? 800 : 400,
                cursor: 'pointer',
                transition: 'all 0.12s',
                opacity: active ? 1 : 0.55,
                outline: active ? `3px solid ${c.color.dot}` : 'none',
                outlineOffset: 1,
              }}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {current.items.map((item, i) => (
          <div
            key={term(item) + i}
            style={{
              background: '#ffffff',
              border: `1px solid ${color.cardBorder}`,
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            }}
          >
            {/* Top row: headword + meaning */}
            <div
              style={{
                padding: '14px 20px 10px',
                borderBottom: `1px solid ${color.line}`,
                background: color.cardRaise,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 19,
                    fontWeight: 700,
                    color: color.ink,
                    letterSpacing: '-0.3px',
                  }}
                >
                  {term(item)}
                </span>
                <SpeakButton text={term(item)} size={15} />
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: current.color.fg,
                  fontStyle: 'italic',
                  fontFamily: font.sans,
                  background: current.color.bg,
                  padding: '2px 10px',
                  borderRadius: 99,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.meaning}
              </span>
            </div>

            {/* Optional extra row (e.g. adjective opposite) */}
            {extra?.(item)}

            {/* Example */}
            <div style={{ padding: '10px 20px', fontFamily: font.sans }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 15,
                  color: color.ink,
                  fontWeight: 600,
                }}
              >
                <span>{item.example}</span>
                <SpeakButton text={item.example} />
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: color.faint,
                  marginTop: 2,
                  fontStyle: 'italic',
                }}
              >
                {item.translation}
              </div>
            </div>

            {/* Optional note */}
            {item.note && (
              <div
                style={{
                  padding: '10px 20px',
                  background: color.canvas,
                  borderTop: `1px solid ${color.line}`,
                  fontSize: 12.5,
                  color: color.muted,
                  lineHeight: 1.6,
                  fontFamily: font.sans,
                }}
              >
                <span style={{ marginRight: 6 }}>💡</span>
                {item.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
