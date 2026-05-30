import { validateCommandRepoScope } from './repoRoot.js'

export const BLOCKED_POLICY_PATTERNS = [
  'rm',
  'rm -rf',
  'sudo',
  'chmod',
  'chown',
  'git push',
  'curl | sh',
  'wget | sh',
  'dd',
  'shutdown',
  'reboot',
  'destructive file operations',
  'commands outside the repo root',
  'shell commands with unsafe pipes or redirects',
]

function getRiskLevel(command) {
  const normalized = command.toLowerCase()

  if (
    normalized.includes('git push') ||
    normalized.includes(' rm ') ||
    normalized.startsWith('rm ') ||
    normalized.includes('delete') ||
    normalized.includes('clean everything') ||
    normalized.includes('dd ') ||
    normalized.includes('shutdown') ||
    normalized.includes('reboot')
  ) {
    return 'critical'
  }

  if (
    normalized.includes('git commit') ||
    normalized.includes('npm install') ||
    normalized.includes('npm audit fix')
  ) {
    return 'medium'
  }

  return 'low'
}

function getConfirmationPhrase(command) {
  const normalized = command.toLowerCase()

  if (normalized.includes('git commit')) {
    return 'CONFIRM COMMIT'
  }

  if (normalized.includes('git push')) {
    return 'CONFIRM PUSH'
  }

  if (normalized.includes('delete') || normalized.includes('rm')) {
    return 'CONFIRM DELETE'
  }

  if (normalized.includes('npm install')) {
    return 'CONFIRM INSTALL'
  }

  return null
}

export function evaluateSafety(command, repoRoot) {
  const normalized = command.toLowerCase()
  const risk = getRiskLevel(command)

  if (normalized.includes('curl') && normalized.includes('|') && normalized.includes('sh')) {
    return {
      risk,
      blocked: true,
      requiresConfirmation: false,
      reason: 'Unsafe pipe execution (curl | sh) is blocked by policy.',
    }
  }

  if (normalized.includes('wget') && normalized.includes('|') && normalized.includes('sh')) {
    return {
      risk,
      blocked: true,
      requiresConfirmation: false,
      reason: 'Unsafe pipe execution (wget | sh) is blocked by policy.',
    }
  }

  if (normalized.includes('>') || normalized.includes('>>')) {
    return {
      risk,
      blocked: true,
      requiresConfirmation: false,
      reason: 'Unsafe shell redirects are blocked by policy.',
    }
  }

  const repoScope = validateCommandRepoScope(command, repoRoot)
  if (!repoScope.allowed) {
    return {
      risk,
      blocked: true,
      requiresConfirmation: false,
      reason: repoScope.reason,
    }
  }

  if (
    normalized.includes('rm ') ||
    normalized.includes('delete') ||
    normalized.includes('shutdown') ||
    normalized.includes('reboot') ||
    normalized.includes('dd ') ||
    normalized.includes('git push')
  ) {
    return {
      risk,
      blocked: true,
      requiresConfirmation: false,
      reason: 'This command is blocked in MVP for safety during demos.',
    }
  }

  const confirmationPhrase = getConfirmationPhrase(command)
  return {
    risk,
    blocked: false,
    requiresConfirmation: risk === 'medium' && Boolean(confirmationPhrase),
    reason:
      risk === 'medium' && confirmationPhrase
        ? 'Typed confirmation is required for medium-risk command execution.'
        : 'Low-risk read-only command is allowlisted.',
    confirmationPhrase,
  }
}
