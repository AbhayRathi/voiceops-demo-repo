const MAX_SPOKEN_SUMMARY_LENGTH = 220

function isLikelyStructuredPayload(text) {
  const trimmed = text.trim()
  return trimmed.startsWith('{') || trimmed.startsWith('[')
}

function isValidSpeechText(text) {
  // Skip likely structured payloads/log dumps so only concise natural-language summaries are spoken.
  return Boolean(text) && text.length <= MAX_SPOKEN_SUMMARY_LENGTH && !isLikelyStructuredPayload(text)
}

export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speakSummary(summary, enabled) {
  if (!enabled || !isSpeechAvailable()) {
    return
  }

  const text = summary.trim()
  if (!isValidSpeechText(text)) {
    return
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  window.speechSynthesis.speak(utterance)
}
