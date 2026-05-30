# voiceops-demo-repo

> ⚠️ **This repo is intentionally broken.** It is the *target* ("patient") used to demo
> VoiceOps Guard — a voice-controlled terminal agent that scans repos, explains failures,
> blocks risky actions, and evaluates sessions.

Do **not** fix the bugs here. They exist on purpose.

## Expected demo outputs

| Command | Expected result |
|---|---|
| `npm test` | ✅ billing test passes · ❌ auth test **fails** (intentional) |
| `npm run lint` | ✅ exits 0 · ⚠️ prints TODO warning |
| `npm run audit:mock` | ✅ exits 0 · ⚠️ prints fake dependency warning |
| `git status` (after `bash setup-demo.sh`) | Shows one intentionally modified file |

## Setup

```bash
bash setup-demo.sh
```

## What VoiceOps Guard will find

- One failing test in `tests/auth.test.js`
- A fake secret-looking value in `src/config.js` (clearly labelled as demo-only)
- An uncommitted change in `src/billing.js` after running `setup-demo.sh`
- Lint and audit warnings (no real vulnerabilities)

## Important

- **No real secrets** are present in this repo.
- **No network calls** are made by any script.
- **No destructive operations** are performed.
