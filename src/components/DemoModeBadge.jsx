export function DemoModeBadge({ enabled }) {
  if (!enabled) {
    return null
  }

  return <span className="badge">DEMO MODE</span>
}
