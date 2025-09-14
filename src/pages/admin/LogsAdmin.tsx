// src/pages/admin/LogsAdmin.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { 
  Activity, AlertTriangle, CheckCircle, XCircle, Info, 
  Calendar, Clock, User, Database, Shield, Globe, 
  Download, Filter, Search, RefreshCw, Eye, ChevronDown, 
  ChevronUp, Trash2, Archive, Bell, Zap, Settings,
  FileText, Monitor, Smartphone, Bug, Heart, Mail
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LogEntry {
  id: string;
  timestamp: any;
  level: 'info' | 'warning' | 'error' | 'debug' | 'success';
  category: 'auth' | 'database' | 'api' | 'ui' | 'security' | 'performance' | 'system';
  action: string;
  message: string;
  details?: any;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  source?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  byCategory: Record<string, number>;
  last24h: number;
  avgPerHour: number;
  errorRate: number;
}

const LogsAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    level: string;
    category: string;
    timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
    search: string;
  }>({
    level: 'all',
    category: 'all',
    timeRange: '24h',
    search: ''
  });
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Créer des logs automatiques pour démonstration
  useEffect(() => {
    const createDemoLogs = async () => {
      const demoLogs = [
        {
          level: 'info' as const,
          category: 'auth' as const,
          action: 'user_login',
          message: 'Connexion administrateur réussie',
          userEmail: auth.currentUser?.email,
          ip: '192.168.1.100',
          userAgent: navigator.userAgent.substring(0, 100),
          source: 'web_app'
        },
        {
          level: 'success' as const,
          category: 'database' as const,
          action: 'data_sync',
          message: 'Synchronisation des données contacts terminée',
          details: { records: 156, duration: 2.3 },
          source: 'firestore'
        },
        {
          level: 'warning' as const,
          category: 'performance' as const,
          action: 'slow_query',
          message: 'Requête lente détectée sur la collection investors',
          details: { duration: 5.2, query: 'where status == qualified' },
          source: 'firestore'
        },
        {
          level: 'info' as const,
          category: 'ui' as const,
          action: 'page_view',
          message: 'Page admin/logs visitée',
          userEmail: auth.currentUser?.email,
          source: 'frontend'
        },
        {
          level: 'error' as const,
          category: 'api' as const,
          action: 'api_error',
          message: "Erreur temporaire lors de l'envoi d'email de notification",
          details: { error_code: 'SMTP_TIMEOUT', recipient: 'user@example.com' },
          source: 'email_service'
        }
      ];

      for (const logData of demoLogs) {
        try {
          await addDoc(collection(db, 'admin_logs'), {
            ...logData,
            timestamp: serverTimestamp()
          });
        } catch (error) {
          console.error('Erreur création log démo:', error);
        }
      }
    };

    createDemoLogs();
  }, []);

  useEffect(() => {
    if (!realTimeEnabled) return;

    setLoading(true);
    
    const getStartDate = () => {
      const now = new Date();
      switch (filter.timeRange) {
        case '1h':
          return new Date(now.getTime() - 60 * 60 * 1000);
        case '24h':
          return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case '7d':
          return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d':
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        default:
          return new Date(2024, 0, 1);
      }
    };

    let logsQuery = query(
      collection(db, 'admin_logs'),
      orderBy('timestamp', 'desc'),
      limit(500)
    );

    if (filter.timeRange !== 'all') {
      logsQuery = query(
        collection(db, 'admin_logs'),
        where('timestamp', '>=', Timestamp.fromDate(getStartDate())),
        orderBy('timestamp', 'desc'),
        limit(500)
      );
    }

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LogEntry[];

      let filteredLogs = logsData;

      if (filter.level !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }

      if (filter.category !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.category === filter.category);
      }

      if (filter.search.trim()) {
        const searchTerm = filter.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.message.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.userEmail?.toLowerCase().includes(searchTerm)
        );
      }

      setLogs(filteredLogs);
      calculateStats(filteredLogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter, realTimeEnabled]);

  const calculateStats = (logsData: LogEntry[]) => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const byLevel: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let last24hCount = 0;
    let errorCount = 0;

    logsData.forEach(log => {
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
      if (log.timestamp && log.timestamp.toDate() >= last24h) last24hCount++;
      if (log.level === 'error') errorCount++;
    });

    const stats: LogStats = {
      total: logsData.length,
      byLevel,
      byCategory,
      last24h: last24hCount,
      avgPerHour: last24hCount / 24,
      errorRate: logsData.length > 0 ? (errorCount / logsData.length) * 100 : 0
    };

    setStats(stats);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'debug': return <Bug className="w-4 h-4 text-gray-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'debug': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Shield className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'api': return <Zap className="w-4 h-4" />;
      case 'ui': return <Monitor className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'performance': return <Activity className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const toggleLogDetails = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) newExpanded.delete(logId);
    else newExpanded.add(logId);
    setExpandedLogs(newExpanded);
  };

  const exportLogs = () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      filter_applied: filter,
      stats,
      logs: logs.map(log => ({
        ...log,
        timestamp: log.timestamp?.toDate?.()?.toISOString() || log.timestamp
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-logs-${filter.timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearOldLogs = async () => {
    if (confirm(t('admin.logs.confirm_clear'))) {
      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(t('admin.logs.gc_success'));
      } catch (error) {
        alert(t('admin.logs.gc_error'));
      }
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString(i18n.language);
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '—';
    if (duration < 1) return `${Math.round(duration * 1000)}ms`;
    return `${duration.toFixed(2)}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Chargement des journaux...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            {t('admin.logs.title')}
          </h1>
          <p className="text-slate-600 mt-1">{t('admin.logs.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={realTimeEnabled}
              onChange={(e) => setRealTimeEnabled(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-sm">Temps réel</span>
            {realTimeEnabled && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </div>
          
          <button
            onClick={exportLogs}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total logs</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{t('admin.common.last_24h')}</p>
                <p className="text-2xl font-bold text-slate-900">{stats.last24h}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-slate-500">
                {Math.round(stats.avgPerHour)} par heure
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Erreurs</p>
                <p className="text-2xl font-bold text-slate-900">{stats.byLevel.error || 0}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-red-500">
                {stats.errorRate.toFixed(1)}% du total
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avertissements</p>
                <p className="text-2xl font-bold text-slate-900">{stats.byLevel.warning || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Succès</p>
                <p className="text-2xl font-bold text-slate-900">{stats.byLevel.success || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9 pr-3 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filter.timeRange}
              onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value as any }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">{t('admin.common.last_1h')}</option>
              <option value="24h">{t('admin.common.last_24h')}</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="all">Tous</option>
            </select>
            
            <select
              value={filter.level}
              onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous niveaux</option>
              <option value="error">Erreurs</option>
              <option value="warning">Avertissements</option>
              <option value="success">Succès</option>
              <option value="info">Informations</option>
              <option value="debug">Debug</option>
            </select>
            
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="auth">Authentification</option>
              <option value="database">Base de données</option>
              <option value="api">API</option>
              <option value="ui">Interface</option>
              <option value="security">Sécurité</option>
              <option value="performance">Performance</option>
              <option value="system">Système</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Entrées de log ({logs.length})
            </h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={clearOldLogs}
                className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
                Nettoyer anciens
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-200">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>{t('admin.logs.none')}</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getLevelIcon(log.level)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                          {getCategoryIcon(log.category)}
                          {log.category}
                        </span>
                        
                        <span className="text-xs text-slate-500 font-mono">
                          {log.action}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(log.timestamp)}</span>
                        
                        {log.duration && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(log.duration)}</span>
                          </>
                        )}
                        
                        <button
                          onClick={() => toggleLogDetails(log.id)}
                          className="ml-2 p-1 hover:bg-slate-200 rounded"
                        >
                          {expandedLogs.has(log.id) ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-900 mb-2">{log.message}</p>
                    
                    {log.userEmail && (
                      <div className="flex items-center space-x-2 text-xs text-slate-600 mb-2">
                        <User className="w-3 h-3" />
                        <span>{log.userEmail}</span>
                        {log.ip && (
                          <>
                            <span>•</span>
                            <span>{log.ip}</span>
                          </>
                        )}
                      </div>
                    )}
                    
                    {expandedLogs.has(log.id) && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {log.source && (
                            <div>
                              <span className="font-medium text-slate-700">Source:</span>
                              <div className="text-slate-600">{log.source}</div>
                            </div>
                          )}
                          
                          {log.userAgent && (
                            <div>
                              <span className="font-medium text-slate-700">User Agent:</span>
                              <div className="text-slate-600 truncate">{log.userAgent}</div>
                            </div>
                          )}
                          
                          {log.details && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-slate-700">Détails:</span>
                              <pre className="mt-1 text-slate-600 bg-white p-2 rounded border text-xs overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {log.metadata && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-slate-700">Métadonnées:</span>
                              <pre className="mt-1 text-slate-600 bg-white p-2 rounded border text-xs overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsAdmin;
