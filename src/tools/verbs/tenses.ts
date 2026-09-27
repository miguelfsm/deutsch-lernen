import type { Verb } from './data'
import { verbData } from './data'

// The three tenses shown in the UI's segmented switch. 'praesens' matches the
// existing `conjugations` field name (kept unrenamed to avoid churn).
export type Tense = 'praesens' | 'praeteritum' | 'perfekt'

export interface PerfektForm {
  pronoun: string
  auxForm: string
  partizip: string
}

// Perfekt's six full forms ("ich habe gearbeitet") are DERIVED, never stored:
// each row pairs this verb's Partizip II with the AUXILIARY'S OWN Präsens
// conjugation, looked up once in verbData (the single source of the haben/sein
// paradigm — DRY by knowledge, not by code). Throws only if verbData itself is
// missing haben or sein, which would be a data bug, not a caller mistake.
export function perfektForms(verb: Verb): PerfektForm[] {
  const aux = verbData.find((v) => v.infinitive === verb.perfekt.auxiliary)
  if (!aux) {
    throw new Error(`Auxiliary verb "${verb.perfekt.auxiliary}" not found in verbData`)
  }
  return aux.conjugations.map((c) => ({
    pronoun: c.pronoun,
    auxForm: c.form,
    partizip: verb.perfekt.partizip,
  }))
}
