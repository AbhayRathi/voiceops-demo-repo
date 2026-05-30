const DEFAULT_REPO_ROOT = '/workspace/repo'
const WINDOWS_ABSOLUTE_PATH = /^[a-zA-Z]:\\/

function isAbsolutePath(pathValue) {
  return /^\//.test(pathValue) || WINDOWS_ABSOLUTE_PATH.test(pathValue)
}

export function resolveRepoRoot() {
  const fromEnv = import.meta.env.VITE_REPO_ROOT
  const candidate = fromEnv || DEFAULT_REPO_ROOT

  if (!candidate || !isAbsolutePath(candidate)) {
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
    (segment) =>
      segment.startsWith('/') || segment.startsWith('./') || segment.startsWith('../') || WINDOWS_ABSOLUTE_PATH.test(segment),
  )

  for (const token of pathTokens) {
    if (token.startsWith('../')) {
      return {
        allowed: false,
        reason: 'Command path attempts to escape outside the repository root.',
      }
    }

    if ((token.startsWith('/') || WINDOWS_ABSOLUTE_PATH.test(token)) && !token.startsWith(repoRoot)) {
      return {
        allowed: false,
        reason: 'Absolute command path is outside the repository root.',
      }
    }
  }

  return { allowed: true }
}
