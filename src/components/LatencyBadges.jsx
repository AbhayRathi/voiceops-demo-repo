import { formatLatency } from '../utils/latency'

export function LatencyBadges({ latency }) {
  return (
    <section className="panel">
      <h2>Latency Metrics</h2>
      <div className="latency-grid">
        <span className="metric">Transcription: {formatLatency(latency.transcription)}</span>
        <span className="metric">Planning: {formatLatency(latency.planning)}</span>
        <span className="metric">Command execution: {formatLatency(latency.commandExecution)}</span>
        <span className="metric">Evaluation: {formatLatency(latency.evaluation)}</span>
        <span className="metric">Total session: {formatLatency(latency.total)}</span>
      </div>
    </section>
  )
}
