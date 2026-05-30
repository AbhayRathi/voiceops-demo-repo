export function AuditLog({ entries }) {
  return (
    <section className="panel">
      <h2>Session Audit Log</h2>
      <ul className="audit-log">
        {entries.map((entry) => (
          <li key={entry.id}>
            <p>
              <strong>{entry.timestamp}</strong> · {entry.type}
            </p>
            <p>{entry.message}</p>
            {entry.metadata ? <pre>{JSON.stringify(entry.metadata, null, 2)}</pre> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
