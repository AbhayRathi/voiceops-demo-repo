#!/usr/bin/env bash
set -e

echo "[setup-demo] Starting VoiceOps Guard demo setup..."

# Initialize git if not already a git repo
if [ ! -d ".git" ]; then
  echo "[setup-demo] Initializing git repository..."
  git init
  git add .
  git commit -m "chore: initial demo repo commit"
  echo "[setup-demo] Initial commit created."
else
  echo "[setup-demo] Git repository already initialized."
fi

# Create initial commit if none exists
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
if [ "$COMMIT_COUNT" = "0" ]; then
  echo "[setup-demo] Creating initial commit..."
  git add .
  git commit -m "chore: initial demo repo commit"
fi

# Leave one intentional uncommitted change
# Idempotent: only append if the TODO isn't already there
if ! grep -q "TODO: add input validation" src/billing.js; then
  echo "" >> src/billing.js
  echo "// TODO: add input validation for calculateTotal inputs" >> src/billing.js
  echo "[setup-demo] Appended TODO to src/billing.js — this is the intentional uncommitted change."
else
  echo "[setup-demo] Intentional uncommitted change already present in src/billing.js."
fi

echo ""
echo "[setup-demo] Done. Run 'git status' to see the intentional uncommitted change."
echo "[setup-demo] Run 'npm test' to see the intentionally failing auth test."
