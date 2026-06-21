// Single source of truth for the tool list — consumed by both the nav bar and
// the home page so the set of tools is defined in exactly one place.
export const tools = [
  {
    path: '/verben',
    label: 'Verben',
    english: 'Verbs',
    blurb: 'Present-tense conjugator with stem-change highlighting.',
  },
  {
    path: '/nomen',
    label: 'Nomen',
    english: 'Nouns',
    blurb: 'Gender and plural reference across 13 categories.',
  },
  {
    path: '/adjektive',
    label: 'Adjektive',
    english: 'Adjectives',
    blurb: 'Common adjectives and their opposites.',
  },
  {
    path: '/redemittel',
    label: 'Redemittel',
    english: 'Phrases',
    blurb: 'Question words, connectors and conversation strategies.',
  },
]
