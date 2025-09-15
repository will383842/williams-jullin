// src/components/admin/AdminSidebar.tsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, Mail, TrendingUp, BarChart3, Settings, 
  Activity, Users, Bell, ChevronRight, ChevronDown,
  LogOut, User, HelpCircle, FileText,
  Shield, Download,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useTranslation } from 'react-i18next';

type MainSection = 'dashboard' | 'messages' | 'analytics' | 'settings' | 'logs';
type SubTab = 'contacts' | 'investors' | 'notifications' | 'exports';

interface AdminSidebarProps {
  activeMain: MainSection;
  activeSub?: SubTab;
  onNavigate: (main: MainSection, sub?: SubTab) => void;
}

interface MenuItem {
  id: MainSection;
  title: string;
  icon: React.ReactNode;
  badge?: number;
  subItems?: {
    id: SubTab;
    title: string;
    icon: React.ReactNode;
    badge?: number;
  }[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeMain, 
  activeSub, 
  onNavigate 
}) => {
  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<MainSection>>(
    new Set(['messages']) // Messages ouvert par défaut
  );

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: t('admin.menu.dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'messages',
      title: t('admin.menu.messages'),
      icon: <Mail className="w-5 h-5" />,
      badge: 12, // Exemple de badge dynamique
      subItems: [
        {
          id: 'contacts',
          title: t('admin.menu.contacts'),
          icon: <Users className="w-4 h-4" />,
          badge: 5
        },
        {
          id: 'investors',
          title: t('admin.menu.investors'),
          icon: <TrendingUp className="w-4 h-4" />,
          badge: 7
        },
        {
          id: 'notifications',
          title: t('admin.menu.notifications'),
          icon: <Bell className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytiques',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'settings',
      title: t('admin.menu.settings'),
      icon: <Settings className="w-5 h-5" />,
      subItems: [
        {
          id: 'exports',
          title: 'Exports',
          icon: <Download className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'logs',
      title: 'Journaux',
      icon: <Activity className="w-5 h-5" />
    }
  ];

  const toggleExpanded = (sectionId: MainSection) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleMainClick = (item: MenuItem) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleExpanded(item.id);
      if (activeMain === item.id && expandedSections.has(item.id)) {
        onNavigate(item.id, item.subItems[0].id);
      }
    } else {
      onNavigate(item.id);
    }
  };

  const handleSubClick = (mainId: MainSection, subId: SubTab) => {
    onNavigate(mainId, subId);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <div className={`bg-white border-r border-slate-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } min-h-full flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Administration</h2>
              <p className="text-xs text-slate-500">Gestion de plateforme</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={collapsed ? t('admin.common.expand') : t('admin.common.collapse')}
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeMain === item.id;
            const isExpanded = expandedSections.has(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMainClick(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={collapsed ? item.title : undefined}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    {!collapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                  </div>
                  
                  {!collapsed && (
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          isActive 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {hasSubItems && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} />
                      )}
                    </div>
                  )}
                </button>

                {/* Sous-éléments */}
                {hasSubItems && !collapsed && isExpanded && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = activeSub === subItem.id;
                      return (
                        <li key={subItem.id}>
                          <button
                            onClick={() => handleSubClick(item.id, subItem.id)}
                            className={`w-full flex items-center justify-between p-2 pl-4 rounded-lg text-sm transition-all ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {subItem.icon}
                              <span>{subItem.title}</span>
                            </div>
                            {subItem.badge && (
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                isSubActive
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {subItem.badge}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Version réduite - indicateur de sous-éléments */}
                {hasSubItems && collapsed && isActive && (
                  <div className="mt-2 ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section utilitaires */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200">
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Aide & Support</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Documentation</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer avec profil admin */}
      <div className="p-4 border-t border-slate-200">
        {collapsed ? (
          <button
            onClick={handleSignOut}
            className="w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t("admin.auth.logout")}
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <div className="space-y-3">
            {/* Profil admin */}
            <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {auth.currentUser?.email || 'Admin'}
                </p>
                <p className="text-xs text-slate-500">Administrateur</p>
              </div>
            </div>

            {/* Actions admin */}
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Shield className="w-4 h-4" />
                <span className="text-xs">{t("admin.menu.security")}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 flex items-center justify-center space-x-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Sortir</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
