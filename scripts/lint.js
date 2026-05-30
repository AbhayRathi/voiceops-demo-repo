#!/usr/bin/env node
// scripts/lint.js
// Demo linter — exits 0 but prints a TODO warning to show VoiceOps Guard
// that lint is "passing with concerns."

console.warn('[lint] WARNING: TODO found in src/billing.js — prorated refund logic not implemented.');
console.warn('[lint] WARNING: src/auth.js uses assignment in conditional (possible bug).');
console.log('[lint] Lint check complete. 0 blocking errors. 2 warnings.');
process.exit(0);