import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface InvestorFormData {
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
  newsletter?: boolean;
}

export interface InvestorSubmission extends InvestorFormData {
  createdAt: any; // Firestore Timestamp
  status: string;
  priority: string;
}

export const validateInvestorForm = (data: InvestorFormData): string[] => {
  const errors: string[] = [];

  // Champs obligatoires
  if (!data.investorType.trim()) {
    errors.push('Le type d\'investisseur est requis');
  }

  if (!data.firstName.trim()) {
    errors.push('Le prénom est requis');
  }

  if (!data.lastName.trim()) {
    errors.push('Le nom est requis');
  }

  if (!data.email.trim()) {
    errors.push('L\'email est requis');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Le format de l\'email est invalide');
  }

  if (!data.investmentAmount.trim()) {
    errors.push('Le montant d\'investissement est requis');
  }

  if (!data.timeline.trim()) {
    errors.push('La timeline est requise');
  }

  if (!data.experience.trim()) {
    errors.push('L\'expérience d\'investissement est requise');
  }

  if (!data.platformInterest.trim()) {
    errors.push('L\'intérêt plateforme est requis');
  }

  if (!data.message.trim()) {
    errors.push('Le message est requis');
  }

  // Validation des URLs
  if (data.website && data.website.trim() && !data.website.match(/^https?:\/\/.+/)) {
    errors.push('Le format du site web est invalide (doit commencer par http:// ou https://)');
  }

  return errors;
};

export const submitInvestorForm = async (data: InvestorFormData): Promise<string> => {
  // Valider les données du formulaire
  const errors = validateInvestorForm(data);
  if (errors.length > 0) {
    throw new Error(`Erreurs de validation: ${errors.join(', ')}`);
  }

  try {
    // Ajouter le document à Firestore
    const docRef = await addDoc(collection(db, 'investors'), {
      investorType: data.investorType,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      organization: data.organization || '',
      position: data.position || '',
      website: data.website || '',
      investmentAmount: data.investmentAmount,
      timeline: data.timeline,
      experience: data.experience,
      platformInterest: data.platformInterest,
      geographicFocus: data.geographicFocus || '',
      message: data.message,
      newsletter: data.newsletter || false,
      createdAt: serverTimestamp(),
      status: 'new',
      priority: 'medium'
    });

    // Point d'extension pour notification email via Cloud Functions
    // TODO: Déclencher Cloud Function pour notification email
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire investisseur:', error);
    throw new Error('Échec de la soumission du formulaire. Veuillez réessayer.');
  }
};