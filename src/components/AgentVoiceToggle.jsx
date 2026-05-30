export function AgentVoiceToggle({ enabled, onToggle, supported }) {
  return (
    <label className="voice-toggle">
      <input
        type="checkbox"
        checked={enabled}
        disabled={!supported}
        onChange={(event) => onToggle(event.target.checked)}
      />
      Agent Voice {supported ? '(On/Off)' : '(Unavailable in this browser)'}
    </label>
  )
}
