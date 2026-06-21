import { Link } from 'react-router-dom'
import { tools } from '../tools/registry.js'

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        maxWidth: 560,
        margin: '0 auto',
        padding: '28px 16px 48px',
        background: '#faf9f7',
        minHeight: '100vh',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 4,
            color: '#9ca3af',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          A1 · Lern-Werkzeuge
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: '#1c1917',
            letterSpacing: '-0.5px',
          }}
        >
          Deutsch Lernen
        </h1>
        <p
          style={{
            fontFamily: "'Arial', sans-serif",
            fontSize: 13.5,
            color: '#78716c',
            marginTop: 8,
          }}
        >
          Choose a tool to start practising.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tools.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            style={{
              display: 'block',
              textDecoration: 'none',
              background: '#ffffff',
              border: '1px solid #e7e5e0',
              borderRadius: 14,
              padding: '16px 20px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1c1917',
                  letterSpacing: '-0.3px',
                }}
              >
                {t.label}
              </span>
              <span
                style={{
                  fontFamily: "'Arial', sans-serif",
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: '#9ca3af',
                }}
              >
                {t.english}
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Arial', sans-serif",
                fontSize: 13,
                color: '#78716c',
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              {t.blurb}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
