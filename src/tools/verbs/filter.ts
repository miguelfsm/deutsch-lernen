import type { Verb } from './data'

// Pure, dependency-free verb search. Case-insensitive substring match against
// the German infinitive and the English gloss, so typing "geh", "to go", or
// "cook" all narrow the list. An empty query returns the list unchanged.
export function filterVerbs(verbs: Verb[], query: string): Verb[] {
  const q = query.trim().toLowerCase()
  if (!q) return verbs
  return verbs.filter(
    (v) =>
      v.infinitive.toLowerCase().includes(q) ||
      v.english.toLowerCase().includes(q),
  )
}
