// project/src/lib/analytics.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { db, app } from './firebase';

/** Enregistre une vue de page (Firestore + GA si dispo) */
export async function trackPageView(path: string): Promise<void> {
  // Firestore (optionnel)
  try {
    await addDoc(collection(db, 'pageViews'), {
      path,
      ts: serverTimestamp(),
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'ssr',
    });
  } catch {
    /* silencieux */
  }

  // Google Analytics (optionnel)
  try {
    if (typeof window === 'undefined') return;
    const { isSupported, getAnalytics, logEvent } = await import('firebase/analytics');
    const supported = await isSupported();
    if (!supported) return;

    const analytics = getAnalytics(app);
    logEvent(analytics, 'page_view', { page_path: path });
  } catch {
    /* silencieux */
  }
}

/** Hook recommandé : envoie une page_view pour le chemin fourni */
export function usePageView(path: string): void {
  useEffect(() => {
    void trackPageView(path);
  }, [path]);
}

/** Alias rétro-compatible : si aucun chemin, on prend location.pathname+search */
export function usePageTracking(path?: string): void {
  useEffect(() => {
    const p =
      path ??
      (typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '/');
    void trackPageView(p);
  }, [path]);
}

/** Événements génériques (clics, soumissions, etc.) */
export async function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): Promise<void> {
  // Firestore (optionnel)
  try {
    await addDoc(collection(db, 'events'), {
      name: eventName,
      params: params ?? null,
      ts: serverTimestamp(),
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'ssr',
    });
  } catch {
    /* silencieux */
  }

  // Google Analytics (optionnel)
  try {
    if (typeof window === 'undefined') return;
    const { isSupported, getAnalytics, logEvent } = await import('firebase/analytics');
    const supported = await isSupported();
    if (!supported) return;

    const analytics = getAnalytics(app);
    logEvent(analytics, eventName as any, params as any);
  } catch {
    /* silencieux */
  }
}
