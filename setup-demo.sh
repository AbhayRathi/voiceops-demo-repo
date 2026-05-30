#!/usr/bin/env bash
# setup-demo.sh
# Idempotent setup script for the VoiceOps Guard demo repo.
# Initializes git if needed, creates an initial commit if none exists,
# and leaves one intentional uncommitted change for VoiceOps to detect.

set -e

echo "[setup-demo] Starting demo setup..."

# Initialize git if not already a repo
if [ ! -d ".git" ]; then
  git init
  echo "[setup-demo] Initialized new git repository."
fi

# Configure a local git identity if not set (needed in CI/clean environments)
git config user.email "demo@voiceops.local" 2>/dev/null || true
git config user.name "VoiceOps Demo" 2>/dev/null || true

# Create an initial commit if none exists
if ! git rev-parse HEAD >/dev/null 2>&1; then
  git add .
  git commit -m "chore: initial demo repo state"
  echo "[setup-demo] Created initial commit."
else
  echo "[setup-demo] Initial commit already exists, skipping."
fi

# Leave one intentional uncommitted change: append a TODO to src/billing.js
# Use a marker so this is idempotent (won't double-append)
MARKER="# TODO: implement prorated refund logic"
if ! grep -qF "$MARKER" src/billing.js; then
  echo "" >> src/billing.js
  echo "$MARKER" >> src/billing.js
  echo "[setup-demo] Added TODO to src/billing.js (intentional uncommitted change)."
else
  echo "[setup-demo] TODO already present in src/billing.js, skipping."
fi

echo "[setup-demo] Done. Run 'git status' to see the intentional uncommitted change."