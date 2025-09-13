import React, { useState } from 'react';
import { Database, Play, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { seedFirestoreData, type SeedDataResult } from '../utils/firestoreDataSeeder';

const FirestoreSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [results, setResults] = useState<SeedDataResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const runSeeding = async () => {
    setIsSeeding(true);
    try {
      const seedResults = await seedFirestoreData();
      setResults(seedResults);
      console.log('🌱 Seeding terminé:', seedResults);
    } catch (error) {
      console.error('Erreur lors du seeding:', error);
    }
    setIsSeeding(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
          title="Créer des données de test Firestore"
        >
          <Database size={20} />
          <span className="hidden sm:inline text-sm font-medium">Seed Data</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[400px]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6" />
              <div>
                <h3 className="font-bold">Firestore Data Seeder</h3>
                <p className="text-sm opacity-90">Créer des données de test</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <button
              onClick={runSeeding}
              disabled={isSeeding}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              {isSeeding ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isSeeding ? 'Création en cours...' : 'CRÉER DONNÉES TEST'}</span>
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Résultats :</h4>
              {results.map((result, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.collection}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                    {result.documentsCreated > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        {result.documentsCreated} documents créés
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>💡 Info :</strong> Ceci créera des données de test dans vos collections Firestore (contacts, investors, analytics) pour que vous puissiez voir du contenu dans la console admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreSeeder;