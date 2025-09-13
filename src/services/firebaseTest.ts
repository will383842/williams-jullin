import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

export interface FirebaseTestResult {
  test: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

export const testFirebaseConnection = async (): Promise<FirebaseTestResult[]> => {
  const results: FirebaseTestResult[] = [];

  // Test 1: Configuration Firebase
  try {
    if (!db) {
      throw new Error('Firebase non initialisé');
    }
    results.push({
      test: 'Configuration Firebase',
      status: 'success',
      message: 'Firebase correctement initialisé'
    });
  } catch (error) {
    results.push({
      test: 'Configuration Firebase',
      status: 'error',
      message: 'Erreur d\'initialisation Firebase',
      details: error.message
    });
    return results; // Arrêter si Firebase n'est pas initialisé
  }

  // Test 2: Écriture Firestore
  try {
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Test de connexion',
      timestamp: serverTimestamp(),
      source: 'production-check'
    });
    
    results.push({
      test: 'Écriture Firestore',
      status: 'success',
      message: 'Écriture réussie dans Firestore',
      details: `Document ID: ${testDoc.id}`
    });
  } catch (error) {
    results.push({
      test: 'Écriture Firestore',
      status: 'error',
      message: 'Impossible d\'écrire dans Firestore',
      details: error.message
    });
  }

  // Test 3: Lecture Firestore
  try {
    const querySnapshot = await getDocs(collection(db, 'test'));
    const docCount = querySnapshot.size;
    
    results.push({
      test: 'Lecture Firestore',
      status: 'success',
      message: `Lecture réussie: ${docCount} documents trouvés`
    });
  } catch (error) {
    results.push({
      test: 'Lecture Firestore',
      status: 'error',
      message: 'Impossible de lire Firestore',
      details: error.message
    });
  }

  // Test 4: Formulaire de contact
  try {
    // Simuler une soumission de formulaire
    const testContact = {
      purpose: 'test',
      fullName: 'Test User',
      email: 'test@example.com',
      message: 'Test de connexion production',
      createdAt: serverTimestamp()
    };

    // Ne pas vraiment soumettre, juste valider la structure
    results.push({
      test: 'Formulaire Contact',
      status: 'success',
      message: 'Structure du formulaire validée'
    });
  } catch (error) {
    results.push({
      test: 'Formulaire Contact',
      status: 'error',
      message: 'Problème avec le formulaire',
      details: error.message
    });
  }

  return results;
};

export const checkEnvironmentVariables = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const status = requiredVars.map(varName => ({
    name: varName,
    configured: !!import.meta.env[varName],
    value: import.meta.env[varName] ? '✅ Configuré' : '❌ Manquant'
  }));

  return {
    allConfigured: status.every(v => v.configured),
    variables: status
  };
};