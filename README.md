# voiceops-demo-repo

**This repo is intentionally broken.** It exists as a demo target for [VoiceOps Guard](https://github.com/example/voiceops-guard) — a voice-controlled terminal agent that scans repos, runs checks, explains failures, blocks risky actions, and evaluates sessions.

This repo is the **patient**, not the doctor.

## Setup

```bash
bash setup-demo.sh
```

This initializes git (if needed), creates an initial commit (if none exists), and leaves one intentional uncommitted change for VoiceOps to detect.

## Expected outputs

| Command | Expected result |
|---|---|
| `npm test` | **Fails** — one auth test intentionally fails, one billing test passes |
| `npm run lint` | **Passes** (exit 0) — prints a TODO warning |
| `npm run audit:mock` | **Passes** (exit 0) — prints a fake dependency warning |
| `git status` (after setup) | Shows one modified file (`src/billing.js`) |

## What VoiceOps Guard can scan here

- A failing test in `tests/auth.test.js`
- A fake secret-looking value in `src/config.js` (NOT a real secret)
- A pending TODO in `src/billing.js`
- Stale logs in `logs/`
- A mock audit warning from `scripts/audit-mock.js`

## Notes

- No real secrets are present in this repo.
- No network calls are made by any script.
- No external npm dependencies are required.
- All scripts use Node.js built-ins only.
