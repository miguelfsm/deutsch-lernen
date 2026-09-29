// Card label for the female form of a job title: "die Ärztin, -nen". The book
// prints the plural as a suffix; it is derivable, so it is not stored: forms in
// -in take -nen (Ärztin → Ärztinnen), the few others (Hausfrau,
// Pflegefachfrau) take -en.
export function feminineLabel(feminine: string): string {
  return `die ${feminine}, ${feminine.endsWith('in') ? '-nen' : '-en'}`
}
