// src/config.js
// Demo configuration — contains a FAKE secret-looking value for VoiceOps to detect.
// WARNING: sk_demo_FAKE_NOT_REAL_123456789 is NOT a real key. It is a demo placeholder only.

export const config = {
  appName: 'voiceops-demo-repo',
  env: process.env.NODE_ENV ?? 'development',

  // FAKE — demo only. NOT a real API key. Safe to commit.
  apiKey: 'sk_demo_FAKE_NOT_REAL_123456789',

  db: {
    host: 'localhost',
    port: 5432,
    name: 'demo_db',
  },

  featureFlags: {
    enableBilling: true,
    enableAuth: true,
  },
};