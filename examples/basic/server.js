const express = require('express');
const { GuardianJS } = require('../../dist');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable TLS fingerprinting
const guardian = new GuardianJS({
  useTLS: true,
  config: {
    tlsThreshold: 0.7,  // Confidence threshold for suspicious TLS patterns
    tlsRules: {
      requireSecureProtocol: true,
      allowedCiphers: ['TLS_AES_128_GCM_SHA256', 'TLS_AES_256_GCM_SHA384'],
      minProtocolVersion: 'TLSv1.2'
    }
  }
});

const PORT = process.env.PORT || 3005;

// Add body parser middleware
app.use(express.json());

// Add GuardianJS middleware
app.use(guardian.middleware());

// Basic route
app.get('/', (req, res) => {
  res.send('Protected by GuardianJS - Basic Example');
});

// Enhanced check endpoint with TLS info
app.post('/check', async (req, res) => {
  try {
    const result = await guardian.detect(req);
    
    // Get TLS connection info
    const tlsInfo = req.socket.encrypted ? {
      protocol: req.socket.getProtocol?.(),
      cipher: req.socket.getCipher?.(),
      clientCertificate: req.socket.getPeerCertificate?.()
    } : null;

    res.json({
      detection: result,
      clientInfo: {
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.ip,
        method: req.method,
        path: req.path
      },
      tlsInfo: tlsInfo,  // Include TLS information
      isSecure: Boolean(req.socket.encrypted)
    });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: 'Detection failed' });
  }
});

// Status endpoint with TLS info
app.get('/status', (req, res) => {
  res.json({
    status: 'active',
    uptime: process.uptime(),
    timestamp: Date.now(),
    tls: {
      enabled: Boolean(guardian.config.useTLS),
      isSecure: Boolean(req.socket.encrypted)
    }
  });
});

// Create HTTPS server
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs/cert.pem')),
  minVersion: 'TLSv1.2',
  cipherSuites: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384'
  ]
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`);
}); 