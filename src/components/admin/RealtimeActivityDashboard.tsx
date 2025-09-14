// src/components/admin/RealtimeActivityDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Activity, Database, Shield, Zap, Bell, 
  Eye, AlertTriangle,
  CheckCircle, XCircle, Info, Clock, Wifi, WifiOff
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActivityEvent {
  id: string;
  timestamp: any;
  level: 'info' | 'warning' | 'error' | 'debug' | 'success';
  category: 'auth' | 'database' | 'api' | 'ui' | 'security' | 'performance' | 'system';
  action: string;
  message: string;
  userEmail?: string;
  details?: any;
}

interface SystemMetrics {
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
  avgResponseTime: number;
  systemLoad: number;
  memoryUsage: number;
  storageUsage: number;
  uptime: string;
}

const RealtimeActivityDashboard: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ 
  isVisible, 
  onClose 
}) => {
  const { t } = useTranslation();

  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 1,
    requestsPerMinute: 0,
    errorRate: 0,
    avgResponseTime: 0.8,
    systemLoad: 45,
    memoryUsage: 62,
    storageUsage: 28,
    uptime: '72h 15m'
  });

  // Stream d'activité temps réel
  useEffect(() => {
    if (!isVisible) return;

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const activityQuery = query(
      collection(db, 'admin_logs'),
      where('timestamp', '>=', Timestamp.fromDate(fiveMinutesAgo)),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(activityQuery, 
      (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ActivityEvent[];
        
        setRecentActivity(activities);
        setIsConnected(true);
        
        // Calculer les métriques en temps réel
        updateMetrics(activities);
      },
      (error) => {
        console.error('Erreur stream activité:', error);
        setIsConnected(false);
      }
    );

    return () => unsubscribe();
  }, [isVisible]);

  // Simulation de métriques système (en production, ces données viendraient d'un monitoring réel)
  const updateMetrics = (activities: ActivityEvent[]) => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    
    const recentActivities = activities.filter(a => 
      a.timestamp && a.timestamp.toDate() >= oneMinuteAgo
    );
    
    const errorCount = recentActivities.filter(a => a.level === 'error').length;
    const errorRate = recentActivities.length > 0 
      ? (errorCount / recentActivities.length) * 100 
      : 0;

    setMetrics(prev => ([
      'requestsPerMinute','errorRate','avgResponseTime','systemLoad','memoryUsage'
    ] && {
      ...prev,
      requestsPerMinute: recentActivities.length,
      errorRate: Math.round(errorRate * 100) / 100,
      avgResponseTime: 0.8 + Math.random() * 0.4, // Simulation
      systemLoad: 40 + Math.random() * 20, // Simulation
      memoryUsage: 60 + Math.random() * 15, // Simulation
    }));
  };

  // Métriques par niveau
  const activityStats = useMemo(() => {
    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);
    
    const recent = recentActivity.filter(a => 
      a.timestamp && a.timestamp.toDate() >= last24h
    );

    return {
      total: recent.length,
      success: recent.filter(a => a.level === 'success').length,
      info: recent.filter(a => a.level === 'info').length,
      warning: recent.filter(a => a.level === 'warning').length,
      error: recent.filter(a => a.level === 'error').length,
      byCategory: recent.reduce((acc, activity) => {
        acc[activity.category] = (acc[activity.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [recentActivity]);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m`;
    return date.toLocaleTimeString();
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error': return <XCircle className="w-3 h-3 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'info': return <Info className="w-3 h-3 text-blue-500" />;
      default: return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Shield className="w-3 h-3" />;
      case 'database': return <Database className="w-3 h-3" />;
      case 'ui': return <Eye className="w-3 h-3" />;
      case 'security': return <Shield className="w-3 h-3 text-red-500" />;
      case 'performance': return <Zap className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getMetricColor = (value: number, thresholds: { warning: number; error: number }) => {
    if (value >= thresholds.error) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">{t('admin.realtime.title')}</h2>
                <p className="text-blue-100">{t('admin.realtime.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-green-300" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-300" />
                )}
                <span className="text-sm">
                  {isConnected ? t('admin.realtime.connected') : t('admin.realtime.disconnected')}
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={t('admin.realtime.close') as string}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Métriques */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
            
            {/* Métriques système */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {t('admin.realtime.system_metrics')}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('admin.realtime.active_users')}</span>
                    <span className="font-bold text-blue-600">{metrics.activeUsers}</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('admin.realtime.req_per_min')}</span>
                    <span className="font-bold">{metrics.requestsPerMinute}</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('admin.realtime.error_rate')}</span>
                    <span className={`font-bold ${getMetricColor(metrics.errorRate, { warning: 5, error: 10 })}`}>
                      {metrics.errorRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('admin.realtime.response_time')}</span>
                    <span className={`font-bold ${getMetricColor(metrics.avgResponseTime, { warning: 2, error: 5 })}`}>
                      {metrics.avgResponseTime.toFixed(2)}s
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('admin.realtime.system_load')}</span>
                    <span className={`font-bold ${getMetricColor(metrics.systemLoad, { warning: 70, error: 85 })}`}>
                      {metrics.systemLoad.toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('admin.realtime.memory')}</span>
                    <span className={`font-bold ${getMetricColor(metrics.memoryUsage, { warning: 80, error: 90 })}`}>
                      {metrics.memoryUsage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('admin.realtime.uptime')}</span>
                    <span className="font-bold text-green-600">{metrics.uptime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques activité */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t('admin.realtime.activity_5min')}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('admin.realtime.success')}</span>
                  </div>
                  <span className="font-bold">{activityStats.success}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span>{t('admin.realtime.info')}</span>
                  </div>
                  <span className="font-bold">{activityStats.info}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>{t('admin.realtime.warnings')}</span>
                  </div>
                  <span className="font-bold">{activityStats.warning}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>{t('admin.realtime.errors')}</span>
                  </div>
                  <span className="font-bold">{activityStats.error}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content - Stream d'activité */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{t('admin.realtime.stream')}</h3>
              <div className="text-sm text-gray-500">
                {t('admin.realtime.last_5m')} • {recentActivity.length} {t('admin.realtime.events')}
              </div>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t('admin.realtime.none')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                      activity.level === 'error' ? 'border-l-red-500 bg-red-50' :
                      activity.level === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                      activity.level === 'success' ? 'border-l-green-500 bg-green-50' :
                      'border-l-blue-500 bg-blue-50'
                    } hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2 mt-1">
                          {getLevelIcon(activity.level)}
                          {getCategoryIcon(activity.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {activity.action}
                            </span>
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {activity.category}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">
                            {activity.message}
                          </p>
                          
                          {activity.userEmail && (
                            <div className="text-xs text-gray-500">
                              {t('admin.realtime.by')}: {activity.userEmail}
                            </div>
                          )}
                          
                          {activity.details && Object.keys(activity.details).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                {t('admin.realtime.view_details')}
                              </summary>
                              <pre className="text-xs bg-white p-2 mt-1 rounded border overflow-x-auto">
                                {JSON.stringify(activity.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeActivityDashboard;
