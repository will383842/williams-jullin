// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',                             // ✅ fallback unique
    supportedLngs: ['en','fr','de','es','pt','ru','zh'], // ✅ les 7
    nonExplicitSupportedLngs: true,                // 'pt-BR' → 'pt', 'zh-CN' → 'zh'
    load: 'languageOnly',                          // 'de-CH' → 'de'
    debug: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage','navigator','htmlTag','path','subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;
