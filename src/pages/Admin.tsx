// src/pages/Admin.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import AdminAuth from '../components/AdminAuth';
import AdminSidebar from '../components/admin/AdminSidebar';
import ContactsAdmin from './admin/ContactsAdmin';
import InvestorsAdmin from './admin/InvestorsAdmin';
import AnalyticsAdmin from './admin/AnalyticsAdmin';
import SettingsAdmin from './admin/SettingsAdmin';
import LogsAdmin from './admin/LogsAdmin';
import NotificationsAdmin from './admin/NotificationsAdmin';
import { 
  Users, TrendingUp, Mail, Bell, Search, Settings, 
  Activity, BarChart3, Calendar, Clock, AlertTriangle,
  CheckCircle, XCircle, Eye, ChevronRight, Loader2,
  RefreshCw, Download, Filter, Command, HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type MainSection = 'dashboard' | 'messages' | 'analytics' | 'settings' | 'logs';
type SubTab = 'contacts' | 'investors' | 'notifications' | 'exports';

interface AdminProps {
  navigate: (page: string) => void;
}

interface DashboardStats {
  totalContacts: number;
  totalInvestors: number;
  newContactsToday: number;
  newInvestorsToday: number;
  urgentItems: number;
  recentActivity: Array<{
    id: string;
    type: 'contact' | 'investor';
    action: string;
    timestamp: any;
    details: string;
  }>;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const Admin: React.FC<AdminProps> = ({ navigate: _navigate }) => {
  const { t } = useTranslation();

  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState<MainSection>('dashboard');
  const [subTab, setSubTab] = useState<SubTab>('contacts');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Vérification authentification
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setAuthLoading(false);
        return;
      }
      const token = await user.getIdTokenResult(true);
      setIsAdmin(!!token.claims.admin);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Deep-link et navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sectionParam = params.get('section') as MainSection;
    const tabParam = params.get('tab') as SubTab;
    
    if (sectionParam && ['dashboard', 'messages', 'analytics', 'settings', 'logs'].includes(sectionParam)) {
      setSection(sectionParam);
    }
    if (tabParam && ['contacts', 'investors', 'notifications', 'exports'].includes(tabParam)) {
      setSubTab(tabParam);
    }
  }, []);

  // Chargement des statistiques du dashboard
  useEffect(() => {
    if (!isAdmin) return;
    
    setStatsLoading(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Écoute des contacts
    const contactsQuery = query(collection(db, 'contacts'));
    const unsubContacts = onSnapshot(contactsQuery, (snap) => {
      const contacts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      // Écoute des investisseurs
      const investorsQuery = query(collection(db, 'investors'));
      const unsubInvestors = onSnapshot(investorsQuery, (investorsSnap) => {
        const investors = investorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        // Calcul des statistiques
        const newContactsToday = contacts.filter((c: any) => {
          const createdAt = c.createdAt?.toDate?.();
          return createdAt && createdAt >= today;
        }).length;
        
        const newInvestorsToday = investors.filter((i: any) => {
          const createdAt = i.createdAt?.toDate?.();
          return createdAt && createdAt >= today;
        }).length;
        
        const urgentContacts = contacts.filter((c: any) => c.priority === 'urgent').length;
        const urgentInvestors = investors.filter((i: any) => i.priority === 'urgent').length;
        
        // Activité récente (simulée pour l'exemple)
        const recentActivity = [
          ...contacts.slice(0, 3).map((c: any) => ({
            id: c.id,
            type: 'contact' as const,
            action: 'Nouveau contact reçu',
            timestamp: c.createdAt,
            details: `${c.fullName} - ${c.email}`
          })),
          ...investors.slice(0, 2).map((i: any) => ({
            id: i.id,
            type: 'investor' as const,
            action: 'Nouvel investisseur',
            timestamp: i.createdAt,
            details: `${i.firstName} ${i.lastName} - ${i.investmentAmount || 'Montant non spécifié'}`
          }))
        ].sort((a, b) => {
          const aTime = a.timestamp?.toMillis?.() || 0;
          const bTime = b.timestamp?.toMillis?.() || 0;
          return bTime - aTime;
        }).slice(0, 5);

        setDashboardStats({
          totalContacts: contacts.length,
          totalInvestors: investors.length,
          newContactsToday,
          newInvestorsToday,
          urgentItems: urgentContacts + urgentInvestors,
          recentActivity
        });
        setStatsLoading(false);
      });

      return () => {
        unsubInvestors();
      };
    });

    return () => unsubContacts();
  }, [isAdmin]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowSearch(!showSearch);
            break;
          case '/':
            e.preventDefault();
            setShowKeyboardShortcuts(true);
            break;
          case '1':
            e.preventDefault();
            handleNavigate('dashboard');
            break;
          case '2':
            e.preventDefault();
            handleNavigate('messages', 'contacts');
            break;
          case '3':
            e.preventDefault();
            handleNavigate('messages', 'investors');
            break;
          case 'r':
            e.preventDefault();
            handleRefresh();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  // Notification auto-hide
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  }, []);

  const handleNavigate = useCallback((main: MainSection, sub?: SubTab) => {
    setSection(main);
    if (sub) setSubTab(sub);
    const params = new URLSearchParams();
    params.set('section', main);
    if (sub) params.set('tab', sub);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulation du rafraîchissement
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    showNotification(t('admin.toast.data_refreshed'), 'success');
  }, [showNotification, t]);

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'view-contacts',
      title: 'Voir les contacts',
      description: 'Gérer tous les messages de contact',
      icon: <Mail className="w-5 h-5" />,
      action: () => handleNavigate('messages', 'contacts'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'view-investors',
      title: 'Pipeline investisseurs',
      description: 'Suivre le pipeline d\'investissement',
      icon: <TrendingUp className="w-5 h-5" />,
      action: () => handleNavigate('messages', 'investors'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'Consulter les statistiques détaillées',
      icon: <BarChart3 className="w-5 h-5" />,
      action: () => handleNavigate('analytics'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configurer l\'administration',
      icon: <Settings className="w-5 h-5" />,
      action: () => handleNavigate('settings'),
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ], [handleNavigate]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString();
  };

  // Écran de chargement d'authentification
  if (authLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">{t('admin.auth.checking')}</p>
        </div>
      </div>
    );
  }

  // Écran d'authentification admin
  if (!isAdmin) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <AdminAuth user={null} onAuthChange={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-slate-50 min-h-screen">
      {/* Notification globale */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Barre d'outils supérieure */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-slate-600">
              <span>{t('admin.header.title')}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-slate-900 capitalize">{section}</span>
              {section === 'messages' && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-medium text-slate-900 capitalize">{subTab}</span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {/* Recherche globale */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Recherche globale (⌘K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              title="Actualiser (⌘R)"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Raccourcis clavier */}
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Raccourcis clavier (⌘/)"
            >
              <Command className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-6rem)] flex">
        {/* Sidebar */}
        <AdminSidebar
          activeMain={section}
          activeSub={subTab}
          onNavigate={handleNavigate}
        />

        {/* Contenu principal */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Dashboard */}
          {section === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{t('admin.dashboard.title')}</h1>
                  <p className="text-slate-600">Vue d'ensemble de votre administration</p>
                </div>
              </div>

              {statsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  {/* Cartes de statistiques */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Contacts</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardStats?.totalContacts}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-green-600">
                          +{dashboardStats?.newContactsToday} aujourd'hui
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Investisseurs</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardStats?.totalInvestors}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-green-600">
                          +{dashboardStats?.newInvestorsToday} aujourd'hui
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Items Urgents</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardStats?.urgentItems}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-slate-500">{t('admin.dashboard.need_attention')}</span>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">{t('admin.activity.title')}</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardStats?.recentActivity.length}</p>
                        </div>
                        <Activity className="w-8 h-8 text-purple-500" />
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-slate-500">{t('admin.activity.recent_actions')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions rapides */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className={`${action.color} text-white p-4 rounded-xl transition-colors`}
                        >
                          <div className="flex items-center space-x-3">
                            {action.icon}
                            <div className="text-left">
                              <p className="font-medium">{action.title}</p>
                              <p className="text-sm opacity-90">{action.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Activité récente */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-lg font-semibold text-slate-900">{t('admin.activity.recent')}</h2>
                    </div>
                    <div className="p-6">
                      {dashboardStats?.recentActivity.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">{t('admin.activity.none')}</p>
                      ) : (
                        <div className="space-y-4">
                          {dashboardStats?.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg">
                              <div className={`p-2 rounded-full ${
                                activity.type === 'contact' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {activity.type === 'contact' ? <Mail className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                                <p className="text-sm text-slate-600">{activity.details}</p>
                              </div>
                              <div className="text-sm text-slate-500">{formatDate(activity.timestamp)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Messages */}
          {section === 'messages' && subTab === 'contacts' && <ContactsAdmin />}
          {section === 'messages' && subTab === 'investors' && <InvestorsAdmin />}
          {section === 'messages' && subTab === 'notifications' && <NotificationsAdmin />}

          {/* Analytics */}
          {section === 'analytics' && <AnalyticsAdmin />}

          {/* Settings */}
          {section === 'settings' && <SettingsAdmin />}

          {/* Logs */}
          {section === 'logs' && <LogsAdmin />}
        </main>
      </div>

      {/* Modal de raccourcis clavier */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Raccourcis clavier</h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-2 hover:bg-slate-50 rounded"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Recherche globale</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">⌘ K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Dashboard</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">⌘ 1</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Contacts</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">⌘ 2</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Investisseurs</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">⌘ 3</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Actualiser</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">⌘ R</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Aide</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">⌘ /</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de recherche globale */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('admin.search.placeholder')}
                  className="w-full pl-10 pr-4 py-3 border-0 focus:ring-0 text-lg"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4">
              <p className="text-slate-500 text-sm">Tapez pour rechercher dans les contacts, investisseurs, paramètres...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
