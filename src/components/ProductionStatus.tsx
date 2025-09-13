import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Eye, EyeOff, Play, RefreshCw } from 'lucide-react';
import { checkProductionReadiness, getFirebaseConnectionStatus } from '../utils/productionCheck';
import { testFirebaseConnection, checkEnvironmentVariables } from '../services/firebaseTest';

const ProductionStatus: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [firebaseTestResults, setFirebaseTestResults] = useState(null);
  const results = checkProductionReadiness();
  const firebaseStatus = getFirebaseConnectionStatus();
  const envStatus = checkEnvironmentVariables();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const readyCount = results.filter(r => r.status === 'ready').length;
  const totalCount = results.length;
  const isProductionReady = readyCount === totalCount && firebaseStatus.configured && envStatus.allConfigured;

  const runFirebaseTests = async () => {
    setIsTestingFirebase(true);
    try {
      const testResults = await testFirebaseConnection();
      setFirebaseTestResults(testResults);
    } catch (error) {
      setFirebaseTestResults([{
        test: 'Connexion Firebase',
        status: 'error',
        message: 'Erreur lors du test',
        details: error.message
      }]);
    }
    setIsTestingFirebase(false);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          title="Vérifier l'état de production"
        >
          <Eye size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[420px]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className={`p-4 ${isProductionReady ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isProductionReady ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
              <div>
                <h3 className="font-bold">État de Production</h3>
                <p className="text-sm opacity-90">
                  {isProductionReady ? '🚀 PRODUCTION READY' : `${readyCount}/${totalCount} composants prêts`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <EyeOff size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          
          {/* Firebase Connection Test */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-blue-800">Test Connexion Firebase</span>
              <button
                onClick={runFirebaseTests}
                disabled={isTestingFirebase}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors disabled:opacity-50"
              >
                {isTestingFirebase ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                <span>{isTestingFirebase ? 'Test...' : 'Tester'}</span>
              </button>
            </div>
            
            {firebaseTestResults && (
              <div className="space-y-2">
                {firebaseTestResults.map((result, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                    <span className={result.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                      {result.test}: {result.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Firebase Status */}
          <div className={`p-3 rounded-lg border ${firebaseStatus.configured ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {firebaseStatus.configured ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="font-semibold text-sm">Connexion Firebase</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="grid grid-cols-2 gap-2">
                {envStatus.variables.map((variable, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <span className="text-xs">{variable.name.replace('VITE_FIREBASE_', '')}:</span>
                    <span className="text-xs">{variable.configured ? '✅' : '❌'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Components Status */}
          {results.map((result, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
              <div className="flex items-center space-x-2 mb-1">
                {getStatusIcon(result.status)}
                <span className="font-semibold text-sm">{result.category}</span>
              </div>
              <p className="text-xs text-gray-700 mb-1">{result.message}</p>
              {result.details && (
                <p className="text-xs text-gray-500">{result.details}</p>
              )}
            </div>
          ))}

          {/* Production Ready Status */}
          <div className={`p-4 rounded-lg border-2 ${isProductionReady ? 'border-green-300 bg-green-100' : 'border-red-300 bg-red-100'}`}>
            <div className="text-center">
              <div className="text-2xl mb-2">
                {isProductionReady ? '🚀' : '⚠️'}
              </div>
              <p className="font-bold text-sm">
                {isProductionReady ? 'PRODUCTION READY!' : 'CONFIGURATION REQUISE'}
              </p>
              {!isProductionReady && (
                <p className="text-xs mt-1">
                  {!envStatus.allConfigured ? 'Variables .env manquantes' : 'Activez Firestore & Auth dans Firebase Console'}
                </p>
              )}
              
              {isProductionReady && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-700">✅ Frontend/Backend connectés</p>
                  <p className="text-xs text-green-700">✅ Prêt pour déploiement</p>
                  <p className="text-xs text-green-700">✅ SEO optimisé</p>
                  <p className="text-xs text-green-700">✅ 7 langues supportées</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionStatus;