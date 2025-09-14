// src/pages/admin/InvestorsAdmin.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Download, Filter, Loader2, Search, Trash2, Eye, CheckSquare, 
  Square, AlertTriangle, Calendar, TrendingUp, 
  ChevronLeft, ChevronRight, X, Target, DollarSign, Clock, Building2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type InvestorDoc = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  position?: string;
  website?: string;
  investorType?: string;
  investmentAmount?: string;
  timeline?: string;
  experience?: string;
  platformInterest?: string;
  geographicFocus?: string;
  message?: string;
  createdAt?: any; // Firestore Timestamp
  status?: 'new' | 'qualified' | 'meeting_scheduled' | 'due_diligence' | 'negotiation' | 'closed' | 'rejected';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
};

type SortField = 'firstName' | 'lastName' | 'email' | 'createdAt' | 'status' | 'priority' | 'investmentAmount';
type SortDirection = 'asc' | 'desc';

const statuses: NonNullable<InvestorDoc['status']>[] = [
  'new','qualified','meeting_scheduled','due_diligence','negotiation','closed','rejected'
];

const InvestorsAdmin: React.FC = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState<InvestorDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [qText, setQText] = useState('');
  const [status, setStatus] = useState<'all' | NonNullable<InvestorDoc['status']>>('all');
  const [priority, setPriority] = useState<'all' | NonNullable<InvestorDoc['priority']>>('all');
  const [type, setType] = useState<'all' | string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDetailModal, setShowDetailModal] = useState<InvestorDoc | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  // Labels dynamiques de statut via i18n
  const getStatusLabel = (s: NonNullable<InvestorDoc['status']>) => {
    switch (s) {
      case 'new': return t('admin.investors.status.new', { defaultValue: 'Nouveau' });
      case 'qualified': return t('admin.investors.status.qualified');
      case 'meeting_scheduled': return t('admin.investors.status.meeting');
      case 'due_diligence': return t('admin.investors.status.due_diligence');
      case 'negotiation': return t('admin.investors.status.negotiation');
      case 'closed': return t('admin.investors.status.closed', { defaultValue: 'Conclu' });
      case 'rejected': return t('admin.investors.status.rejected');
      default: return s;
    }
  };

  useEffect(() => {
    setLoading(true);
    const qy = query(collection(db, 'investors'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qy, snap => {
      const next: InvestorDoc[] = [];
      snap.forEach(d => {
        const data = d.data() as any;
        next.push({
          id: d.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          organization: data.organization,
          position: data.position,
          website: data.website,
          investorType: data.investorType,
          investmentAmount: data.investmentAmount,
          timeline: data.timeline,
          experience: data.experience,
          platformInterest: data.platformInterest,
          geographicFocus: data.geographicFocus,
          message: data.message,
          createdAt: data.createdAt,
          status: data.status ?? 'new',
          priority: data.priority ?? 'medium',
          notes: data.notes
        });
      });
      setRows(next);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Types d'investisseurs uniques
  const types = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => r.investorType && set.add(r.investorType));
    return Array.from(set).sort();
  }, [rows]);

  // Notification auto-hide
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fmtDate = (ts?: any) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  // Filtrage et tri
  const filtered = useMemo(() => {
    let result = rows.filter(r => {
      const okStatus = status === 'all' ? true : (r.status ?? 'new') === status;
      const okPriority = priority === 'all' ? true : (r.priority ?? 'medium') === priority;
      const okType = type === 'all' ? true : (r.investorType ?? '') === type;
      if (!okStatus || !okPriority || !okType) return false;

      if (qText.trim()) {
        const term = qText.trim().toLowerCase();
        const hay = `${r.firstName} ${r.lastName} ${r.email} ${r.organization ?? ''} ${r.message ?? ''}`.toLowerCase();
        return hay.includes(term);
      }
      return true;
    });

    result.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortField) {
        case 'firstName': aVal = a.firstName.toLowerCase(); bVal = b.firstName.toLowerCase(); break;
        case 'lastName': aVal = a.lastName.toLowerCase(); bVal = b.lastName.toLowerCase(); break;
        case 'email': aVal = a.email.toLowerCase(); bVal = b.email.toLowerCase(); break;
        case 'createdAt': aVal = a.createdAt?.toMillis() || 0; bVal = b.createdAt?.toMillis() || 0; break;
        case 'status': aVal = a.status || 'new'; bVal = b.status || 'new'; break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
          aVal = priorityOrder[a.priority || 'medium'];
          bVal = priorityOrder[b.priority || 'medium'];
          break;
        case 'investmentAmount':
          const extractAmount = (amt?: string) => {
            if (!amt) return 0;
            const match = amt.match(/[\d,]+/);
            return match ? parseInt(match[0].replace(/,/g, '')) : 0;
          };
          aVal = extractAmount(a.investmentAmount);
          bVal = extractAmount(b.investmentAmount);
          break;
        default: return 0;
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rows, qText, status, priority, type, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: rows.length,
      new: rows.filter(r => (r.status ?? 'new') === 'new').length,
      qualified: rows.filter(r => r.status === 'qualified').length,
      meetings: rows.filter(r => r.status === 'meeting_scheduled').length,
      dueDiligence: rows.filter(r => r.status === 'due_diligence').length,
      negotiation: rows.filter(r => r.status === 'negotiation').length,
      closed: rows.filter(r => r.status === 'closed').length,
      rejected: rows.filter(r => r.status === 'rejected').length,
      urgent: rows.filter(r => r.priority === 'urgent').length,
    };
  }, [rows]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const setStatusOn = async (id: string, next: NonNullable<InvestorDoc['status']>) => {
    try {
      setActionLoading(prev => new Set([...prev, id]));
      await updateDoc(doc(db, 'investors', id), { status: next });
      // i18n toast
      showNotification(t('admin.investors.status_updated_success'));
    } catch (error) {
      showNotification(t('admin.investors.status_update_error'), 'error');
    } finally {
      setActionLoading(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const setPriorityOn = async (id: string, next: NonNullable<InvestorDoc['priority']>) => {
    try {
      setActionLoading(prev => new Set([...prev, id]));
      await updateDoc(doc(db, 'investors', id), { priority: next });
      showNotification(t('admin.investors.priority_updated_success', { defaultValue: 'Priorité mise à jour avec succès' }));
    } catch (error) {
      showNotification(t('admin.investors.priority_update_error', { defaultValue: 'Erreur lors de la mise à jour de la priorité' }), 'error');
    } finally {
      setActionLoading(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const deleteInvestor = async (id: string) => {
    try {
      setActionLoading(prev => new Set([...prev, id]));
      await deleteDoc(doc(db, 'investors', id));
      showNotification(t('admin.investors.deleted_success', { defaultValue: 'Investisseur supprimé avec succès' }));
      setShowDeleteConfirm(null);
    } catch (error) {
      showNotification(t('admin.investors.delete_error', { defaultValue: 'Erreur lors de la suppression' }), 'error');
    } finally {
      setActionLoading(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const handleBatchAction = async (action: 'delete' | 'status' | 'priority', value?: string) => {
    if (selectedIds.size === 0) return;
    try {
      setActionLoading(prev => new Set([...prev, 'batch']));
      const batch = writeBatch(db);
      selectedIds.forEach(id => {
        const docRef = doc(db, 'investors', id);
        if (action === 'delete') batch.delete(docRef);
        else if (action === 'status' && value) batch.update(docRef, { status: value });
        else if (action === 'priority' && value) batch.update(docRef, { priority: value });
      });
      await batch.commit();

      // i18n bulk toast
      showNotification(
        t(action === 'delete' ? 'admin.investors.bulk_deleted' : 'admin.investors.bulk_updated', { count: selectedIds.size })
      );
      setSelectedIds(new Set());
      setShowBatchActions(false);
    } catch (error) {
      showNotification(t('admin.investors.bulk_action_error', { defaultValue: "Erreur lors de l'action groupée" }), 'error');
    } finally {
      setActionLoading(prev => {
        const n = new Set(prev);
        n.delete('batch');
        return n;
      });
    }
  };

  const toggleSelect = (id: string) => {
    const ns = new Set(selectedIds);
    ns.has(id) ? ns.delete(id) : ns.add(id);
    setSelectedIds(ns);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginatedData.map(r => r.id)));
  };

  const exportCsv = () => {
    const header = ['id','firstName','lastName','email','phone','organization','position','investorType','investmentAmount','timeline','experience','platformInterest','geographicFocus','status','priority','createdAt','message'];
    const lines = [header.join(',')];
    filtered.forEach(r => {
      const vals = [
        r.id, r.firstName, r.lastName, r.email,
        r.phone ?? '', r.organization ?? '', r.position ?? '',
        r.investorType ?? '', r.investmentAmount ?? '',
        r.timeline ?? '', r.experience ?? '',
        r.platformInterest ?? '', r.geographicFocus ?? '',
        r.status ?? 'new', r.priority ?? 'medium',
        fmtDate(r.createdAt),
        (r.message ?? '').replace(/\n|\r|,/g,' ').slice(0,800),
      ];
      lines.push(vals.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investors_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'new': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'qualified': return 'text-green-600 bg-green-50 border-green-200';
      case 'meeting_scheduled': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'due_diligence': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'negotiation': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'closed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header avec statistiques */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              {t('admin.investors.title', { defaultValue: 'Messages · Investisseurs' })}
            </h1>
            <p className="text-slate-600 mt-1">{t('admin.investors.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-xs text-slate-500">{t('admin.common.total', { defaultValue: 'Total' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
              <div className="text-xs text-slate-500">{t('admin.common.new', { defaultValue: 'Nouveaux' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
              <div className="text-xs text-slate-500">{t('admin.investors.status.closed', { defaultValue: 'Conclu' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <div className="text-xs text-slate-500">{t('admin.common.urgent', { defaultValue: 'Urgents' })}</div>
            </div>
          </div>
        </div>
        
        {/* Statistiques détaillées */}
        <div className="mt-4 pt-4 border-t grid grid-cols-2 lg:grid-cols-6 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>{t('admin.investors.status.qualified')}: {stats.qualified}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>{t('admin.investors.status.meeting')}: {stats.meetings}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>{t('admin.investors.status.due_diligence')}: {stats.dueDiligence}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>{t('admin.investors.status.negotiation')}: {stats.negotiation}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>{t('admin.investors.status.closed', { defaultValue: 'Conclu' })}: {stats.closed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>{t('admin.investors.status.rejected')}: {stats.rejected}</span>
          </div>
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={t('admin.search.investors_placeholder', { defaultValue: 'Rechercher (nom, email, organisation, message)…' })}
                className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={qText}
                onChange={e => setQText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={status}
                onChange={e => setStatus(e.target.value as any)}
              >
                <option value="all">{t('admin.common.all_statuses', { defaultValue: 'Tous les statuts' })}</option>
                {statuses.map(s => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
              <select
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
              >
                <option value="all">{t('admin.common.all_priorities', { defaultValue: 'Toutes priorités' })}</option>
                <option value="urgent">{t('admin.common.urgent', { defaultValue: 'Urgent' })}</option>
                <option value="high">{t('admin.common.high')}</option>
                <option value="medium">{t('admin.common.medium', { defaultValue: 'Moyen' })}</option>
                <option value="low">{t('admin.common.low', { defaultValue: 'Faible' })}</option>
              </select>
              <select
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="all">{t('admin.investors.all_types', { defaultValue: 'Tous les types' })}</option>
                {types.map(ti => <option key={ti} value={ti}>{ti}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBatchActions(!showBatchActions)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <CheckSquare className="w-4 h-4" />
                  {selectedIds.size} {t('admin.common.selected', { defaultValue: 'sélectionnés' })}
                </button>
                
                {showBatchActions && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleBatchAction('status', 'qualified')}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex items-center gap-2"
                      >
                        <Target className="w-4 h-4" />
                        {t('admin.investors.batch.mark_qualified', { defaultValue: 'Marquer comme qualifié' })}
                      </button>
                      <button
                        onClick={() => handleBatchAction('status', 'meeting_scheduled')}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        {t('admin.investors.batch.meeting_scheduled', { defaultValue: 'RDV planifié' })}
                      </button>
                      <button
                        onClick={() => handleBatchAction('status', 'rejected')}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        {t('admin.investors.batch.reject', { defaultValue: 'Rejeter' })}
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={() => handleBatchAction('priority', 'urgent')}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {t('admin.investors.batch.mark_urgent', { defaultValue: 'Priorité urgente' })}
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={() => handleBatchAction('delete')}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 rounded flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t('admin.common.delete', { defaultValue: 'Supprimer' })}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-600 border-b bg-slate-50">
              <tr>
                <th className="py-3 px-4">
                  <button onClick={toggleSelectAll} className="flex items-center justify-center">
                    {selectedIds.size === paginatedData.length && paginatedData.length > 0 ? 
                      <CheckSquare className="w-4 h-4 text-blue-600" /> : 
                      <Square className="w-4 h-4" />
                    }
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('firstName')} className="flex items-center gap-1 hover:text-slate-900">
                    {t('admin.investors.table.name', { defaultValue: 'Nom' })} {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-slate-900">
                    {t('admin.investors.table.email', { defaultValue: 'Email' })} {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {t('admin.investors.table.organization', { defaultValue: 'Organisation' })}
                  </div>
                </th>
                <th className="py-3 px-4">{t('admin.investors.table.type', { defaultValue: 'Type' })}</th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('investmentAmount')} className="flex items-center gap-1 hover:text-slate-900">
                    <DollarSign className="w-4 h-4" />
                    {t('admin.investors.table.ticket', { defaultValue: 'Ticket' })} {sortField === 'investmentAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {t('admin.investors.table.timeline', { defaultValue: 'Timeline' })}
                  </div>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 hover:text-slate-900 whitespace-nowrap">
                    <Calendar className="w-4 h-4" />
                    {t('admin.investors.table.received', { defaultValue: 'Reçu' })} {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-slate-900">
                    {t('admin.investors.table.status', { defaultValue: 'Statut' })} {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('priority')} className="flex items-center gap-1 hover:text-slate-900">
                    {t('admin.investors.table.priority', { defaultValue: 'Priorité' })} {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">{t('admin.common.actions', { defaultValue: 'Actions' })}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-8 text-center" colSpan={11}>
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('admin.common.loading', { defaultValue: 'Chargement…' })}
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-slate-500" colSpan={11}>
                    {t('admin.common.no_results')}
                  </td>
                </tr>
              ) : (
                paginatedData.map(r => (
                  <tr key={r.id} className="border-b last:border-b-0 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <button onClick={() => toggleSelect(r.id)} className="flex items-center justify-center">
                        {selectedIds.has(r.id) ? 
                          <CheckSquare className="w-4 h-4 text-blue-600" /> : 
                          <Square className="w-4 h-4" />
                        }
                      </button>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <div>{r.firstName} {r.lastName}</div>
                      {r.position && <div className="text-xs text-slate-500">{r.position}</div>}
                    </td>
                    <td className="py-3 px-4">{r.email}</td>
                    <td className="py-3 px-4">{r.organization ?? '—'}</td>
                    <td className="py-3 px-4">{r.investorType ?? '—'}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-green-600">
                        {r.investmentAmount ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{r.timeline ?? '—'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                    <td className="py-3 px-4">
                      <select
                        className={`border rounded-lg px-2 py-1 text-xs font-medium ${getStatusColor(r.status || 'new')}`}
                        value={r.status ?? 'new'}
                        onChange={(e) => setStatusOn(r.id, e.target.value as any)}
                        disabled={actionLoading.has(r.id)}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{getStatusLabel(s)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        className={`border rounded-lg px-2 py-1 text-xs font-medium ${getPriorityColor(r.priority || 'medium')}`}
                        value={r.priority ?? 'medium'}
                        onChange={(e) => setPriorityOn(r.id, e.target.value as any)}
                        disabled={actionLoading.has(r.id)}
                      >
                        <option value="low">{t('admin.common.low', { defaultValue: 'Faible' })}</option>
                        <option value="medium">{t('admin.common.medium', { defaultValue: 'Moyen' })}</option>
                        <option value="high">{t('admin.common.high')}</option>
                        <option value="urgent">{t('admin.common.urgent', { defaultValue: 'Urgent' })}</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setShowDetailModal(r)}
                          className="p-1 hover:bg-blue-50 rounded text-blue-600"
                          title={t('admin.common.view_details', { defaultValue: 'Voir détails' })}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(r.id)}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                          title={t('admin.common.delete', { defaultValue: 'Supprimer' })}
                          disabled={actionLoading.has(r.id)}
                        >
                          {actionLoading.has(r.id) ? 
                            <Loader2 className="w-4 h-4 animate-spin" /> :
                            <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>{t('admin.common.per_page', { count: 10, defaultValue: '10 par page' })}</option>
                <option value={25}>{t('admin.common.per_page', { count: 25, defaultValue: '25 par page' })}</option>
                <option value={50}>{t('admin.common.per_page', { count: 50, defaultValue: '50 par page' })}</option>
              </select>
              <span className="text-sm text-slate-600">
                {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} {t('admin.common.of', { defaultValue: 'de' })} {filtered.length}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-slate-50 rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-slate-50 rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  {t('admin.investors.detail_title')}
                </h3>
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="p-2 hover:bg-slate-50 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Informations personnelles */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">{t('admin.investors.section.personal', { defaultValue: 'Informations personnelles' })}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.full_name', { defaultValue: 'Nom complet' })}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.firstName} {showDetailModal.lastName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.email', { defaultValue: 'Email' })}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.phone', { defaultValue: 'Téléphone' })}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.phone ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.received_date')}</label>
                      <div className="mt-1 text-slate-900">{fmtDate(showDetailModal.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Informations professionnelles */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">{t('admin.investors.section.professional', { defaultValue: 'Informations professionnelles' })}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.organization', { defaultValue: 'Organisation' })}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.organization ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.position', { defaultValue: 'Position' })}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.position ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.website', { defaultValue: 'Site web' })}</label>
                      <div className="mt-1 text-slate-900">
                        {showDetailModal.website ? (
                          <a href={showDetailModal.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {showDetailModal.website}
                          </a>
                        ) : '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails d'investissement */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">{t('admin.investors.section.investment', { defaultValue: "Détails d'investissement" })}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.investor_type')}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.investorType ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.investment_amount')}</label>
                      <div className="mt-1 text-green-600 font-semibold">{showDetailModal.investmentAmount ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.timeline')}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.timeline ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.experience')}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.experience ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.platform_interest')}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.platformInterest ?? '—'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">{t('admin.investors.geographic_focus')}</label>
                      <div className="mt-1 text-slate-900">{showDetailModal.geographicFocus ?? '—'}</div>
                    </div>
                  </div>
                </div>
                
                {showDetailModal.message && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.investors.message', { defaultValue: 'Message' })}</label>
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 whitespace-pre-wrap">
                      {showDetailModal.message}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.investors.table.status', { defaultValue: 'Statut' })}</label>
                    <div className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(showDetailModal.status || 'new')}`}>
                      {getStatusLabel(showDetailModal.status || 'new')}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.investors.table.priority', { defaultValue: 'Priorité' })}</label>
                    <div className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(showDetailModal.priority || 'medium')}`}>
                      {showDetailModal.priority === 'urgent' ? t('admin.common.urgent', { defaultValue: 'Urgent' }) :
                       showDetailModal.priority === 'high' ? t('admin.common.high') :
                       showDetailModal.priority === 'low' ? t('admin.common.low', { defaultValue: 'Faible' }) :
                       t('admin.common.medium', { defaultValue: 'Moyen' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">{t('admin.investors.delete_confirm_title')}</h3>
            </div>
            <p className="text-slate-600 mb-6">
              {t('admin.investors.delete_confirm_description', { defaultValue: "Êtes-vous sûr de vouloir supprimer cet investisseur ? Cette action est irréversible." })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                {t('admin.common.cancel', { defaultValue: 'Annuler' })}
              </button>
              <button
                onClick={() => deleteInvestor(showDeleteConfirm)}
                disabled={actionLoading.has(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading.has(showDeleteConfirm) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {t('admin.common.delete', { defaultValue: 'Supprimer' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorsAdmin;
