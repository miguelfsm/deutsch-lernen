// Longest-common-prefix split shared by the verb and noun tools: given a base
// form and a derived form, keep the shared leading part unchanged and return
// the divergent remainder (which the UI highlights).
export interface PrefixSplit {
  unchanged: string
  changed: string
}

export function splitSharedPrefix(base: string, derived: string): PrefixSplit {
  let i = 0
  while (i < base.length && i < derived.length && base[i] === derived[i]) i++
  return { unchanged: derived.slice(0, i), changed: derived.slice(i) }
}
