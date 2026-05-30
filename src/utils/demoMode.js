export const isDemoMode = typeof __DEMO_MODE__ !== 'undefined' ? __DEMO_MODE__ : false

const MOCK_COMMAND_OUTPUTS = {
  'git status': {
    output:
      'On branch demo/hackathon\nChanges not staged for commit:\n  modified: src/App.jsx\n  modified: src/utils/safetyPolicy.js\nUntracked files:\n  src/components/AuditLog.jsx',
    success: true,
  },
  'git diff --stat': {
    output: ' src/App.jsx | 42 ++++++++++++++++++++++\n src/utils/fallbackAgent.js | 18 ++++++++++',
    success: true,
  },
  'git diff --name-only': {
    output: 'src/App.jsx\nsrc/utils/fallbackAgent.js\nsrc/components/StatusTimeline.jsx',
    success: true,
  },
  'npm test': {
    output:
      'FAIL src/demo.spec.js\n  ✕ should block push when tests fail\n\nTest Suites: 1 failed, 4 passed, 5 total',
    success: false,
  },
  'npm run lint': {
    output: 'Lint completed: no critical issues found. One optional rule unavailable in demo mode.',
    success: true,
  },
  'npm audit': {
    output: 'npm audit unavailable in demo mode sandbox; returning cached advisory summary.',
    success: true,
  },
  'secret scan': {
    output:
      'Potential secret pattern detected: AWS_ACCESS_KEY_ID-like token in src/config/example.env (demo warning).',
    success: false,
  },
}

export function getDemoCommandResult(command) {
  const normalized = command.trim().toLowerCase()

  if (normalized.includes('git push')) {
    return {
      status: 'blocked',
      output: 'Push blocked: tests are failing in demo mode.',
      success: false,
    }
  }

  if (normalized.includes('delete') || normalized.includes('rm')) {
    return {
      status: 'blocked',
      output: 'Delete request simulated only. No files were deleted.',
      success: false,
    }
  }

  const output = MOCK_COMMAND_OUTPUTS[normalized]
  if (output) {
    return {
      status: output.success ? 'ok' : 'warning',
      ...output,
    }
  }

  return {
    status: 'ok',
    output: `Demo command executed: ${command}`,
    success: true,
  }
}
