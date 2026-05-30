// tests/auth.test.js
// Uses Node.js built-in test runner (node:test).
// One test intentionally fails to give VoiceOps Guard something to explain.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateToken, hashPassword, checkPermission } from '../src/auth.js';

test('validateToken returns false for empty string', () => {
  // INTENTIONALLY FAILING: validateToken has a bug where it uses assignment
  // instead of equality, causing it to always return true for non-null tokens.
  assert.strictEqual(validateToken(''), false);
});

test('validateToken returns true for a valid-looking token', () => {
  assert.strictEqual(validateToken('some-valid-token'), true);
});

test('hashPassword returns a base64 string', () => {
  const result = hashPassword('secret');
  assert.ok(typeof result === 'string');
  assert.ok(result.length > 0);
});

test('checkPermission allows admin to delete', () => {
  const admin = { role: 'admin' };
  assert.strictEqual(checkPermission(admin, 'delete'), true);
});

test('checkPermission denies user from deleting', () => {
  const user = { role: 'user' };
  assert.strictEqual(checkPermission(user, 'delete'), false);
});