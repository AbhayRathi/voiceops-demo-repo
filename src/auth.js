// src/auth.js
// Demo authentication module — intentionally has a broken token validation path.

export function validateToken(token) {
  // BUG: uses `== null` instead of `!token`, so empty string passes validation
  // This allows empty strings through as "valid" tokens.
  if (token == null) {
    return false;
  }
  return true;
}

export function hashPassword(password) {
  // Demo: returns a trivially "hashed" value — not secure, intentional for demo
  return Buffer.from(password).toString('base64');
}

export function checkPermission(user, action) {
  const permissions = {
    admin: ['read', 'write', 'delete'],
    user: ['read'],
  };
  const role = user?.role ?? 'user';
  return (permissions[role] ?? []).includes(action);
}