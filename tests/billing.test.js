const { test } = require("node:test");
const assert = require("node:assert/strict");
const { calculateTotal } = require("../src/billing.js");

test("calculateTotal sums item prices correctly", () => {
  const items = [{ price: 10 }, { price: 20 }, { price: 5 }];
  assert.strictEqual(calculateTotal(items), 35);
});
