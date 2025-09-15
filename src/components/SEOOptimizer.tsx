import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { seoPageData, generatePageStructuredData, injectStructuredData, generateOptimizedKeywords } from '../utils/seoOptimization';

interface SEOOptimizerProps {
  page: string;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string[];
}

const SEOOptimizer: React.FC<SEOOptimizerProps> = ({
  page,
  customTitle,
  customDescription,
  customKeywords = []
}) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const pageData = seoPageData[page];
    if (!pageData) return;

    // Titre optimisé
    const title = customTitle || pageData.title;
    document.title = title;

    // Description optimisée
    const description = customDescription || pageData.description;
    updateMetaTag('name', 'description', description);

    // Keywords optimisés
    const allKeywords = [...pageData.keywords, ...customKeywords];
    const optimizedKeywords = generateOptimizedKeywords(allKeywords);
    updateMetaTag('name', 'keywords', optimizedKeywords);

    // Langue du document
    document.documentElement.lang = i18n.language;

    // Open Graph optimisé
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', `https://williamsjullin.com/${page === 'home' ? '' : page}`);
    updateMetaTag('property', 'og:locale', getLocaleFromLanguage(i18n.language));

    // Twitter Cards optimisé
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);

    // Canonical URL
    updateCanonicalUrl(`https://williamsjullin.com/${page === 'home' ? '' : page}`);

    // Données structurées pour les IA
    const structuredData = generatePageStructuredData(page, {
      "mainEntityOfPage": {
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": `https://williamsjullin.com/${page === 'home' ? '' : page}`,
        "inLanguage": i18n.language,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Williams Jullin - Expert Mondial Expatriation",
          "url": "https://williamsjullin.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://williamsjullin.com/blog?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      }
    });

    injectStructuredData(structuredData);

    // Optimisations spécifiques par page
    if (page === 'home') {
      addHomePageOptimizations();
    } else if (page === 'blog') {
      addBlogOptimizations();
    } else if (page === 'contact') {
      addContactOptimizations();
    }

  }, [page, customTitle, customDescription, customKeywords, i18n.language]);

  const updateMetaTag = (attribute: string, name: string, content: string) => {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElemen'meta';
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const updateCanonicalUrl = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElemen'link';
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  };

  const getLocaleFromLanguage = (lang: string): string => {
    const localeMap: { [key: string]: string } = {
      'fr': 'fr_FR',
      'en': 'en_US', 
      'de': 'de_DE',
      'es': 'es_ES',
      'pt': 'pt_PT',
      'ru': 'ru_RU',
      'zh': 'zh_CN'
    };
    return localeMap[lang] || 'fr_FR';
  };

  const addHomePageOptimizations = () => {
    // Données structurées spécifiques à la page d'accueil
    const homeStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Williams Jullin - Expert Mondial Expatriation",
      "url": "https://williamsjullin.com",
      "description": "Site officiel de Williams Jullin, expert mondial en expatriation. Services pour toutes nationalités dans 197 pays.",
      "inLanguage": ["fr", "en", "de", "es", "pt", "ru", "zh"],
      "author": {
        "@type": "Person",
        "name": "Williams Jullin"
      },
      "publisher": {
        "@type": "Person",
        "name": "Williams Jullin"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://williamsjullin.com/blog?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const script = document.createElemen'script';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(homeStructuredData, null, 2);
    document.head.appendChild(script);
  };

  const addBlogOptimizations = () => {
    // Optimisations spécifiques au blog
    updateMetaTag('name', 'article:author', 'Williams Jullin');
    updateMetaTag('property', 'og:type', 'blog');
  };

  const addContactOptimizations = () => {
    // Optimisations spécifiques au contact
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('name', 'contact:email', 'contact@williamsjullin.com');
  };

  return null;
};

export default SEOOptimizer;