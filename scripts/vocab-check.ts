// Lernwortschatz check — plan §4.3, §5 Phase 3.
//
// Usage: npm run vocab:check -- A1.2-L08
//
// Reads content/lws/<LessonId>.txt (one entry per line, as printed in the
// book), matches it against the live catalog with the pure `checkVocab` core,
// and prints a report: what the app already has with this lesson's tag, what
// it has but hasn't tagged, what's missing (grouped by guessed word class),
// and what only matched case-insensitively ("maybe"). Report only — nothing is
// added here (decision D4); Miguel approves, then Claude adds the words.
//
// Run with `tsx` (a devDependency): the smallest way to execute a TS/ESM
// script against this repo's setup without adding a second build pipeline —
// vite-node is not otherwise a project dependency, and ts-node's CJS/ESM
// interop is fiddlier under "type": "module". `scripts/` is typechecked by
// `tsconfig.scripts.json` (Node globals, kept out of the app's own
// tsconfig.json), which `npm run typecheck` also runs; `npm run lint` covers
// this file like any other, since ESLint isn't split per tsconfig.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { catalog } from '../src/lib/catalog/index'
import { lessons, type LessonId } from '../src/content/lessons'
import { checkVocab, type GuessedKind, type VocabMatch, type VocabMiss } from '../src/lib/vocab/checkVocab'

function isLessonId(value: string): value is LessonId {
  return lessons.some((l) => l.id === value)
}

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

const arg = process.argv[2]
if (!arg) {
  fail('Usage: npm run vocab:check -- <LessonId>\n\nValid ids:\n' + lessons.map((l) => `  ${l.id}`).join('\n'))
}
if (!isLessonId(arg)) {
  fail(
    `Unknown lesson id "${arg}".\n\nValid ids:\n` + lessons.map((l) => `  ${l.id}`).join('\n'),
  )
}
const lessonId: LessonId = arg

const filePath = resolve(process.cwd(), 'content/lws', `${lessonId}.txt`)
let raw: string
try {
  raw = readFileSync(filePath, 'utf-8')
} catch {
  fail(`No Lernwortschatz file found at content/lws/${lessonId}.txt — transcribe the photo there first.`)
}

const lines = raw.split(/\r?\n/)
const entryCount = lines.map((l) => l.trim()).filter((l) => l !== '' && !l.startsWith('#')).length
const result = checkVocab(lines, catalog, lessonId)

/** The line, or "line [form]" when a " / "-separated line was split into
 * several headwords and this result is about just one of them. */
function describeLine(m: { line: string; form: string }): string {
  return m.form === m.line.trim() ? m.line : `${m.line}  [${m.form}]`
}

function printMatchGroup(title: string, items: VocabMatch[]): void {
  console.log(`\n${title} (${items.length})`)
  for (const m of items) {
    const terms = m.entries.map((e) => e.term).join(', ')
    console.log(`  ${describeLine(m)}  →  ${terms}`)
  }
}

const KIND_LABEL: Record<GuessedKind, string> = {
  noun: 'Nomen',
  verb: 'Verben',
  phrase: 'Redemittel/Phrasen',
  unknown: 'Unklar',
}

function printMissing(items: VocabMiss[]): void {
  console.log(`\n❌ Fehlt in der App (${items.length})`)
  const byKind = new Map<GuessedKind, VocabMiss[]>()
  for (const m of items) {
    const group = byKind.get(m.kind) ?? []
    group.push(m)
    byKind.set(m.kind, group)
  }
  for (const kind of ['noun', 'verb', 'phrase', 'unknown'] as GuessedKind[]) {
    const group = byKind.get(kind)
    if (!group || group.length === 0) continue
    console.log(`  ${KIND_LABEL[kind]} (${group.length})`)
    for (const m of group) console.log(`    ${describeLine(m)}`)
  }
}

console.log(`Lernwortschatz ${lessonId}: ${entryCount} Zeilen aus content/lws/${lessonId}.txt`)
printMatchGroup('✅ Schon da, mit Lektionen-Tag', result.tagged)
printMatchGroup('🏷️ Schon da, aber ohne Lektionen-Tag', result.untagged)
printMissing(result.missing)
printMatchGroup('❓ Nur unsicherer Treffer (Gross-/Kleinschreibung)', result.maybe)
console.log('')

process.exit(0)
