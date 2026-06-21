// ─── HELPERS ─────────────────────────────────────────────────────────────────
// Returns the longest prefix shared between singular and plural,
// plus whatever differs in the plural (the "changed" part, shown in red).
export function getPluralParts(
  singular: string,
  plural: string,
): { unchanged: string; changed: string } {
  if (!plural || plural === "—") return { unchanged: "", changed: "—" };
  if (plural === singular)       return { unchanged: plural, changed: "" };
  let i = 0;
  while (i < singular.length && i < plural.length && singular[i] === plural[i]) i++;
  return { unchanged: plural.slice(0, i), changed: plural.slice(i) };
}
