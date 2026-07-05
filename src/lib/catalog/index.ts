import type { CatalogEntry } from './types'
import { verbsCatalog } from '../../tools/verbs/catalog'
import { nounsCatalog } from '../../tools/nouns/catalog'
import { adjectivesCatalog } from '../../tools/adjectives/catalog'
import { phrasesCatalog } from '../../tools/phrases/catalog'
import { satzbauCatalog } from '../../tools/satzbau/catalog'

// The ONE place edited when adding a tool: one import + one spread below. Search,
// practice and cross-linking then need zero edits.
//
// Static explicit concatenation is deliberate — NOT a register-on-import registry.
// A mutable `sources[]` populated by side-effecting imports has three real
// hazards: tree-shaking/lazy routes can silently drop an unimported adapter; Vite
// HMR double-registers; and Vitest module isolation makes the result order-
// dependent and flaky. A plain array has none of these and is trivially testable.
export const catalog: CatalogEntry[] = [
  ...verbsCatalog(),
  ...nounsCatalog(),
  ...adjectivesCatalog(),
  ...phrasesCatalog(),
  ...satzbauCatalog(),
]

export type { CatalogEntry }
