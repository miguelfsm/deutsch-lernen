import type { Case, PrepUse, Preposition } from './data'

// Pure filter behind the case/use pill rows (mock screen "Präpositionen").
// 'Alle' means "no filter on this axis" for either axis independently.
export type CaseFilter = Case | 'Alle'
export type UseFilter = PrepUse | 'Alle'

export function filterPrepositions(
  items: Preposition[],
  caseFilter: CaseFilter,
  useFilter: UseFilter,
): Preposition[] {
  return items.filter(
    (p) =>
      (caseFilter === 'Alle' || p.case === caseFilter) &&
      (useFilter === 'Alle' || p.use.includes(useFilter as PrepUse)),
  )
}
