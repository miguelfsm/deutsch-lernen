// The ONE place that touches the browser Web Speech API (window.speechSynthesis).
// Call sites depend on speak()/isSpeechSupported(), never on the API directly —
// that seam is what lets a future engine (Feature G, Piper offline TTS) swap in
// here alone without touching any card view. No npm package, no network, no key.

// Feature-detects the presence of speechSynthesis only — NOT voice availability.
// This is what gates the 🔊 button. Voice presence is deliberately NOT checked
// here (see speak(): iOS returns [] from getVoices() until a user gesture).
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && Boolean(window.speechSynthesis)
}

// Pure and testable. Prefer a German (`de-*`) voice, preferring an offline
// (`localService`) one when present; otherwise `undefined` so the browser falls
// back to its own default voice for `lang='de-DE'`. `localService` is a
// best-effort hint — unreliable on some browsers, so it only breaks ties.
export function pickGermanVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const german = voices.filter((v) => v.lang?.toLowerCase().startsWith('de'))
  if (german.length === 0) return undefined
  return german.find((v) => v.localService) ?? german[0]
}

// Speaks German text aloud. Always call from a user gesture (the 🔊 button) so
// iOS's autoplay restriction is satisfied. The German voice is detected LAZILY
// here, at call time — a "no German voice" result is never computed or cached at
// load, because iOS Safari returns [] from getVoices() until speech is first
// triggered by a gesture. If no German voice is found we still speak with
// lang='de-DE' and the default voice: an accented voice beats a silently-dead
// button.
export function speak(text: string, opts?: { rate?: number }): void {
  if (!isSpeechSupported()) return
  const synth = window.speechSynthesis
  synth.cancel() // stop any utterance already in flight
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'de-DE'
  if (opts?.rate != null) utterance.rate = opts.rate
  const voice = pickGermanVoice(synth.getVoices())
  if (voice) utterance.voice = voice
  synth.speak(utterance)
}
