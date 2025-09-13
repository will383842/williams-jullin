import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase production
const firebaseConfig = {
  apiKey: "AIzaSyDsyaEowojDY47rY5SkINuJBeZH19x73ho",
  authDomain: "williams-jullin.firebaseapp.com",
  projectId: "williams-jullin",
  storageBucket: "williams-jullin.firebasestorage.app",
  messagingSenderId: "30033948509",
  appId: "1:30033948509:web:cb77d44ba304864bda82b4",
  measurementId: "G-RMZK97X4NH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize analytics only in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;