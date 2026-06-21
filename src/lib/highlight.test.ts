import { describe, it, expect } from 'vitest'
import { splitSharedPrefix } from './highlight'

describe('splitSharedPrefix', () => {
  it('keeps the shared prefix and splits the divergent suffix', () => {
    expect(splitSharedPrefix('mach', 'machst')).toEqual({
      unchanged: 'mach',
      changed: 'st',
    })
  })

  it('returns everything as changed when nothing matches', () => {
    expect(splitSharedPrefix('se', 'bin')).toEqual({
      unchanged: '',
      changed: 'bin',
    })
  })

  it('returns everything as unchanged when identical', () => {
    expect(splitSharedPrefix('Zimmer', 'Zimmer')).toEqual({
      unchanged: 'Zimmer',
      changed: '',
    })
  })
})
