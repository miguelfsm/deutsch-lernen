import { splitSharedPrefix } from '../../lib/highlight'

// Split a plural into the part shared with the singular (unchanged) and the
// part that differs (highlighted). Handles uncountable and unchanged plurals.
export function getPluralParts(
  singular: string,
  plural: string,
): { unchanged: string; changed: string } {
  if (!plural || plural === '—') return { unchanged: '', changed: '—' }
  if (plural === singular) return { unchanged: plural, changed: '' }
  return splitSharedPrefix(singular, plural)
}
