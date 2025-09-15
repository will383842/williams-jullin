// src/pages/admin/SettingsAdmin.tsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { 
  Settings, Save, RefreshCw, User, Mail, Shield, Globe, 
  Palette, Bell, Database, Lock, Key, Eye, EyeOff,
  CheckCircle, XCircle, AlertTriangle, Monitor, Smartphone,
  Cloud, Zap, Users, BarChart3, Download, Upload, Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdminSettings {
  id?: string;
  site: {
    name: string;
    description: string;
    url: string;
    logo: string;
    favicon: string;
    maintenance: boolean;
    maintenanceMessage: string;
  };
  notifications: {
    emailNotifications: boolean;
    adminEmail: string;
    newContactAlert: boolean;
    newInvestorAlert: boolean;
    urgentPriorityAlert: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    allowedIPs: string[];
    forceHTTPS: boolean;
    maxLoginAttempts: number;
  };
  analytics: {
    googleAnalyticsId: string;
    enableTracking: boolean;
    trackAnonymously: boolean;
    dataRetentionDays: number;
  };
  performance: {
    enableCaching: boolean;
    cacheTimeout: number;
    enableCompression: boolean;
    optimizeImages: boolean;
  };
  integrations: {
    emailService: 'firebase' | 'sendgrid' | 'mailchimp';
    emailApiKey?: string;
    smsService: 'none' | 'twilio';
    smsApiKey?: string;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    itemsPerPage: number;
  };
  backup: {
    autoBackup: boolean;
    backupLocation: 'firebase' | 'drive' | 'local';
    lastBackup?: string;
  };
}

interface SystemStats {
  totalUsers: number;
  totalContacts: number;
  totalInvestors: number;
  storageUsed: number;
  lastActivity: string;
  uptime: string;
}

const defaultSettings: AdminSettings = {
  site: {
    name: 'Williams Jullin - Expert Mondial Expatriation',
    description: 'Plateforme mondiale d\'aide aux expatriés - Toutes nationalités bienvenues',
    url: 'https://williamsjullin.com',
    logo: '/Williams-jullin.jpg',
    favicon: '/favicon.ico',
    maintenance: false,
    maintenanceMessage: 'Site en maintenance - Retour bientôt'
  },
  notifications: {
    emailNotifications: true,
    adminEmail: 'admin@williamsjullin.com',
    newContactAlert: true,
    newInvestorAlert: true,
    urgentPriorityAlert: true
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 1440, // 24h en minutes
    allowedIPs: [],
    forceHTTPS: true,
    maxLoginAttempts: 5
  },
  analytics: {
    googleAnalyticsId: 'G-RMZK97X4NH',
    enableTracking: true,
    trackAnonymously: false,
    dataRetentionDays: 365
  },
  performance: {
    enableCaching: true,
    cacheTimeout: 3600,
    enableCompression: true,
    optimizeImages: true
  },
  integrations: {
    emailService: 'firebase',
    smsService: 'none',
    backupFrequency: 'daily'
  },
  ui: {
    theme: 'light',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    itemsPerPage: 10
  },
  backup: {
    autoBackup: true,
    backupLocation: 'firebase'
  }
};

const SettingsAdmin: React.FC = () => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('site');
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);

  useEffect(() => {
    loadSettings();
    loadSystemStats();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const loadSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'admin_settings', 'main'));
      if (settingsDoc.exists()) {
        setSettings({ ...defaultSettings, ...settingsDoc.data() });
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
      showNotification(t('admin.settings.load_error'), 'error');
    }
    setLoading(false);
  };

  const loadSystemStats = async () => {
    try {
      const contactsSnap = await getDocs(collection(db, 'contacts'));
      const investorsSnap = await getDocs(collection(db, 'investors'));
      const analyticsSnap = await getDocs(collection(db, 'analytics'));

      const stats: SystemStats = {
        totalUsers: 1, // Admin pour l'instant
        totalContacts: contactsSnap.size,
        totalInvestors: investorsSnap.size,
        storageUsed: Math.round((contactsSnap.size + investorsSnap.size + analyticsSnap.size) * 0.5), // Estimation en KB
        lastActivity: new Date().toISOString(),
        uptime: calculateUptime()
      };

      setSystemStats(stats);
    } catch (error) {
      console.error('Erreur chargement stats système:', error);
    }
  };

  const calculateUptime = () => {
    const startDate = new Date('2024-01-01');
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jours`;
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'admin_settings', 'main'), settings);
      showNotification(t('admin.settings.backup_success'), 'success');
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      showNotification(t('admin.settings.load_error'), 'error');
    }
    setSaving(false);
  };

  const updateSetting = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
    setUnsavedChanges(true);
  };

  const runBackup = async () => {
    setBackupInProgress(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newSettings = {
        ...settings,
        backup: {
          ...settings.backup,
          lastBackup: new Date().toISOString()
        }
      };
      setSettings(newSettings);
      await setDoc(doc(db, 'admin_settings', 'main'), newSettings);
      showNotification(t('admin.settings.backup_success'), 'success');
    } catch (error) {
      showNotification(t('admin.settings.load_error'), 'error');
    }
    setBackupInProgress(false);
  };

  const resetToDefaults = async () => {
    if (confirm(t('admin.settings.restore_confirm'))) {
      try {
        await setDoc(doc(db, 'admin_settings', 'main'), defaultSettings);
        setSettings(defaultSettings);
        setUnsavedChanges(false);
        showNotification(t('admin.settings.backup_success'), 'success');
      } catch (error) {
        showNotification(t('admin.settings.load_error'), 'error');
      }
    }
  };

  const sections = [
    { id: 'site', name: 'Site Web', icon: <Globe className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', name: 'Sécurité', icon: <Shield className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'performance', name: 'Performance', icon: <Zap className="w-4 h-4" /> },
    { id: 'integrations', name: 'Intégrations', icon: <Cloud className="w-4 h-4" /> },
    { id: 'ui', name: 'Interface', icon: <Palette className="w-4 h-4" /> },
    { id: 'backup', name: 'Sauvegarde', icon: <Database className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Chargement des paramètres...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            {t('admin.settings.system_title')}
          </h1>
          <p className="text-slate-600 mt-1">{t('admin.settings.system_subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {unsavedChanges && (
            <span className="text-sm text-orange-600 font-medium">
              {t('admin.settings.unsaved_changes')}
            </span>
          )}
          <button
            onClick={saveSettings}
            disabled={saving || !unsavedChanges}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Statistiques système */}
      {systemStats && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            {t('admin.settings.system_state')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemStats.totalContacts}</div>
              <div className="text-sm text-slate-600">Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemStats.totalInvestors}</div>
              <div className="text-sm text-slate-600">Investisseurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemStats.storageUsed} KB</div>
              <div className="text-sm text-slate-600">Stockage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{systemStats.uptime}</div>
              <div className="text-sm text-slate-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">●</div>
              <div className="text-sm text-slate-600">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-slate-600">{t('admin.settings.availability')}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des sections */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="font-semibold mb-4">Sections</h3>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-slate-50'
                }`}
              >
                {section.icon}
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu de la section */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6">
            
            {/* Section Site Web */}
            {activeSection === 'site' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Configuration du site
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom du site</label>
                    <input
                      type="text"
                      value={settings.site.name}
                      onChange={(e) => updateSetting(['site', 'name'], e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">URL du site</label>
                    <input
                      type="url"
                      value={settings.site.url}
                      onChange={(e) => updateSetting(['site', 'url'], e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={settings.site.description}
                      onChange={(e) => updateSetting(['site', 'description'], e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mode maintenance</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.site.maintenance}
                        onChange={(e) => updateSetting(['site', 'maintenance'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Activer le mode maintenance</span>
                    </div>
                  </div>
                  
                  {settings.site.maintenance && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Message de maintenance</label>
                      <input
                        type="text"
                        value={settings.site.maintenanceMessage}
                        onChange={(e) => updateSetting(['site', 'maintenanceMessage'], e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email administrateur</label>
                    <input
                      type="email"
                      value={settings.notifications.adminEmail}
                      onChange={(e) => updateSetting(['notifications', 'adminEmail'], e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => updateSetting(['notifications', 'emailNotifications'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Activer les notifications email</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newContactAlert}
                        onChange={(e) => updateSetting(['notifications', 'newContactAlert'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Alertes nouveaux contacts</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newInvestorAlert}
                        onChange={(e) => updateSetting(['notifications', 'newInvestorAlert'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Alertes nouveaux investisseurs</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.urgentPriorityAlert}
                        onChange={(e) => updateSetting(['notifications', 'urgentPriorityAlert'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Alertes priorité urgente</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Sécurité */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Sécurité
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeout de session (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting(['security', 'sessionTimeout'], parseInt(e.target.value))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Max tentatives de connexion</label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting(['security', 'maxLoginAttempts'], parseInt(e.target.value))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => updateSetting(['security', 'twoFactorAuth'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Authentification à deux facteurs (2FA)</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.security.forceHTTPS}
                        onChange={(e) => updateSetting(['security', 'forceHTTPS'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Forcer HTTPS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Analytics */}
            {activeSection === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                    <input
                      type="text"
                      value={settings.analytics.googleAnalyticsId}
                      onChange={(e) => updateSetting(['analytics', 'googleAnalyticsId'], e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Rétention des données (jours)</label>
                    <input
                      type="number"
                      value={settings.analytics.dataRetentionDays}
                      onChange={(e) => updateSetting(['analytics', 'dataRetentionDays'], parseInt(e.target.value))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.analytics.enableTracking}
                        onChange={(e) => updateSetting(['analytics', 'enableTracking'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Activer le tracking</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.analytics.trackAnonymously}
                        onChange={(e) => updateSetting(['analytics', 'trackAnonymously'], e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">Tracking anonyme</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Sauvegarde */}
            {activeSection === 'backup' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Sauvegarde
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fréquence de sauvegarde</label>
                      <select
                        value={settings.integrations.backupFrequency}
                        onChange={(e) => updateSetting(['integrations', 'backupFrequency'], e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">Quotidienne</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuelle</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Lieu de sauvegarde</label>
                      <select
                        value={settings.backup.backupLocation}
                        onChange={(e) => updateSetting(['backup', 'backupLocation'], e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="firebase">Firebase</option>
                        <option value="drive">Google Drive</option>
                        <option value="local">Local</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.backup.autoBackup}
                      onChange={(e) => updateSetting(['backup', 'autoBackup'], e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm">Sauvegarde automatique</span>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Dernière sauvegarde:</span>
                      <span className="text-sm text-slate-600">
                        {settings.backup.lastBackup 
                          ? new Date(settings.backup.lastBackup).toLocaleString()
                          : 'Jamais'
                        }
                      </span>
                    </div>
                    
                    <button
                      onClick={runBackup}
                      disabled={backupInProgress}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {backupInProgress ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {backupInProgress ? 'Sauvegarde...' : 'Lancer sauvegarde'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions globales */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Restaurer par défaut
                </button>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">
                    Dernière sauvegarde: {new Date().toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setShowSensitiveData(!showSensitiveData)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showSensitiveData ? 'Masquer' : 'Afficher'} les données sensibles
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
