const PRESETS = [
  'Check if this repo is safe to push',
  'Explain the test failure',
  'Check for security issues',
  'Commit everything and push',
  'Delete all old logs',
  'Clean everything up',
]

export function PresetUtterances({ onSelect, disabled }) {
  return (
    <section className="panel">
      <h2>Preset Demo Script</h2>
      <div className="preset-grid">
        {PRESETS.map((preset) => (
          <button key={preset} type="button" disabled={disabled} onClick={() => onSelect(preset)}>
            {preset}
          </button>
        ))}
      </div>
    </section>
  )
}
