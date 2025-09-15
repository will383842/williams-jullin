// src/router/paths.ts
export const BASE_URL = 'https://williamsjullin.com';

export const LOCALES = ['fr','en','de','es','pt','ru','zh'] as const;
export type Locale = typeof LOCALES[number];

type RouteMap = {
  home: string;
  story: string;
  blog: string;
  contact: string;
  media: string;
  investors: string;
  post: (slug: string) => string;
};

export const PATHS: Record<Locale, RouteMap> = {
  fr: {
    home: '/',
    story: '/mon-histoire',
    blog: '/blog',
    contact: '/contact',
    media: '/media',
    investors: '/investors',
    post: (slug) => `/blog/${slug}`
  },
  en: {
    home: '/en',
    story: '/en/my-story',
    blog: '/en/blog',
    contact: '/en/contact',
    media: '/en/media',
    investors: '/en/investors',
    post: (slug) => `/en/blog/${slug}`
  },
  de: {
    home: '/de',
    story: '/de/meine-geschichte',
    blog: '/de/blog',
    contact: '/de/kontakt',
    media: '/de/medien',
    investors: '/de/investoren',
    post: (slug) => `/de/blog/${slug}`
  },
  es: {
    home: '/es',
    story: '/es/mi-historia',
    blog: '/es/blog',
    contact: '/es/contacto',
    media: '/es/medios',
    investors: '/es/inversores',
    post: (slug) => `/es/blog/${slug}`
  },
  pt: {
    home: '/pt',
    story: '/pt/minha-historia',
    blog: '/pt/blog',
    contact: '/pt/contato',
    media: '/pt/midia',
    investors: '/pt/investidores',
    post: (slug) => `/pt/blog/${slug}`
  },
  ru: {
    home: '/ru',
    story: '/ru/moja-istoria',
    blog: '/ru/blog',
    contact: '/ru/kontakt',
    media: '/ru/media',
    investors: '/ru/investory',
    post: (slug) => `/ru/blog/${slug}`
  },
  zh: {
    home: '/zh',
    story: '/zh/我的故事',
    blog: '/zh/博客',
    contact: '/zh/联系',
    media: '/zh/媒体',
    investors: '/zh/投资者',
    post: (slug) => `/zh/博客/${slug}`
  }
};
