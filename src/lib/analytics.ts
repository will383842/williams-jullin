import { logEvent } from 'firebase/analytics';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { db, analytics } from './firebase';

// Tracker une vue de page
export const trackPageView = async (page: string, title: string) => {
  try {
    // Google Analytics
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: page
      });
    }

    // Analytics Firestore
    await addDoc(collection(db, 'analytics'), {
      type: 'page_view',
      page,
      title,
      url: window.location.href,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      language: navigator.language || 'en',
      country: 'Unknown', // Sera détecté côté serveur
      sessionId: sessionStorage.getItem('sessionId') || generateSessionId(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

  } catch (error) {
    console.error('Erreur tracking page view:', error);
  }
};

// Tracker un événement personnalisé
export const trackEvent = async (eventName: string, parameters: Record<string, any> = {}) => {
  try {
    // Google Analytics
    if (analytics) {
      logEvent(analytics, eventName, parameters);
    }

    // Analytics Firestore
    await addDoc(collection(db, 'analytics'), {
      type: 'custom_event',
      eventName,
      parameters,
      timestamp: serverTimestamp(),
      page: window.location.pathname,
      language: navigator.language || 'en',
      country: 'Unknown',
      sessionId: sessionStorage.getItem('sessionId') || generateSessionId()
    });

  } catch (error) {
    console.error('Erreur tracking event:', error);
  }
};

// Générer un ID de session unique
const generateSessionId = (): string => {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem('sessionId', sessionId);
  return sessionId;
};

// Hook pour tracker automatiquement les pages
export const usePageTracking = (page: string, title: string) => {
  useEffect(() => {
    trackPageView(page, title);
  }, [page, title]);
};

export default analytics;