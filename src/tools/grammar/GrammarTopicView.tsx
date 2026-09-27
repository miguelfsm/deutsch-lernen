import { Fragment } from 'react'
import CrossLinks from '../../components/CrossLinks'
import SpeakButton from '../../components/SpeakButton'
import { font, color } from '../../lib/theme'
import { catalog } from '../../lib/catalog'
import type { GrammarBlock, GrammarTopic } from './data'

// Renders every block type of a GrammarTopic. One view for all topics — no
// per-topic components (plan §3.6).
export default function GrammarTopicView({ topic }: { topic: GrammarTopic }) {
  const related = (topic.related ?? [])
    .map((id) => catalog.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => e !== undefined)

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
      <div
        style={{
          padding: '16px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: color.ink, letterSpacing: '-0.4px' }}>
            {topic.title}
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 12.5, color: color.muted, marginTop: 3 }}>
            {topic.ugRef}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 22px 14px', fontFamily: font.sans, fontSize: 13.5, color: color.muted, lineHeight: 1.5 }}>
        {topic.summary}
      </div>

      {topic.blocks.map((block, i) => (
        <GrammarBlockView key={i} block={block} />
      ))}

      {related.length > 0 && (
        <div
          style={{
            padding: '12px 18px',
            borderTop: `1px solid ${color.line}`,
            background: color.canvas,
            fontFamily: font.sans,
            fontSize: 12.5,
            color: color.muted,
          }}
        >
          <span style={{ marginRight: 6 }}>🔗</span>
          Verwandt:
          <CrossLinks entries={related} />
        </div>
      )}
    </div>
  )
}

function GrammarBlockView({ block }: { block: GrammarBlock }) {
  if (block.type === 'rule') {
    return (
      <div
        style={{
          padding: '10px 22px',
          borderTop: `1px solid ${color.line}`,
          background: color.canvas,
          fontFamily: font.sans,
          fontSize: 13.5,
          color: color.ink,
          lineHeight: 1.55,
        }}
      >
        <span style={{ marginRight: 6 }}>📌</span>
        {block.text}
      </div>
    )
  }

  if (block.type === 'examples') {
    return (
      <>
        {block.items.map((ex, i) => (
          <div
            key={i}
            style={{
              padding: '10px 22px',
              fontFamily: font.sans,
              borderTop: `1px solid ${color.line}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: color.ink, fontWeight: 600 }}>
              <span>{ex.de}</span>
              <SpeakButton text={ex.de} />
            </div>
            <div style={{ fontSize: 12.5, color: color.faint, marginTop: 2, fontStyle: 'italic' }}>{ex.en}</div>
          </div>
        ))}
      </>
    )
  }

  // block.type === 'table'
  const hasQuestions = block.rows.some((r) => r.question)
  return (
    <div style={{ overflowX: 'auto', borderTop: `1px solid ${color.line}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: hasQuestions ? 480 : undefined }}>
        {block.caption && (
          <caption style={{ captionSide: 'top', textAlign: 'left', padding: '8px 22px 0', fontFamily: font.sans, fontSize: 12, color: color.faint }}>
            {block.caption}
          </caption>
        )}
        <thead>
          <tr style={{ background: color.cardRaise }}>
            {block.head.map((h, i) => (
              <th key={i} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <Fragment key={i}>
              {row.question && (
                <tr>
                  <td
                    colSpan={block.head.length}
                    style={{
                      borderTop: `1px solid ${color.line}`,
                      background: color.canvas,
                      padding: '7px 22px',
                      fontFamily: font.sans,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: color.muted,
                    }}
                  >
                    {row.question}
                  </td>
                </tr>
              )}
              <tr style={{ borderTop: `1px solid ${color.line}` }}>
                {row.cells.map((cell, j) => (
                  <td key={j} style={tdStyle}>
                    {cell}
                  </td>
                ))}
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = {
  padding: '7px 22px',
  textAlign: 'left' as const,
  fontSize: 10,
  color: color.faint,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  fontFamily: font.sans,
}

const tdStyle = {
  padding: '8px 22px',
  fontSize: 14.5,
  color: color.ink,
}
