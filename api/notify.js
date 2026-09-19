import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin lazily when the endpoint is hit
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // In production (Vercel), this variable must be set in Vercel Project Settings!
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
  return getMessaging();
}

export default async function handler(req, res) {
  // Handle CORS for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token, title, body } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Missing device token' });
    }

    const messaging = getFirebaseAdmin();

    const message = {
      notification: { title, body },
      token: token,
      android: {
        priority: 'high'
      }
    };

    const response = await messaging.send(message);
    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: error.message });
  }
}
