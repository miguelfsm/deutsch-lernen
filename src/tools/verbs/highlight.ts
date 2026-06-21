// ─── HELPERS ─────────────────────────────────────────────────────────────────
export function getStem(infinitive: string): string {
  return infinitive.slice(0, -2); // remove trailing "-en"
}

// Returns the longest prefix shared between stem and the conjugated form,
// plus whatever comes after it (the "changed" part).
export function getHighlightParts(
  infinitive: string,
  form: string,
  customStem?: string,
): { unchanged: string; changed: string } {
  const stem = customStem || getStem(infinitive);
  let i = 0;
  while (i < stem.length && i < form.length && stem[i] === form[i]) i++;
  return { unchanged: form.slice(0, i), changed: form.slice(i) };
}
