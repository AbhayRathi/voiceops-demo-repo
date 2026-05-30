export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speakSummary(summary, enabled) {
  if (!enabled || !isSpeechAvailable()) {
    return
  }

  const text = summary.trim()
  if (!text || text.length > 220 || text.includes('{') || text.includes('[')) {
    return
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  window.speechSynthesis.speak(utterance)
}
