// Utilitaire pour créer des données de test dans Firestore

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SeedDataResult {
  collection: string;
  documentsCreated: number;
  status: 'success' | 'error';
  message: string;
  documentIds?: string[];
}

export class FirestoreDataSeeder {
  private results: SeedDataResult[] = [];

  async seedAllCollections(): Promise<SeedDataResult[]> {
    this.results = [];
    
    console.log('🌱 Démarrage du seeding des données Firestore...');
    
    await this.seedContacts();
    await this.seedInvestors();
    await this.seedAnalytics();
    
    return this.results;
  }

  private async seedContacts() {
    const collection_name = 'contacts';
    
    try {
      const sampleContacts = [
        {
          purpose: 'general',
          fullName: 'Marie Dubois',
          email: 'marie.dubois@email.com',
          title: 'Demande d\'aide pour expatriation en Allemagne',
          message: 'Bonjour Williams, je prévois de m\'expatrier en Allemagne pour le travail et j\'aurais besoin de conseils sur les démarches administratives et le logement. Merci !',
          country: 'France',
          createdAt: serverTimestamp(),
          status: 'new',
          priority: 'medium'
        },
        {
          purpose: 'support',
          fullName: 'John Smith',
          email: 'john.smith@email.com',
          title: 'Question sur SOS-Expat',
          message: 'Hi Williams, I\'m currently in Thailand and facing some visa issues. Could you help me understand how SOS-Expat works? Thanks!',
          country: 'United States',
          createdAt: serverTimestamp(),
          status: 'new',
          priority: 'high'
        },
        {
          purpose: 'partnership',
          fullName: 'Carlos Rodriguez',
          email: 'carlos.rodriguez@email.com',
          title: 'Partenariat services juridiques',
          message: 'Hola Williams, soy abogado especializado en inmigración en España. Me gustaría explorar una posible colaboración con Ulixai para ofrecer servicios a expatriados hispanohablantes.',
          country: 'Spain',
          createdAt: serverTimestamp(),
          status: 'read',
          priority: 'medium'
        },
        {
          purpose: 'media',
          fullName: 'Sophie Laurent',
          email: 'sophie.laurent@journaliste.fr',
          title: 'Interview pour article expatriation',
          message: 'Bonjour M. Jullin, je suis journaliste et je prépare un article sur les nouvelles tendances de l\'expatriation. Seriez-vous disponible pour une interview ?',
          country: 'France',
          createdAt: serverTimestamp(),
          status: 'replied',
          priority: 'low'
        },
        {
          purpose: 'investment',
          fullName: 'David Chen',
          email: 'david.chen@venture.com',
          title: 'Intérêt investissement Ulixai',
          message: 'Hello Williams, I represent a VC fund focused on international mobility startups. We\'re very interested in learning more about Ulixai and potential investment opportunities.',
          country: 'Singapore',
          createdAt: serverTimestamp(),
          status: 'new',
          priority: 'urgent'
        }
      ];

      const documentIds: string[] = [];
      
      for (const contact of sampleContacts) {
        const docRef = await addDoc(collection(db, collection_name), contact);
        documentIds.push(docRef.id);
      }

      this.results.push({
        collection: collection_name,
        documentsCreated: sampleContacts.length,
        status: 'success',
        message: `${sampleContacts.length} contacts de test créés avec succès`,
        documentIds
      });

    } catch (error) {
      this.results.push({
        collection: collection_name,
        documentsCreated: 0,
        status: 'error',
        message: `Erreur lors de la création des contacts: ${error.message}`
      });
    }
  }

  private async seedInvestors() {
    const collection_name = 'investors';
    
    try {
      const sampleInvestors = [
        {
          investorType: 'vc_fund',
          firstName: 'Alexandra',
          lastName: 'Petrov',
          email: 'alexandra.petrov@europeanvc.com',
          phone: '+33 1 42 86 83 00',
          organization: 'European Mobility Ventures',
          position: 'Managing Partner',
          website: 'https://europeanvc.com',
          investmentAmount: '1M-5M',
          timeline: '3-6months',
          experience: 'professional',
          platformInterest: 'both',
          geographicFocus: 'Europe',
          message: 'Nous sommes un fonds VC spécialisé dans la mobilité internationale. Ulixai et SOS-Expat correspondent parfaitement à notre thèse d\'investissement. Nous aimerions discuter d\'un investissement série A.',
          newsletter: true,
          createdAt: serverTimestamp(),
          status: 'qualified',
          priority: 'high'
        },
        {
          investorType: 'individual',
          firstName: 'Robert',
          lastName: 'Johnson',
          email: 'robert.johnson@wealth.com',
          phone: '+1 555 123 4567',
          organization: 'Johnson Family Office',
          position: 'Principal',
          website: 'https://johnsonfamily.com',
          investmentAmount: '250k-500k',
          timeline: '1-3months',
          experience: 'experienced',
          platformInterest: 'ecosystem',
          geographicFocus: 'Global',
          message: 'As a serial expat myself, I understand the pain points your platforms solve. I\'m interested in investing and potentially becoming an advisor.',
          newsletter: true,
          createdAt: serverTimestamp(),
          status: 'meeting_scheduled',
          priority: 'high'
        },
        {
          investorType: 'angel',
          firstName: 'Hiroshi',
          lastName: 'Tanaka',
          email: 'hiroshi.tanaka@angel.jp',
          phone: '+81 3 1234 5678',
          organization: 'Tokyo Angel Network',
          position: 'Angel Investor',
          website: 'https://tokyoangels.jp',
          investmentAmount: '100k-250k',
          timeline: 'immediate',
          experience: 'professional',
          platformInterest: 'ulixai',
          geographicFocus: 'Asia',
          message: 'I\'m very impressed by the traction and the vision. As someone who has invested in several mobility startups in Asia, I see huge potential for Ulixai in the Japanese market.',
          newsletter: false,
          createdAt: serverTimestamp(),
          status: 'new',
          priority: 'medium'
        },
        {
          investorType: 'family_office',
          firstName: 'Isabella',
          lastName: 'Rossi',
          email: 'isabella.rossi@rossigroup.it',
          phone: '+39 02 1234 5678',
          organization: 'Rossi Family Office',
          position: 'Investment Director',
          website: 'https://rossigroup.it',
          investmentAmount: '500k-1M',
          timeline: '6-12months',
          experience: 'experienced',
          platformInterest: 'both',
          geographicFocus: 'Europe',
          message: 'La famiglia Rossi ha una lunga storia di investimenti in tecnologie innovative. Siamo interessati a Ulixai e SOS-Expat per il loro potenziale di impatto sociale e crescita.',
          newsletter: true,
          createdAt: serverTimestamp(),
          status: 'due_diligence',
          priority: 'high'
        }
      ];

      const documentIds: string[] = [];
      
      for (const investor of sampleInvestors) {
        const docRef = await addDoc(collection(db, collection_name), investor);
        documentIds.push(docRef.id);
      }

      this.results.push({
        collection: collection_name,
        documentsCreated: sampleInvestors.length,
        status: 'success',
        message: `${sampleInvestors.length} investisseurs de test créés avec succès`,
        documentIds
      });

    } catch (error) {
      this.results.push({
        collection: collection_name,
        documentsCreated: 0,
        status: 'error',
        message: `Erreur lors de la création des investisseurs: ${error.message}`
      });
    }
  }

  private async seedAnalytics() {
    const collection_name = 'analytics';
    
    try {
      const sampleAnalytics = [
        {
          type: 'page_view',
          page: 'home',
          title: 'Williams Jullin - Expert Mondial Expatriation',
          url: 'https://williamsjullin.com/',
          timestamp: serverTimestamp(),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          language: 'fr',
          country: 'France',
          sessionId: 'session_test_1',
          viewport: { width: 1920, height: 1080 }
        },
        {
          type: 'page_view',
          page: 'investors',
          title: 'Investisseurs - Williams Jullin',
          url: 'https://williamsjullin.com/investors',
          timestamp: serverTimestamp(),
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          language: 'en',
          country: 'United States',
          sessionId: 'session_test_2',
          viewport: { width: 1440, height: 900 }
        },
        {
          type: 'custom_event',
          eventName: 'contact_form_submitted',
          parameters: { purpose: 'general', country: 'France' },
          timestamp: serverTimestamp(),
          sessionId: 'session_test_1',
          page: 'contact',
          language: 'fr',
          country: 'France'
        },
        {
          type: 'time_on_page',
          page: 'home',
          duration: 45000,
          timestamp: serverTimestamp(),
          sessionId: 'session_test_1',
          language: 'fr',
          country: 'France'
        }
      ];

      const documentIds: string[] = [];
      
      for (const analytics of sampleAnalytics) {
        const docRef = await addDoc(collection(db, collection_name), analytics);
        documentIds.push(docRef.id);
      }

      this.results.push({
        collection: collection_name,
        documentsCreated: sampleAnalytics.length,
        status: 'success',
        message: `${sampleAnalytics.length} événements analytics créés avec succès`,
        documentIds
      });

    } catch (error) {
      this.results.push({
        collection: collection_name,
        documentsCreated: 0,
        status: 'error',
        message: `Erreur lors de la création des analytics: ${error.message}`
      });
    }
  }
}

export const seedFirestoreData = async (): Promise<SeedDataResult[]> => {
  const seeder = new FirestoreDataSeeder();
  return await seeder.seedAllCollections();
};