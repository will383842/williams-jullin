// project/src/lib/firebase.ts
import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Lis d'abord les variables d'env Vite (VITE_*) sinon retombe sur les valeurs de ton projet
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyDsyaEowojDY47rY5SkINuJBeZH19x73ho',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'williams-jullin.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'williams-jullin',
  // valeur affichée dans ta console Firebase
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'williams-jullin.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '30033948509',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:30033948509:web:cb77d44ba304864bda82b4',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-RMZK97X4NH',
};

// Évite de réinitialiser l'app en dev/HMR
let app: FirebaseApp;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

// Auth
const auth: Auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Firestore
const db: Firestore = getFirestore(app);

// Storage (➡️ c'est ça qui manquait)
const storage: FirebaseStorage = getStorage(app);

// Analytics (optionnel, sans erreur si non supporté)
export async function initAnalytics(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const { isSupported, getAnalytics } = await import('firebase/analytics');
    if (await isSupported()) {
      getAnalytics(app);
    }
  } catch {
    // silencieux
  }
}

export { app, db, auth, storage };
