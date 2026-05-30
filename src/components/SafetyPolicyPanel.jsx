import { BLOCKED_POLICY_PATTERNS } from '../utils/safetyPolicy'

export function SafetyPolicyPanel() {
  return (
    <section className="panel">
      <h2>Safety Policy</h2>
      <p>
        VoiceOps only runs allowlisted commands automatically. Risky actions require confirmation or are
        blocked.
      </p>
      <ul>
        {BLOCKED_POLICY_PATTERNS.map((pattern) => (
          <li key={pattern}>{pattern}</li>
        ))}
      </ul>
    </section>
  )
}
