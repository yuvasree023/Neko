import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { geminiRouter } from './routes/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Let Vite dev server run smoothly
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost in dev and explicit domains
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Momo Journal API',
    mode: config.isDemoMode ? 'demo-mock' : 'live-gemini',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/gemini', geminiRouter);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const server = app.listen(config.port, () => {
  console.log(`🐾 Momo Journal Server running on port ${config.port}`);
  console.log(`🚀 Mode: ${config.isDemoMode ? 'Demo / Offline Safe Mode (Simulated AI)' : 'Gemini Connected'}`);
});

export default app;
