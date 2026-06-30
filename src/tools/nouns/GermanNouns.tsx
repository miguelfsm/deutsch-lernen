import { useState } from "react";
import Header from "../../components/Header";
import { nounData, type Noun, type Article } from "./data.js";
import { getPluralParts } from "./highlight.js";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const CATEGORIES = ["Familie", "Supermarkt", "Zuhause", "Tiere", "Kleidung", "Körper", "Schule", "Arbeit", "Freizeit", "Lebensmittel", "Geografie", "Alltag", "Zeit", "Mengen & Einheiten"];

// Amber for the plural-change highlight — deliberately distinct from the
// feminine "die" red so the plural ending is obvious at a glance.
const AMBER = "#d97706";

const ARTICLE_META: Record<Article, { bg: string; fg: string; dot: string; label: string }> = {
  der: { bg: "#dbeafe", fg: "#1e40af", dot: "#3b82f6", label: "Masculine" },
  die: { bg: "#fee2e2", fg: "#991b1b", dot: "#ef4444", label: "Feminine"  },
  das: { bg: "#d1fae5", fg: "#065f46", dot: "#10b981", label: "Neuter"    },
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function GermanNouns() {
  const [selected, setSelected] = useState<Noun>(nounData[0]);
  const [category, setCategory] = useState<string>("Familie");

  const visibleNouns = nounData.filter(n => n.category === category);
  const meta         = ARTICLE_META[selected.article];
  const noPlural     = selected.plural === "—";
  const { unchanged, changed } = getPluralParts(selected.singular, selected.plural);

  function selectCategory(cat: string) {
    setCategory(cat);
    const first = nounData.find(n => n.category === cat);
    if (first) setSelected(first);
  }

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      maxWidth: 520,
      margin: "0 auto",
      padding: "20px 16px 40px",
      background: "#faf9f7",
      minHeight: "100vh",
    }}>

      {/* ── Header ── */}
      <Header eyebrow="Nomen · Singular & Plural" title="German Noun Reference" />

      {/* ── Legend ── */}
      <div style={{
        display: "flex",
        gap: 0,
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 16,
        background: "#f0ede8",
        borderRadius: 99,
        padding: "6px 14px",
        width: "fit-content",
        margin: "0 auto 18px",
        fontFamily: "'Arial', sans-serif",
      }}>
        {Object.entries(ARTICLE_META).map(([art, m], i) => (
          <div key={art} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 12px",
            borderRight: i < 2 ? "1px solid #d6d1c8" : "none",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#78716c", textTransform: "uppercase", letterSpacing: 0.8 }}>
              {art} — {m.label}
            </span>
          </div>
        ))}
        <div style={{ width: "100%", height: 1, background: "#d6d1c8", margin: "5px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
          <div style={{ width: 18, height: 3, borderRadius: 2, background: AMBER, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#78716c", letterSpacing: 0.3 }}>Plural change</span>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
        marginBottom: 16,
      }}>
        {CATEGORIES.map(cat => {
          const active = cat === category;
          return (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              style={{
                padding: "5px 14px",
                borderRadius: 99,
                border: active ? "2px solid #78716c" : "2px solid transparent",
                background: active ? "#1c1917" : "#e7e5e0",
                color: active ? "#faf9f7" : "#57534e",
                fontSize: 12,
                fontFamily: "'Arial', sans-serif",
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.12s",
                letterSpacing: 0.3,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Noun pills ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
        marginBottom: 24,
      }}>
        {visibleNouns.map(n => {
          const active = n.singular === selected.singular && n.category === selected.category;
          const m = ARTICLE_META[n.article];
          return (
            <button
              key={`${n.category}-${n.singular}`}
              onClick={() => setSelected(n)}
              style={{
                padding: "5px 12px",
                borderRadius: 99,
                border: active ? `2px solid ${m.dot}` : "2px solid transparent",
                background: m.bg,
                color: m.fg,
                fontSize: 13,
                fontFamily: "'Georgia', serif",
                fontWeight: active ? 800 : 400,
                cursor: "pointer",
                transition: "all 0.12s",
                opacity: active ? 1 : 0.5,
                outline: active ? `3px solid ${m.dot}` : "none",
                outlineOffset: 1,
              }}
            >
              {n.singular}
            </button>
          );
        })}
      </div>

      {/* ── Card ── */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e7e5e0",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>

        {/* Card header */}
        <div style={{
          padding: "18px 22px 16px",
          borderBottom: "1px solid #f0ede8",
          background: "#fdfcfb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}>
          <div>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              lineHeight: 1,
            }}>
              <span style={{
                fontSize: 16,
                color: meta.fg,
                fontFamily: "'Arial', sans-serif",
                fontWeight: 600,
              }}>
                {selected.article}
              </span>
              <span style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1c1917",
                letterSpacing: "-1px",
              }}>
                {selected.singular}
              </span>
            </div>
            <div style={{
              fontSize: 14,
              color: "#78716c",
              marginTop: 6,
              fontStyle: "italic",
            }}>
              {selected.english}
            </div>
          </div>
          <span style={{
            padding: "4px 12px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            background: meta.bg,
            color: meta.fg,
            whiteSpace: "nowrap",
            marginTop: 4,
            fontFamily: "'Arial', sans-serif",
          }}>
            {meta.label}
          </span>
        </div>

        {/* Category reference row */}
        <div style={{
          padding: "8px 22px",
          background: "#f9f7f4",
          borderBottom: "1px solid #f0ede8",
          fontSize: 12,
          color: "#9ca3af",
          fontFamily: "'Arial', sans-serif",
          letterSpacing: 0.3,
        }}>
          Category: <strong style={{ color: "#78716c" }}>{selected.category}</strong>
          {"  ·  "}
          Plural article: <strong style={{ color: "#78716c" }}>die</strong>{" "}
          <span style={{ color: "#c4b5a5", fontSize: 11 }}>(all genders use <em>die</em> in the plural)</span>
        </div>

        {/* Singular / Plural table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9f7f4" }}>
              <th style={{
                padding: "8px 22px",
                textAlign: "left",
                fontSize: 10,
                color: "#a8a29e",
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "'Arial', sans-serif",
                width: "38%",
              }}>Number</th>
              <th style={{
                padding: "8px 22px",
                textAlign: "left",
                fontSize: 10,
                color: "#a8a29e",
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "'Arial', sans-serif",
              }}>Form</th>
            </tr>
          </thead>
          <tbody>

            {/* Singular row */}
            <tr style={{ borderTop: "1px solid #f0ede8", background: "#ffffff" }}>
              <td style={{
                padding: "13px 22px",
                fontSize: 14,
                color: "#9ca3af",
                fontStyle: "italic",
                fontFamily: "'Arial', sans-serif",
              }}>
                Singular
              </td>
              <td style={{
                padding: "13px 22px",
                fontSize: 20,
                color: "#1c1917",
                fontWeight: 600,
                letterSpacing: "-0.3px",
              }}>
                <span style={{
                  color: meta.fg,
                  fontFamily: "'Arial', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  marginRight: 8,
                }}>
                  {selected.article}
                </span>
                {selected.singular}
              </td>
            </tr>

            {/* Plural row */}
            <tr style={{ borderTop: "1px solid #f0ede8", background: "#fdfcfb" }}>
              <td style={{
                padding: "13px 22px",
                fontSize: 14,
                color: "#9ca3af",
                fontStyle: "italic",
                fontFamily: "'Arial', sans-serif",
              }}>
                Plural
              </td>
              <td style={{
                padding: "13px 22px",
                fontSize: 20,
                color: "#1c1917",
                fontWeight: 600,
                letterSpacing: "-0.3px",
              }}>
                {noPlural ? (
                  <span style={{
                    fontSize: 14,
                    color: "#a8a29e",
                    fontStyle: "italic",
                    fontFamily: "'Arial', sans-serif",
                  }}>
                    kein Plural
                  </span>
                ) : (
                  <>
                    <span style={{
                      color: "#9ca3af",
                      fontFamily: "'Arial', sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      marginRight: 8,
                    }}>
                      die
                    </span>
                    <span>{unchanged}</span>
                    {changed && (
                      <span style={{
                        color: AMBER,
                        fontWeight: 800,
                        borderBottom: `2px solid ${AMBER}33`,
                        paddingBottom: 1,
                      }}>
                        {changed}
                      </span>
                    )}
                  </>
                )}
              </td>
            </tr>

          </tbody>
        </table>

        {/* Note */}
        <div style={{
          padding: "12px 22px",
          background: "#faf9f7",
          borderTop: "1px solid #f0ede8",
          fontSize: 13,
          color: "#78716c",
          lineHeight: 1.6,
          fontFamily: "'Arial', sans-serif",
        }}>
          <span style={{ marginRight: 6 }}>💡</span>
          {selected.note}
        </div>

      </div>

    </div>
  );
}
