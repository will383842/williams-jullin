// src/pages/Home.tsx
import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { usePageTracking } from '../lib/analytics';
import {
  ExternalLink,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Heart,
  Calendar,
  Tag,
} from 'lucide-react';

interface HomeProps {
  navigate: (page: string, id?: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const { t } = useTranslation();

  // Tracker cette page (clé i18n)
  usePageTracking('home', t('home.analytics.title'));

  // SEO (titre + meta + JSON-LD)
  useEffect(() => {
    // Title
    document.title = t('home.seo.title');

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('home.seo.description'));
    }

    // JSON-LD (localisé)
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': 'https://williamsjullin.com/#person',
          name: 'Williams Jullin',
          url: 'https://williamsjullin.com',
          image: 'https://williamsjullin.com/Williams-jullin.jpg',
          jobTitle: t('home.structured.person.jobTitle'),
          description: t('home.structured.person.description'),
          sameAs: [
            'https://ulixai.com',
            'https://sos-expat.com',
            'https://linkedin.com/in/williamsjullin',
            'https://twitter.com/williamsjullin',
            'https://facebook.com/williamsjullin',
            'https://instagram.com/williamsjullin',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://williamsjullin.com/#website',
          name: t('home.structured.website.name'),
          url: 'https://williamsjullin.com',
          description: t('home.structured.website.description'),
          inLanguage: ['fr', 'en', 'de', 'es', 'pt', 'ru', 'zh'],
          isAccessibleForFree: true,
          author: { '@id': 'https://williamsjullin.com/#person' },
          publisher: { '@id': 'https://williamsjullin.com/#person' },
        },
      ],
    };

    // Remplace l'ancien JSON-LD si présent
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [t]);

  return (
    <main className="overflow-hidden" role="main">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 w-32 h-32 md:top-20 md:left-20 md:w-72 md:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 right-4 w-48 h-48 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Mobile */}
            <div className="lg:hidden text-white text-center">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-100 font-semibold text-sm">
                  {t('home.hero.badge')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black mb-6 leading-tight">
                <span className="block mb-2">{t('home.hero.title_1')}</span>
                <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  {t('home.hero.title_2')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-blue-100 leading-relaxed mb-8 px-2">
                {t('home.hero.subtitle')}
              </p>

              {/* Photo */}
              <div className="mb-8">
                <div className="relative max-w-sm mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-2xl rotate-2 blur-xl" />
                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 shadow-2xl">
                    <img
                      src="/Williams-jullin.jpg"
                      alt={t('home.hero.photo_alt')}
                      className="w-full h-72 object-cover object-top rounded-xl"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4 mb-10 px-4">
                <a
                  href="https://sos-expat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25"
                >
                  <Phone size={20} />
                  <span className="text-center leading-tight">{t('home.hero.cta_primary')}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://ulixai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
                >
                  <MessageCircle size={20} />
                  <span className="text-center leading-tight">{t('home.hero.cta_secondary')}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-400 mb-1">125K+</div>
                  <div className="text-blue-200 text-xs font-medium leading-tight">
                    {t('home.stats.expats_helped')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-400 mb-1">197</div>
                  <div className="text-blue-200 text-xs font-medium leading-tight">
                    {t('home.stats.countries_covered')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-400 mb-1">24/7</div>
                  <div className="text-blue-200 text-xs font-medium leading-tight">
                    {t('home.stats.services')}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
              {/* Texte gauche */}
              <div className="lg:col-span-7 text-white">
                {/* Badge */}
                <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-blue-100 font-semibold text-base lg:text-base">
                    {t('home.hero.badge')}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
                  <span className="block">{t('home.hero.title_1')}</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                    {t('home.hero.title_2')}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
                  {t('home.hero.subtitle')}
                </p>

                {/* CTAs */}
                <div className="flex flex-col gap-4 mb-12">
                  <a
                    href="https://sos-expat.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25"
                  >
                    <Phone size={20} className="md:w-6 md:h-6" />
                    <span className="text-center leading-tight">{t('home.hero.cta_primary')}</span>
                    <ExternalLink size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="https://ulixai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
                  >
                    <MessageCircle size={20} className="md:w-6 md:h-6" />
                    <span className="text-center leading-tight">{t('home.hero.cta_secondary')}</span>
                    <ExternalLink size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-black text-blue-400 mb-2">125K+</div>
                    <div className="text-blue-200 text-sm font-medium leading-tight">
                      {t('home.stats.expats_helped')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-black text-blue-400 mb-2">197</div>
                    <div className="text-blue-200 text-sm font-medium leading-tight">
                      {t('home.stats.countries_covered')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-black text-blue-400 mb-2">24/7</div>
                    <div className="text-blue-200 text-sm font-medium leading-tight">
                      {t('home.stats.services')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image droite */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-3xl rotate-3 blur-xl" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-5 shadow-2xl">
                    <img
                      src="/Williams-jullin.jpg"
                      alt={t('home.hero.photo_alt')}
                      className="w-full h-80 lg:h-[425px] object-cover object-center rounded-2xl scale-110"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CONFÉRENCE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl md:rounded-3xl rotate-1 md:rotate-2 blur-sm" />
                <div className="relative bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl">
                  <img
                    src="/williams-jullin-conference.jpg"
                    alt={t('home.conference.photo_alt')}
                    className="w-full h-64 md:h-80 lg:h-[500px] object-cover rounded-xl md:rounded-2xl"
                  />
                  <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                    {t('home.conference.badge')}
                  </div>
                </div>
              </div>

              {/* Texte */}
              <div className="relative order-1 lg:order-2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-6 text-center lg:text-left">
                  {t('home.conference.title')}
                </h2>

                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-base md:text-lg text-center lg:text-left">{t('home.conference.description')}</p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="font-semibold text-sm md:text-base">{t('home.conference.point_1')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="font-semibold text-sm md:text-base">{t('home.conference.point_2')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="font-semibold text-sm md:text-base">{t('home.conference.point_3')}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-3 text-sm md:text-base">
                      {t('home.conference.topics_title')}
                    </h4>
                    <div className="space-y-2 text-blue-700 text-xs md:text-sm">
                      <p>• {t('home.conference.topic_1')}</p>
                      <p>• {t('home.conference.topic_2')}</p>
                      <p>• {t('home.conference.topic_3')}</p>
                      <p>• {t('home.conference.topic_4')}</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 md:p-6 border border-orange-100">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs md:text-sm">🌍</span>
                      </div>
                      <h4 className="font-bold text-orange-800 text-sm md:text-base">
                        {t('home.conference.impact_title')}
                      </h4>
                    </div>
                    <p className="text-orange-700 text-xs md:text-sm pl-9 md:pl-11">
                      {t('home.conference.impact_description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS (SOS-Expat & Ulixai) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
            {/* SOS-Expat */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              {/* Texte */}
              <div className="relative">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-6 text-center lg:text-left">
                  {t('home.solutions.sos.title')}
                </h2>

                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-sm md:text-base text-center lg:text-left">{t('home.solutions.sos.description')}</p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="font-semibold text-sm md:text-base">{t('home.solutions.sos.feature_1')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="font-semibold text-sm md:text-base">{t('home.solutions.sos.feature_2')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="font-semibold text-sm md:text-base">{t('home.solutions.sos.feature_3')}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 md:p-4 border border-blue-100">
                    <p
                      className="text-blue-800 font-medium text-sm md:text-base"
                      dangerouslySetInnerHTML={{ __html: t('home.solutions.sos.call_to_action') }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
                  <div className="bg-red-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-red-100">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 mx-auto mb-2" />
                    <span className="text-red-800 font-medium text-xs md:text-sm leading-tight">
                      {t('home.solutions.sos.badge_1')}
                    </span>
                  </div>
                  <div className="bg-green-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-green-100">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-green-800 font-medium text-xs md:text-sm leading-tight">
                      {t('home.solutions.sos.badge_2')}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-blue-100">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-blue-800 font-medium text-xs md:text-sm leading-tight">
                      {t('home.solutions.sos.badge_3')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative order-first lg:order-last">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl rotate-1 md:rotate-2 blur-sm" />
                <div className="relative bg-white rounded-2xl p-3 md:p-4 shadow-2xl">
                  <img
                    src="/sos-expat.com-filter-red.png"
                    alt={t('home.sos_expat.alt')}
                    className="w-full h-64 md:h-80 lg:h-[500px] object-cover rounded-xl"
                  />
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                    {t('home.solutions.sos.badge_time')}
                  </div>
                </div>
              </div>
            </div>

            {/* Ulixai */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl -rotate-1 md:-rotate-2 blur-sm" />
                <div className="relative bg-white rounded-2xl p-3 md:p-4 shadow-2xl">
                  <img
                    src="/ulixai.com-filter-blue.png"
                    alt={t('home.ulixai.alt')}
                    className="w-full h-64 md:h-80 lg:h-[500px] object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Texte */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 text-center lg:text-left">
                  {t('home.solutions.ulixai.title')}
                </h2>

                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-sm md:text-base text-center lg:text-left">{t('home.solutions.ulixai.description')}</p>

                  <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-3 text-sm md:text-base">
                      {t('home.solutions.ulixai.client_title')}
                    </h4>
                    <div className="space-y-2 text-blue-700 text-xs md:text-sm">
                      <p>• {t('home.solutions.ulixai.client_step_1')}</p>
                      <p>• {t('home.solutions.ulixai.client_step_2')}</p>
                      <p>• {t('home.solutions.ulixai.client_step_3')}</p>
                      <p className="italic text-blue-600">{t('home.solutions.ulixai.examples')}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                    <h4 className="font-bold text-green-800 mb-3 text-sm md:text-base">
                      {t('home.solutions.ulixai.provider_title')}
                    </h4>
                    <div className="space-y-2 text-green-700 text-xs md:text-sm">
                      <p>• {t('home.solutions.ulixai.provider_step_1')}</p>
                      <p>• {t('home.solutions.ulixai.provider_step_2')}</p>
                      <p>• {t('home.solutions.ulixai.provider_step_3')}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-3 text-sm md:text-base">
                      {t('home.solutions.ulixai.why_title')}
                    </h4>
                    <div className="space-y-2 text-slate-700 text-xs md:text-sm">
                      <p>• <strong>{t('home.solutions.ulixai.why_verified_label')}:</strong> {t('home.solutions.ulixai.why_verified')}</p>
                      <p>• <strong>{t('home.solutions.ulixai.why_multilingual_label')}:</strong> {t('home.solutions.ulixai.why_multilingual')}</p>
                      <p>• <strong>{t('home.solutions.ulixai.why_global_label')}:</strong> {t('home.solutions.ulixai.why_global')}</p>
                      <p>• <strong>{t('home.solutions.ulixai.why_fast_label')}:</strong> {t('home.solutions.ulixai.why_fast')}</p>
                      <p>• <strong>{t('home.solutions.ulixai.why_fair_label')}:</strong> {t('home.solutions.ulixai.why_fair')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* fin bloc Ulixai */}
          </div>
        </div>
      </section>

      {/* DOUBLE IMPACT */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center space-x-3 bg-blue-100 rounded-full px-4 py-2 md:px-6 md:py-3 mb-6">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="text-blue-800 font-semibold text-sm md:text-base">
                  {t('home.double_impact.badge')}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  {t('home.double_impact.title')}
                </span>
              </h2>

              <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
                {t('home.double_impact.subtitle')}
              </p>
            </div>

            {/* Cartes mission */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* SOS-Expat */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-500/20 rounded-2xl md:rounded-3xl rotate-1 blur-sm group-hover:rotate-2 transition-transform duration-500" />
                <div className="relative bg-white border border-red-100 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Phone className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-red-600">{t('home.double_impact.sos.name')}</h3>
                      <p className="text-red-500 font-semibold text-sm md:text-base">{t('home.double_impact.sos.tagline')}</p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                    <div className="bg-red-50 rounded-xl p-4 md:p-6 border border-red-100">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs md:text-sm">🆘</span>
                        </div>
                        <h4 className="font-bold text-red-800 text-sm md:text-base">
                          {t('home.double_impact.sos.mission_1_title')}
                        </h4>
                      </div>
                      <p className="text-red-700 text-xs md:text-sm pl-9 md:pl-11">{t('home.double_impact.sos.mission_1_desc')}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs md:text-sm">💰</span>
                        </div>
                        <h4 className="font-bold text-green-800 text-sm md:text-base">
                          {t('home.double_impact.sos.mission_2_title')}
                        </h4>
                      </div>
                      <p className="text-green-700 text-xs md:text-sm pl-9 md:pl-11">{t('home.double_impact.sos.mission_2_desc')}</p>
                    </div>
                  </div>

                  <a
                    href="https://sos-expat.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                  >
                    <span>{t('home.double_impact.sos.cta')}</span>
                    <ExternalLink size={16} className="md:w-5 md:h-5" />
                  </a>
                </div>
              </div>

              {/* Ulixai */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-2xl md:rounded-3xl -rotate-1 blur-sm group-hover:-rotate-2 transition-transform duration-500" />
                <div className="relative bg-white border border-blue-100 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-blue-600">{t('home.double_impact.ulixai.name')}</h3>
                      <p className="text-blue-500 font-semibold text-sm md:text-base">{t('home.double_impact.ulixai.tagline')}</p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                    <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs md:text-sm">🔍</span>
                        </div>
                        <h4 className="font-bold text-blue-800 text-sm md:text-base leading-tight">
                          {t('home.double_impact.ulixai.mission_1_title')}
                        </h4>
                      </div>
                      <p className="text-blue-700 text-xs md:text-sm pl-9 md:pl-11">{t('home.double_impact.ulixai.mission_1_desc')}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs md:text-sm">💼</span>
                        </div>
                        <h4 className="font-bold text-green-800 text-sm md:text-base leading-tight">
                          {t('home.double_impact.ulixai.mission_2_title')}
                        </h4>
                      </div>
                      <p className="text-green-700 text-xs md:text-sm pl-9 md:pl-11">{t('home.double_impact.ulixai.mission_2_desc')}</p>
                    </div>
                  </div>

                  <a
                    href="https://ulixai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                  >
                    <span>{t('home.double_impact.ulixai.cta')}</span>
                    <ExternalLink size={16} className="md:w-5 md:h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Message de conclusion */}
            <div className="mt-12 md:mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Globe className="w-6 h-6 md:w-8 md:h-8" />
                  <Heart className="w-6 h-6 md:w-8 md:h-8" />
                  <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">{t('home.double_impact.conclusion_title')}</h3>
                <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                  {t('home.double_impact.conclusion_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center space-x-3 bg-blue-100 rounded-full px-4 py-2 md:px-6 md:py-3 mb-6">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="text-blue-800 font-semibold text-sm md:text-base">
                  {t('home.hero.badge_verified')}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  {t('home.hero.headline')}
                </span>
              </h2>

              <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                {t('home.hero.subtitle')}
                <strong className="text-blue-600"> <Trans i18nKey="home.hero.tagline" /></strong>
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
              {[
                { name: t('home.services.visas_permits'), icon: '🛂' },
                { name: t('home.services.housing'), icon: '🏠' },
                { name: t('home.services.jobs'), icon: '💼' },
                { name: t('home.services.health'), icon: '🏥' },
                { name: t('home.services.education'), icon: '🎓' },
                { name: t('home.services.taxes'), icon: '📊' },
                { name: t('home.services.banking'), icon: '🏦' },
                { name: t('home.services.moving'), icon: '📦' },
                { name: t('home.services.transport'), icon: '🚗' },
                { name: t('home.services.renovation'), icon: '🔨' },
              ].map((service, index) => (
                <div
                  key={index}
                  className="group text-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {service.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Plus */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full px-6 py-3 text-white shadow-lg">
                <span className="text-2xl">∞</span>
                <span className="font-semibold text-sm md:text-base">
                  <Trans i18nKey="home.services.more_html" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  {t('home.trust.title')}
                </span>
              </h2>
              <p className="text-base md:text-xl text-slate-600">
                {t('home.trust.subtitle')}
              </p>
            </div>

            {/* Desktop */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-base font-medium text-slate-800 mb-4 leading-relaxed">
                  {t('home.testimonials.item_1.quote')}
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t('home.testimonials.item_1.name')}</div>
                    <div className="text-slate-600 text-xs">{t('home.testimonials.item_1.meta')}</div>
                  </div>
                </div>
              </div>

              {/* 2 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-base font-medium text-slate-800 mb-4 leading-relaxed">
                  {t('home.testimonials.item_2.quote')}
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    Y
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t('home.testimonials.item_2.name')}</div>
                    <div className="text-slate-600 text-xs">{t('home.testimonials.item_2.meta')}</div>
                  </div>
                </div>
              </div>

              {/* 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-base font-medium text-slate-800 mb-4 leading-relaxed">
                  {t('home.testimonials.item_3.quote')}
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t('home.testimonials.item_3.name')}</div>
                    <div className="text-slate-600 text-xs">{t('home.testimonials.item_3.meta')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile (carrousel auto) */}
            <div className="md:hidden relative">
              <style jsx>{`
                @keyframes slide-left {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .testimonials-scroll { animation: slide-left 20s linear infinite; }
                .testimonials-scroll:hover { animation-play-state: paused; }
              `}</style>

              <div className="overflow-hidden">
                <div className="testimonials-scroll flex space-x-4 w-[200%]">
                  {/* Première série */}
                  <div className="flex space-x-4 w-1/2">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-lg min-w-[280px]">
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-sm font-medium text-slate-800 mb-3 leading-relaxed">
                        {t('home.testimonials.item_1.quote')}
                      </blockquote>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          L
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{t('home.testimonials.item_1.name')}</div>
                          <div className="text-slate-600 text-xs">{t('home.testimonials.item_1.meta')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 shadow-lg min-w-[280px]">
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-sm font-medium text-slate-800 mb-3 leading-relaxed">
                        {t('home.testimonials.item_2.quote')}
                      </blockquote>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          Y
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{t('home.testimonials.item_2.name')}</div>
                          <div className="text-slate-600 text-xs">{t('home.testimonials.item_2.meta')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 shadow-lg min-w-[280px]">
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-sm font-medium text-slate-800 mb-3 leading-relaxed">
                        {t('home.testimonials.item_3.quote')}
                      </blockquote>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          M
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{t('home.testimonials.item_3.name')}</div>
                          <div className="text-slate-600 text-xs">{t('home.testimonials.item_3.meta')}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deuxième série */}
                  <div className="flex space-x-4 w-1/2">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-lg min-w-[280px]">
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-sm font-medium text-slate-800 mb-3 leading-relaxed">
                        {t('home.testimonials.item_1.quote')}
                      </blockquote>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          L
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{t('home.testimonials.item_1.name')}</div>
                          <div className="text-slate-600 text-xs">{t('home.testimonials.item_1.meta')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 shadow-lg min-w-[280px]">
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-sm font-medium text-slate-800 mb-3 leading-relaxed">
                        {t('home.testimonials.item_2.quote')}
                      </blockquote>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          Y
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{t('home.testimonials.item_2.name')}</div>
                          <div className="text-slate-600 text-xs">{t('home.testimonials.item_2.meta')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 shadow-lg min-w-[280px]">
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-sm font-medium text-slate-800 mb-3 leading-relaxed">
                        {t('home.testimonials.item_3.quote')}
                      </blockquote>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          M
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{t('home.testimonials.item_3.name')}</div>
                          <div className="text-slate-600 text-xs">{t('home.testimonials.item_3.meta')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                  <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                    {t('home.blog.title')}
                  </span>
                </h2>
                <p className="text-base md:text-xl text-slate-600">
                  {t('home.blog.subtitle')}
                </p>
              </div>
              <button
                onClick={() => navigate('blog')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold flex items-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
              >
                <span>{t('home.blog.see_all')}</span>
                <ArrowRight size={16} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Article 1 */}
              <article className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt={t('blog.posts.visa_guide.title')}
                    className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium text-gray-700">
                    {t('blog.language_label')}
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm mb-2 md:mb-3">
                    <Calendar size={14} className="md:w-4 md:h-4" />
                    <span>{t('blog.posts.visa_guide.date')}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                    {t('blog.posts.visa_guide.title')}
                  </h3>

                  <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                    {t('blog.posts.visa_guide.excerpt')}
                  </p>

                  <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                      {t('blog.topics.visas')}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                      {t('blog.topics.tips')}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('blog', 'guide-complet-visas-europeens')}
                    className="touch-link flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors duration-200 text-sm md:text-base py-2"
                  >
                    <span>{t('blog.read_more')}</span>
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </article>

              {/* Article 2 */}
              <article className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt={t('blog.posts.banking_nomad.title')}
                    className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium text-gray-700">
                    {t('blog.language_label')}
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm mb-2 md:mb-3">
                    <Calendar size={14} className="md:w-4 md:h-4" />
                    <span>{t('blog.posts.banking_nomad.date')}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                    {t('blog.posts.banking_nomad.title')}
                  </h3>

                  <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                    {t('blog.posts.banking_nomad.excerpt')}
                  </p>

                  <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                      {t('blog.topics.banking')}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                      {t('blog.topics.tips')}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('blog', 'banking-digital-nomades-solutions')}
                    className="touch-link flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors duration-200 text-sm md:text-base py-2"
                  >
                    <span>{t('blog.read_more')}</span>
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </article>

              {/* Article 3 */}
              <article className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt={t('blog.posts.housing_berlin.title')}
                    className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium text-gray-700">
                    {t('blog.language_label')}
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm mb-2 md:mb-3">
                    <Calendar size={14} className="md:w-4 md:h-4" />
                    <span>{t('blog.posts.housing_berlin.date')}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                    {t('blog.posts.housing_berlin.title')}
                  </h3>

                  <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                    {t('blog.posts.housing_berlin.excerpt')}
                  </p>

                  <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                      {t('blog.topics.housing')}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                      {t('blog.topics.culture')}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('blog', 'trouver-logement-berlin-guide-expat')}
                    className="touch-link flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors duration-200 text-sm md:text-base py-2"
                  >
                    <span>{t('blog.read_more')}</span>
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 w-32 h-32 md:top-20 md:left-20 md:w-72 md:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 right-4 w-48 h-48 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
                {t('home.cta.title')}
              </h2>
              <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed px-4">
                {t('home.cta.subtitle')}
              </p>
            </div>

            {/* Stats finales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-2">125K+</div>
                <div className="text-blue-200 text-sm md:text-base">{t('home.stats.expats_helped')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-2">197</div>
                <div className="text-blue-200 text-sm md:text-base">{t('home.stats.countries_covered')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-2">24/7</div>
                <div className="text-blue-200 text-sm md:text-base">{t('home.stats.services')}</div>
              </div>
            </div>

            {/* CTAs finaux */}
            <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
              <a
                href="https://sos-expat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 md:px-8 rounded-xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 text-sm md:text-base"
              >
                <Phone size={18} className="md:w-5 md:h-5" />
                <span>{t('home.hero.cta_primary')}</span>
                <ExternalLink size={14} className="md:w-4 md:h-4" />
              </a>
              <a
                href="https://ulixai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white px-6 py-4 md:px-8 rounded-xl font-bold flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-500/25 text-sm md:text-base"
              >
                <MessageCircle size={18} className="md:w-5 md:h-5" />
                <span>{t('home.hero.cta_secondary')}</span>
                <ExternalLink size={14} className="md:w-4 md:h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
