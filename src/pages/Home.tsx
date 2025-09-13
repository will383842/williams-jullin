import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

  // Tracker cette page
  usePageTracking('home', 'Accueil - Williams Jullin');

  // SEO (titre + meta + JSON-LD)
  useEffect(() => {
    // Title
    document.title =
      'Williams Jullin - Expert Mondial Expatriation | Aide 500K+ Expatriés | 197 Pays | Toutes Nationalités';

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "🌍 Williams Jullin, expert #1 mondial en expatriation. Fondateur Ulixai & SOS-Expat. Aide immédiate 24/7 pour 500K+ expatriés dans 197 pays. Toutes nationalités, toutes langues, toutes cultures. Services vérifiés, conseils d'expert, communauté mondiale inclusive."
      );
    }

    // JSON-LD minimal propre
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': 'https://williamsjullin.com/#person',
          name: 'Williams Jullin',
          url: 'https://williamsjullin.com',
          image: 'https://williamsjullin.com/Williams-jullin.jpg',
          jobTitle: 'Expert Mondial Expatriation & Mobilité Internationale',
          description:
            "Expert mondial en expatriation et mobilité internationale. Fondateur d'Ulixai et SOS-Expat, aide 24/7 dans 197 pays.",
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
          name: 'Williams Jullin - Expert Mondial Expatriation Inclusive',
          url: 'https://williamsjullin.com',
          description:
            'Site officiel de Williams Jullin, expert mondial en expatriation inclusive. Services pour expatriés dans 197 pays.',
          inLanguage: ['fr', 'en'],
          isAccessibleForFree: true,
          author: { '@id': 'https://williamsjullin.com/#person' },
          publisher: { '@id': 'https://williamsjullin.com/#person' },
        },
      ],
    };

    // Remplace l’ancien script si présent
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

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

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Texte gauche */}
            <div className="lg:col-span-7 text-white">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 md:space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-100 font-semibold text-xs md:text-sm lg:text-base">
                  {t('home.hero.badge')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight">
                <span className="block">{t('home.hero.title_1')}</span>
                <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  {t('home.hero.title_2')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                {t('home.hero.subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-12">
                <a
                  href="https://sos-expat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 md:px-8 rounded-2xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 text-sm md:text-base"
                >
                  <Phone size={20} className="md:w-6 md:h-6" />
                  <span className="text-center leading-tight">{t('home.hero.cta_primary')}</span>
                  <ExternalLink size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://ulixai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 md:px-8 rounded-2xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 text-sm md:text-base"
                >
                  <MessageCircle size={20} className="md:w-6 md:h-6" />
                  <span className="text-center leading-tight">{t('home.hero.cta_secondary')}</span>
                  <ExternalLink size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-1 md:mb-2">125K+</div>
                  <div className="text-blue-200 text-xs md:text-sm font-medium leading-tight">
                    {t('home.stats.expats_helped')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-1 md:mb-2">197</div>
                  <div className="text-blue-200 text-xs md:text-sm font-medium leading-tight">
                    {t('home.stats.countries_covered')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-1 md:mb-2">24/7</div>
                  <div className="text-blue-200 text-xs md:text-sm font-medium leading-tight">
                    {t('home.stats.services')}
                  </div>
                </div>
              </div>
            </div>

            {/* Image droite — locale et stable */}
            <div className="lg:col-span-5">
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-2xl md:rounded-3xl rotate-2 md:rotate-3 blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl">
                  <img
                    src="/Williams-jullin.jpg"
                    alt="Williams Jullin - Expert en mobilité internationale"
                    className="w-full h-64 md:h-80 lg:h-[425px] object-cover object-top rounded-xl md:rounded-2xl"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CONFÉRENCE */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Gauche */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl md:rounded-3xl rotate-1 md:rotate-2 blur-sm" />
                <div className="relative bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl">
                  <img
                    src="/williams-jullin-conference.jpg"
                    alt="Williams Jullin en conférence sur l'expatriation"
                    className="w-full h-64 md:h-80 lg:h-[500px] object-cover rounded-xl md:rounded-2xl"
                  />
                  <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                    {t('home.conference.badge')}
                  </div>
                </div>
              </div>

              {/* Texte Droite */}
              <div className="relative">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4 md:mb-6">
                  {t('home.conference.title')}
                </h2>

                <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-base md:text-lg">{t('home.conference.description')}</p>

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-semibold text-sm md:text-base">{t('home.conference.point_1')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-semibold text-sm md:text-base">{t('home.conference.point_2')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-semibold text-sm md:text-base">{t('home.conference.point_3')}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2 md:mb-3 text-sm md:text-base">
                      {t('home.conference.topics_title')}
                    </h4>
                    <div className="space-y-1 md:space-y-2 text-blue-700 text-xs md:text-sm">
                      <p>• {t('home.conference.topic_1')}</p>
                      <p>• {t('home.conference.topic_2')}</p>
                      <p>• {t('home.conference.topic_3')}</p>
                      <p>• {t('home.conference.topic_4')}</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 md:p-6 border border-orange-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs md:text-sm">🌍</span>
                      </div>
                      <h4 className="font-bold text-orange-800 text-sm md:text-base">
                        {t('home.conference.impact_title')}
                      </h4>
                    </div>
                    <p className="text-orange-700 text-xs md:text-sm">{t('home.conference.impact_description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION SOLUTIONS (SOS-Expat & Ulixai) */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
            {/* Bloc SOS-Expat */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Texte */}
              <div className="relative">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4 md:mb-6">
                  {t('home.solutions.sos.title')}
                </h2>

                <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-sm md:text-base">{t('home.solutions.sos.description')}</p>

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-semibold text-sm md:text-base">{t('home.solutions.sos.feature_1')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-semibold text-sm md:text-base">{t('home.solutions.sos.feature_2')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-semibold text-sm md:text-base">{t('home.solutions.sos.feature_3')}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3 md:p-4 border border-blue-100">
                    <p
                      className="text-blue-800 font-medium text-sm md:text-base"
                      dangerouslySetInnerHTML={{ __html: t('home.solutions.sos.call_to_action') }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6">
                  <div className="bg-red-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-red-100">
                    <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-red-600 mx-auto mb-1 md:mb-2" />
                    <span className="text-red-800 font-medium text-xs md:text-sm leading-tight">
                      {t('home.solutions.sos.badge_1')}
                    </span>
                  </div>
                  <div className="bg-green-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-green-100">
                    <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-600 mx-auto mb-1 md:mb-2" />
                    <span className="text-green-800 font-medium text-xs md:text-sm leading-tight">
                      {t('home.solutions.sos.badge_2')}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-blue-100">
                    <Shield className="w-4 h-4 md:w-6 md:h-6 text-blue-600 mx-auto mb-1 md:mb-2" />
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
                    alt="SOS-Expat - Aide immédiate pour expatriés"
                    className="w-full h-64 md:h-80 lg:h-[500px] object-cover rounded-xl"
                  />
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                    {t('home.solutions.sos.badge_time')}
                  </div>
                </div>
              </div>
            </div>

            {/* Bloc Ulixai */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl -rotate-1 md:-rotate-2 blur-sm" />
                <div className="relative bg-white rounded-2xl p-3 md:p-4 shadow-2xl">
                  <img
                    src="/ulixai.com-filter-blue copy.png"
                    alt="Ulixai - Le bon prestataire partout dans le monde"
                    className="w-full h-64 md:h-80 lg:h-[500px] object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Texte */}
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900">
                  {t('home.solutions.ulixai.title')}
                </h2>

                <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-sm md:text-base">{t('home.solutions.ulixai.description')}</p>

                  <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2 md:mb-3 text-sm md:text-base">
                      {t('home.solutions.ulixai.client_title')}
                    </h4>
                    <div className="space-y-1 md:space-y-2 text-blue-700 text-xs md:text-sm">
                      <p>• {t('home.solutions.ulixai.client_step_1')}</p>
                      <p>• {t('home.solutions.ulixai.client_step_2')}</p>
                      <p>• {t('home.solutions.ulixai.client_step_3')}</p>
                      <p className="italic text-blue-600">{t('home.solutions.ulixai.examples')}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                    <h4 className="font-bold text-green-800 mb-2 md:mb-3 text-sm md:text-base">
                      {t('home.solutions.ulixai.provider_title')}
                    </h4>
                    <div className="space-y-1 md:space-y-2 text-green-700 text-xs md:text-sm">
                      <p>• {t('home.solutions.ulixai.provider_step_1')}</p>
                      <p>• {t('home.solutions.ulixai.provider_step_2')}</p>
                      <p>• {t('home.solutions.ulixai.provider_step_3')}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2 md:mb-3 text-sm md:text-base">
                      {t('home.solutions.ulixai.why_title')}
                    </h4>
                    <div className="grid grid-cols-1 gap-1 md:gap-2 text-slate-700 text-xs md:text-sm">
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
      <section className="py-12 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center space-x-2 md:space-x-3 bg-blue-100 rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="text-blue-800 font-semibold text-sm md:text-base">
                  {t('home.double_impact.badge')}
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-6xl font-black mb-4 md:mb-6">
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
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <Phone className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-red-600">{t('home.double_impact.sos.name')}</h3>
                      <p className="text-red-500 font-semibold text-sm md:text-base">{t('home.double_impact.sos.tagline')}</p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                    <div className="bg-red-50 rounded-xl p-4 md:p-6 border border-red-100">
                      <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs md:text-sm">🆘</span>
                        </div>
                        <h4 className="font-bold text-red-800 text-sm md:text-base">
                          {t('home.double_impact.sos.mission_1_title')}
                        </h4>
                      </div>
                      <p className="text-red-700 text-xs md:text-sm">{t('home.double_impact.sos.mission_1_desc')}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                      <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs md:text-sm">💰</span>
                        </div>
                        <h4 className="font-bold text-green-800 text-sm md:text-base">
                          {t('home.double_impact.sos.mission_2_title')}
                        </h4>
                      </div>
                      <p className="text-green-700 text-xs md:text-sm">{t('home.double_impact.sos.mission_2_desc')}</p>
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
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-blue-600">{t('home.double_impact.ulixai.name')}</h3>
                      <p className="text-blue-500 font-semibold text-sm md:text-base">{t('home.double_impact.ulixai.tagline')}</p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                    <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                      <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs md:text-sm">🔍</span>
                        </div>
                        <h4 className="font-bold text-blue-800 text-sm md:text-base leading-tight">
                          {t('home.double_impact.ulixai.mission_1_title')}
                        </h4>
                      </div>
                      <p className="text-blue-700 text-xs md:text-sm">{t('home.double_impact.ulixai.mission_1_desc')}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                      <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs md:text-sm">💼</span>
                        </div>
                        <h4 className="font-bold text-green-800 text-sm md:text-base leading-tight">
                          {t('home.double_impact.ulixai.mission_2_title')}
                        </h4>
                      </div>
                      <p className="text-green-700 text-xs md:text-sm">{t('home.double_impact.ulixai.mission_2_desc')}</p>
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
                <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <Globe className="w-6 h-6 md:w-8 md:h-8" />
                  <Heart className="w-6 h-6 md:w-8 md:h-8" />
                  <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{t('home.double_impact.conclusion_title')}</h3>
                <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                  {t('home.double_impact.conclusion_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  {t('home.testimonials.title')}
                </span>
              </h2>
            </div>

            {/* Services */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mb-12 md:mb-16">
              {[
                { name: t('home.services.visas'), icon: '🛂' },
                { name: t('home.services.housing'), icon: '🏠' },
                { name: t('home.services.work'), icon: '💼' },
                { name: t('home.services.health'), icon: '🏥' },
                { name: t('home.services.education'), icon: '🎓' },
                { name: t('home.services.tax'), icon: '📊' },
                { name: t('home.services.banking'), icon: '🏦' },
              ].map((service, index) => (
                <div key={index} className="text-center p-3 md:p-4 bg-slate-50 rounded-lg md:rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2">{service.icon}</div>
                  <p className="text-xs md:text-sm font-semibold text-slate-700 leading-tight">{service.name}</p>
                </div>
              ))}
            </div>

            {/* Avis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100 shadow-lg flex flex-col">
                <div className="flex items-center space-x-1 mb-3 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-base md:text-lg font-medium text-slate-800 mb-4 md:mb-6 leading-relaxed flex-grow">
                  "{t('home.testimonials.testimonial_1.quote')}"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm md:text-base">
                      {t('home.testimonials.testimonial_1.name')}
                    </div>
                    <div className="text-slate-600 text-xs md:text-sm flex items-center space-x-2">
                      <svg className="w-4 h-4" viewBox="0 0 640 480">
                        <defs><clipPath id="sg-a"><path fillOpacity=".7" d="M0 0h640v480H0z" /></clipPath></defs>
                        <g fillRule="evenodd" clipPath="url(#sg-a)">
                          <path fill="#fff" d="M-20 0h680v480H-20z" />
                          <path fill="#df0000" d="M-20 0h680v240H-20z" />
                        </g>
                        <path fill="#fff" d="M146 40.2a53.3 53.3 0 0 0 0 79.6 67 67 0 0 1 0-79.6z" />
                        <g fill="#fff">
                          <path d="m133 70 4.8 14.7H153l-12.4 9 4.7 14.8L133 99.7l-12.3 8.9 4.7-14.8-12.4-9h15.2z" />
                          <path d="m93.5 50.4 3.2 9.8h10.3l-8.3 6 3.1 9.8-8.2-6-8.2 6 3.1-9.8-8.3-6H92z" />
                          <path d="m173 50.4 3.2 9.8h10.3l-8.3 6 3.1 9.8-8.2-6-8.2 6 3.1-9.8-8.3-6h10.3z" />
                          <path d="m93.5 89.6 3.2 9.8h10.3l-8.3 6 3.1 9.8-8.2-6-8.2 6 3.1-9.8-8.3-6H92z" />
                          <path d="m173 89.6 3.2 9.8h10.3l-8.3 6 3.1 9.8-8.2-6-8.2 6 3.1-9.8-8.3-6h10.3z" />
                        </g>
                      </svg>
                      <span>{t('home.testimonials.testimonial_1.location')}</span>
                      <span>•</span>
                      <span>{t('home.testimonials.testimonial_1.role')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border border-green-100 shadow-lg flex flex-col">
                <div className="flex items-center space-x-1 mb-3 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-base md:text-lg font-medium text-slate-800 mb-4 md:mb-6 leading-relaxed flex-grow">
                  "{t('home.testimonials.testimonial_2.quote')}"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    Y
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm md:text-base">
                      {t('home.testimonials.testimonial_2.name')}
                    </div>
                    <div className="text-slate-600 text-xs md:text-sm flex items-center space-x-2">
                      <svg className="w-4 h-4" viewBox="0 0 640 480">
                        <path fill="#fff" d="M0 0h640v480H0z" />
                        <path fill="#bf0a30" d="M0 0h640v37.9H0zm0 75.7h640v37.9H0zm0 75.8h640v37.8H0zm0 75.7h640v37.9H0zm0 75.8h640v37.8H0zm0 75.7h640V480H0z" />
                        <path fill="#002868" d="M0 0h364.8v258.5H0z" />
                        <g fill="#fff">
                          <g id="ca-d">
                            <g id="ca-c">
                              <g id="ca-b">
                                <path id="ca-a" d="m30.4 11 .4 1.5-.8-1.2-1.1.8L30 11l-1.1-.8-.8 1.2.4-1.5L27.4 11l1.1-.8-.4-1.5.8 1.2z" />
                                <use width="100%" height="100%" transform="translate(0 25.8)" href="#ca-a" />
                              </g>
                              <use width="100%" height="100%" transform="translate(0 51.6)" href="#ca-b" />
                            </g>
                            <use width="100%" height="100%" transform="translate(0 103.2)" href="#ca-c" />
                          </g>
                          <use width="100%" height="100%" transform="translate(61.7 0)" href="#ca-d" />
                          <use width="100%" height="100%" transform="translate(123.4 0)" href="#ca-d" />
                        </g>
                        <path fill="#ff0000" d="M318.3 258.5c-1.4-1.8-2.1-2.1-3.6-1.8l-11.5 2.3c-1.8.4-2.6-.3-3.8-3.2-1.2-2.9-2.3-3.2-4.4-1.8l-9.9 6.6c-2.1 1.4-3.2.9-5.2-2.4l-7.5-12.6c-2-3.3-3.8-3.3-6.7-.9l-13.8 11.4c-2.9 2.4-4.4 1.8-6.4-2.7l-9.6-21.5c-2-4.5-4.2-4.8-7.2-1.8l-14.4 14.4c-3 3-5.1 2.4-7.8-2.7l-12.9-24.3c-2.7-5.1-5.4-5.1-8.1-.9l-12.9 20.1c-2.7 4.2-5.1 3.6-8.4-1.8l-15.6-25.5c-3.3-5.4-6.3-5.1-9.3.9l-14.4 28.8c-3 5.7-6 5.1-9.6-1.8l-17.1-32.4c-3.6-6.9-7.2-6.6-10.5.9l-15.9 35.7c-3.3 7.5-7.2 6.9-11.1-1.8l-18.6-41.4c-3.9-8.7-8.1-8.1-11.7.9l-17.1 42.6c-3.6 9.3-8.1 8.4-12.3-2.7l-20.1-52.8c-4.2-11.1-9.3-10.2-13.2 2.7l-18.6 61.2c-3.9 12.9-9.6 11.7-14.1-3.6l-21.6-73.2c-4.5-15.3-11.1-13.8-15.3 4.5l-20.1 87.3c-4.2 18.3-12 16.5-17.1-5.4l-24.3-104.4c-5.1-21.9-13.8-19.8-18.6 6.3l-22.8 124.8c-4.8 26.1-15.3 23.4-21.3-7.2l-28.5-145.8c-6-30.6-17.4-27.3-23.1 9l-27 172.8c-5.7 36.3-19.8 32.4-25.8-10.8l-28.5-205.2c-6-43.2-21.9-38.7-28.2 12.6l-30 244.8c-6.3 51.3-24.6 46.2-31.5-14.4l-32.7-288c-6.9-60.6-27.3-54.9-34.8 15.9l-35.7 336.6c-7.5 70.5-30.6 63.9-38.4-17.1l-37.2-385.2c-7.8-80.7-33.9-72.6-42 18.9l-38.7 435c-8.1 91.2-36.9 81.9-45.3-20.7l-40.2-487.2c-8.4-102.3-39.9-91.5-48.6 22.5l-41.7 542.4c-8.7 113.7-42.9 100.8-51.9-24.3l-42.9-597.6c-9-125.1-45.9-109.8-55.2 25.8l-44.4 648c-9.3 135.9-48.9 118.8-58.5-27.9l-45.9-699.6c-9.6-146.7-51.9-127.8-61.8 29.7l-47.1 750c-9.9 157.5-54.9 136.8-65.1-31.5l-48.6-801.6c-10.2-168.3-57.9-145.8-68.4 33.3l-49.8 852.8c-10.5 179.1-60.9 154.8-71.7-35.1l-51.3-904.8c-10.8-189.9-63.9-163.8-75 36.9l-52.5 957.6c-11.1 200.7-66.9 172.8-78.3-38.7l-53.7-1011.6c-11.4-211.5-69.9-181.8-81.6 40.5l-55.2 1064.4" />
                      </svg>
                      <span>{t('home.testimonials.testimonial_2.location')}</span>
                      <span>•</span>
                      <span>{t('home.testimonials.testimonial_2.role')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* fin avis */}
          </div>
        </div>
      </section>

      {/* BLOG SECTION (pas d’images ici) */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 gap-4">
              <div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-4 text-center md:text-left">
                  <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                    {t('home.blog.title')}
                  </span>
                </h2>
                <p className="text-base md:text-xl text-slate-600 text-center md:text-left">
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

            {/* Articles du blog */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Article 1 - Guide Visas */}
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
                    <span>15 janvier 2024</span>
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

              {/* Article 2 - Banking Nomades */}
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
                    <span>10 janvier 2024</span>
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

              {/* Article 3 - Logement Berlin */}
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
                    <span>5 janvier 2024</span>
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
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 w-32 h-32 md:top-20 md:left-20 md:w-72 md:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 right-4 w-48 h-48 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">
                {t('home.cta.title')}
              </h2>
              <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed px-4">
                {t('home.cta.subtitle')}
              </p>
            </div>

            {/* Stats finales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-1 md:mb-2">125K+</div>
                <div className="text-blue-200 text-sm md:text-base">{t('home.stats.expats_helped')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-1 md:mb-2">197</div>
                <div className="text-blue-200 text-sm md:text-base">{t('home.stats.countries_covered')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 md:col-span-3 lg:col-span-1">
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-1 md:mb-2">24/7</div>
                <div className="text-blue-200 text-sm md:text-base">{t('home.stats.services')}</div>
              </div>
            </div>

            {/* CTAs finaux */}
            <div className="flex flex-col gap-3 md:gap-4 justify-center">
              <a
                href="https://sos-expat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 md:px-8 rounded-xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 text-sm md:text-base"
              >
                <Phone size={18} className="md:w-5 md:h-5" />
                <span>{t('home.hero.cta_primary')}</span>
                <ExternalLink size={14} className="md:w-4 md:h-4" />
              </a>
              <a
                href="https://ulixai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white px-6 py-4 md:px-8 rounded-xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-500/25 text-sm md:text-base"
              >
                <MessageCircle size={18} className="md:w-5 md:h-5" />
                <span>{t('home.hero.cta_secondary')}</span>
                <ExternalLink size={14} className="md:w-4 md:h-4" />
              </a>
            </div>

            <div className="mt-6 md:mt-8"></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
