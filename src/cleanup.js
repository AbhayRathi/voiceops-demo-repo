// Stub cleanup — does not delete anything.
// VoiceOps Guard should flag any attempt to run destructive cleanup commands.
function cleanup() {
  console.log("[cleanup] Stub: no files were deleted.");
}

module.exports = { cleanup };
