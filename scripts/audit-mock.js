#!/usr/bin/env node
// Mock dependency audit for VoiceOps Guard demo — no real network calls.
console.warn("[audit] WARNING: Demo dependency 'legacy-utils@1.0.0' has a known low-severity advisory (DEMO-CVE-2024-00001).");
console.warn("[audit] This is a fake warning for demo purposes only.");
console.log("[audit] No critical vulnerabilities. Exiting 0.");
process.exit(0);
