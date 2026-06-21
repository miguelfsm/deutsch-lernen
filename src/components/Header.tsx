import { color } from '../lib/theme'

// The eyebrow + title block shared by every tool's page header.
export default function Header({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 22 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 4,
          color: color.faint,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {eyebrow}
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 700,
          color: color.ink,
          letterSpacing: '-0.5px',
        }}
      >
        {title}
      </h1>
    </div>
  )
}
