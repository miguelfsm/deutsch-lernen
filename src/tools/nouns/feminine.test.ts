import { describe, it, expect } from 'vitest'
import { feminineLabel } from './feminine'

describe('feminineLabel', () => {
  it('uses -nen for -in forms and -en for the -frau forms', () => {
    expect(feminineLabel('Ärztin')).toBe('die Ärztin, -nen')
    expect(feminineLabel('Hausfrau')).toBe('die Hausfrau, -en')
    expect(feminineLabel('Pflegefachfrau')).toBe('die Pflegefachfrau, -en')
  })
})
