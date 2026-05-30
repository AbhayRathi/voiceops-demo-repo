import { useState } from 'react'

export function ConfirmationGate({ pending, onConfirm, onCancel }) {
  const [typedValue, setTypedValue] = useState('')

  if (!pending) {
    return null
  }

  const confirmAction = () => {
    onConfirm(typedValue)
    setTypedValue('')
  }

  return (
    <section className="panel warning">
      <h2>Typed Confirmation Required</h2>
      <p>
        Command: <code>{pending.command}</code>
      </p>
      <p id="confirmation-reason">Reason: {pending.reason}</p>
      <p>
        Type <strong>{pending.confirmationPhrase}</strong> to proceed.
      </p>
      <label htmlFor="confirmation-input">Confirmation phrase</label>
      <input
        id="confirmation-input"
        aria-describedby="confirmation-reason"
        value={typedValue}
        onChange={(event) => setTypedValue(event.target.value)}
      />
      <div className="row">
        <button type="button" onClick={confirmAction}>
          Confirm
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  )
}
