// Word-icon coverage report — plans/WORD_ICONS_PLAN.md §3 and §11.
//
// Usage:
//   npx tsx scripts/icon-coverage.ts [--sets-dir <dir>]
//
// Reads the hand-written candidate map plans/word-icons-candidates.json (German
// headword → icon name) and the live catalog, and prints per kind/category how
// many words got a STRONG icon (the picture is the word), a WEAK one (a generic
// or symbolic hook), or none. With --sets-dir (or env ICON_SETS_DIR) it also
// verifies that every icon name really exists in each candidate set: the dir must
// hold one folder per set key in the JSON ("fluent", "noto", "openmoji",
// "twemoji", "ph"), each an unpacked @iconify-json package (it needs icons.json):
//
//   mkdir sets && cd sets
//   npm pack @iconify-json/fluent-emoji-flat@1.2.6 && tar xzf iconify-json-fluent-emoji-flat-1.2.6.tgz && mv package fluent
//   … same for noto, openmoji, twemoji, ph (versions are listed in the JSON)
//
// Without it, names are taken on trust and the report says so. Exit code 1 when a
// verified name is missing or the map names a word the catalog does not have.
//
// Node-only tooling, never imported by the app (same rules as vocab-check.ts):
// typechecked by tsconfig.scripts.json, linted like everything else.

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { catalog } from '../src/lib/catalog/index'
import type { CatalogEntry, EntryKind } from '../src/lib/catalog/types'

type Tier = 'strong' | 'weak' | 'none'
type ConceptMap = Record<string, Record<string, Record<string, string | null>>>

interface CandidateFile {
  sets: Record<string, { package: string; version: string; licence: string }>
  concepts: ConceptMap
  lineSets: Record<string, Record<string, string | null>>
}

const EMOJI_SETS = ['fluent', 'noto', 'openmoji', 'twemoji']
/** Kinds where an icon can plausibly help; the rest get none by policy (plan §6.1). */
const ICONABLE: EntryKind[] = ['noun', 'verb', 'adjective', 'adverb', 'phrase']

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

/** '~name' → weak, 'name' → strong, null/undefined → none. */
function parse(value: string | null | undefined): { tier: Tier; name: string | null } {
  if (value === null || value === undefined) return { tier: 'none', name: null }
  return value.startsWith('~') ? { tier: 'weak', name: value.slice(1) } : { tier: 'strong', name: value }
}

// ── args ──
const args = process.argv.slice(2)
const flag = args.indexOf('--sets-dir')
const setsDirArg = (flag >= 0 ? args[flag + 1] : undefined) ?? process.env.ICON_SETS_DIR
const candidates = readJson<CandidateFile>(resolve(process.cwd(), 'plans/word-icons-candidates.json'))

/** set key → every icon name (incl. aliases) — only when the packages are unpacked. */
const available = new Map<string, Set<string>>()
if (setsDirArg) {
  for (const key of Object.keys(candidates.sets)) {
    const file = resolve(process.cwd(), setsDirArg, key, 'icons.json')
    if (!existsSync(file)) fail(`--sets-dir: missing ${file}`)
    const json = readJson<{ icons: Record<string, unknown>; aliases?: Record<string, unknown> }>(file)
    available.set(key, new Set([...Object.keys(json.icons), ...Object.keys(json.aliases ?? {})]))
  }
}
const verified = available.size > 0

// ── per-word evaluation ──
interface Row {
  entry: CatalogEntry
  /** Present when the map has a decision (icon or explicit null) for this word. */
  mapped: boolean
  /** set key → resulting tier after the existence check. */
  tiers: Record<string, Tier>
  /** set key → the icon name that could not be found. */
  missing: Record<string, string>
}

const problems: string[] = []
const catalogKeys = new Set(catalog.map((e) => `${e.kind}|${e.category ?? ''}|${e.term}`))
for (const [kind, cats] of Object.entries(candidates.concepts)) {
  for (const [cat, words] of Object.entries(cats)) {
    for (const term of Object.keys(words)) {
      if (!catalogKeys.has(`${kind}|${cat}|${term}`)) problems.push(`map names unknown word: ${kind}/${cat}/${term}`)
    }
  }
}
const termIndex = new Map<string, CatalogEntry>()
for (const e of catalog) if (ICONABLE.includes(e.kind)) termIndex.set(e.term, e)
for (const [set, words] of Object.entries(candidates.lineSets)) {
  for (const term of Object.keys(words)) {
    if (!termIndex.has(term)) problems.push(`lineSets.${set} names unknown word: ${term}`)
  }
}

function evaluate(entry: CatalogEntry): Row {
  const raw = candidates.concepts[entry.kind]?.[entry.category ?? '']?.[entry.term]
  const mapped = raw !== undefined
  const tiers: Record<string, Tier> = {}
  const missing: Record<string, string> = {}
  const concept = parse(raw)
  for (const set of EMOJI_SETS) {
    if (concept.name === null) {
      tiers[set] = 'none'
    } else if (verified && !available.get(set)?.has(concept.name)) {
      tiers[set] = 'none'
      missing[set] = concept.name
    } else {
      tiers[set] = concept.tier
    }
  }
  for (const [set, words] of Object.entries(candidates.lineSets)) {
    const line = parse(words[entry.term])
    if (line.name !== null && verified && !available.get(set)?.has(line.name)) {
      tiers[set] = 'none'
      missing[set] = line.name
    } else {
      tiers[set] = line.tier
    }
  }
  return { entry, mapped, tiers, missing }
}

const rows = catalog.map(evaluate)
for (const r of rows) {
  for (const [set, name] of Object.entries(r.missing)) {
    problems.push(`${set}: icon "${name}" (for ${r.entry.term}) not found in the set`)
  }
}

// ── reporting ──
interface Tally {
  total: number
  mapped: number
  strong: number
  weak: number
}
function tally(list: Row[], set: string): Tally {
  const t: Tally = { total: list.length, mapped: 0, strong: 0, weak: 0 }
  for (const r of list) {
    if (r.mapped) t.mapped++
    if (r.tiers[set] === 'strong') t.strong++
    if (r.tiers[set] === 'weak') t.weak++
  }
  return t
}

const reportSets = [...EMOJI_SETS, ...Object.keys(candidates.lineSets)]
console.log(
  `Icon coverage — ${catalog.length} catalog entries; icon names ${verified ? 'VERIFIED against the unpacked sets' : 'NOT verified (no --sets-dir)'}`,
)
console.log('Strong = the picture is the word · Weak = generic/symbolic hook · shares are of ALL words in the group.')

function printGroup(title: string, list: Row[]): void {
  const cells = reportSets.map((set) => {
    const t = tally(list, set)
    return `${String(Math.round((100 * t.strong) / list.length)).padStart(3)}/${String(Math.round((100 * (t.strong + t.weak)) / list.length)).padStart(3)}`
  })
  console.log(`${title.padEnd(38)} ${String(list.length).padStart(3)}  ${cells.join('  ')}`)
}

console.log(`${''.padEnd(38)} ${'n'.padStart(3)}  ${reportSets.map((s) => s.padStart(7)).join('  ')}`)
console.log('(cells: strong% / strong+weak%)')

for (const kind of ICONABLE) {
  const ofKind = rows.filter((r) => r.entry.kind === kind)
  if (ofKind.length === 0) continue
  const cats = [...new Set(ofKind.map((r) => r.entry.category ?? ''))]
  console.log(`\n== ${kind} ==`)
  if (cats.length > 1) {
    for (const cat of cats) printGroup(`${kind} · ${cat}`, ofKind.filter((r) => (r.entry.category ?? '') === cat))
  }
  printGroup(`${kind} TOTAL`, ofKind)
}

const wordRows = rows.filter((r) => ['noun', 'verb', 'adjective', 'adverb'].includes(r.entry.kind))
console.log('\n== overall ==')
printGroup('words (noun+verb+adjective+adverb)', wordRows)
printGroup(`whole catalog (incl. grammar/patterns)`, rows)

const unmappedWords = wordRows.filter((r) => !r.mapped)
console.log(`\nWords with no decision in the map yet: ${unmappedWords.length} of ${wordRows.length}`)
if (unmappedWords.length > 0) console.log('  ' + unmappedWords.map((r) => r.entry.term).join(', '))

// Icons shared by several words (fine for feminine forms, a smell otherwise).
const shared = new Map<string, string[]>()
for (const r of rows) {
  const name = parse(candidates.concepts[r.entry.kind]?.[r.entry.category ?? '']?.[r.entry.term]).name
  if (name === null) continue
  shared.set(name, [...(shared.get(name) ?? []), r.entry.term])
}
const dupes = [...shared.entries()].filter(([, terms]) => terms.length > 1)
console.log(`\nIcons used by more than one word (${dupes.length}):`)
for (const [name, terms] of dupes) console.log(`  ${name}: ${terms.join(', ')}`)

if (problems.length > 0) {
  console.log(`\nProblems (${problems.length}):`)
  for (const p of problems) console.log(`  ✗ ${p}`)
  process.exit(1)
}
console.log('')
