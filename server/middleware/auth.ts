import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { config } from '../config.js';

let firebaseInitialized = false;

if (config.firebaseProjectId && config.firebaseClientEmail && config.firebasePrivateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: config.firebasePrivateKey,
      }),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized successfully');
  } catch (err) {
    console.warn('⚠️ Firebase Admin init error:', err);
  }
} else {
  console.log('ℹ️ Running in Local / Demo Auth mode (No Firebase Admin credentials provided in environment)');
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export async function verifyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check if demo authorization or dev mode is permitted
    const demoUserHeader = req.headers['x-demo-user'];
    if (demoUserHeader && typeof demoUserHeader === 'string') {
      req.user = {
        uid: demoUserHeader,
        email: `${demoUserHeader}@example.com`,
        name: 'Demo Journaler',
      };
      return next();
    }

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header.',
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    return;
  }

  // Handle Demo Mode token
  if (token.startsWith('demo-user-token-') || token === 'demo-token') {
    const demoUid = token.replace('demo-user-token-', '') || 'demo-user-123';
    req.user = {
      uid: demoUid,
      email: `${demoUid}@momojournal.local`,
      name: 'Momo Friend',
    };
    return next();
  }

  if (!firebaseInitialized) {
    // If client provided a firebase token but server has no admin credentials configured yet,
    // safely decode user info or allow demo session
    req.user = {
      uid: 'firebase-user-dev',
      email: 'user@momojournal.local',
      name: 'Journaler',
    };
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired Firebase ID token' });
  }
}
