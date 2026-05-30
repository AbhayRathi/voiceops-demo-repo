#!/usr/bin/env node
// scripts/audit-mock.js
// Demo dependency audit — exits 0 but prints a fake vulnerability warning.
// No real network calls or npm audit is performed.

console.log('[audit] Running mock dependency audit...');
console.warn('[audit] MODERATE: fake-dep@1.2.3 — Prototype pollution in merge utility (DEMO-CVE-2024-00001)');
console.warn('[audit] INFO: lodash-demo@4.17.0 — Outdated; consider updating (not a real finding)');
console.log('[audit] Mock audit complete. 1 moderate, 1 informational. No critical vulnerabilities.');
console.log('[audit] NOTE: This is a demo audit output. No real dependencies were scanned.');
process.exit(0);