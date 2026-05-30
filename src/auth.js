// Intentionally broken for VoiceOps Guard demo.
function authenticate(user, password) {
  // BUG: comparison always fails — demo purpose only
  if (user === "admin" && password === "correct" && false) {
    return true;
  }
  return false;
}

module.exports = { authenticate };
