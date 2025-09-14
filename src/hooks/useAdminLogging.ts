// src/hooks/useAdminLogging.ts
import { useEffect, useCallback, useRef } from 'react';
import { adminLogger } from '../services/adminLogger';

// Hook pour logger automatiquement les vues de pages
export const usePageLogger = (pageName: string, section?: string) => {
  const hasLogged = useRef(false);

  useEffect(() => {
    if (!hasLogged.current) {
      adminLogger.logUI('page_view', `Page ${pageName} visitée`, {
        page: pageName,
        section,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      hasLogged.current = true;
    }
  }, [pageName, section]);
};

// Hook pour logger les actions sur les formulaires
export const useFormLogger = (formName: string) => {
  const logFormAction = useCallback((action: string, details?: any) => {
    adminLogger.logUI(`form_${action}`, `Formulaire ${formName}: ${action}`, {
      form: formName,
      action,
      ...details
    });
  }, [formName]);

  const logFormSubmit = useCallback((success: boolean, data?: any, error?: any) => {
    if (success) {
      adminLogger.logSuccess('form_submit', `Formulaire ${formName} soumis avec succès`, {
        form: formName,
        data
      }, 'ui');
    } else {
      adminLogger.logError('form_submit', `Erreur soumission formulaire ${formName}`, error, 'ui');
    }
  }, [formName]);

  const logFieldChange = useCallback((fieldName: string, oldValue: any, newValue: any) => {
    adminLogger.logDebug('form_field_change', `Champ ${fieldName} modifié`, {
      form: formName,
      field: fieldName,
      oldValue,
      newValue
    }, 'ui');
  }, [formName]);

  return {
    logFormAction,
    logFormSubmit,
    logFieldChange
  };
};

// Hook pour logger les actions CRUD
export const useCRUDLogger = (entityType: 'contact' | 'investor') => {
  const logCreate = useCallback((entityId: string, data: any) => {
    if (entityType === 'contact') {
      adminLogger.logContactAction('create', entityId, { data });
    } else {
      adminLogger.logInvestorAction('create', entityId, { data });
    }
    
    // Aussi créer une notification
    adminLogger.logSuccess(
      `${entityType}_created`,
      `Nouveau ${entityType} créé: ${data.fullName || `${data.firstName} ${data.lastName}`}`,
      { entityId, ...data },
      'database'
    );
  }, [entityType]);

  const logUpdate = useCallback((entityId: string, changes: any, oldData?: any) => {
    if (entityType === 'contact') {
      adminLogger.logContactAction('update', entityId, { changes, oldData });
    } else {
      adminLogger.logInvestorAction('update', entityId, { changes, oldData });
    }
  }, [entityType]);

  const logDelete = useCallback((entityId: string, entityName?: string) => {
    if (entityType === 'contact') {
      adminLogger.logContactAction('delete', entityId, { entityName });
    } else {
      adminLogger.logInvestorAction('delete', entityId, { entityName });
    }

    adminLogger.logWarning(
      `${entityType}_deleted`,
      `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} supprimé: ${entityName || entityId}`,
      { entityId, entityName },
      'database'
    );
  }, [entityType]);

  const logBatchAction = useCallback((action: string, entityIds: string[], details?: any) => {
    adminLogger.logInfo(
      `${entityType}_batch_${action}`,
      `Action groupée sur ${entityIds.length} ${entityType}s: ${action}`,
      { entityIds, action, ...details },
      'database'
    );
  }, [entityType]);

  return {
    logCreate,
    logUpdate,
    logDelete,
    logBatchAction
  };
};

// Hook pour logger les erreurs automatiquement
export const useErrorLogger = (component: string) => {
  const logError = useCallback((error: Error, context?: string, details?: any) => {
    adminLogger.logError(
      'component_error',
      `Erreur dans ${component}${context ? ` - ${context}` : ''}`,
      {
        error: error.message,
        stack: error.stack,
        component,
        context,
        ...details
      },
      'ui'
    );
  }, [component]);

  const logWarning = useCallback((message: string, details?: any) => {
    adminLogger.logWarning(
      'component_warning',
      `Avertissement dans ${component}: ${message}`,
      { component, ...details },
      'ui'
    );
  }, [component]);

  return { logError, logWarning };
};

// Hook pour logger les performances
export const usePerformanceLogger = (operation: string) => {
  const measureOperation = useCallback(async <T,>(
    operationFn: () => Promise<T>,
    details?: any
  ): Promise<T> => {
    return adminLogger.measurePerformance(operation, operationFn, details);
  }, [operation]);

  const logSlowOperation = useCallback((duration: number, threshold: number = 3) => {
    if (duration > threshold) {
      adminLogger.logWarning(
        'slow_operation',
        `Opération lente détectée: ${operation} (${duration.toFixed(2)}s)`,
        { operation, duration, threshold },
        'performance'
      );
    }
  }, [operation]);

  return { measureOperation, logSlowOperation };
};

// Hook pour logger les changements de paramètres
export const useSettingsLogger = () => {
  const logSettingChange = useCallback(<T,>(
    setting: string,
    oldValue: T,
    newValue: T,
    category?: string
  ) => {
    adminLogger.logSettingsChange(setting, oldValue, newValue);
    
    if (category) {
      adminLogger.logInfo(
        'setting_updated',
        `Paramètre ${category} mis à jour: ${setting}`,
        { setting, oldValue, newValue, category },
        'system'
      );
    }
  }, []);

  const logBulkSettingsChange = useCallback((changes: Record<string, { old: any; new: any }>) => {
    const changeCount = Object.keys(changes).length;
    
    adminLogger.logInfo(
      'bulk_settings_update',
      `Mise à jour groupée de ${changeCount} paramètres`,
      { changes, changeCount },
      'system'
    );

    // Logger chaque changement individuellement aussi
    Object.entries(changes).forEach(([setting, { old: oldValue, new: newValue }]) => {
      logSettingChange(setting, oldValue, newValue);
    });
  }, [logSettingChange]);

  return { logSettingChange, logBulkSettingsChange };
};

// Hook pour logger les authentifications
export const useAuthLogger = () => {
  const logLogin = useCallback((method: string = 'email', success: boolean = true) => {
    if (success) {
      adminLogger.logAuth('login', `Connexion réussie via ${method}`, { method });
    } else {
      adminLogger.logAuth('login_failed', `Échec connexion via ${method}`, { method });
    }
  }, []);

  const logLogout = useCallback(() => {
    adminLogger.logAuth('logout', 'Déconnexion utilisateur');
  }, []);

  const logSecurityEvent = useCallback((event: string, details?: any, severity: 'info' | 'warning' | 'error' = 'warning') => {
    adminLogger.logSecurity(
      'security_event',
      `Événement sécurité: ${event}`,
      { event, ...details },
      severity
    );
  }, []);

  return { logLogin, logLogout, logSecurityEvent };
};

// Hook pour logger les exports/imports
export const useDataLogger = () => {
  const logExport = useCallback((type: string, format: string, recordCount: number, filters?: any) => {
    adminLogger.logExport(type as any, format, recordCount);
    
    adminLogger.logInfo(
      'data_exported',
      `Export réalisé: ${recordCount} ${type} en ${format}`,
      { type, format, recordCount, filters },
      'system'
    );
  }, []);

  const logImport = useCallback((type: string, recordCount: number, errors: number = 0, warnings: number = 0) => {
    adminLogger.logImport(type as any, recordCount, errors);
    
    if (warnings > 0) {
      adminLogger.logWarning(
        'data_import_warnings',
        `Import avec avertissements: ${warnings} warnings sur ${recordCount} enregistrements`,
        { type, recordCount, errors, warnings },
        'database'
      );
    }
  }, []);

  return { logExport, logImport };
};

// Hook principal qui combine plusieurs loggers
export const useAdminLogger = (component: string) => {
  const { logError, logWarning } = useErrorLogger(component);
  const { measureOperation } = usePerformanceLogger(`${component}_operation`);
  
  // Logger automatique de montage/démontage du composant
  useEffect(() => {
    adminLogger.logDebug(
      'component_mount',
      `Composant ${component} monté`,
      { component },
      'ui'
    );

    return () => {
      adminLogger.logDebug(
        'component_unmount',
        `Composant ${component} démonté`,
        { component },
        'ui'
      );
    };
  }, [component]);

  const logAction = useCallback((action: string, details?: any, level: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    switch (level) {
      case 'success':
        adminLogger.logSuccess(action, `Action réussie: ${action}`, details, 'ui');
        break;
      case 'warning':
        adminLogger.logWarning(action, `Avertissement: ${action}`, details, 'ui');
        break;
      case 'error':
        adminLogger.logError(action, `Erreur: ${action}`, details, 'ui');
        break;
      default:
        adminLogger.logInfo(action, `Action: ${action}`, details, 'ui');
    }
  }, []);

  return {
    logAction,
    logError,
    logWarning,
    measureOperation,
    // Exposer l'instance du logger pour les cas avancés
    logger: adminLogger
  };
};

export default useAdminLogger;