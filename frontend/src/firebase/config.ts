import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;

if (firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    // Helps in environments where WebSockets are blocked and Firestore
    // incorrectly appears offline.
    experimentalForceLongPolling: true,
  });
} else {
  // Firebase not configured – calling features will be unavailable.
  console.warn(
    '[AMU-SmartCare] Firebase is not configured. Set REACT_APP_FIREBASE_* env vars to enable calling.'
  );
  // Cast so TypeScript is satisfied while the rest of the code checks for null.
  app = null as unknown as FirebaseApp;
  db = null as unknown as Firestore;
}

export { app, db };
export const isFirebaseConfigured = !!firebaseConfig.projectId;
