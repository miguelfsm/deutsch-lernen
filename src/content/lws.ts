import type { LessonId } from './lessons'

// Committed Lernwortschatz transcriptions (plan §4.3), read at BUILD time via
// Vite's `import.meta.glob` so the lesson page can show real coverage with no
// runtime fetch or server. `eager: true` inlines every file's raw text into
// the bundle at build; `?raw` returns the text unparsed (these are plain
// "one entry per line" text files, not modules).
//
// Kept as its own module (rather than inline in the lesson page) so the one
// Vite-specific, non-pure piece of the coverage feature is isolated: the pure
// `lessonCoverage` selector below is tested directly against string[] lines
// (plan: "test the pure coverage computation, not the glob"), and this file
// has no logic worth testing beyond what the glob's type already guarantees.
const files = import.meta.glob('../../content/lws/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** "…/content/lws/A1.2-L08.txt" → "A1.2-L08" (README: file naming = `<LessonId>.txt`). */
function idFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.txt$/, '')
}

/** Raw file text keyed by LessonId. A lesson with no transcribed file yet is
 * simply absent — the lesson page shows "Wortschatz noch nicht geprüft". */
export const lwsFiles: Partial<Record<LessonId, string>> = Object.fromEntries(
  Object.entries(files).map(([path, raw]) => [idFromPath(path), raw]),
)
