export function StatusTimeline({ states, currentState, completedStates }) {
  return (
    <section className="panel">
      <h2>Workflow Status</h2>
      <p>
        Active state: <strong>{currentState}</strong>
      </p>
      <ol className="timeline">
        {states.map((state) => {
          const isCurrent = currentState === state
          const isDone = completedStates.includes(state)

          return (
            <li key={state} className={isCurrent ? 'current' : isDone ? 'done' : ''}>
              <span>{state}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
