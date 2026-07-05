import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useDeepSelect } from './useDeepSelect'

const items = [
  { id: 'a', name: 'schlafen' },
  { id: 'b', name: 'essen' },
]
const toSlug = (i: { name: string }) => i.name

function wrapperFor(url: string) {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  )
}

describe('useDeepSelect', () => {
  it('returns the matching item for a valid ?sel', () => {
    const { result } = renderHook(() => useDeepSelect(items, toSlug), {
      wrapper: wrapperFor('/verben?sel=essen'),
    })
    expect(result.current).toEqual({ id: 'b', name: 'essen' })
  })

  it('returns undefined for a ?sel that matches nothing', () => {
    const { result } = renderHook(() => useDeepSelect(items, toSlug), {
      wrapper: wrapperFor('/verben?sel=laufen'),
    })
    expect(result.current).toBeUndefined()
  })

  it('returns undefined when ?sel is absent', () => {
    const { result } = renderHook(() => useDeepSelect(items, toSlug), {
      wrapper: wrapperFor('/verben'),
    })
    expect(result.current).toBeUndefined()
  })

  it('returns undefined for an empty/whitespace ?sel', () => {
    const { result } = renderHook(() => useDeepSelect(items, toSlug), {
      wrapper: wrapperFor('/verben?sel=%20'),
    })
    expect(result.current).toBeUndefined()
  })
})
