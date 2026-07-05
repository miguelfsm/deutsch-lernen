import { useSearchParams } from 'react-router-dom'

// Reads a deep-select target from the URL and returns the matching item, so a
// tool can seed its initial selection from `#/verben?sel=schlafen`.
//
// Usage — seed via LAZY initial state, never a mount effect:
//   const deep = useDeepSelect(verbData, (v) => verbSlug(v.infinitive))
//   const [selected, setSelected] = useState(() => deep ?? verbData[0])
//
// Lazy initial state (not useEffect) is what stops StrictMode's double-invoke and
// the router from fighting the user's very first click. The hook seeds the
// initial selection only; navigating between two `?sel=` targets is out of scope
// for v1 (YAGNI) — tools keep their own useState for clicks.
export function useDeepSelect<T>(
  items: T[],
  toSlug: (item: T) => string,
  param = 'sel',
): T | undefined {
  const [searchParams] = useSearchParams()
  const sel = searchParams.get(param)?.trim()
  if (!sel) return undefined
  return items.find((item) => toSlug(item) === sel)
}
