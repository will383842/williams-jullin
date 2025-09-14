// src/pages/admin/ContactsAdmin.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Download, Filter, Loader2, Search, Trash2, Eye, CheckSquare, 
  Square, AlertTriangle, Calendar, Users, 
  ChevronLeft, ChevronRight, X, Archive, Mail, MailCheck 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ContactDoc = {
  id: string;
  purpose?: string;
  fullName: string;
  email: string;
  title?: string;
  message: string;
  country?: string;
  createdAt?: any; // Firestore Timestamp
  status?: 'new' | 'read' | 'replied' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
};

type SortField = 'fullName' | 'email' | 'createdAt' | 'status' | 'priority';
type SortDirection = 'asc' | 'desc';

const ContactsAdmin: React.FC = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState<ContactDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [qText, setQText] = useState('');
  const [status, setStatus] = useState<'all' | NonNullable<ContactDoc['status']>>('all');
  const [priority, setPriority] = useState<'all' | NonNullable<ContactDoc['priority']>>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDetailModal, setShowDetailModal] = useState<ContactDoc | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    setLoading(true);
    const qy = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qy, snap => {
      const next: ContactDoc[] = [];
      snap.forEach(d => {
        const data = d.data() as any;
        next.push({
          id: d.id,
          purpose: data.purpose,
          fullName: data.fullName,
          email: data.email,
          title: data.title,
          message: data.message,
          country: data.country,
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
      if (!okStatus || !okPriority) return false;

      if (qText.trim()) {
        const term = qText.trim().toLowerCase();
        const hay = `${r.fullName} ${r.email} ${r.purpose ?? ''} ${r.title ?? ''} ${r.message}`.toLowerCase();
        return hay.includes(term);
      }
      return true;
    });

    result.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortField) {
        case 'fullName': aVal = a.fullName.toLowerCase(); bVal = b.fullName.toLowerCase(); break;
        case 'email': aVal = a.email.toLowerCase(); bVal = b.email.toLowerCase(); break;
        case 'createdAt': aVal = a.createdAt?.toMillis() || 0; bVal = b.createdAt?.toMillis() || 0; break;
        case 'status': aVal = a.status || 'new'; bVal = b.status || 'new'; break;
        case 'priority':
          const order = { low: 1, medium: 2, high: 3, urgent: 4 } as const;
          aVal = order[a.priority || 'medium']; bVal = order[b.priority || 'medium']; break;
        default: return 0;
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rows, qText, status, priority, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: rows.length,
      new: rows.filter(r => (r.status ?? 'new') === 'new').length,
      read: rows.filter(r => r.status === 'read').length,
      replied: rows.filter(r => r.status === 'replied').length,
      archived: rows.filter(r => r.status === 'archived').length,
      urgent: rows.filter(r => r.priority === 'urgent').length,
    };
  }, [rows]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const setStatusOn = async (id: string, next: NonNullable<ContactDoc['status']>) => {
    try {
      setActionLoading(prev => new Set([...prev, id]));
      await updateDoc(doc(db, 'contacts', id), { status: next });
      // i18n toast
      showNotification(t('admin.contacts.status_updated_success'));
    } catch (error) {
      showNotification(t('admin.contacts.status_update_error'), 'error');
    } finally {
      setActionLoading(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const setPriorityOn = async (id: string, next: NonNullable<ContactDoc['priority']>) => {
    try {
      setActionLoading(prev => new Set([...prev, id]));
      await updateDoc(doc(db, 'contacts', id), { priority: next });
      // (non demandé explicitement, on laisse tel quel ou ajoute une clé si vous en avez une)
      showNotification(t('admin.contacts.priority_updated_success', { defaultValue: 'Priorité mise à jour avec succès' }));
    } catch (error) {
      showNotification(t('admin.contacts.priority_update_error', { defaultValue: 'Erreur lors de la mise à jour de la priorité' }), 'error');
    } finally {
      setActionLoading(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const deleteContact = async (id: string) => {
    try {
      setActionLoading(prev => new Set([...prev, id]));
      await deleteDoc(doc(db, 'contacts', id));
      showNotification(t('admin.contacts.deleted_success', { defaultValue: 'Contact supprimé avec succès' }));
      setShowDeleteConfirm(null);
    } catch (error) {
      showNotification(t('admin.contacts.delete_error', { defaultValue: 'Erreur lors de la suppression' }), 'error');
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
        const docRef = doc(db, 'contacts', id);
        if (action === 'delete') batch.delete(docRef);
        else if (action === 'status' && value) batch.update(docRef, { status: value });
        else if (action === 'priority' && value) batch.update(docRef, { priority: value });
      });
      await batch.commit();
      // i18n toast bulk
      showNotification(
        t(action === 'delete' ? 'admin.contacts.bulk_deleted' : 'admin.contacts.bulk_updated', { count: selectedIds.size })
      );
      setSelectedIds(new Set());
      setShowBatchActions(false);
    } catch (error) {
      showNotification(t('admin.contacts.bulk_action_error', { defaultValue: "Erreur lors de l'action groupée" }), 'error');
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
    const header = ['id','fullName','email','purpose','title','message','country','status','priority','createdAt'];
    const lines = [header.join(',')];
    filtered.forEach(r => {
      const vals = [
        r.id,
        r.fullName ?? '',
        r.email ?? '',
        r.purpose ?? '',
        r.title ?? '',
        (r.message ?? '').replace(/\n|\r|,/g,' ').slice(0,800),
        r.country ?? '',
        r.status ?? 'new',
        r.priority ?? 'medium',
        fmtDate(r.createdAt)
      ];
      lines.push(vals.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-green-600 bg-green-50 border-green-200';
      case 'read': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'replied': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'archived': return 'text-gray-600 bg-gray-50 border-gray-200';
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
              <Users className="w-6 h-6" />
              Messages · Contacts
            </h1>
            <p className="text-slate-600 mt-1">{t('admin.contacts.subtitle')}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.new}</div>
              <div className="text-xs text-slate-500">Nouveaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <div className="text-xs text-slate-500">Urgents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={t('admin.search.contacts_placeholder', { defaultValue: 'Rechercher (nom, email, sujet, message)…' })}
                className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={qText}
                onChange={e => setQText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={status}
                onChange={e => setStatus(e.target.value as any)}
              >
                <option value="all">{t('admin.common.all_statuses', { defaultValue: 'Tous les statuts' })}</option>
                <option value="new">{t('admin.common.new', { defaultValue: 'Nouveau' })}</option>
                <option value="read">{t('admin.common.read', { defaultValue: 'Lu' })}</option>
                <option value="replied">{t('admin.common.replied')}</option>
                <option value="archived">{t('admin.common.archived')}</option>
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleBatchAction('status', 'read')}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {t('admin.common.mark_read', { defaultValue: 'Marquer comme lu' })}
                      </button>
                      <button
                        onClick={() => handleBatchAction('status', 'replied')}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex items-center gap-2"
                      >
                        <MailCheck className="w-4 h-4" />
                        {t('admin.common.mark_replied', { defaultValue: 'Marquer comme répondu' })}
                      </button>
                      <button
                        onClick={() => handleBatchAction('status', 'archived')}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        {t('admin.common.archive', { defaultValue: 'Archiver' })}
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
                  <button onClick={() => handleSort('fullName')} className="flex items-center gap-1 hover:text-slate-900">
                    Nom {sortField === 'fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-slate-900">
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">{t('admin.contacts.subject', { defaultValue: 'Objet' })}</th>
                <th className="py-3 px-4">{t('admin.contacts.message', { defaultValue: 'Message' })}</th>
                <th className="py-3 px-4">{t('admin.contacts.country', { defaultValue: 'Pays' })}</th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-slate-900 whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4" />
                    {t('admin.contacts.received_date', { defaultValue: 'Reçu' })} {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-slate-900">
                    {t('admin.contacts.status', { defaultValue: 'Statut' })} {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('priority')} className="flex items-center gap-1 hover:text-slate-900">
                    {t('admin.contacts.priority', { defaultValue: 'Priorité' })} {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-8 text-center" colSpan={10}>
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('admin.common.loading', { defaultValue: 'Chargement…' })}
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-slate-500" colSpan={10}>
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
                    <td className="py-3 px-4 font-medium">{r.fullName}</td>
                    <td className="py-3 px-4">{r.email}</td>
                    <td className="py-3 px-4">{r.purpose ?? '—'}</td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="truncate" title={r.message}>
                        {r.message}
                      </div>
                    </td>
                    <td className="py-3 px-4">{r.country ?? '—'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                    <td className="py-3 px-4">
                      <select
                        className={`border rounded-lg px-2 py-1 text-xs font-medium ${getStatusColor(r.status || 'new')}`}
                        value={r.status ?? 'new'}
                        onChange={(e) => setStatusOn(r.id, e.target.value as any)}
                        disabled={actionLoading.has(r.id)}
                      >
                        <option value="new">{t('admin.common.new', { defaultValue: 'Nouveau' })}</option>
                        <option value="read">{t('admin.common.read', { defaultValue: 'Lu' })}</option>
                        <option value="replied">{t('admin.common.replied')}</option>
                        <option value="archived">{t('admin.common.archived')}</option>
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('admin.contacts.detail_title')}</h3>
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="p-2 hover:bg-slate-50 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.contacts.full_name', { defaultValue: 'Nom complet' })}</label>
                    <div className="mt-1 text-slate-900">{showDetailModal.fullName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.contacts.email', { defaultValue: 'Email' })}</label>
                    <div className="mt-1 text-slate-900">{showDetailModal.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.contacts.country', { defaultValue: 'Pays' })}</label>
                    <div className="mt-1 text-slate-900">{showDetailModal.country ?? '—'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.contacts.received_date')}</label>
                    <div className="mt-1 text-slate-900">{fmtDate(showDetailModal.createdAt)}</div>
                  </div>
                </div>
                
                {showDetailModal.purpose && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.contacts.subject')}</label>
                    <div className="mt-1 text-slate-900">{showDetailModal.purpose}</div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-slate-600">{t('admin.contacts.message')}</label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 whitespace-pre-wrap">
                    {showDetailModal.message}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.contacts.status')}</label>
                    <div className={`mt-1 inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(showDetailModal.status || 'new')}`}>
                      {showDetailModal.status === 'new' ? t('admin.common.new', { defaultValue: 'Nouveau' }) :
                       showDetailModal.status === 'read' ? t('admin.common.read', { defaultValue: 'Lu' }) :
                       showDetailModal.status === 'replied' ? t('admin.common.replied') :
                       t('admin.common.archived')}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">{t('admin.contacts.priority')}</label>
                    <div className={`mt-1 inline-block px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(showDetailModal.priority || 'medium')}`}>
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
              <h3 className="text-lg font-semibold">{t('admin.contacts.delete_confirm_title')}</h3>
            </div>
            <p className="text-slate-600 mb-6">
              {t('admin.contacts.delete_confirm_description', { defaultValue: 'Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.' })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                {t('admin.common.cancel', { defaultValue: 'Annuler' })}
              </button>
              <button
                onClick={() => deleteContact(showDeleteConfirm)}
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

export default ContactsAdmin;
