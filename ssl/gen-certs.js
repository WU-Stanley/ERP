const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  }
});

// Create self-signed certificate
const cert = crypto.createSelfSignedCertificate ? null : null;

// Build certificate manually using crypto
const now = new Date();
const certStr = `-----BEGIN CERTIFICATE-----
${crypto.randomBytes(100).toString('base64')}
-----END CERTIFICATE-----`;

// Use openssl via child_process instead
const { execSync } = require('child_process');

try {
  fs.mkdirSync('ssl', { recursive: true });
  
  // Generate private key
  execSync('openssl genrsa -out ssl/server.key 2048 2>&1');
  
  // Generate self-signed certificate
  execSync('openssl req -x509 -new -nodes -key ssl/server.key -sha256 -days 365 -out ssl/server.crt -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" 2>&1');
  
  console.log('SSL certificates generated successfully!');
  console.log('Key: ssl/server.key');
  console.log('Cert: ssl/server.crt');
} catch (err) {
  console.error('Error generating certificates:', err.message);
  process.exit(1);
}
