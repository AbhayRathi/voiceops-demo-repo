// tests/billing.test.js
// Uses Node.js built-in test runner (node:test).
// All billing tests pass — demonstrates a healthy module alongside the broken auth module.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotal, applyDiscount, formatCurrency } from '../src/billing.js';

test('calculateTotal sums item prices correctly', () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 1 },
  ];
  assert.strictEqual(calculateTotal(items), 25);
});

test('applyDiscount reduces total by the given percentage', () => {
  assert.strictEqual(applyDiscount(100, 20), 80);
});

test('applyDiscount throws on invalid discount', () => {
  assert.throws(() => applyDiscount(100, -1), /Invalid discount/);
  assert.throws(() => applyDiscount(100, 101), /Invalid discount/);
});

test('formatCurrency formats a number as a dollar string', () => {
  assert.strictEqual(formatCurrency(9.9), '$9.90');
  assert.strictEqual(formatCurrency(100), '$100.00');
});