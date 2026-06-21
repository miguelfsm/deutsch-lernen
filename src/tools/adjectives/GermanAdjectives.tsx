import CategoryCardsTool from '../../components/CategoryCardsTool'
import { font } from '../../lib/theme'
import { categories } from './data'

export default function GermanAdjectives() {
  return (
    <CategoryCardsTool
      eyebrow="Adjektive · Describing Words"
      title="Adjectives & Opposites"
      categories={categories}
      term={(item) => item.word}
      extra={(item) =>
        item.opposite ? (
          <div
            style={{
              padding: '8px 20px',
              fontFamily: font.sans,
              fontSize: 13,
              color: '#78716c',
              background: '#faf9f7',
              borderBottom: '1px solid #f0ede8',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ color: '#c4b9a8' }}>↔</span>
            <strong style={{ color: '#44403c' }}>{item.opposite.word}</strong>
            <span style={{ fontStyle: 'italic' }}>
              ({item.opposite.meaning})
            </span>
          </div>
        ) : null
      }
    />
  )
}
