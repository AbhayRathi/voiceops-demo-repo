export const AUDIT_EVENT_TYPES = {
  USER_UTTERANCE_RECEIVED: 'user utterance received',
  TRANSCRIPT_FINALIZED: 'transcript finalized',
  INTENT_DETECTED: 'intent detected',
  AGENT_PLAN_CREATED: 'agent plan created',
  COMMAND_PROPOSED: 'command proposed',
  RISK_CLASSIFIED: 'risk classified',
  COMMAND_ALLOWED: 'command allowed',
  COMMAND_BLOCKED: 'command blocked',
  COMMAND_REQUIRES_CONFIRMATION: 'command requires confirmation',
  COMMAND_EXECUTED: 'command executed',
  COMMAND_OUTPUT_RECEIVED: 'command output received',
  REPORT_GENERATED: 'report generated',
  EVALUATION_COMPLETED: 'evaluation completed',
  GUARDRAIL_ADDED: 'guardrail added',
  ERROR_OCCURRED: 'error occurred',
}

let fallbackCounter = 0

export function createAuditEntry(type, message, metadata) {
  const randomId = globalThis.crypto?.randomUUID?.()

  if (!randomId) {
    fallbackCounter += 1
  }

  return {
    id: randomId ?? `audit-${Date.now()}-${fallbackCounter}`,
    timestamp: new Date().toISOString(),
    type,
    message,
    metadata,
  }
}
