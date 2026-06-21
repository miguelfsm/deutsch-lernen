import { splitSharedPrefix } from '../../lib/highlight'

export function getStem(infinitive: string): string {
  return infinitive.slice(0, -2) // remove trailing "-en"
}

// Split a conjugated form into the part shared with its stem (unchanged) and
// the part that differs (highlighted). Separable verbs pass a custom stem.
export function getHighlightParts(
  infinitive: string,
  form: string,
  customStem?: string,
): { unchanged: string; changed: string } {
  const stem = customStem || getStem(infinitive)
  return splitSharedPrefix(stem, form)
}
