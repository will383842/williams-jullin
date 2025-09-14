// src/pages/admin/NotificationsAdmin.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, where, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { 
  Bell, AlertTriangle, CheckCircle, Info, Mail, 
  Smartphone, Globe, Settings as SettingsIcon, Clock, Eye, EyeOff,
  MoreVertical, Trash2, Archive, RefreshCw, Filter,
  Users, TrendingUp, MessageSquare, Heart, Zap,
  Calendar, MapPin, Star, Flag, Send, Plus,
  BellRing, Volume2, VolumeX, Toggle, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  category: 'contact' | 'investor' | 'system' | 'security' | 'update' | 'marketing';
  title: string;
  message: string;
  timestamp: any;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: Array<{
    label: string;
    action: string;
    variant: 'primary' | 'secondary' | 'danger';
  }>;
  metadata?: {
    userId?: string;
    contactId?: string;
    investorId?: string;
    url?: string;
    data?: any;
  };
  channels: Array<'web' | 'email' | 'sms' | 'push'>;
  expiresAt?: any;
  archived?: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  sms: boolean;
  categories: {
    contact: boolean;
    investor: boolean;
    system: boolean;
    security: boolean;
    update: boolean;
    marketing: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  sound: true,
  desktop: true,
  email: true,
  sms: false,
  categories: {
    contact: true,
    investor: true,
    system: true,
    security: true,
    update: true,
    marketing: false
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  frequency: 'immediate'
};

const NotificationsAdmin: React.FC = () => {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    type: string;
    category: string;
    read: string;
    priority: string;
    timeRange: '24h' | '7d' | '30d' | 'all';
  }>({
    type: 'all',
    category: 'all',
    read: 'all',
    priority: 'all',
    timeRange: '7d'
  });
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<NotificationItem> | null>(null);

  // Créer des notifications de démonstration
  useEffect(() => {
    const createDemoNotifications = async () => {
      const demoNotifications = [
        {
          type: 'success' as const,
          category: 'contact' as const,
          title: 'Nouveau contact reçu',
          message: 'Marie Dubois a envoyé un message depuis la page contact',
          priority: 'high' as const,
          channels: ['web', 'email'] as const,
          read: false,
          actions: [
            { label: 'Voir le contact', action: 'view_contact', variant: 'primary' as const },
            { label: 'Répondre', action: 'reply', variant: 'secondary' as const }
          ],
          metadata: { contactId: 'contact_123', url: '/admin?section=messages&tab=contacts' }
        },
        {
          type: 'info' as const,
          category: 'investor' as const,
          title: 'Nouvel investisseur qualifié',
          message: 'Jean Martin vient de passer au statut "qualifié" - Ticket: 500K€',
          priority: 'high' as const,
          channels: ['web', 'email'] as const,
          read: false,
          actions: [
            { label: 'Voir investisseur', action: 'view_investor', variant: 'primary' as const }
          ],
          metadata: { investorId: 'investor_456', url: '/admin?section=messages&tab=investors' }
        },
        {
          type: 'warning' as const,
          category: 'system' as const,
          title: 'Sauvegarde recommandée',
          message: 'Dernière sauvegarde datant de plus de 7 jours',
          priority: 'medium' as const,
          channels: ['web'] as const,
          read: true,
          actions: [
            { label: 'Lancer sauvegarde', action: 'backup_now', variant: 'primary' as const }
          ]
        },
        {
          type: 'error' as const,
          category: 'security' as const,
          title: 'Tentative de connexion suspecte',
          message: '5 tentatives échouées depuis 192.168.1.100',
          priority: 'urgent' as const,
          channels: ['web', 'email', 'sms'] as const,
          read: false,
          actions: [
            { label: 'Bloquer IP', action: 'block_ip', variant: 'danger' as const },
            { label: 'Voir logs', action: 'view_logs', variant: 'secondary' as const }
          ]
        },
        {
          type: 'info' as const,
          category: 'update' as const,
          title: 'Mise à jour disponible',
          message: 'Une nouvelle version du système admin est disponible',
          priority: 'low' as const,
          channels: ['web'] as const,
          read: true,
          actions: [
            { label: 'Voir changelog', action: 'view_changelog', variant: 'primary' as const }
          ]
        }
      ];

      for (const notification of demoNotifications) {
        try {
          await addDoc(collection(db, 'admin_notifications'), {
            ...notification,
            timestamp: serverTimestamp(),
            archived: false
          });
        } catch (error) {
          console.error('Erreur création notification démo:', error);
        }
      }
    };

    createDemoNotifications();
  }, []);

  useEffect(() => {
    setLoading(true);
    
    // Calculer la date de début selon le filtre temporel
    const getStartDate = () => {
      const now = new Date();
      switch (filter.timeRange) {
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

    // Construire la requête
    let notificationsQuery = query(
      collection(db, 'admin_notifications'),
      orderBy('timestamp', 'desc')
    );

    if (filter.timeRange !== 'all') {
      notificationsQuery = query(
        collection(db, 'admin_notifications'),
        where('timestamp', '>=', Timestamp.fromDate(getStartDate())),
        orderBy('timestamp', 'desc')
      );
    }

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      let notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationItem[];

      // Appliquer les filtres
      if (filter.type !== 'all') {
        notificationsData = notificationsData.filter(n => n.type === filter.type);
      }
      if (filter.category !== 'all') {
        notificationsData = notificationsData.filter(n => n.category === filter.category);
      }
      if (filter.read !== 'all') {
        notificationsData = notificationsData.filter(n => 
          filter.read === 'read' ? n.read : !n.read
        );
      }
      if (filter.priority !== 'all') {
        notificationsData = notificationsData.filter(n => n.priority === filter.priority);
      }

      // Filtrer les non-archivées par défaut
      notificationsData = notificationsData.filter(n => !n.archived);

      setNotifications(notificationsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  // Statistiques
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const urgent = notifications.filter(n => n.priority === 'urgent').length;
    const today = notifications.filter(n => {
      if (!n.timestamp) return false;
      const notifDate = n.timestamp.toDate();
      const today = new Date();
      return notifDate.toDateString() === today.toDateString();
    }).length;

    return { total, unread, urgent, today };
  }, [notifications]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'system': return <SettingsIcon className="w-4 h-4 text-gray-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'contact': return <MessageSquare className="w-4 h-4" />;
      case 'investor': return <TrendingUp className="w-4 h-4" />;
      case 'system': return <SettingsIcon className="w-4 h-4" />;
      case 'security': return <AlertTriangle className="w-4 h-4" />;
      case 'update': return <RefreshCw className="w-4 h-4" />;
      case 'marketing': return <Globe className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'admin_notifications', notificationId), {
        read: true
      });
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  const archiveNotification = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'admin_notifications', notificationId), {
        archived: true
      });
    } catch (error) {
      console.error('Erreur archivage:', error);
    }
  };

  const handleAction = async (notification: NotificationItem, action: string) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    switch (action) {
      case 'view_contact':
      case 'view_investor':
        if (notification.metadata?.url) {
          window.location.href = notification.metadata.url;
        }
        break;
      case 'view_logs':
        window.location.href = '/admin?section=logs';
        break;
      default:
        console.log('Action:', action);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('common.just_now');
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString();
  };

  const createCustomNotification = async () => {
    if (!newNotification?.title || !newNotification?.message) return;

    try {
      await addDoc(collection(db, 'admin_notifications'), {
        ...newNotification,
        timestamp: serverTimestamp(),
        read: false,
        archived: false
      });
      setNewNotification(null);
    } catch (error) {
      console.error('Erreur création notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">{t('admin.notifications.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            {t('admin.notifications.title')}
            {stats.unread > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.unread}
              </span>
            )}
          </h1>
          <p className="text-slate-600 mt-1">{t('admin.notifications.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewNotification({
              type: 'info',
              category: 'system',
              title: '',
              message: '',
              priority: 'medium',
              channels: ['web']
            })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            {t('admin.notifications.new.button')}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <SettingsIcon className="w-4 h-4" />
            {t('admin.notifications.settings.open')}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('admin.notifications.stats.total')}</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('admin.notifications.stats.unread')}</p>
              <p className="text-2xl font-bold text-slate-900">{stats.unread}</p>
            </div>
            <BellRing className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('admin.notifications.stats.urgent')}</p>
              <p className="text-2xl font-bold text-slate-900">{stats.urgent}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('admin.notifications.stats.today')}</p>
              <p className="text-2xl font-bold text-slate-900">{stats.today}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <select
              value={filter.timeRange}
              onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value as any }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">{t('admin.common.last_24h')}</option>
              <option value="7d">{t('admin.common.last_7d')}</option>
              <option value="30d">{t('admin.common.last_30d')}</option>
              <option value="all">{t('admin.common.all')}</option>
            </select>
            
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('admin.notifications.filters.types.all')}</option>
              <option value="success">{t('admin.notifications.filters.types.success')}</option>
              <option value="info">{t('admin.notifications.filters.types.info')}</option>
              <option value="warning">{t('admin.notifications.filters.types.warning')}</option>
              <option value="error">{t('admin.notifications.filters.types.error')}</option>
              <option value="system">{t('admin.notifications.filters.types.system')}</option>
            </select>
            
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('admin.notifications.filters.categories.all')}</option>
              <option value="contact">{t('admin.notifications.filters.categories.contact')}</option>
              <option value="investor">{t('admin.notifications.filters.categories.investor')}</option>
              <option value="system">{t('admin.notifications.filters.categories.system')}</option>
              <option value="security">{t('admin.notifications.filters.categories.security')}</option>
              <option value="update">{t('admin.notifications.filters.categories.update')}</option>
              <option value="marketing">{t('admin.notifications.filters.categories.marketing')}</option>
            </select>
            
            <select
              value={filter.read}
              onChange={(e) => setFilter(prev => ({ ...prev, read: e.target.value }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('admin.notifications.filters.read.all')}</option>
              <option value="unread">{t('admin.notifications.filters.read.unread')}</option>
              <option value="read">{t('admin.notifications.filters.read.read')}</option>
            </select>
            
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('admin.notifications.filters.priority.all')}</option>
              <option value="urgent">{t('admin.common.urgent')}</option>
              <option value="high">{t('admin.common.high')}</option>
              <option value="medium">{t('admin.common.medium')}</option>
              <option value="low">{t('admin.common.low')}</option>
            </select>
          </div>
          
          {stats.unread > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4" />
              {t('admin.notifications.actions.mark_all_read')}
            </button>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="divide-y divide-slate-200">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>{t('admin.notifications.none')}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-semibold ${
                          !notification.read ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {notification.title}
                        </h3>
                        
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        <button
                          onClick={() => archiveNotification(notification.id)}
                          className="p-1 hover:bg-slate-200 rounded"
                          title={t('admin.notifications.actions.archive')}
                        >
                          <Archive className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                        {getCategoryIcon(notification.category)}
                        {t(`admin.notifications.category.${notification.category}`)}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        notification.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`admin.common.${notification.priority}`)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">
                      {notification.message}
                    </p>
                    
                    {notification.channels && notification.channels.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs text-slate-500">{t('admin.notifications.channels_label')}</span>
                        {notification.channels.map((channel) => (
                          <span key={channel} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                            {channel === 'web' && <Globe className="w-3 h-3" />}
                            {channel === 'email' && <Mail className="w-3 h-3" />}
                            {channel === 'sms' && <Smartphone className="w-3 h-3" />}
                            {channel === 'push' && <Bell className="w-3 h-3" />}
                            {t(`admin.notifications.channels.${channel}`)}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex items-center space-x-2">
                        {notification.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleAction(notification, action.action)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                              action.variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                              'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 rounded text-xs text-slate-600 hover:bg-slate-100"
                          >
                            {t('admin.notifications.actions.mark_read')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal nouvelle notification */}
      {newNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('admin.notifications.new.title')}</h3>
              <button
                onClick={() => setNewNotification(null)}
                className="p-2 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.notifications.form.title')}</label>
                <input
                  type="text"
                  value={newNotification.title || ''}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.notifications.form.message')}</label>
                <textarea
                  value={newNotification.message || ''}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.notifications.form.type')}</label>
                  <select
                    value={newNotification.type || 'info'}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">{t('admin.notifications.filters.types.info')}</option>
                    <option value="success">{t('admin.notifications.filters.types.success')}</option>
                    <option value="warning">{t('admin.notifications.filters.types.warning')}</option>
                    <option value="error">{t('admin.notifications.filters.types.error')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.notifications.form.priority')}</label>
                  <select
                    value={newNotification.priority || 'medium'}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">{t('admin.common.low')}</option>
                    <option value="medium">{t('admin.common.medium')}</option>
                    <option value="high">{t('admin.common.high')}</option>
                    <option value="urgent">{t('admin.common.urgent')}</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setNewNotification(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  {t('admin.common.cancel')}
                </button>
                <button
                  onClick={createCustomNotification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('admin.common.create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel des paramètres */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">{t('admin.notifications.settings.title')}</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">{t('admin.notifications.settings.general')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>{t('admin.notifications.settings.enable')}</span>
                      <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('admin.notifications.settings.sound')}</span>
                      <input
                        type="checkbox"
                        checked={settings.sound}
                        onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('admin.notifications.settings.desktop')}</span>
                      <input
                        type="checkbox"
                        checked={settings.desktop}
                        onChange={(e) => setSettings(prev => ({ ...prev, desktop: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">{t('admin.notifications.settings.categories')}</h4>
                  <div className="space-y-3">
                    {Object.entries(settings.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize">{t(`admin.notifications.category.${category}`)}</span>
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            categories: { ...prev.categories, [category]: e.target.checked }
                          }))}
                          className="rounded border-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">{t('admin.notifications.settings.quiet_hours.title')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>{t('admin.notifications.settings.quiet_hours.enable')}</span>
                      <input
                        type="checkbox"
                        checked={settings.quietHours.enabled}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, enabled: e.target.checked }
                        }))}
                        className="rounded border-slate-300"
                      />
                    </div>
                    {settings.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">{t('admin.notifications.settings.quiet_hours.start')}</label>
                          <input
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              quietHours: { ...prev.quietHours, start: e.target.value }
                            }))}
                            className="w-full p-2 border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">{t('admin.notifications.settings.quiet_hours.end')}</label>
                          <input
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              quietHours: { ...prev.quietHours, end: e.target.value }
                            }))}
                            className="w-full p-2 border border-slate-300 rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  {t('admin.notifications.settings.close')}
                </button>
                <button
                  onClick={() => {
                    // Sauvegarder les paramètres
                    setShowSettings(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('admin.notifications.settings.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsAdmin;
