// src/pages/admin/AnalyticsAdmin.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, limit, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  BarChart3, LineChart, PieChart, Activity, Users, Globe, 
  Calendar, TrendingUp, TrendingDown, Eye, MousePointer,
  Smartphone, Monitor, Tablet, MapPin, Clock, RefreshCw,
  Download, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useTranslation } from 'react-i18next';

interface AnalyticsData {
  id: string;
  type: 'page_view' | 'custom_event';
  page?: string;
  title?: string;
  eventName?: string;
  parameters?: any;
  timestamp: any;
  userAgent?: string;
  language?: string;
  country?: string;
  sessionId?: string;
  viewport?: { width: number; height: number };
}

interface ContactData {
  id: string;
  fullName: string;
  email: string;
  country?: string;
  createdAt: any;
  status?: string;
}

interface InvestorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  investmentAmount?: string;
  createdAt: any;
  status?: string;
}

const AnalyticsAdmin: React.FC = () => {
  const { t } = useTranslation();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [contactsData, setContactsData] = useState<ContactData[]>([]);
  const [investorsData, setInvestorsData] = useState<InvestorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'pageViews' | 'uniqueVisitors' | 'conversions'>('pageViews');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'traffic']));

  useEffect(() => {
    setLoading(true);
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate = new Date(2024, 0, 1);
    }

    const analyticsQuery = timeRange === 'all' 
      ? query(collection(db, 'analytics'), orderBy('timestamp', 'desc'), limit(1000))
      : query(
          collection(db, 'analytics'), 
          where('timestamp', '>=', Timestamp.fromDate(startDate)),
          orderBy('timestamp', 'desc'),
          limit(1000)
        );

    const unsubAnalytics = onSnapshot(analyticsQuery, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AnalyticsData[];
      setAnalyticsData(data);
    });

    const contactsQuery = timeRange === 'all'
      ? query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'contacts'),
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          orderBy('createdAt', 'desc')
        );

    const unsubContacts = onSnapshot(contactsQuery, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactData[];
      setContactsData(data);
    });

    const investorsQuery = timeRange === 'all'
      ? query(collection(db, 'investors'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'investors'),
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          orderBy('createdAt', 'desc')
        );

    const unsubInvestors = onSnapshot(investorsQuery, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InvestorData[];
      setInvestorsData(data);
      setLoading(false);
    });

    return () => {
      unsubAnalytics();
      unsubContacts();
      unsubInvestors();
    };
  }, [timeRange]);

  const metrics = useMemo(() => {
    const pageViews = analyticsData.filter(d => d.type === 'page_view').length;
    const uniqueVisitors = new Set(analyticsData.map(d => d.sessionId)).size;
    const totalContacts = contactsData.length;
    const totalInvestors = investorsData.length;
    const conversionRate = pageViews > 0 ? ((totalContacts + totalInvestors) / pageViews * 100) : 0;

    return {
      pageViews,
      uniqueVisitors,
      totalContacts,
      totalInvestors,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }, [analyticsData, contactsData, investorsData]);

  const timeSeriesData = useMemo(() => {
    const dayStats: Record<string, { date: string; pageViews: number; contacts: number; investors: number }> = {};
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dayStats[dateKey] = {
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        pageViews: 0,
        contacts: 0,
        investors: 0
      };
    }

    analyticsData.forEach(item => {
      if (item.timestamp && item.type === 'page_view') {
        const date = item.timestamp.toDate().toISOString().split('T')[0];
        if (dayStats[date]) {
          dayStats[date].pageViews++;
        }
      }
    });

    contactsData.forEach(item => {
      if (item.createdAt) {
        const date = item.createdAt.toDate().toISOString().split('T')[0];
        if (dayStats[date]) {
          dayStats[date].contacts++;
        }
      }
    });

    investorsData.forEach(item => {
      if (item.createdAt) {
        const date = item.createdAt.toDate().toISOString().split('T')[0];
        if (dayStats[date]) {
          dayStats[date].investors++;
        }
      }
    });

    return Object.values(dayStats);
  }, [analyticsData, contactsData, investorsData, timeRange]);

  const topPages = useMemo(() => {
    const pageCounts: Record<string, number> = {};
    analyticsData
      .filter(d => d.type === 'page_view' && d.page)
      .forEach(d => {
        pageCounts[d.page!] = (pageCounts[d.page!] || 0) + 1;
      });

    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({
        page: page === '/' ? 'Accueil' : page.replace('/', '').charAt(0).toUpperCase() + page.slice(2),
        views: count,
        percentage: Math.round((count / metrics.pageViews) * 100)
      }));
  }, [analyticsData, metrics.pageViews]);

  const countryData = useMemo(() => {
    const countryCounts: Record<string, number> = {};
    [...contactsData, ...investorsData].forEach(item => {
      if (item.country) {
        countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
      }
    });

    return Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([country, count]) => ({
        country,
        count,
        percentage: Math.round((count / (contactsData.length + investorsData.length)) * 100)
      }));
  }, [contactsData, investorsData]);

  const deviceData = useMemo(() => {
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    
    analyticsData.forEach(item => {
      if (item.viewport) {
        if (item.viewport.width < 768) deviceCounts.mobile++;
        else if (item.viewport.width < 1024) deviceCounts.tablet++;
        else deviceCounts.desktop++;
      }
    });

    const total = deviceCounts.mobile + deviceCounts.desktop + deviceCounts.tablet;
    
    return [
      { name: 'Mobile', value: deviceCounts.mobile, percentage: total > 0 ? Math.round((deviceCounts.mobile / total) * 100) : 0, color: '#3B82F6' },
      { name: 'Desktop', value: deviceCounts.desktop, percentage: total > 0 ? Math.round((deviceCounts.desktop / total) * 100) : 0, color: '#10B981' },
      { name: 'Tablet', value: deviceCounts.tablet, percentage: total > 0 ? Math.round((deviceCounts.tablet / total) * 100) : 0, color: '#F59E0B' }
    ];
  }, [analyticsData]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) newExpanded.delete(section);
    else newExpanded.add(section);
    setExpandedSections(newExpanded);
  };

  const exportData = () => {
    const data = {
      periode: timeRange,
      date_export: new Date().toISOString(),
      metriques: metrics,
      donnees_temporelles: timeSeriesData,
      top_pages: topPages,
      repartition_pays: countryData,
      appareils: deviceData,
      contacts_recents: contactsData.slice(0, 10),
      investisseurs_recents: investorsData.slice(0, 10)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Chargement des analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analytiques & Performance
          </h1>
          <p className="text-slate-600 mt-1">{t('admin.analytics.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="all">{t('admin.analytics.all_data')}</option>
          </select>
          
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pages vues</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.pageViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Visiteurs uniques</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.uniqueVisitors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Contacts</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.totalContacts}</p>
            </div>
            <MousePointer className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Investisseurs</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.totalInvestors}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux conversion</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.conversionRate}%</p>
            </div>
            <Activity className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Graphique temporel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{t('admin.analytics.over_time')}</h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="border border-slate-300 rounded px-2 py-1 text-sm"
              >
                <option value="pageViews">Pages vues</option>
                <option value="conversions">Conversions</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Pages vues"
                />
                <Line 
                  type="monotone" 
                  dataKey="contacts" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Contacts"
                />
                <Line 
                  type="monotone" 
                  dataKey="investors" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Investisseurs"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages populaires */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Pages populaires</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                    <span className="text-sm font-medium text-slate-900">{page.page}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">{page.views} vues</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {page.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Répartition par appareils */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">{t('admin.analytics.devices')}</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: device.color }}
                    ></div>
                    <span>{device.name}</span>
                  </div>
                  <span className="font-medium">{device.value} ({device.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Répartition géographique */}
      {countryData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('admin.analytics.geo')}
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {countryData.map((country) => (
                <div key={country.country} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{country.count}</div>
                    <div className="text-xs text-slate-500">{country.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsAdmin;
