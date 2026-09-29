import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { catalog } from '../lib/catalog'
import { checkVocab } from '../lib/vocab/checkVocab'

// Guards the finished Lektion 8 intake: every Lernwortschatz entry is in the
// app and tagged (the report `npm run vocab:check -- A1.2-L08` stays clean).
describe('Lernwortschatz A1.2-L08 is fully covered', () => {
  it('has nothing missing, untagged or only case-insensitive', () => {
    const lines = readFileSync('content/lws/A1.2-L08.txt', 'utf-8').split(/\r?\n/)
    const r = checkVocab(lines, catalog, 'A1.2-L08')
    expect(r.missing).toEqual([])
    expect(r.untagged).toEqual([])
    expect(r.maybe).toEqual([])
  })
})
