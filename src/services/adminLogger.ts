// src/services/adminLogger.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface LogEntry {
  level: 'info' | 'warning' | 'error' | 'debug' | 'success';
  category: 'auth' | 'database' | 'api' | 'ui' | 'security' | 'performance' | 'system';
  action: string;
  message: string;
  details?: any;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  source?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

class AdminLogger {
  private static instance: AdminLogger;
  private logQueue: LogEntry[] = [];
  private isProcessing = false;

  static getInstance(): AdminLogger {
    if (!AdminLogger.instance) {
      AdminLogger.instance = new AdminLogger();
    }
    return AdminLogger.instance;
  }

  private async getUserInfo() {
    const user = auth.currentUser;
    return {
      userId: user?.uid,
      userEmail: user?.email,
      userAgent: navigator.userAgent.substring(0, 100)
    };
  }

  private async saveLog(logEntry: LogEntry) {
    try {
      const userInfo = await this.getUserInfo();
      
      await addDoc(collection(db, 'admin_logs'), {
        ...logEntry,
        ...userInfo,
        timestamp: serverTimestamp(),
        ip: await this.getClientIP()
      });
    } catch (error) {
      console.error('Erreur sauvegarde log:', error);
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // En production, vous devriez utiliser un service réel pour obtenir l'IP
      return '192.168.1.100'; // IP simulée pour la démo
    } catch {
      return 'unknown';
    }
  }

  private async processLogQueue() {
    if (this.isProcessing || this.logQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.logQueue.length > 0) {
      const logEntry = this.logQueue.shift();
      if (logEntry) {
        await this.saveLog(logEntry);
      }
    }
    
    this.isProcessing = false;
  }

  // Méthodes publiques pour logger différents types d'événements
  
  async logInfo(action: string, message: string, details?: any, category: LogEntry['category'] = 'system') {
    this.logQueue.push({
      level: 'info',
      category,
      action,
      message,
      details,
      source: 'admin_panel'
    });
    this.processLogQueue();
  }

  async logSuccess(action: string, message: string, details?: any, category: LogEntry['category'] = 'system') {
    this.logQueue.push({
      level: 'success',
      category,
      action,
      message,
      details,
      source: 'admin_panel'
    });
    this.processLogQueue();
  }

  async logWarning(action: string, message: string, details?: any, category: LogEntry['category'] = 'system') {
    this.logQueue.push({
      level: 'warning',
      category,
      action,
      message,
      details,
      source: 'admin_panel'
    });
    this.processLogQueue();
  }

  async logError(action: string, message: string, error?: any, category: LogEntry['category'] = 'system') {
    this.logQueue.push({
      level: 'error',
      category,
      action,
      message,
      details: error ? { error: error.message, stack: error.stack } : undefined,
      source: 'admin_panel'
    });
    this.processLogQueue();
  }

  async logDebug(action: string, message: string, details?: any, category: LogEntry['category'] = 'system') {
    this.logQueue.push({
      level: 'debug',
      category,
      action,
      message,
      details,
      source: 'admin_panel'
    });
    this.processLogQueue();
  }

  // Méthodes spécialisées pour les actions d'administration
  
  async logAuth(action: 'login' | 'logout' | 'login_failed', message: string, details?: any) {
    await this.logInfo(action, message, details, 'auth');
  }

  async logDatabase(action: string, message: string, details?: any, duration?: number) {
    this.logQueue.push({
      level: 'info',
      category: 'database',
      action,
      message,
      details,
      duration,
      source: 'firestore'
    });
    this.processLogQueue();
  }

  async logUI(action: string, message: string, details?: any) {
    await this.logInfo(action, message, details, 'ui');
  }

  async logSecurity(action: string, message: string, details?: any, level: LogEntry['level'] = 'warning') {
    this.logQueue.push({
      level,
      category: 'security',
      action,
      message,
      details,
      source: 'security_monitor'
    });
    this.processLogQueue();
  }

  async logPerformance(action: string, message: string, duration: number, details?: any) {
    const level: LogEntry['level'] = duration > 5 ? 'warning' : duration > 10 ? 'error' : 'info';
    
    this.logQueue.push({
      level,
      category: 'performance',
      action,
      message,
      duration,
      details,
      source: 'performance_monitor'
    });
    this.processLogQueue();
  }

  // Méthodes pour logger les actions CRUD
  
  async logContactAction(action: 'create' | 'update' | 'delete' | 'view', contactId: string, details?: any) {
    const messages = {
      create: 'Nouveau contact créé',
      update: 'Contact mis à jour', 
      delete: 'Contact supprimé',
      view: 'Contact consulté'
    };

    await this.logDatabase(`contact_${action}`, messages[action], {
      contactId,
      ...details
    });
  }

  async logInvestorAction(action: 'create' | 'update' | 'delete' | 'view', investorId: string, details?: any) {
    const messages = {
      create: 'Nouvel investisseur créé',
      update: 'Investisseur mis à jour',
      delete: 'Investisseur supprimé', 
      view: 'Investisseur consulté'
    };

    await this.logDatabase(`investor_${action}`, messages[action], {
      investorId,
      ...details
    });
  }

  async logSettingsChange(setting: string, oldValue: any, newValue: any) {
    await this.logInfo('settings_update', `Paramètre modifié: ${setting}`, {
      setting,
      oldValue,
      newValue
    }, 'system');
  }

  async logExport(type: 'contacts' | 'investors' | 'analytics' | 'logs', format: string, recordCount: number) {
    await this.logInfo('data_export', `Export ${type} en ${format}`, {
      type,
      format,
      recordCount
    }, 'system');
  }

  async logImport(type: 'contacts' | 'investors', recordCount: number, errors?: number) {
    const level: LogEntry['level'] = errors && errors > 0 ? 'warning' : 'success';
    
    this.logQueue.push({
      level,
      category: 'database',
      action: 'data_import',
      message: `Import ${type}: ${recordCount} enregistrements${errors ? `, ${errors} erreurs` : ''}`,
      details: { type, recordCount, errors },
      source: 'import_service'
    });
    this.processLogQueue();
  }

  // Méthode pour mesurer les performances d'une fonction
  async measurePerformance<T>(
    action: string, 
    operation: () => Promise<T>, 
    details?: any
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      const duration = (Date.now() - startTime) / 1000;
      
      await this.logPerformance(action, `Opération ${action} terminée`, duration, {
        success: true,
        ...details
      });
      
      return result;
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      
      await this.logError(action, `Erreur lors de ${action}`, error, 'performance');
      
      throw error;
    }
  }
}

// Instance singleton
export const adminLogger = AdminLogger.getInstance();

// Hook React pour utiliser le logger facilement
export const useAdminLogger = () => {
  return adminLogger;
};

// Décorateur pour logger automatiquement les erreurs (utilisation optionnelle)
export function LogErrors(category: LogEntry['category'] = 'system') {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        adminLogger.logError(
          propertyName,
          `Erreur dans ${target.constructor.name}.${propertyName}`,
          error,
          category
        );
        throw error;
      }
    };
  };
}

export default AdminLogger;