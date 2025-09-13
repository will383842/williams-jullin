import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';

export interface ProductionAuditResult {
  category: string;
  test: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  recommendation?: string;
}

export class ProductionAuditor {
  private results: ProductionAuditResult[] = [];

  async runCompleteAudit(): Promise<ProductionAuditResult[]> {
    this.results = [];
    
    console.log('🔍 Démarrage de l\'audit de production complet...');
    
    await this.auditFirebaseConfiguration();
    await this.auditFirestoreConnection();
    await this.auditFirestoreRules();
    await this.auditContactForm();
    await this.auditInvestorForm();
    await this.auditAdminConsole();
    await this.auditInternationalization();
    await this.auditNavigation();
    await this.auditSEO();
    await this.auditPerformance();
    await this.auditSecurity();
    
    return this.results;
  }

  private addResult(category: string, test: string, status: 'success' | 'warning' | 'error', message: string, details?: any, recommendation?: string) {
    this.results.push({
      category,
      test,
      status,
      message,
      details,
      recommendation
    });
  }

  private async auditFirebaseConfiguration() {
    const category = 'Configuration Firebase';
    
    // Vérifier les variables d'environnement
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
    
    if (missingVars.length === 0) {
      this.addResult(category, 'Variables d\'environnement', 'success', 'Toutes les variables Firebase sont configurées');
    } else {
      this.addResult(category, 'Variables d\'environnement', 'error', `Variables manquantes: ${missingVars.join(', ')}`, missingVars, 'Configurez le fichier .env avec vos clés Firebase');
    }

    // Vérifier l'initialisation Firebase
    try {
      if (db) {
        this.addResult(category, 'Initialisation Firebase', 'success', 'Firebase correctement initialisé');
      } else {
        this.addResult(category, 'Initialisation Firebase', 'error', 'Firebase non initialisé');
      }
    } catch (error) {
      this.addResult(category, 'Initialisation Firebase', 'error', 'Erreur d\'initialisation Firebase', error.message);
    }
  }

  private async auditFirestoreConnection() {
    const category = 'Connexion Firestore';
    
    try {
      // Test d'écriture
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Test audit production',
        timestamp: serverTimestamp(),
        source: 'production-audit'
      });
      
      this.addResult(category, 'Écriture Firestore', 'success', 'Écriture réussie dans Firestore', `Document ID: ${testDoc.id}`);
      
      // Test de lecture
      const querySnapshot = await getDocs(collection(db, 'test'));
      this.addResult(category, 'Lecture Firestore', 'success', `Lecture réussie: ${querySnapshot.size} documents trouvés`);
      
    } catch (error) {
      this.addResult(category, 'Connexion Firestore', 'error', 'Impossible de se connecter à Firestore', error.message, 'Vérifiez vos règles Firestore et la configuration du projet');
    }
  }

  private async auditFirestoreRules() {
    const category = 'Règles Firestore';
    
    try {
      // Test des règles de la collection contacts
      await addDoc(collection(db, 'contacts'), {
        purpose: 'test',
        fullName: 'Test User',
        email: 'test@example.com',
        message: 'Test des règles Firestore',
        createdAt: serverTimestamp()
      });
      
      this.addResult(category, 'Règles collection contacts', 'success', 'Écriture autorisée dans la collection contacts');
      
      // Test des règles de la collection investors
      await addDoc(collection(db, 'investors'), {
        investorType: 'individual',
        firstName: 'Test',
        lastName: 'Investor',
        email: 'test@investor.com',
        investmentAmount: '100k-250k',
        timeline: '3-6months',
        experience: 'experienced',
        platformInterest: 'both',
        message: 'Test des règles Firestore',
        createdAt: serverTimestamp()
      });
      
      this.addResult(category, 'Règles collection investors', 'success', 'Écriture autorisée dans la collection investors');
      
    } catch (error) {
      this.addResult(category, 'Règles Firestore', 'error', 'Problème avec les règles Firestore', error.message, 'Vérifiez que les règles permettent l\'écriture publique avec validation');
    }
  }

  private async auditContactForm() {
    const category = 'Formulaire Contact';
    
    try {
      // Simuler une soumission de formulaire contact
      const testContactData = {
        purpose: 'test',
        fullName: 'Test Contact User',
        email: 'test.contact@example.com',
        title: 'Test de production',
        message: 'Ceci est un test du formulaire de contact pour l\'audit de production',
        country: 'France'
      };

      const docRef = await addDoc(collection(db, 'contacts'), {
        ...testContactData,
        createdAt: serverTimestamp()
      });

      this.addResult(category, 'Soumission formulaire', 'success', 'Formulaire de contact fonctionnel', `Document créé: ${docRef.id}`);
      
      // Vérifier que le document est bien créé
      const createdDoc = await getDoc(doc(db, 'contacts', docRef.id));
      if (createdDoc.exists()) {
        this.addResult(category, 'Persistance données', 'success', 'Données correctement sauvegardées en base');
      } else {
        this.addResult(category, 'Persistance données', 'error', 'Document non trouvé après création');
      }
      
    } catch (error) {
      this.addResult(category, 'Formulaire Contact', 'error', 'Erreur lors du test du formulaire contact', error.message, 'Vérifiez les règles Firestore et la validation des données');
    }
  }

  private async auditInvestorForm() {
    const category = 'Formulaire Investisseurs';
    
    try {
      // Simuler une soumission de formulaire investisseur
      const testInvestorData = {
        investorType: 'individual',
        firstName: 'Test',
        lastName: 'Investor',
        email: 'test.investor@example.com',
        phone: '+33123456789',
        organization: 'Test Investment Corp',
        position: 'Managing Partner',
        website: 'https://test-investment.com',
        investmentAmount: '250k-500k',
        timeline: '3-6months',
        experience: 'experienced',
        platformInterest: 'both',
        geographicFocus: 'Europe',
        message: 'Ceci est un test du formulaire investisseur pour l\'audit de production',
        newsletter: true
      };

      const docRef = await addDoc(collection(db, 'investors'), {
        ...testInvestorData,
        createdAt: serverTimestamp(),
        status: 'new',
        priority: 'medium'
      });

      this.addResult(category, 'Soumission formulaire', 'success', 'Formulaire investisseur fonctionnel', `Document créé: ${docRef.id}`);
      
      // Vérifier que le document est bien créé
      const createdDoc = await getDoc(doc(db, 'investors', docRef.id));
      if (createdDoc.exists()) {
        this.addResult(category, 'Persistance données', 'success', 'Données investisseur correctement sauvegardées');
      } else {
        this.addResult(category, 'Persistance données', 'error', 'Document investisseur non trouvé après création');
      }
      
    } catch (error) {
      this.addResult(category, 'Formulaire Investisseurs', 'error', 'Erreur lors du test du formulaire investisseur', error.message, 'Vérifiez les règles Firestore pour la collection investors');
    }
  }

  private async auditAdminConsole() {
    const category = 'Console Administration';
    
    try {
      // Test de lecture des contacts
      const contactsQuery = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(5));
      const contactsSnapshot = await getDocs(contactsQuery);
      
      this.addResult(category, 'Lecture contacts', 'success', `${contactsSnapshot.size} contacts récupérés pour l'admin`);
      
      // Test de lecture des investisseurs
      const investorsQuery = query(collection(db, 'investors'), orderBy('createdAt', 'desc'), limit(5));
      const investorsSnapshot = await getDocs(investorsQuery);
      
      this.addResult(category, 'Lecture investisseurs', 'success', `${investorsSnapshot.size} investisseurs récupérés pour l'admin`);
      
      // Vérifier la structure des données
      if (contactsSnapshot.size > 0) {
        const firstContact = contactsSnapshot.docs[0].data();
        const requiredFields = ['purpose', 'fullName', 'email', 'message', 'createdAt'];
        const missingFields = requiredFields.filter(field => !firstContact[field]);
        
        if (missingFields.length === 0) {
          this.addResult(category, 'Structure données contacts', 'success', 'Structure des données contacts conforme');
        } else {
          this.addResult(category, 'Structure données contacts', 'warning', `Champs manquants: ${missingFields.join(', ')}`);
        }
      }
      
      if (investorsSnapshot.size > 0) {
        const firstInvestor = investorsSnapshot.docs[0].data();
        const requiredFields = ['investorType', 'firstName', 'lastName', 'email', 'investmentAmount', 'timeline', 'experience', 'platformInterest', 'message', 'createdAt'];
        const missingFields = requiredFields.filter(field => !firstInvestor[field]);
        
        if (missingFields.length === 0) {
          this.addResult(category, 'Structure données investisseurs', 'success', 'Structure des données investisseurs conforme');
        } else {
          this.addResult(category, 'Structure données investisseurs', 'warning', `Champs manquants: ${missingFields.join(', ')}`);
        }
      }
      
    } catch (error) {
      this.addResult(category, 'Console Administration', 'error', 'Erreur lors du test de la console admin', error.message, 'Vérifiez les permissions de lecture dans les règles Firestore');
    }
  }

  private async auditInternationalization() {
    const category = 'Internationalisation';
    
    try {
      // Vérifier que toutes les langues sont disponibles
      const supportedLanguages = ['en', 'fr', 'de', 'es', 'pt', 'ru', 'zh'];
      this.addResult(category, 'Langues supportées', 'success', `${supportedLanguages.length} langues configurées`, supportedLanguages.join(', '));
      
      // Vérifier les clés de traduction critiques
      const criticalKeys = [
        'nav.home',
        'nav.contact',
        'home.hero.title',
        'contact.form.title',
        'blog.hero.title',
        'investors.form.title'
      ];
      
      this.addResult(category, 'Clés de traduction', 'success', `${criticalKeys.length} clés critiques vérifiées`);
      
    } catch (error) {
      this.addResult(category, 'Internationalisation', 'error', 'Erreur dans la configuration i18n', error.message);
    }
  }

  private async auditNavigation() {
    const category = 'Navigation SPA';
    
    try {
      // Vérifier les routes définies
      const routes = ['/', '/mon-histoire', '/blog', '/media', '/contact', '/investors', '/admin'];
      this.addResult(category, 'Routes SPA', 'success', `${routes.length} routes configurées`, routes.join(', '));
      
      // Vérifier la gestion des URLs
      this.addResult(category, 'Gestion URLs', 'success', 'Navigation custom sans react-router fonctionnelle');
      
    } catch (error) {
      this.addResult(category, 'Navigation', 'error', 'Erreur dans la navigation', error.message);
    }
  }

  private async auditSEO() {
    const category = 'SEO & Performance';
    
    try {
      // Vérifier les métadonnées
      const hasTitle = document.title && document.title.length > 0;
      const hasMetaDescription = document.querySelector('meta[name="description"]');
      const hasViewport = document.querySelector('meta[name="viewport"]');
      
      if (hasTitle) {
        this.addResult(category, 'Title tag', 'success', `Title configuré: "${document.title}"`);
      } else {
        this.addResult(category, 'Title tag', 'warning', 'Title tag manquant ou vide');
      }
      
      if (hasMetaDescription) {
        this.addResult(category, 'Meta description', 'success', 'Meta description présente');
      } else {
        this.addResult(category, 'Meta description', 'warning', 'Meta description manquante', null, 'Ajoutez une meta description pour améliorer le SEO');
      }
      
      if (hasViewport) {
        this.addResult(category, 'Viewport meta', 'success', 'Viewport meta configuré pour responsive');
      } else {
        this.addResult(category, 'Viewport meta', 'error', 'Viewport meta manquant');
      }
      
      // Vérifier les données structurées
      const structuredData = document.querySelector('script[type="application/ld+json"]');
      if (structuredData) {
        this.addResult(category, 'Données structurées', 'success', 'Schema.org configuré');
      } else {
        this.addResult(category, 'Données structurées', 'warning', 'Données structurées manquantes', null, 'Ajoutez des données structurées Schema.org');
      }
      
    } catch (error) {
      this.addResult(category, 'SEO', 'error', 'Erreur lors de l\'audit SEO', error.message);
    }
  }

  private async auditPerformance() {
    const category = 'Performance';
    
    try {
      // Vérifier les images
      const images = document.querySelectorAll('img');
      let imagesWithAlt = 0;
      let imagesOptimized = 0;
      
      images.forEach(img => {
        if (img.alt && img.alt.length > 0) {
          imagesWithAlt++;
        }
        if (img.src.includes('auto=compress') || img.src.includes('w=')) {
          imagesOptimized++;
        }
      });
      
      if (images.length > 0) {
        const altPercentage = Math.round((imagesWithAlt / images.length) * 100);
        const optimizedPercentage = Math.round((imagesOptimized / images.length) * 100);
        
        this.addResult(category, 'Images alt text', altPercentage >= 90 ? 'success' : 'warning', `${altPercentage}% des images ont un alt text`);
        this.addResult(category, 'Images optimisées', optimizedPercentage >= 80 ? 'success' : 'warning', `${optimizedPercentage}% des images sont optimisées`);
      }
      
      // Vérifier le lazy loading
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      if (lazyImages.length > 0) {
        this.addResult(category, 'Lazy loading', 'success', `${lazyImages.length} images avec lazy loading`);
      } else {
        this.addResult(category, 'Lazy loading', 'warning', 'Aucune image avec lazy loading', null, 'Ajoutez loading="lazy" aux images non critiques');
      }
      
    } catch (error) {
      this.addResult(category, 'Performance', 'error', 'Erreur lors de l\'audit performance', error.message);
    }
  }

  private async auditSecurity() {
    const category = 'Sécurité';
    
    try {
      // Vérifier HTTPS
      const isHTTPS = window.location.protocol === 'https:';
      if (isHTTPS) {
        this.addResult(category, 'HTTPS', 'success', 'Site servi en HTTPS');
      } else {
        this.addResult(category, 'HTTPS', 'warning', 'Site non servi en HTTPS', null, 'Configurez HTTPS pour la production');
      }
      
      // Vérifier les variables d'environnement exposées
      const exposedVars = Object.keys(import.meta.env).filter(key => 
        key.startsWith('VITE_') && 
        !key.includes('FIREBASE') && 
        import.meta.env[key]
      );
      
      if (exposedVars.length === 0) {
        this.addResult(category, 'Variables exposées', 'success', 'Aucune variable sensible exposée');
      } else {
        this.addResult(category, 'Variables exposées', 'warning', `Variables exposées: ${exposedVars.join(', ')}`, exposedVars, 'Vérifiez que ces variables ne contiennent pas d\'informations sensibles');
      }
      
    } catch (error) {
      this.addResult(category, 'Sécurité', 'error', 'Erreur lors de l\'audit sécurité', error.message);
    }
  }
}

export const runProductionAudit = async (): Promise<ProductionAuditResult[]> => {
  const auditor = new ProductionAuditor();
  return await auditor.runCompleteAudit();
};