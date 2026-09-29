import { useState, type CSSProperties } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import SpeakButton from "../../components/SpeakButton";
import { verbData, type Verb, type VerbType } from "./data.js";
import { getStem, getHighlightParts } from "./highlight.js";
import { filterVerbs } from "./filter.js";
import { IMPERATIV_PRONOUNS, perfektForms, type Tense } from "./tenses.js";
import { font, color } from "../../lib/theme";
import { useDeepSelect } from "../../lib/useDeepSelect";
import { verbSlug } from "../../lib/catalog/slug";
import { linksForCard } from "../../lib/catalog/resolver";
import CrossLinks from "../../components/CrossLinks";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const BLUE   = "#1d6ef5";
const RED    = "#e03e2d";

const TYPE_META: Record<VerbType, { bg: string; fg: string; dot: string; label: string }> = {
  regular:   { bg: "#d1fae5", fg: "#065f46", dot: "#10b981", label: "Regular"   },
  irregular: { bg: "#fee2e2", fg: "#991b1b", dot: "#ef4444", label: "Irregular" },
  modal:     { bg: "#ede9fe", fg: "#5b21b6", dot: "#8b5cf6", label: "Modal"     },
};

// Segmented tense switch above the card (mock: "Verben · 3 Zeiten"). Präsens
// stays the default so `?sel=` links unaffected by this phase keep working.
const TENSES: { id: Tense; label: string }[] = [
  { id: "praesens", label: "Präsens" },
  { id: "praeteritum", label: "Präteritum" },
  { id: "perfekt", label: "Perfekt" },
  { id: "imperativ", label: "Imperativ" },
];
const VALID_TENSES = new Set<string>(TENSES.map((t) => t.id));

// Short display label for a lesson tag chip: "A1.1" stays as-is, "A1.2-L08"
// shortens to "L8" (matches the mock's `tag()` helper).
function lessonLabel(id: string): string {
  const m = id.match(/-L0*(\d+)$/);
  return m ? `L${m[1]}` : id;
}

// Shared cell styles for the Präsens/Präteritum/Perfekt tables.
const TH_STYLE: CSSProperties = {
  padding: "8px 22px",
  textAlign: "left",
  fontSize: 10,
  color: "#a8a29e",
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  fontFamily: "'Arial', sans-serif",
};
const TD_PRONOUN_STYLE: CSSProperties = {
  padding: "13px 22px",
  fontSize: 14,
  color: "#9ca3af",
  fontStyle: "italic",
  fontFamily: "'Arial', sans-serif",
};
const TD_FORM_STYLE: CSSProperties = {
  padding: "13px 22px",
  fontSize: 18,
  color: "#1c1917",
  fontWeight: 600,
  letterSpacing: "-0.3px",
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function GermanVerbs() {
  // Deep-select seeds the initial verb from `?sel=`, falling back to the default.
  const deepSelected = useDeepSelect(verbData, (v) => verbSlug(v.infinitive));
  const [selected, setSelected] = useState<Verb>(() => deepSelected ?? verbData[0]);
  const [query, setQuery] = useState("");
  const meta = TYPE_META[selected.type];

  // `&tense=praeteritum|perfekt` next to `?sel=`, default Präsens. Same lazy
  // seed pattern as useDeepSelect — read once, then plain useState for clicks.
  const [searchParams] = useSearchParams();
  const [tense, setTense] = useState<Tense>(() => {
    const t = searchParams.get("tense");
    return t && VALID_TENSES.has(t) ? (t as Tense) : "praesens";
  });

  const visibleVerbs = filterVerbs(verbData, query);

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
      <Header eyebrow="Präsens · Präteritum · Perfekt" title="German Verb Conjugator" />

      {/* ── Legend (above pills so colours are meaningful at a glance) ── */}
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
        {Object.entries(TYPE_META).map(([type, m], i) => (
          <div key={type} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 12px",
            borderRight: i < 2 ? "1px solid #d6d1c8" : "none",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#78716c", textTransform: "uppercase", letterSpacing: 0.8 }}>
              {m.label}
            </span>
          </div>
        ))}
        <div style={{ width: "100%", height: 1, background: "#d6d1c8", margin: "5px 0" }} />
        {[
          { color: BLUE, label: "Regular ending" },
          { color: RED,  label: "Stem change" },
        ].map(({ color, label }, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 12px",
            borderRight: i < 1 ? "1px solid #d6d1c8" : "none",
          }}>
            <div style={{ width: 18, height: 3, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#78716c", letterSpacing: 0.3 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Search box ── */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Verb suchen…"
        aria-label="Verb suchen"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 280,
          margin: "0 auto 14px",
          padding: "8px 14px",
          borderRadius: 99,
          border: "1.5px solid #e7e5e0",
          background: "#ffffff",
          fontFamily: "'Arial', sans-serif",
          fontSize: 13,
          color: "#1c1917",
          textAlign: "center",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      {/* ── Verb pills ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
        marginBottom: 24,
      }}>
        {visibleVerbs.map(v => {
          const active = v.infinitive === selected.infinitive;
          const m = TYPE_META[v.type];
          return (
            <button
              key={v.infinitive}
              onClick={() => setSelected(v)}
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
              {v.infinitive}
            </button>
          );
        })}
        {visibleVerbs.length === 0 && (
          <span style={{
            fontFamily: "'Arial', sans-serif",
            fontSize: 13,
            color: "#9ca3af",
            fontStyle: "italic",
          }}>
            Keine Treffer für „{query.trim()}“
          </span>
        )}
      </div>

      {/* ── Tense switch (Präsens · Präteritum · Perfekt · Imperativ) ── */}
      <div
        role="group"
        aria-label="Zeitform"
        style={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          background: "#f0ede8",
          borderRadius: 99,
          padding: 4,
          width: "fit-content",
          margin: "0 auto 14px",
          fontFamily: font.sans,
        }}
      >
        {TENSES.map((t) => {
          const active = t.id === tense;
          return (
            <button
              key={t.id}
              onClick={() => setTense(t.id)}
              aria-pressed={active}
              style={{
                padding: "6px 14px",
                borderRadius: 99,
                border: "none",
                background: active ? "#1c1917" : "transparent",
                color: active ? "#faf9f7" : "#57534e",
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.12s",
              }}
            >
              {t.label}
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
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1c1917",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}>
                {selected.infinitive}
              </span>
              <SpeakButton text={selected.infinitive} size={20} />
            </div>
            <div style={{
              fontSize: 14,
              color: "#78716c",
              marginTop: 5,
              fontStyle: "italic",
            }}>
              {selected.english}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
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
              fontFamily: "'Arial', sans-serif",
            }}>
              {meta.label}
            </span>
            {selected.lessons.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {selected.lessons.map((l) => (
                  <span key={l} style={{
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                    background: "#e7e5e0",
                    color: "#57534e",
                    fontFamily: "'Arial', sans-serif",
                  }}>
                    {lessonLabel(l)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {tense === "perfekt" ? (
          <>
            {/* Perfekt caption — the six forms are DERIVED, never typed in twice. */}
            <div style={{
              padding: "10px 22px",
              background: "#f9f7f4",
              borderBottom: "1px solid #f0ede8",
              fontSize: 12,
              color: "#9ca3af",
              fontFamily: "'Arial', sans-serif",
              letterSpacing: 0.3,
            }}>
              Perfekt = <strong style={{ color: "#78716c" }}>{selected.perfekt.auxiliary}</strong> (Präsens) + Partizip II{" "}
              <strong style={{ color: "#78716c" }}>{selected.perfekt.partizip}</strong>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9f7f4" }}>
                  <th style={TH_STYLE}>Pronoun</th>
                  <th style={TH_STYLE}>{selected.perfekt.auxiliary}</th>
                  <th style={TH_STYLE}>Partizip II</th>
                </tr>
              </thead>
              <tbody>
                {perfektForms(selected).map((f, i) => {
                  // Partizip II always ends -t (weak/mixed, regular pattern) or
                  // -en (strong, irregular stem) — a small, reliable split that
                  // reuses the same red/blue legend without needing a bespoke
                  // per-character diff against the infinitive.
                  const p2Color = selected.perfekt.partizip.endsWith("en") ? RED : BLUE;
                  return (
                    <tr key={f.pronoun} style={{
                      borderTop: "1px solid #f0ede8",
                      background: i % 2 === 0 ? "#ffffff" : "#fdfcfb",
                    }}>
                      <td style={TD_PRONOUN_STYLE}>{f.pronoun}</td>
                      <td style={TD_FORM_STYLE}>{f.auxForm}</td>
                      <td style={TD_FORM_STYLE}>
                        <span style={{ color: p2Color, fontWeight: 800 }}>{selected.perfekt.partizip}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : tense === "imperativ" ? (
          selected.imperativ ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9f7f4" }}>
                  <th style={{ ...TH_STYLE, width: "38%" }}>Pronoun</th>
                  <th style={TH_STYLE}>Imperativ</th>
                </tr>
              </thead>
              <tbody>
                {IMPERATIV_PRONOUNS.map((p, i) => (
                  <tr key={p} style={{
                    borderTop: "1px solid #f0ede8",
                    background: i % 2 === 0 ? "#ffffff" : "#fdfcfb",
                  }}>
                    <td style={TD_PRONOUN_STYLE}>{p}</td>
                    <td style={TD_FORM_STYLE}>{selected.imperativ![p]}!</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{
              padding: "18px 22px",
              fontSize: 14,
              color: "#78716c",
              fontStyle: "italic",
              fontFamily: font.sans,
            }}>
              Kein Imperativ — {selected.infinitive} is not used as a command.
            </div>
          )
        ) : (
          <>
            {/* Stem reference row */}
            <div style={{
              padding: "8px 22px",
              background: "#f9f7f4",
              borderBottom: "1px solid #f0ede8",
              fontSize: 12,
              color: "#9ca3af",
              fontFamily: "'Arial', sans-serif",
              letterSpacing: 0.3,
            }}>
              Stem: <strong style={{ color: "#78716c" }}>{getStem(selected.infinitive)}-</strong>
              {selected.separable && (
                <>
                  {" "}· separable prefix <strong style={{ color: "#78716c" }}>{selected.separable}-</strong>
                </>
              )}
            </div>

            {/* Conjugation rows */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9f7f4" }}>
                  <th style={{ ...TH_STYLE, width: "38%" }}>Pronoun</th>
                  <th style={TH_STYLE}>Conjugated Form</th>
                </tr>
              </thead>
              <tbody>
                {(tense === "praeteritum" ? selected.praeteritum : selected.conjugations).map((c, i) => {
                  const { unchanged, changed } = getHighlightParts(selected.infinitive, c.form, selected.customStem);
                  const hlColor = c.stemChange ? RED : BLUE;
                  const isEven = i % 2 === 0;
                  return (
                    <tr
                      key={c.pronoun}
                      style={{
                        borderTop: "1px solid #f0ede8",
                        background: isEven ? "#ffffff" : "#fdfcfb",
                      }}
                    >
                      <td style={TD_PRONOUN_STYLE}>
                        {c.pronoun}
                      </td>
                      <td style={{
                        padding: "13px 22px",
                        fontSize: 20,
                        color: "#1c1917",
                        fontWeight: 600,
                        letterSpacing: "-0.3px",
                      }}>
                        <span>{unchanged}</span>
                        {changed && (
                          <span style={{
                            color: hlColor,
                            fontWeight: 800,
                            borderBottom: `2px solid ${hlColor}33`,
                            paddingBottom: 1,
                          }}>
                            {changed}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {/* Example sentence (A1) — same visual language as the Adjectives/
            Phrases cards; incidental style duplication is fine per Feature B. */}
        {selected.example && selected.translation && (
          <div style={{
            padding: "12px 22px",
            borderTop: "1px solid #f0ede8",
            fontFamily: font.sans,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 15,
              color: color.ink,
              fontWeight: 600,
            }}>
              <span>{selected.example}</span>
              <SpeakButton text={selected.example} />
            </div>
            <div style={{
              fontSize: 12.5,
              color: color.faint,
              marginTop: 2,
              fontStyle: "italic",
            }}>
              {selected.translation}
            </div>
            {/* Cross-links to any verb/noun the example references. */}
            <CrossLinks
              entries={linksForCard(
                selected.example,
                verbSlug(selected.infinitive),
                "verben",
              )}
            />
          </div>
        )}

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
