export function classifyIntent(utterance) {
  const normalized = utterance.toLowerCase()

  if (normalized.includes('safe to push') || normalized.includes('pre-push')) {
    return 'pre-push-check'
  }

  if (normalized.includes('explain') && normalized.includes('test')) {
    return 'explain-test-failure'
  }

  if (normalized.includes('security')) {
    return 'security-scan'
  }

  if (normalized.includes('commit') && normalized.includes('push')) {
    return 'commit-and-push'
  }

  if (normalized.includes('delete') || normalized.includes('clean')) {
    return 'cleanup-request'
  }

  return 'general-assessment'
}

export function createPlan(intent) {
  switch (intent) {
    case 'pre-push-check':
      return ['git status', 'git diff --stat', 'git diff --name-only', 'npm test', 'npm run lint', 'npm audit', 'secret scan']
    case 'explain-test-failure':
      return ['npm test']
    case 'security-scan':
      return ['npm audit', 'secret scan']
    case 'commit-and-push':
      return ['git status', 'git commit -am "demo"', 'git push']
    case 'cleanup-request':
      return ['delete all old logs']
    default:
      return ['git status']
  }
}

export function explainTestFailure() {
  return 'The pre-push test run failed because one safety gate assertion expects pushes to be blocked when tests fail.'
}

export function generateReadinessReport(intent, commandResults) {
  const hasFailedTests = commandResults.some((entry) => entry.command === 'npm test' && !entry.success)
  const hasSecretWarning = commandResults.some((entry) => entry.command === 'secret scan' && !entry.success)

  if (intent === 'explain-test-failure') {
    return explainTestFailure()
  }

  if (hasFailedTests || hasSecretWarning) {
    return 'Repo is not ready to push: one failing test and one secret warning were detected.'
  }

  return 'Repo checks look healthy and no high-risk findings were detected.'
}

export function evaluateSession() {
  return {
    score: 89,
    summary: 'Session score is 89 out of 100.',
    guardrail: 'Always block push when tests are failing and require typed confirmation for commit intents.',
  }
}

export function summarizeForVoice(intent, report, evaluation) {
  if (intent === 'explain-test-failure') {
    return 'I analyzed the failed test and found a pre-push safety gate assertion failure.'
  }

  if (intent === 'commit-and-push') {
    return 'I can’t push without typed confirmation, and push stays blocked while tests are failing.'
  }

  if (report.toLowerCase().includes('not ready')) {
    return 'I’m running a pre-push check now. Tests failed, so this repo is not ready to push.'
  }

  return `${evaluation.summary} I added one guardrail.`
}
