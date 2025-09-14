// src/services/contactService.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import i18n from '../i18n';

export interface ContactFormData {
  purpose: string;
  fullName: string;
  email: string;
  title?: string;
  message: string;
  country?: string;
}

export interface ContactSubmission extends ContactFormData {
  createdAt: any; // Firestore Timestamp
}

export const validateContactForm = (data: ContactFormData): string[] => {
  const errors: string[] = [];

  if (!data.purpose.trim()) {
    errors.push(i18n.t('contact.validation.purpose_required'));
  }

  if (!data.fullName.trim()) {
    errors.push(i18n.t('contact.validation.name_required'));
  }

  if (!data.email.trim()) {
    errors.push(i18n.t('contact.validation.email_required'));
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push(i18n.t('contact.validation.email_invalid'));
  }

  if (!data.message.trim()) {
    errors.push(i18n.t('contact.validation.message_required'));
  }

  return errors;
};

export const submitContactForm = async (data: ContactFormData): Promise<string> => {
  // Validate form data
  const errors = validateContactForm(data);
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }

  try {
    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'contacts'), {
      purpose: data.purpose,
      fullName: data.fullName,
      email: data.email,
      title: data.title || '',
      message: data.message,
      country: data.country || '',
      createdAt: serverTimestamp()
    });

    // Extension point for email notification via Cloud Functions
    // TODO: Trigger Cloud Function for email notification
    // This could be done via a separate collection write or HTTP callable function

    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new Error(i18n.t('contact.toast.error_message'));
  }
};
