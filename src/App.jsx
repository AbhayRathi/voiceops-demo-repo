import { useMemo, useRef, useState } from 'react'
import { AgentVoiceToggle } from './components/AgentVoiceToggle'
import { AuditLog } from './components/AuditLog'
import { ConfirmationGate } from './components/ConfirmationGate'
import { DemoModeBadge } from './components/DemoModeBadge'
import { LatencyBadges } from './components/LatencyBadges'
import { PresetUtterances } from './components/PresetUtterances'
import { SafetyPolicyPanel } from './components/SafetyPolicyPanel'
import { StatusTimeline } from './components/StatusTimeline'
import './App.css'
import { AUDIT_EVENT_TYPES, createAuditEntry } from './utils/auditLog'
import { getDemoCommandResult, isDemoMode } from './utils/demoMode'
import { classifyIntent, createPlan, evaluateSession, generateReadinessReport, summarizeForVoice } from './utils/fallbackAgent'
import { elapsed } from './utils/latency'
import { resolveRepoRoot } from './utils/repoRoot'
import { evaluateSafety } from './utils/safetyPolicy'
import { isSpeechAvailable, speakSummary } from './utils/speechSynthesis'
import { WORKFLOW_STATES } from './utils/status'

const DEFAULT_LATENCY = {
  transcription: null,
  planning: null,
  commandExecution: null,
  evaluation: null,
  total: null,
}

function App() {
  const [utterance, setUtterance] = useState('')
  const [currentState, setCurrentState] = useState('Idle')
  const [completedStates, setCompletedStates] = useState([])
  const [auditEntries, setAuditEntries] = useState([])
  const [commandOutputs, setCommandOutputs] = useState([])
  const [latency, setLatency] = useState(DEFAULT_LATENCY)
  const [running, setRunning] = useState(false)
  const [pendingConfirmation, setPendingConfirmation] = useState(null)
  const [summary, setSummary] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const confirmationResolverRef = useRef(null)
  const speechSupported = useMemo(() => isSpeechAvailable(), [])
  const repoRoot = useMemo(() => resolveRepoRoot(), [])

  const addAudit = (type, message, metadata) => {
    setAuditEntries((prev) => [createAuditEntry(type, message, metadata), ...prev])
  }

  const transitionTo = async (nextState, pause = 150) => {
    setCurrentState((previousState) => {
      if (previousState !== nextState) {
        setCompletedStates((prev) =>
          prev.includes(previousState) || previousState === 'Error' ? prev : [...prev, previousState],
        )
      }
      return nextState
    })

    await new Promise((resolve) => {
      window.setTimeout(resolve, pause)
    })
  }

  const requestTypedConfirmation = (details) => {
    setPendingConfirmation(details)

    return new Promise((resolve) => {
      confirmationResolverRef.current = resolve
    })
  }

  const finishConfirmation = (result) => {
    if (confirmationResolverRef.current) {
      confirmationResolverRef.current(result)
      confirmationResolverRef.current = null
    }
    setPendingConfirmation(null)
  }

  const runCommand = async (command, intent) => {
    if (isDemoMode) {
      return getDemoCommandResult(command, intent)
    }

    if (command === 'secret scan') {
      return {
        status: 'ok',
        success: true,
        output: 'No obvious secret patterns found.',
      }
    }

    return {
      status: 'ok',
      success: true,
      output: `Simulated command output for: ${command}`,
    }
  }

  const runSession = async (input, source) => {
    setRunning(true)
    setCommandOutputs([])
    setSummary('')
    setCompletedStates([])
    setLatency(DEFAULT_LATENCY)

    const startTime = Date.now()

    try {
      addAudit(AUDIT_EVENT_TYPES.USER_UTTERANCE_RECEIVED, 'Utterance captured', { input, source })
      await transitionTo('Listening')

      if (source === 'preset') {
        setLatency((prev) => ({ ...prev, transcription: 'preset' }))
      } else {
        const transcribeStart = Date.now()
        await transitionTo('Transcribing')
        addAudit(AUDIT_EVENT_TYPES.TRANSCRIPT_FINALIZED, 'Transcript finalized', { transcript: input })
        await transitionTo('Transcribed')
        setLatency((prev) => ({ ...prev, transcription: elapsed(transcribeStart) }))
      }

      const planningStart = Date.now()
      await transitionTo('Planning')
      const intent = classifyIntent(input)
      addAudit(AUDIT_EVENT_TYPES.INTENT_DETECTED, 'Intent detected', { intent })
      await transitionTo('Classifying commands')
      const plan = createPlan(intent)
      addAudit(AUDIT_EVENT_TYPES.AGENT_PLAN_CREATED, 'Agent plan created', { plan })
      setLatency((prev) => ({ ...prev, planning: elapsed(planningStart) }))

      const commandStart = Date.now()
      const results = []

      for (const command of plan) {
        await transitionTo(command === 'secret scan' ? 'Scanning secrets' : 'Running checks')

        addAudit(AUDIT_EVENT_TYPES.COMMAND_PROPOSED, 'Command proposed', { command })

        const safety = evaluateSafety(command, repoRoot)
        addAudit(AUDIT_EVENT_TYPES.RISK_CLASSIFIED, 'Risk classified', {
          command,
          risk: safety.risk,
          reason: safety.reason,
        })

        if (safety.blocked) {
          const blockedResult = {
            command,
            output: `Blocked: ${safety.reason}`,
            success: false,
            status: 'blocked',
          }
          addAudit(AUDIT_EVENT_TYPES.COMMAND_BLOCKED, 'Command blocked', {
            command,
            reason: safety.reason,
          })
          results.push(blockedResult)
          setCommandOutputs((prev) => [...prev, blockedResult])
          continue
        }

        if (safety.requiresConfirmation) {
          addAudit(
            AUDIT_EVENT_TYPES.COMMAND_REQUIRES_CONFIRMATION,
            'Command requires typed confirmation',
            {
              command,
              reason: safety.reason,
              expected: safety.confirmationPhrase,
            },
          )

          const confirmed = await requestTypedConfirmation({
            command,
            reason: safety.reason,
            confirmationPhrase: safety.confirmationPhrase,
          })

          if (!confirmed) {
            const deniedResult = {
              command,
              output: 'Command was not confirmed and was not executed.',
              success: false,
              status: 'blocked',
            }
            addAudit(AUDIT_EVENT_TYPES.COMMAND_BLOCKED, 'Command blocked due to missing confirmation', {
              command,
            })
            results.push(deniedResult)
            setCommandOutputs((prev) => [...prev, deniedResult])
            continue
          }
        }

        addAudit(AUDIT_EVENT_TYPES.COMMAND_ALLOWED, 'Command allowed', { command })
        addAudit(AUDIT_EVENT_TYPES.COMMAND_EXECUTED, 'Command executed', { command })
        const result = await runCommand(command, intent)
        addAudit(AUDIT_EVENT_TYPES.COMMAND_OUTPUT_RECEIVED, 'Command output received', {
          command,
          status: result.status,
        })

        const entry = { command, ...result }
        results.push(entry)
        setCommandOutputs((prev) => [...prev, entry])
      }

      setLatency((prev) => ({ ...prev, commandExecution: elapsed(commandStart) }))

      await transitionTo('Generating report')
      const report = generateReadinessReport(intent, results)
      addAudit(AUDIT_EVENT_TYPES.REPORT_GENERATED, 'Readiness report generated', { report })

      const evaluationStart = Date.now()
      await transitionTo('Evaluating session')
      const evaluation = evaluateSession(intent, results)
      addAudit(AUDIT_EVENT_TYPES.EVALUATION_COMPLETED, 'Session evaluation completed', evaluation)

      await transitionTo('Adding guardrail')
      addAudit(AUDIT_EVENT_TYPES.GUARDRAIL_ADDED, 'Guardrail added', { guardrail: evaluation.guardrail })

      setLatency((prev) => ({
        ...prev,
        evaluation: elapsed(evaluationStart),
        total: elapsed(startTime),
      }))

      const nextSummary = summarizeForVoice(intent, report, evaluation)
      setSummary(`${report}\n${evaluation.summary}\nGuardrail: ${evaluation.guardrail}`)
      speakSummary(nextSummary, voiceEnabled)

      await transitionTo('Complete', 0)
    } catch (error) {
      addAudit(AUDIT_EVENT_TYPES.ERROR_OCCURRED, 'Error occurred', {
        message: error instanceof Error ? error.message : String(error),
      })
      setCurrentState('Error')
    } finally {
      setRunning(false)
    }
  }

  const submitInput = (input, source) => {
    const value = input.trim()
    if (!value || running) {
      return
    }

    void runSession(value, source)
  }

  const repoScopeWarning = repoRoot
    ? null
    : 'Warning: repository root could not be detected. Command execution is blocked.'

  return (
    <main className="app">
      <header className="header">
        <h1>VoiceOps Guard</h1>
        <DemoModeBadge enabled={isDemoMode} />
      </header>

      <p className="repo-root">
        Repo root: <code>{repoRoot ?? 'Unavailable'}</code>
      </p>
      {repoScopeWarning ? <p className="warning-text">{repoScopeWarning}</p> : null}

      <AgentVoiceToggle enabled={voiceEnabled} onToggle={setVoiceEnabled} supported={speechSupported} />

      <section className="panel">
        <h2>Utterance Input</h2>
        <div className="row">
          <input
            value={utterance}
            onChange={(event) => setUtterance(event.target.value)}
            placeholder="Type or use preset utterances"
          />
          <button type="button" onClick={() => submitInput(utterance, 'typed')} disabled={running}>
            Run
          </button>
        </div>
      </section>

      <PresetUtterances onSelect={(value) => submitInput(value, 'preset')} disabled={running} />
      <StatusTimeline
        states={WORKFLOW_STATES}
        currentState={currentState}
        completedStates={completedStates}
      />
      <LatencyBadges latency={latency} />
      <SafetyPolicyPanel />

      <ConfirmationGate
        pending={pendingConfirmation}
        onConfirm={(typedValue) => {
          const expected = pendingConfirmation?.confirmationPhrase
          finishConfirmation(typedValue.trim() === expected)
        }}
        onCancel={() => finishConfirmation(false)}
      />

      <section className="panel">
        <h2>Command Outputs</h2>
        <ul className="outputs">
          {commandOutputs.map((result, index) => (
            <li key={`${result.command}-${index}`}>
              <p>
                <strong>{result.command}</strong> · {result.status}
              </p>
              <pre>{result.output}</pre>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Agent Summary</h2>
        <pre>{summary || 'No summary yet.'}</pre>
      </section>

      <AuditLog entries={auditEntries} />
    </main>
  )
}

export default App
