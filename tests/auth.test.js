const { test } = require("node:test");
const assert = require("node:assert/strict");
const { authenticate } = require("../src/auth.js");

test("authenticate returns true for valid credentials", () => {
  // This test fails intentionally — authenticate() always returns false due to a bug in src/auth.js
  assert.strictEqual(authenticate("admin", "correct"), true);
});
