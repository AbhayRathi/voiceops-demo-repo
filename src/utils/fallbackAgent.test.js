import assert from 'node:assert/strict'
import test from 'node:test'

import { classifyIntent, createPlan, evaluateSession, generateReadinessReport } from './fallbackAgent.js'

test('classifies safety to push utterance as pre-push check', () => {
  assert.equal(classifyIntent('Check if this repo is safe to push'), 'pre-push-check')
})

test('pre-push plan contains key deterministic checks', () => {
  const plan = createPlan('pre-push-check')

  assert.deepEqual(plan.slice(0, 4), ['git status', 'git diff --stat', 'git diff --name-only', 'npm test'])
})

test('readiness report reflects failed tests and secret warning', () => {
  const report = generateReadinessReport('pre-push-check', [
    { command: 'npm test', success: false },
    { command: 'secret scan', success: false },
  ])

  assert.match(report, /not ready to push/i)
})

test('session evaluation returns deterministic score and guardrail', () => {
  const evaluation = evaluateSession()

  assert.equal(evaluation.score, 89)
  assert.match(evaluation.guardrail, /block push/i)
})
