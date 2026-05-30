const DEFAULT_REPO_ROOT = '/tmp/workspace/AbhayRathi/voiceops-demo-repo'

export function resolveRepoRoot() {
  const fromEnv = import.meta.env.VITE_REPO_ROOT
  const candidate = fromEnv || DEFAULT_REPO_ROOT

  if (!candidate || !candidate.startsWith('/')) {
    return null
  }

  return candidate
}

export function validateCommandRepoScope(command, repoRoot) {
  if (!repoRoot) {
    return {
      allowed: false,
      reason: 'Repository root is unavailable, so command scope cannot be verified.',
    }
  }

  const segments = command.split(/\s+/)
  const pathTokens = segments.filter(
    (segment) => segment.startsWith('/') || segment.startsWith('./') || segment.startsWith('../'),
  )

  for (const token of pathTokens) {
    if (token.startsWith('../')) {
      return {
        allowed: false,
        reason: 'Command path attempts to escape outside the repository root.',
      }
    }

    if (token.startsWith('/') && !token.startsWith(repoRoot)) {
      return {
        allowed: false,
        reason: 'Absolute command path is outside the repository root.',
      }
    }
  }

  return { allowed: true }
}
