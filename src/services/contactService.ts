import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
    errors.push('Purpose is required');
  }

  if (!data.fullName.trim()) {
    errors.push('Full name is required');
  }

  if (!data.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email format is invalid');
  }

  if (!data.message.trim()) {
    errors.push('Message is required');
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
    throw new Error('Failed to submit contact form. Please try again.');
  }
};