import { useState } from "react";
import { categories } from "./data.js";

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function GermanAdjectives() {
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const current = categories.find((c) => c.id === activeCat) ?? categories[0];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      maxWidth: 560,
      margin: "0 auto",
      padding: "20px 16px 40px",
      background: "#faf9f7",
      minHeight: "100vh",
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>
          Adjektive · Describing Words
        </div>
        <h1 style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 700,
          color: "#1c1917",
          letterSpacing: "-0.5px",
        }}>
          Adjectives & Opposites
        </h1>
      </div>

      {/* ── Category pills ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
        marginBottom: 22,
      }}>
        {categories.map(c => {
          const active = c.id === activeCat;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              style={{
                padding: "7px 14px",
                borderRadius: 99,
                border: active ? `2px solid ${c.color.dot}` : "2px solid transparent",
                background: c.color.bg,
                color: c.color.fg,
                fontSize: 13,
                fontFamily: "'Georgia', serif",
                fontWeight: active ? 800 : 400,
                cursor: "pointer",
                transition: "all 0.12s",
                opacity: active ? 1 : 0.55,
                outline: active ? `3px solid ${c.color.dot}` : "none",
                outlineOffset: 1,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* ── Adjective cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {current.items.map((item, i) => (
          <div
            key={item.word + i}
            style={{
              background: "#ffffff",
              border: "1px solid #e7e5e0",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* Top row: word + meaning */}
            <div style={{
              padding: "14px 20px 10px",
              borderBottom: "1px solid #f0ede8",
              background: "#fdfcfb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
              flexWrap: "wrap",
            }}>
              <span style={{
                fontSize: 19,
                fontWeight: 700,
                color: "#1c1917",
                letterSpacing: "-0.3px",
              }}>
                {item.word}
              </span>
              <span style={{
                fontSize: 13,
                color: current.color.fg,
                fontStyle: "italic",
                fontFamily: "'Arial', sans-serif",
                background: current.color.bg,
                padding: "2px 10px",
                borderRadius: 99,
                whiteSpace: "nowrap",
              }}>
                {item.meaning}
              </span>
            </div>

            {/* Opposite row */}
            {item.opposite && (
              <div style={{
                padding: "8px 20px",
                fontFamily: "'Arial', sans-serif",
                fontSize: 13,
                color: "#78716c",
                background: "#faf9f7",
                borderBottom: "1px solid #f0ede8",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <span style={{ color: "#c4b9a8" }}>↔</span>
                <strong style={{ color: "#44403c" }}>{item.opposite.word}</strong>
                <span style={{ fontStyle: "italic" }}>({item.opposite.meaning})</span>
              </div>
            )}

            {/* Example */}
            <div style={{
              padding: "10px 20px",
              fontFamily: "'Arial', sans-serif",
            }}>
              <div style={{ fontSize: 15, color: "#1c1917", fontWeight: 600 }}>
                {item.example}
              </div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2, fontStyle: "italic" }}>
                {item.translation}
              </div>
            </div>

            {/* Optional note */}
            {item.note && (
              <div style={{
                padding: "10px 20px",
                background: "#faf9f7",
                borderTop: "1px solid #f0ede8",
                fontSize: 12.5,
                color: "#78716c",
                lineHeight: 1.6,
                fontFamily: "'Arial', sans-serif",
              }}>
                <span style={{ marginRight: 6 }}>💡</span>
                {item.note}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
