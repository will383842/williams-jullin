import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import AdminAuth from '../components/AdminAuth';
import BlogEditor from '../components/BlogEditor';
import { 
  Mail, 
  TrendingUp, 
  Users, 
  Calendar, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Search,
  RefreshCw,
  BarChart3,
  Globe,
  MessageSquare,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
  Shield,
  FileText,
  Zap
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AdminProps {
  navigate: (page: string) => void;
}

interface ContactMessage {
  id: string;
  purpose: string;
  fullName: string;
  email: string;
  title?: string;
  message: string;
  country?: string;
  createdAt: Timestamp;
  status?: 'new' | 'read' | 'replied' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
}

interface InvestorMessage {
  id: string;
  investorType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  position?: string;
  website?: string;
  investmentAmount: string;
  timeline: string;
  experience: string;
  platformInterest: string;
  geographicFocus?: string;
  message: string;
  createdAt: Timestamp;
  status?: 'new' | 'qualified' | 'meeting_scheduled' | 'due_diligence' | 'negotiation' | 'closed' | 'rejected';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  followUpDate?: Timestamp;
}

const Admin: React.FC<AdminProps> = ({ navigate }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'investors' | 'analytics' | 'blog'>('contacts');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'overview' | 'detailed'>('overview');
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [investors, setInvestors] = useState<InvestorMessage[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | InvestorMessage | null>(null);

  // Authentification Firebase réelle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Vérifier les custom claims
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin) {
          setUser(user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Charger les données
  useEffect(() => {
    console.log('🔍 Initialisation des listeners Firestore...');
    
    const unsubscribeContacts = onSnapshot(
      query(collection(db, 'contacts'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        console.log(`📧 ${snapshot.size} contacts récupérés`);
        const contactsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || 'new',
          priority: doc.data().priority || 'medium'
        })) as ContactMessage[];
        setContacts(contactsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        console.error('🚨 Erreur contacts:', error.message);
        setLoading(false);
      }
    );

    const unsubscribeAnalytics = onSnapshot(
      query(collection(db, 'analytics'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        console.log(`📊 ${snapshot.size} événements analytics récupérés`);
        const analyticsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnalyticsData(analyticsData);
      },
      (error) => {
        console.error('Error fetching analytics:', error);
        console.error('🚨 Erreur analytics:', error.message);
      }
    );
    const unsubscribeInvestors = onSnapshot(
      query(collection(db, 'investors'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        console.log(`💰 ${snapshot.size} investisseurs récupérés`);
        const investorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || 'new',
          priority: doc.data().priority || 'medium'
        })) as InvestorMessage[];
        setInvestors(investorsData);
      },
      (error) => {
        console.error('Error fetching investors:', error);
        console.error('🚨 Erreur investisseurs:', error.message);
      }
    );

    return () => {
      unsubscribeContacts();
      unsubscribeInvestors();
      unsubscribeAnalytics();
    };
  }, []);

  // Calculer les analytics détaillées
  const getDetailedAnalytics = () => {
    const pageViews = analyticsData.filter(event => event.type === 'page_view');
    const timeOnPage = analyticsData.filter(event => event.type === 'time_on_page');
    const customEvents = analyticsData.filter(event => event.type === 'custom_event');
    
    // Visiteurs uniques par session
    const uniqueSessions = [...new Set(pageViews.map(event => event.sessionId))];
    
    // Top pays
    const countryStats = pageViews.reduce((acc, event) => {
      const country = event.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    
    const topCountries = Object.entries(countryStats)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Statistiques par page
    const pageStats = pageViews.reduce((acc, event) => {
      const page = event.page || 'Unknown';
      if (!acc[page]) {
        acc[page] = {
          page,
          views: 0,
          uniqueVisitors: new Set(),
          totalDuration: 0,
          durationCount: 0,
          countries: {}
        };
      }
      
      acc[page].views++;
      acc[page].uniqueVisitors.add(event.sessionId);
      
      if (event.country) {
        acc[page].countries[event.country] = (acc[page].countries[event.country] || 0) + 1;
      }
      
      return acc;
    }, {});
    
    // Ajouter les durées
    timeOnPage.forEach(event => {
      const page = event.page || 'Unknown';
      if (pageStats[page] && event.duration) {
        pageStats[page].totalDuration += event.duration;
        pageStats[page].durationCount++;
      }
    });
    
    // Convertir en array et calculer les moyennes
    const pageStatsArray = Object.values(pageStats).map(stat => ({
      page: stat.page,
      views: stat.views,
      uniqueVisitors: stat.uniqueVisitors.size,
      avgDuration: stat.durationCount > 0 ? Math.round(stat.totalDuration / stat.durationCount / 1000) : 0,
      topCountries: Object.entries(stat.countries)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
    })).sort((a, b) => b.views - a.views);
    
    return {
      totalPageViews: pageViews.length,
      uniqueVisitors: uniqueSessions.length,
      totalEvents: customEvents.length,
      topCountries,
      pageStats: pageStatsArray,
      recentEvents: analyticsData.slice(0, 20)
    };
  };
  const updateMessageStatus = async (id: string, collection: string, status: string, priority?: string) => {
    try {
      const updateData: any = { status };
      if (priority) updateData.priority = priority;
      
      await updateDoc(doc(db, collection, id), updateData);
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id: string, collection: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        await deleteDoc(doc(db, collection, id));
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string, type: 'contact' | 'investor') => {
    const contactStatuses = {
      new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
      read: { label: 'Lu', color: 'bg-gray-100 text-gray-800' },
      replied: { label: 'Répondu', color: 'bg-green-100 text-green-800' },
      archived: { label: 'Archivé', color: 'bg-gray-100 text-gray-600' }
    };

    const investorStatuses = {
      new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
      qualified: { label: 'Qualifié', color: 'bg-green-100 text-green-800' },
      meeting_scheduled: { label: 'RDV Planifié', color: 'bg-purple-100 text-purple-800' },
      due_diligence: { label: 'Due Diligence', color: 'bg-orange-100 text-orange-800' },
      negotiation: { label: 'Négociation', color: 'bg-yellow-100 text-yellow-800' },
      closed: { label: 'Conclu', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800' }
    };

    const statuses = type === 'contact' ? contactStatuses : investorStatuses;
    const statusInfo = statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorities = {
      low: { label: 'Faible', color: 'bg-gray-100 text-gray-600' },
      medium: { label: 'Moyen', color: 'bg-blue-100 text-blue-700' },
      high: { label: 'Élevé', color: 'bg-orange-100 text-orange-700' },
      urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' }
    };

    const priorityInfo = priorities[priority] || priorities.medium;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
        {priorityInfo.label}
      </span>
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (investor.organization && investor.organization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || investor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getAnalytics = () => {
    const totalContacts = contacts.length;
    const totalInvestors = investors.length;
    const newContacts = contacts.filter(c => c.status === 'new').length;
    const newInvestors = investors.filter(i => i.status === 'new').length;
    const qualifiedInvestors = investors.filter(i => ['qualified', 'meeting_scheduled', 'due_diligence', 'negotiation'].includes(i.status || 'new')).length;

    return {
      totalContacts,
      totalInvestors,
      newContacts,
      newInvestors,
      qualifiedInvestors,
      conversionRate: totalInvestors > 0 ? Math.round((qualifiedInvestors / totalInvestors) * 100) : 0
    };
  };

  const analytics = getAnalytics();
  const detailedAnalytics = getDetailedAnalytics();

  if (authLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <AdminAuth user={user} onAuthChange={setUser} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-24 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
              <p className="text-gray-600">{t('admin.subtitle')}</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.totalContacts}</div>
                <div className="text-xs text-blue-700">{t('admin.stats.contacts')}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.totalInvestors}</div>
                <div className="text-xs text-green-700">{t('admin.stats.investors')}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">{analytics.newContacts + analytics.newInvestors}</div>
                <div className="text-xs text-orange-700">{t('admin.stats.new')}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{analytics.conversionRate}%</div>
                <div className="text-xs text-purple-700">{t('admin.stats.conversion')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'contacts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail size={18} />
            <span>Contacts ({analytics.totalContacts})</span>
            {analytics.newContacts > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {analytics.newContacts}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('investors')}
            className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'investors'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp size={18} />
            <span>Investisseurs ({analytics.totalInvestors})</span>
            {analytics.newInvestors > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {analytics.newInvestors}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={18} />
            <span>Analytics Web</span>
          </button>
          
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'blog'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={18} />
            <span>Articles Blog</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom, email, organisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveaux</option>
              <option value="read">Lus</option>
              <option value="replied">Répondus</option>
              {activeTab === 'investors' && (
                <>
                  <option value="qualified">Qualifiés</option>
                  <option value="meeting_scheduled">RDV Planifiés</option>
                  <option value="due_diligence">Due Diligence</option>
                  <option value="negotiation">Négociation</option>
                  <option value="closed">Conclus</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Sub-navigation pour Analytics */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveAnalyticsTab('overview')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeAnalyticsTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveAnalyticsTab('detailed')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeAnalyticsTab === 'detailed'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics Détaillées
              </button>
            </div>

            {activeAnalyticsTab === 'overview' && (
              <>
                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics.totalContacts}</p>
                        <p className="text-sm text-gray-600">Total Contacts</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics.totalInvestors}</p>
                        <p className="text-sm text-gray-600">Total Investisseurs</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics.newContacts + analytics.newInvestors}</p>
                        <p className="text-sm text-gray-600">Nouveaux Messages</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                        <p className="text-sm text-gray-600">Taux Conversion</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Activité Récente</h3>
                  <div className="space-y-3">
                    {[...contacts.slice(0, 3), ...investors.slice(0, 2)]
                      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {'investorType' in item ? <TrendingUp size={16} className="text-blue-600" /> : <Mail size={16} className="text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {'firstName' in item ? `${item.firstName} ${item.lastName}` : item.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {'investorType' in item ? `Investisseur ${item.investorType}` : `Contact ${item.purpose}`}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}

            {activeAnalyticsTab === 'detailed' && (
              <>
            {/* Vue d'ensemble */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{detailedAnalytics.totalPageViews}</p>
                    <p className="text-sm text-gray-600">Pages Vues Total</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{detailedAnalytics.uniqueVisitors}</p>
                    <p className="text-sm text-gray-600">Visiteurs Uniques</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{detailedAnalytics.topCountries.length}</p>
                    <p className="text-sm text-gray-600">Pays Différents</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{detailedAnalytics.pageStats.length}</p>
                    <p className="text-sm text-gray-600">Pages Trackées</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Pays */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>Top Pays Visiteurs</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detailedAnalytics.topCountries.map((country, index) => (
                  <div key={country.country} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{country.country}</p>
                      <p className="text-sm text-gray-600">{country.count} visites</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques par Page */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Statistiques par Page</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Page</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Vues</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Visiteurs Uniques</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Durée Moyenne</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Top Pays</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedAnalytics.pageStats.map((stat, index) => (
                      <tr key={stat.page} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{stat.page}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-blue-600 font-medium">{stat.views}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">{stat.uniqueVisitors}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-purple-600 font-medium">{stat.avgDuration}s</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            {stat.topCountries.slice(0, 3).map((country, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {country.country} ({country.count})
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Événements Récents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Activité Récente</span>
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {detailedAnalytics.recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      {event.type === 'page_view' ? '👁️' : event.type === 'time_on_page' ? '⏱️' : '🎯'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {event.type === 'page_view' ? `Vue: ${event.page}` : 
                         event.type === 'time_on_page' ? `Durée: ${event.page} (${Math.round((event.duration || 0) / 1000)}s)` :
                         `Événement: ${event.eventName}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.country} • {event.language}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.timestamp && formatDate(event.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{contact.fullName}</h3>
                      <p className="text-gray-600">{contact.email}</p>
                      {contact.country && (
                        <p className="text-sm text-gray-500 flex items-center space-x-1">
                          <Globe size={12} />
                          <span>{contact.country}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(contact.status || 'new', 'contact')}
                    {getPriorityBadge(contact.priority || 'medium')}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Objet:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">{contact.purpose}</span>
                  </div>
                  
                  {contact.title && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Titre:</span>
                      <span className="ml-2 text-sm text-gray-600">{contact.title}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Message:</span>
                    <p className="mt-1 text-gray-600 bg-gray-50 rounded-lg p-3">{contact.message}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Reçu le {formatDate(contact.createdAt)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={contact.status || 'new'}
                        onChange={(e) => updateMessageStatus(contact.id, 'contacts', e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="new">Nouveau</option>
                        <option value="read">Lu</option>
                        <option value="replied">Répondu</option>
                        <option value="archived">Archivé</option>
                      </select>
                      
                      <select
                        value={contact.priority || 'medium'}
                        onChange={(e) => updateMessageStatus(contact.id, 'contacts', contact.status || 'new', e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyen</option>
                        <option value="high">Élevé</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      
                      <button
                        onClick={() => deleteMessage(contact.id, 'contacts')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun contact trouvé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'investors' && (
          <div className="space-y-4">
            {filteredInvestors.map((investor) => (
              <div key={investor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {investor.firstName} {investor.lastName}
                      </h3>
                      <p className="text-gray-600">{investor.email}</p>
                      {investor.phone && (
                        <p className="text-sm text-gray-500">{investor.phone}</p>
                      )}
                      {investor.organization && (
                        <p className="text-sm text-blue-600 font-medium">{investor.organization}</p>
                      )}
                      {investor.position && (
                        <p className="text-xs text-gray-500">{investor.position}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(investor.status || 'new', 'investor')}
                    {getPriorityBadge(investor.priority || 'medium')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-700">Type d'Investisseur</p>
                    <p className="text-sm text-blue-900">{investor.investorType}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-green-700">Montant</p>
                    <p className="text-sm text-green-900">{investor.investmentAmount}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-purple-700">Timeline</p>
                    <p className="text-sm text-purple-900">{investor.timeline}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Expérience:</span>
                      <span className="ml-2 text-sm text-gray-600">{investor.experience}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Intérêt:</span>
                      <span className="ml-2 text-sm text-gray-600">{investor.platformInterest}</span>
                    </div>
                  </div>
                  
                  {investor.geographicFocus && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Focus Géographique:</span>
                      <span className="ml-2 text-sm text-gray-600">{investor.geographicFocus}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Message:</span>
                    <p className="mt-1 text-gray-600 bg-gray-50 rounded-lg p-3">{investor.message}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Reçu le {formatDate(investor.createdAt)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={investor.status || 'new'}
                        onChange={(e) => updateMessageStatus(investor.id, 'investors', e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="new">Nouveau</option>
                        <option value="qualified">Qualifié</option>
                        <option value="meeting_scheduled">RDV Planifié</option>
                        <option value="due_diligence">Due Diligence</option>
                        <option value="negotiation">Négociation</option>
                        <option value="closed">Conclu</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                      
                      <select
                        value={investor.priority || 'medium'}
                        onChange={(e) => updateMessageStatus(investor.id, 'investors', investor.status || 'new', e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyen</option>
                        <option value="high">Élevé</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      
                      <button
                        onClick={() => deleteMessage(investor.id, 'investors')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredInvestors.length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun investisseur trouvé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <BlogEditor />
        )}
      </div>
    </div>
  );
};

export default Admin;