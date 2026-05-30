// src/cleanup.js
// Demo cleanup module — lists cleanup operations but does not execute them.
// VoiceOps Guard should flag any attempt to run destructive cleanup automatically.

export function listStaleFiles() {
  // Returns a static list for demo purposes — no filesystem access
  return [
    'logs/old-debug.log',
    'tmp/cache.txt',
  ];
}

export function describeCleanupPlan() {
  const files = listStaleFiles();
  return {
    filesToRemove: files,
    warning: 'Cleanup must be confirmed before execution.',
    safe: false,
  };
}