# VoiceOps Guard Demo

A deterministic, demo-ready VoiceOps Guard UI with safety gating and auditability.

## Run

```bash
npm install
DEMO_MODE=true npm run dev
```

### Notes

- `DEMO_MODE=true` enables deterministic mock outputs for pre-push checks and safety outcomes.
- Repo root defaults to `/tmp/workspace/AbhayRathi/voiceops-demo-repo` and can be overridden with `VITE_REPO_ROOT`.
- The app blocks destructive actions (`git push`, delete/cleanup commands) in this MVP.

## Validate

```bash
npm test
npm run lint
npm run build
```
