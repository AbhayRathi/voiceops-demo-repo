import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateSafety } from './safetyPolicy.js'

test('blocks push command in MVP policy', () => {
  const result = evaluateSafety('git push', '/workspace/repo')

  assert.equal(result.blocked, true)
  assert.equal(result.requiresConfirmation, false)
})

test('requires typed confirmation for medium risk commit', () => {
  const result = evaluateSafety('git commit -am "demo"', '/workspace/repo')

  assert.equal(result.blocked, false)
  assert.equal(result.requiresConfirmation, true)
  assert.equal(result.confirmationPhrase, 'CONFIRM COMMIT')
})
