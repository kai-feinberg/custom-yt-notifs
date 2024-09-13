// /lib/firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from './firebase-admin.json'; // Path to your service account file

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

export { db, admin };