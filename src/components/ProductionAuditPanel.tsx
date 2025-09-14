// src/components/ProductionAuditPanel.tsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Play, 
  Download,
  Eye,
  EyeOff,
  Database,
  Shield,
  Globe,
  Zap,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { runComprehensiveProductionTest, type ComprehensiveTestResult } from '../utils/comprehensiveProductionTest';

const ProductionAuditPanel: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ComprehensiveTestResult[]>([]);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [detailedReport, setDetailedReport] = useState<string>('');
  const [isProductionReady, setIsProductionReady] = useState(false);

  // Optionnel : nombre de langues supportées (pour l’élément de checklist)
  const languagesSupported = 7;

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const { results: auditResults, report, isProductionReady: ready } = await runComprehensiveProductionTest();
      setResults(auditResults);
      setDetailedReport(report);
      setIsProductionReady(ready);
      setLastRun(new Date());
    } catch (error) {
      console.error('Erreur lors de l\'audit:', error);
    }
    setIsRunning(false);
  };

  useEffect(() => {
    if (isVisible && results.length === 0) {
      runAudit();
    }
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Configuration Firebase':
      case 'Connexion Firestore':
      case 'Règles Firestore':
        return <Database className="h-5 w-5" />;
      case 'Formulaire Contact':
      case 'Formulaire Investisseurs':
      case 'Console Administration':
        return <Settings className="h-5 w-5" />;
      case 'Sécurité':
        return <Shield className="h-5 w-5" />;
      case 'SEO & Performance':
      case 'Performance':
        return <Zap className="h-5 w-5" />;
      case 'Internationalisation':
      case 'Navigation SPA':
        return <Globe className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, ComprehensiveTestResult[]>);

  const totalTests = results.length;
  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const successRate = totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0;

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      isProductionReady,
      summary: {
        totalTests,
        successCount,
        warningCount,
        errorCount,
        successRate,
        isProductionReady
      },
      detailedReport,
      results: groupedResults
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
          title={t('admin.audit.open_title') as string}
          aria-label={t('admin.audit.open_title') as string}
        >
          <Eye size={20} />
          <span className="hidden sm:inline text-sm font-medium">
            {t('admin.audit.open_button')}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-[500px] max-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className={`p-4 ${isProductionReady ? 'bg-green-600' : errorCount > 0 ? 'bg-red-600' : 'bg-yellow-600'} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isProductionReady ? (
                <CheckCircle className="h-6 w-6" />
              ) : errorCount > 0 ? (
                <XCircle className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
              <div>
                <h3 className="font-bold">{t('admin.audit.header_title')}</h3>
                <p className="text-sm opacity-90">
                  {isProductionReady
                    ? t('admin.status.production_ready_badge')
                    : t('admin.audit.success_ratio', {
                        success: successCount,
                        total: totalTests,
                        rate: successRate
                      })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportReport}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={t('admin.audit.export') as string}
                aria-label={t('admin.audit.export') as string}
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={t('admin.audit.close_panel') as string}
                title={t('admin.audit.close_panel') as string}
              >
                <EyeOff size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={runAudit}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-bold flex items-center space-x-2 transition-colors shadow-lg"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>
                  {isRunning ? t('admin.audit.running') : t('admin.audit.run_full')}
                </span>
              </button>
              
              {lastRun && (
                <span className="text-xs text-gray-500">
                  {t('admin.audit.last_run', { time: lastRun.toLocaleTimeString() })}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">{successCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-700 font-medium">{warningCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 font-medium">{errorCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[500px] overflow-y-auto">
          {Object.entries(groupedResults).map(([category, categoryResults]) => (
            <div key={category} className="border-b border-gray-100 last:border-b-0">
              <div className="p-4 bg-gray-50">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <h4 className="font-bold text-gray-900">{category}</h4>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {t('admin.audit.tests_count', { count: categoryResults.length })}
                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {categoryResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">{result.test}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{result.message}</p>
                        
                        {result.details && (
                          <div className="text-xs text-gray-600 bg-white/50 rounded p-2 mb-2">
                            <strong>{t('admin.audit.details_label')} </strong>
                            {typeof result.details === 'string' ? result.details : JSON.stringify(result.details)}
                          </div>
                        )}
                        
                        {result.recommendation && (
                          <div className="text-xs text-blue-700 bg-blue-50 rounded p-2">
                            <strong>💡 {t('admin.audit.recommendation_label')} </strong>
                            {result.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={`p-6 ${isProductionReady ? 'bg-green-100 border-green-200' : errorCount > 0 ? 'bg-red-100 border-red-200' : 'bg-yellow-100 border-yellow-200'} border-t-2`}>
          <div className="text-center">
            <div className="text-3xl mb-3">
              {isProductionReady ? '🚀' : errorCount > 0 ? '🚨' : '⚠️'}
            </div>
            <p className="font-bold text-lg mb-3">
              {isProductionReady
                ? t('admin.status.ready_headline')
                : errorCount > 0
                  ? t('admin.status.critical_errors_headline')
                  : t('admin.status.improvements_headline')}
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <div className="font-bold text-green-700">{successCount}</div>
                <div className="text-green-600">{t('admin.audit.success')}</div>
              </div>
              <div>
                <div className="font-bold text-yellow-700">{warningCount}</div>
                <div className="text-yellow-600">{t('admin.audit.warnings')}</div>
              </div>
              <div>
                <div className="font-bold text-red-700">{errorCount}</div>
                <div className="text-red-600">{t('admin.audit.errors')}</div>
              </div>
            </div>
            
            {isProductionReady && (
              <div className="mt-3 space-y-1">
                <p className="text-sm text-green-700 font-medium">✅ {t('admin.audit.checklist.contacts')}</p>
                <p className="text-sm text-green-700 font-medium">✅ {t('admin.audit.checklist.admin_console')}</p>
                <p className="text-sm text-green-700 font-medium">✅ {t('admin.audit.checklist.firestore')}</p>
                <p className="text-sm text-green-700 font-medium">✅ {t('admin.audit.checklist.languages', { count: languagesSupported })}</p>
                <p className="text-sm text-green-700 font-medium">✅ {t('admin.audit.checklist.spa')}</p>
                <p className="text-sm text-green-700 font-medium">✅ {t('admin.audit.checklist.performance')}</p>
                <p className="text-sm text-green-700 font-medium">✅ {t('admin.audit.checklist.security')}</p>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-600">
              <p>
                {t('admin.audit.footer', {
                  count: totalTests,
                  time: lastRun ? lastRun.toLocaleTimeString() : '—'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionAuditPanel;
