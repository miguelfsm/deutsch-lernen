import { useState } from 'react'
import Header from '../../components/Header'
import { font, color } from '../../lib/theme'
import { useDeepSelect } from '../../lib/useDeepSelect'
import { slugify } from '../../lib/catalog/slug'
import { lessons, type LessonId } from '../../content/lessons'
import { grammarTopics } from './data'
import GrammarTopicView from './GrammarTopicView'

const pill = (active: boolean) => ({
  padding: '6px 14px',
  borderRadius: 99,
  border: '2px solid transparent',
  background: active ? '#1c1917' : '#e7e5e0',
  color: active ? '#faf9f7' : '#57534e',
  fontSize: 13,
  fontFamily: font.sans,
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
  transition: 'all 0.12s',
})

// Lesson number → title, so pills can read e.g. "8 · Beruf und Arbeit". Only
// numbered A1.2 lessons are relevant here (grammar topics are per-lesson book
// pages; the A1.1 bucket has none).
const LESSON_TITLE = new Map(
  lessons.filter((l): l is typeof l & { number: number } => l.number !== undefined).map((l) => [l.id, l]),
)

export default function GermanGrammar() {
  const deepSelected = useDeepSelect(grammarTopics, (g) => slugify(g.id))

  // Only lessons that actually have a grammar topic get a pill — a lesson
  // without one would be a dead end (judgement call, see Phase 7 handback).
  const lessonIds: LessonId[] = []
  for (const g of grammarTopics) {
    for (const id of g.lessons) {
      if (!lessonIds.includes(id)) lessonIds.push(id)
    }
  }
  lessonIds.sort((a, b) => (LESSON_TITLE.get(a)?.number ?? 0) - (LESSON_TITLE.get(b)?.number ?? 0))

  const [lessonFilter, setLessonFilter] = useState<LessonId>(() => {
    const seed = grammarTopics.find((g) => deepSelected && g.id === deepSelected.id)
    return seed?.lessons[0] ?? lessonIds[0]
  })

  const topicsForLesson = grammarTopics.filter((g) => g.lessons.includes(lessonFilter))

  const [selectedId, setSelectedId] = useState<string>(
    () => deepSelected?.id ?? topicsForLesson[0]?.id ?? grammarTopics[0]?.id,
  )

  const selected = grammarTopics.find((g) => g.id === selectedId) ?? topicsForLesson[0]

  function pickLesson(id: LessonId) {
    setLessonFilter(id)
    const first = grammarTopics.find((g) => g.lessons.includes(id))
    if (first) setSelectedId(first.id)
  }

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
      <Header eyebrow="A1.2 · Grammatik" title="Grammatik" />

      {lessonIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: font.sans, fontSize: 12, color: color.faint }}>Lektion</span>
          {lessonIds.map((id) => (
            <button key={id} onClick={() => pickLesson(id)} aria-pressed={lessonFilter === id} style={pill(lessonFilter === id)}>
              {LESSON_TITLE.get(id)?.number ?? id}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {topicsForLesson.map((g) => (
          <button key={g.id} onClick={() => setSelectedId(g.id)} aria-pressed={selectedId === g.id} style={pill(selectedId === g.id)}>
            {g.title}
          </button>
        ))}
      </div>

      {selected ? (
        <GrammarTopicView topic={selected} />
      ) : (
        <p style={{ fontFamily: font.sans, fontSize: 14, color: color.faint, fontStyle: 'italic', textAlign: 'center' }}>
          Für diese Lektion gibt es noch keine Grammatik-Themen.
        </p>
      )}
    </div>
  )
}
