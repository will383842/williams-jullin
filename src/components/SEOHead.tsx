import React from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
  alternateUrls?: { [key: string]: string };
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = '/Williams-jullin.jpg',
  url = 'https://williamsjullin.com',
  type = 'website',
  locale = 'fr_FR',
  alternateUrls = {}
}) => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    // Mettre à jour le title
    if (title) {
      document.title = title;
    }

    // Mettre à jour la meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElemen'meta';
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Mettre à jour les keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElemen'meta';
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Mettre à jour la langue du document
    document.documentElement.lang = i18n.language;

    // Mettre à jour les Open Graph
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElemen'meta';
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (title) updateMetaProperty('og:title', title);
    if (description) updateMetaProperty('og:description', description);
    if (url) updateMetaProperty('og:url', url);
    if (image) updateMetaProperty('og:image', image);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:locale', locale);

    // Twitter Cards
    const updateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElemen'meta';
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (title) updateTwitterMeta('twitter:title', title);
    if (description) updateTwitterMeta('twitter:description', description);
    if (image) updateTwitterMeta('twitter:image', image);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElemen'link';
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

  }, [title, description, keywords, image, url, type, locale, i18n.language]);

  return null;
};

export default SEOHead;