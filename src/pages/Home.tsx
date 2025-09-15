// src/pages/Home.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
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

// SEO imports (toujours)
import SEO from '../seo/SEO';
import { buildAlternates, canonical } from '../seo/helpers';
import { metaHome } from '../seo/meta';
import { websiteSchema, personSchema } from '../seo/schema';

import { PATHS, LOCALES, type Locale } from '../router/paths';


interface HomeProps {
  navigate: (page: string, id?: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {

  // === SEO locale & URLs ===
  const locale = (i18n?.language?.split('-')[0] ?? 'fr') as Locale;
  const bcp47 = locale === 'fr' ? 'fr-FR' : `${locale}-${locale.toUpperCase()}`;
  const alternates = buildAlternates(locale, 'home');
  const can = canonical(locale, 'home');
  const meta = metaHome(locale);
const { t, i18n } = useTranslation();

  // Locale (toujours)
  const locale = (i18n.language?.split('-')[0] ?? 'fr') as Locale;
  const bcp47 = locale === 'fr' ? 'fr-FR' : `${locale}-${locale.toUpperCase()}`;

  // SEO data (toujours)
  const meta = metaHome(locale);
  const alternates = buildAlternates(locale, 'home');
  const can = canonical(locale, 'home');

  // Fonction pour gérer les traductions manquantes avec fallback
  const getSafeTranslation = (key: string, fallback: string = '') => {
    try {
      const translation = t(key);
      // Si la traduction retourne la clé elle-même, c'est qu'elle n'existe pas
      return translation === key ? fallback : translation;
    } catch {
      return fallback;
    }
  };

  // Fonction pour obtenir l'emoji du drapeau basé sur la langue
  const getFlagEmoji = (location: string): string => {
    const flags: { [key: string]: string } = {
      Singapore: '🇸🇬',
      Singapour: '🇸🇬',
      Toronto: '🇨🇦',
      Canada: '🇨🇦',
      Berlin: '🇩🇪',
      Germany: '🇩🇪',
      Allemagne: '🇩🇪',
      France: '🇫🇷',
      España: '🇪🇸',
      Portugal: '🇵🇹',
      Russia: '🇷🇺',
      China: '🇨🇳',
      Thailand: '🇹🇭',
      Thaïlande: '🇹🇭',
    };

    for (const [place, flag] of Object.entries(flags)) {
      if (location.includes(place)) return flag;
    }
    return '🌍';
  };

  return (
  <>
    <SEO
  title={meta.title}
  description={meta.desc}
  canonical={can}
  locale={bcp47}
  alternates={alternates}
  ogImage="https://williamsjullin.com/Williams-jullin.jpg"
  jsonLd={[personSchema(locale), websiteSchema(bcp47)]}
/>

    <>
      {/* SEO (toujours injecté en tout début du return) */}
      <SEO
        title={meta.title}
        description={meta.desc}
        canonical={can}
        locale={bcp47}
        alternates={alternates}
        ogImage="https://williamsjullin.com/Williams-jullin.jpg"
        jsonLd={[personSchema(locale), websiteSchema(bcp47)]}
      />

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
                    {getSafeTranslation('home.hero.badge', 'Expert en Mobilité Internationale')}
                  </span>
                </div>

                {/* Un seul H1 sur la page */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight">
                  <span className="block">{getSafeTranslation('home.hero.title_1', 'Williams')}</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                    {getSafeTranslation('home.hero.title_2', 'Jullin')}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                  {getSafeTranslation(
                    'home.hero.subtitle',
                    "Fondateur d'Ulixai.com et SOS-Expat.com — je connecte instantanément 304 millions d'expatriés et 1,465 milliard voyageurs avec des prestataires vérifiés, partout dans le monde."
                  )}
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
                    <span className="text-center leading-tight">
                      {getSafeTranslation('home.hero.cta_primary', 'Aide immédiate en moins de 5 minutes (SOS-Expat)')}
                    </span>
                    <ExternalLink size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="https://ulixai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 md:px-8 rounded-2xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 text-sm md:text-base"
                  >
                    <MessageCircle size={20} className="md:w-6 md:h-6" />
                    <span className="text-center leading-tight">
                      {getSafeTranslation('home.hero.cta_secondary', 'Un besoin de services → trouver un prestataire (Ulixai)')}
                    </span>
                    <ExternalLink size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-1 md:mb-2">125K+</div>
                    <div className="text-blue-200 text-xs md:text-sm font-medium leading-tight">
                      {getSafeTranslation('home.stats.expats_helped', 'Expatriés Aidés')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-1 md:mb-2">197</div>
                    <div className="text-blue-200 text-xs md:text-sm font-medium leading-tight">
                      {getSafeTranslation('home.stats.countries_covered', 'Pays Couverts')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-1 md:mb-2">24/7</div>
                    <div className="text-blue-200 text-xs md:text-sm font-medium leading-tight">
                      {getSafeTranslation('home.stats.services', 'Services SOS-Expat & Ulixai')}
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
                      {getSafeTranslation('home.conference.badge', 'Expert Reconnu')}
                    </div>
                  </div>
                </div>

                {/* Texte Droite */}
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4 md:mb-6">
                    {getSafeTranslation(
                      'home.conference.title',
                      "Mes conférences sur l'expatriation et la vie d'expatrié"
                    )}
                  </h2>

                  <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed">
                    <p className="text-base md:text-lg">
                      {getSafeTranslation(
                        'home.conference.description',
                        "Je partage mon expertise avec des milliers d'expatriés à travers le monde"
                      )}
                    </p>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="font-semibold text-sm md:text-base">
                          {getSafeTranslation(
                            'home.conference.point_1',
                            "Je donne des conférences internationales sur l'expatriation"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="font-semibold text-sm md:text-base">
                          {getSafeTranslation('home.conference.point_2', 'Expert reconnu en mobilité internationale')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="font-semibold text-sm md:text-base">
                          {getSafeTranslation('home.conference.point_3', 'Je suis le fondateur de SOS-Expat et Ulixai')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-2 md:mb-3 text-sm md:text-base">
                        {getSafeTranslation('home.conference.topics_title', '🎤 Mes sujets de conférence')}
                      </h4>
                      <div className="space-y-1 md:space-y-2 text-blue-700 text-xs md:text-sm">
                        <p>• {getSafeTranslation('home.conference.topic_1', "Les défis de l'expatriation moderne")}</p>
                        <p>• {getSafeTranslation('home.conference.topic_2', "Comment créer des revenus en tant qu'expatrié")}</p>
                        <p>• {getSafeTranslation('home.conference.topic_3', 'L\'avenir de la mobilité internationale')}</p>
                        <p>• {getSafeTranslation('home.conference.topic_4', "Construire des réseaux d'entraide globaux")}</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4 md:p-6 border border-orange-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs md:text-sm">🌍</span>
                        </div>
                        <h4 className="font-bold text-orange-800 text-sm md:text-base">
                          {getSafeTranslation('home.conference.impact_title', 'Mon Impact Global')}
                        </h4>
                      </div>
                      <p className="text-orange-700 text-xs md:text-sm">
                        {getSafeTranslation(
                          'home.conference.impact_description',
                          "Intervenant dans des conférences d'expatriés et voyageurs du monde entier."
                        )}
                      </p>
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
                    {getSafeTranslation('home.solutions.sos.title', 'SOS-Expat : Aide immédiate pour tous')}
                  </h2>

                  <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed">
                    <p className="text-sm md:text-base">
                      {getSafeTranslation(
                        'home.solutions.sos.description',
                        "En moins de 5 minutes, on vous met en relation avec un avocat ou un expatrié aidant de confiance. Appel garanti. Pas de stress, pas de surprises — juste une solution, maintenant."
                      )}
                    </p>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="font-semibold text-sm md:text-base">
                          {getSafeTranslation('home.solutions.sos.feature_1', '100+ pros et aidants vérifiés')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="font-semibold text-sm md:text-base">
                          {getSafeTranslation('home.solutions.sos.feature_2', 'Partout dans le monde, 24/7')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="font-semibold text-sm md:text-base">
                          {getSafeTranslation("home.solutions.sos.feature_3", "Humain d'abord, efficacité ensuite")}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-3 md:p-4 border border-blue-100">
                      <p
                        className="text-blue-800 font-medium text-sm md:text-base"
                        dangerouslySetInnerHTML={{
                          __html: getSafeTranslation(
                            'home.solutions.sos.call_to_action',
                            "👉 Besoin d'aide maintenant ?<br/>👉 Envie d'aider et d'être payé ? Rejoignez le réseau."
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6">
                    <div className="bg-red-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-red-100">
                      <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-red-600 mx-auto mb-1 md:mb-2" />
                      <span className="text-red-800 font-medium text-xs md:text-sm leading-tight">
                        {getSafeTranslation('home.solutions.sos.badge_1', 'Services 24/7')}
                      </span>
                    </div>
                    <div className="bg-green-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-green-100">
                      <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-600 mx-auto mb-1 md:mb-2" />
                      <span className="text-green-800 font-medium text-xs md:text-sm leading-tight">
                        {getSafeTranslation('home.solutions.sos.badge_2', 'Revenus Garantis')}
                      </span>
                    </div>
                    <div className="bg-blue-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-blue-100">
                      <Shield className="w-4 h-4 md:w-6 md:h-6 text-blue-600 mx-auto mb-1 md:mb-2" />
                      <span className="text-blue-800 font-medium text-xs md:text-sm leading-tight">
                        {getSafeTranslation('home.solutions.sos.badge_3', 'Paiement Sécurisé')}
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
                      {getSafeTranslation('home.solutions.sos.badge_time', '< 5 min')}
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
                      src="/ulixai.com-filter-blue.png"
                      alt="Ulixai - Le bon prestataire partout dans le monde"
                      className="w-full h-64 md:h-80 lg:h-[500px] object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Texte */}
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900">
                    {getSafeTranslation(
                      'home.solutions.ulixai.title',
                      'Ulixai — Le bon prestataire, dans votre langue, où que vous soyez'
                    )}
                  </h2>

                  <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed">
                    <p className="text-sm md:text-base">
                      {getSafeTranslation(
                        'home.solutions.ulixai.description',
                        "Prestataires expatriés aidants ou pros vérifiés, réponses rapides, devis rapides, suivi simple. Pour expatriés, futurs expatriés, voyageurs, vacanciers — toutes nationalités, partout."
                      )}
                    </p>

                    <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-2 md:mb-3 text-sm md:text-base">
                        {getSafeTranslation('home.solutions.ulixai.client_title', 'Côté client — comment ça marche')}
                      </h4>
                      <div className="space-y-1 md:space-y-2 text-blue-700 text-xs md:text-sm">
                        <p>
                          •{' '}
                          {getSafeTranslation(
                            'home.solutions.ulixai.client_step_1',
                            'Décrivez votre besoin (pays, langue, service, délai).'
                          )}
                        </p>
                        <p>
                          •{' '}
                          {getSafeTranslation(
                            'home.solutions.ulixai.client_step_2',
                            'Recevez plusieurs propositions et devis de prestataires vérifiés qui parlent votre langue.'
                          )}
                        </p>
                        <p>
                          •{' '}
                          {getSafeTranslation(
                            'home.solutions.ulixai.client_step_3',
                            'Choisissez en présentiel ou en ligne. Paiement, historique et avis en un seul endroit.'
                          )}
                        </p>
                        <p className="italic text-blue-600">
                          {getSafeTranslation(
                            'home.solutions.ulixai.examples',
                            'Exemples : visa, traductions, logement, éducation, santé, démarches, dépannage, déménagement, travail…'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                      <h4 className="font-bold text-green-800 mb-2 md:mb-3 text-sm md:text-base">
                        {getSafeTranslation('home.solutions.ulixai.provider_title', 'Côté prestataire')}
                      </h4>
                      <div className="space-y-1 md:space-y-2 text-green-700 text-xs md:text-sm">
                        <p>
                          •{' '}
                          {getSafeTranslation(
                            'home.solutions.ulixai.provider_step_1',
                            'Inscription 2 minutes (expatrié ou pro).'
                          )}
                        </p>
                        <p>
                          •{' '}
                          {getSafeTranslation(
                            'home.solutions.ulixai.provider_step_2',
                            'Recevez des demandes selon vos langues/pays.'
                          )}
                        </p>
                        <p>
                          •{' '}
                          {getSafeTranslation(
                            'home.solutions.ulixai.provider_step_3',
                            'Devis → réalisation → paiement, construisez votre réputation.'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-2 md:mb-3 text-sm md:text-base">
                        {getSafeTranslation('home.solutions.ulixai.why_title', 'Pourquoi Ulixai')}
                      </h4>
                      <div className="grid grid-cols-1 gap-1 md:gap-2 text-slate-700 text-xs md:text-sm">
                        <p>
                          • <strong>{getSafeTranslation('home.solutions.ulixai.why_verified_label', 'Vérifié')}:</strong>{' '}
                          {getSafeTranslation('home.solutions.ulixai.why_verified', 'expatriés ou pros vérifiés & évalués')}
                        </p>
                        <p>
                          •{' '}
                          <strong>
                            {getSafeTranslation('home.solutions.ulixai.why_multilingual_label', 'Multilingue')}
                          </strong>
                          : {getSafeTranslation('home.solutions.ulixai.why_multilingual', 'dans votre langue')}
                        </p>
                        <p>
                          • <strong>{getSafeTranslation('home.solutions.ulixai.why_global_label', 'Global')}:</strong>{' '}
                          {getSafeTranslation('home.solutions.ulixai.why_global', 'partout dans le monde')}
                        </p>
                        <p>
                          • <strong>{getSafeTranslation('home.solutions.ulixai.why_fast_label', 'Rapide')}:</strong>{' '}
                          {getSafeTranslation('home.solutions.ulixai.why_fast', 'devis en minutes, suivi centralisé')}
                        </p>
                        <p>
                          • <strong>{getSafeTranslation('home.solutions.ulixai.why_fair_label', 'Équitable')}:</strong>{' '}
                          {getSafeTranslation('home.solutions.ulixai.why_fair', 'revenus pour expatriés & pros')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{' '}
              {/* fin bloc Ulixai */}
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
                    {getSafeTranslation('home.double_impact.badge', 'Double Impact')}
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl lg:text-6xl font-black mb-4 md:mb-6">
                  <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                    {getSafeTranslation('home.double_impact.title', '2 plateformes, 4 missions')}
                  </span>
                </h2>

                <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
                  {getSafeTranslation(
                    'home.double_impact.subtitle',
                    'Aider les expatriés ET créer des revenus pour tous, partout dans le monde'
                  )}
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
                        <h3 className="text-xl md:text-2xl font-black text-red-600">
                          {getSafeTranslation('home.double_impact.sos.name', 'SOS-Expat.com')}
                        </h3>
                        <p className="text-red-500 font-semibold text-sm md:text-base">
                          {getSafeTranslation('home.double_impact.sos.tagline', 'Aide immédiate')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                      <div className="bg-red-50 rounded-xl p-4 md:p-6 border border-red-100">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs md:text-sm">🆘</span>
                          </div>
                          <h4 className="font-bold text-red-800 text-sm md:text-base">
                            {getSafeTranslation('home.double_impact.sos.mission_1_title', 'Mission 1 : Aide immédiate')}
                          </h4>
                        </div>
                        <p className="text-red-700 text-xs md:text-sm">
                          {getSafeTranslation(
                            'home.double_impact.sos.mission_1_desc',
                            'Expatriés, voyageurs, vacanciers en difficulté partout dans le monde'
                          )}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs md:text-sm">💰</span>
                          </div>
                          <h4 className="font-bold text-green-800 text-sm md:text-base">
                            {getSafeTranslation('home.double_impact.sos.mission_2_title', 'Mission 2 : Revenus garantis')}
                          </h4>
                        </div>
                        <p className="text-green-700 text-xs md:text-sm">
                          {getSafeTranslation(
                            'home.double_impact.sos.mission_2_desc',
                            'Avocats & expatriés aidants gagnent avec des appels prépayés'
                          )}
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://sos-expat.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all durée-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                    >
                      <span>{getSafeTranslation('home.double_impact.sos.cta', 'Commencer avec SOS-Expat')}</span>
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
                        <h3 className="text-xl md:text-2xl font-black text-blue-600">
                          {getSafeTranslation('home.double_impact.ulixai.name', 'Ulixai.com')}
                        </h3>
                        <p className="text-blue-500 font-semibold text-sm md:text-base">
                          {getSafeTranslation('home.double_impact.ulixai.tagline', 'Services & Devis')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                      <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs md:text-sm">🔍</span>
                          </div>
                          <h4 className="font-bold text-blue-800 text-sm md:text-base leading-tight">
                            {getSafeTranslation(
                              'home.double_impact.ulixai.mission_1_title',
                              'Mission 1 : Services illimités & choix entre plusieurs offres et prestataires'
                            )}
                          </h4>
                        </div>
                        <p className="text-blue-700 text-xs md:text-sm">
                          {getSafeTranslation(
                            'home.double_impact.ulixai.mission_1_desc',
                            'Trouvez le bon prestataire partout dans le monde'
                          )}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-100">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs md:text-sm">💼</span>
                          </div>
                          <h4 className="font-bold text-green-800 text-sm md:text-base leading-tight">
                            {getSafeTranslation('home.double_impact.ulixai.mission_2_title', 'Mission 2 : Revenus mondiaux')}
                          </h4>
                        </div>
                        <p className="text-green-700 text-xs md:text-sm">
                          {getSafeTranslation(
                            'home.double_impact.ulixai.mission_2_desc',
                            "Prestataires expatriés ou professionnels gagnent des revenus où qu'ils soient dans le monde"
                          )}
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://ulixai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                    >
                      <span>{getSafeTranslation('home.double_impact.ulixai.cta', 'Poster une demande sur Ulixai')}</span>
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
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                    {getSafeTranslation('home.double_impact.conclusion_title', 'Double Impact Mondial')}
                  </h3>
                  <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                    {getSafeTranslation(
                      'home.double_impact.conclusion_desc',
                      "Nous aidons les expatriés avec leurs défis ET nous créons des opportunités de revenus pour les aidants et prestataires, partout dans le monde."
                    )}
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
                    {getSafeTranslation('home.testimonials.title', 'Ils nous font confiance')}
                  </span>
                </h2>
              </div>

              {/* Services */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mb-12 md:mb-16">
                {[
                  { name: getSafeTranslation('home.services.visas', 'Visas'), icon: '🛂' },
                  { name: getSafeTranslation('home.services.housing', 'Logement'), icon: '🏠' },
                  { name: getSafeTranslation('home.services.work', 'Travail'), icon: '💼' },
                  { name: getSafeTranslation('home.services.health', 'Santé'), icon: '🏥' },
                  { name: getSafeTranslation('home.services.education', 'Éducation'), icon: '🎓' },
                  { name: getSafeTranslation('home.services.tax', 'Fiscalité'), icon: '📊' },
                  { name: getSafeTranslation('home.services.banking', 'Banque'), icon: '🏦' },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="text-center p-3 md:p-4 bg-slate-50 rounded-lg md:rounded-xl hover:bg-blue-50 transition-colors duration-300"
                  >
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2">{service.icon}</div>
                    <p className="text-xs md:text-sm font-semibold text-slate-700 leading-tight">{service.name}</p>
                  </div>
                ))}
              </div>

              {/* Avis (nouvelle implémentation i18n + mobile safe) */}
              {(() => {
                type Testimonial = { quote: string; name: string; location: string; role: string };
                const items = (t('home.testimonials.items', { returnObjects: true }) as Testimonial[] | string) as unknown;

                const resolved: Testimonial[] = Array.isArray(items)
                  ? items
                  : [
                      {
                        quote:
                          "Grâce à SOS-Expat, j'ai pu résoudre mon problème de visa ET commencer à générer des revenus en aidant d'autres expatriés.",
                        name: 'Léa M.',
                        location: 'Singapour',
                        role: 'Avocate',
                      },
                      {
                        quote:
                          "Ulixai m'a permis de trouver l'appartement parfait à Berlin ET de développer mon activité de conseil immobilier.",
                        name: 'Yassine K.',
                        location: 'Toronto',
                        role: 'Consultant',
                      },
                    ];

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    {resolved.slice(0, 2).map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl p-6 md:p-8 border shadow-lg flex flex-col h-full ${
                          idx === 0
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
                            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                        }`}
                      >
                        <div className="flex items-center space-x-1 mb-3 md:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-base md:text-lg font-medium text-slate-800 mb-4 md:mb-6 leading-relaxed">
                          “{item.quote}”
                        </blockquote>
                        <div className="mt-auto flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 md:w-12 md:h-12 ${
                              idx === 0
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                : 'bg-gradient-to-br from-green-500 to-green-600'
                            } rounded-full flex items-center justify-center text-white font-bold`}
                          >
                            {item.name?.[0] ?? '•'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm md:text-base">{item.name}</div>
                            <div className="text-slate-600 text-xs md:text-sm flex items-center space-x-2">
                              <span className="text-lg">{getFlagEmoji(item.location)}</span>
                              <span>{item.location}</span>
                              <span>•</span>
                              <span>{item.role}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* BLOG SECTION */}
        <section className="py-12 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 gap-4">
                <div>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-4 text-center md:text-left">
                    <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                      {getSafeTranslation('home.blog.title', 'Derniers articles')}
                    </span>
                  </h2>
                  <p className="text-base md:text-xl text-slate-600 text-center md:text-left">
                    {getSafeTranslation('home.blog.subtitle', "Conseils d'expert pour votre expatriation")}
                  </p>
                </div>
                <button
                  onClick={() => navigate('blog')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold flex items-center space-x-2 md:space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                >
                  <span>{getSafeTranslation('home.blog.see_all', 'Tous les articles')}</span>
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
                      alt={getSafeTranslation('blog.posts.visa_guide.title', 'Guide Complet des Visas Européens')}
                      className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium text-gray-700">
                      {getSafeTranslation('blog.language_label', i18n.language.toUpperCase())}
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm mb-2 md:mb-3">
                      <Calendar size={14} className="md:w-4 md:h-4" />
                      <span>15 janvier 2024</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                      {getSafeTranslation(
                        'blog.posts.visa_guide.title',
                        'Guide Complet des Visas Européens : Tout Ce Que Vous Devez Savoir'
                      )}
                    </h3>

                    <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                      {getSafeTranslation(
                        'blog.posts.visa_guide.excerpt',
                        "Naviguez dans le monde complexe des visas européens avec ce guide complet couvrant les exigences, processus et conseils d'experts pour réussir."
                      )}
                    </p>

                    <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                        {getSafeTranslation('blog.topics.visas', 'Visas')}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                        {getSafeTranslation('blog.topics.tips', 'Conseils')}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate('blog', 'guide-complet-visas-europeens')}
                      className="touch-link flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors duration-200 text-sm md:text-base py-2"
                    >
                      <span>{getSafeTranslation('blog.read_more', 'Lire Plus')}</span>
                      <ArrowRight size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </article>

                {/* Article 2 - Banking Nomades */}
                <article className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt={getSafeTranslation('blog.posts.banking_nomad.title', 'Banque Numérique pour Nomades')}
                      className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium text-gray-700">
                      {getSafeTranslation('blog.language_label', i18n.language.toUpperCase())}
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm mb-2 md:mb-3">
                      <Calendar size={14} className="md:w-4 md:h-4" />
                      <span>10 janvier 2024</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                      {getSafeTranslation(
                        'blog.posts.banking_nomad.title',
                        'Banque Numérique pour Nomades : Meilleures Solutions Bancaires Internationales'
                      )}
                    </h3>

                    <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                      {getSafeTranslation(
                        'blog.posts.banking_nomad.excerpt',
                        'Découvrez les meilleures solutions bancaires pour nomades numériques et expatriés, incluant comptes multi-devises et options de transfert international.'
                      )}
                    </p>

                    <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                        {getSafeTranslation('blog.topics.banking', 'Banque')}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                        {getSafeTranslation('blog.topics.tips', 'Conseils')}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate('blog', 'banking-digital-nomades-solutions')}
                      className="touch-link flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors durée-200 text-sm md:text-base py-2"
                    >
                      <span>{getSafeTranslation('blog.read_more', 'Lire Plus')}</span>
                      <ArrowRight size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </article>

                {/* Article 3 - Logement Berlin */}
                <article className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt={getSafeTranslation('blog.posts.housing_berlin.title', 'Trouver un Logement à Berlin')}
                      className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform durée-300"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium text-gray-700">
                      {getSafeTranslation('blog.language_label', i18n.language.toUpperCase())}
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm mb-2 md:mb-3">
                      <Calendar size={14} className="md:w-4 md:h-4" />
                      <span>5 janvier 2024</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                      {getSafeTranslation(
                        'blog.posts.housing_berlin.title',
                        "Trouver un Logement à Berlin : Guide Complet de l'Expatrié"
                      )}
                    </h3>

                    <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                      {getSafeTranslation(
                        'blog.posts.housing_berlin.excerpt',
                        "Maîtrisez le marché immobilier berlinois avec des conseils d'initiés sur les quartiers, processus de location et éviter les pièges courants."
                      )}
                    </p>

                    <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                        {getSafeTranslation('blog.topics.housing', 'Logement')}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                        {getSafeTranslation('blog.topics.culture', 'Culture')}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate('blog', 'trouver-logement-berlin-guide-expat')}
                      className="touch-link flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors durée-200 text-sm md:text-base py-2"
                    >
                      <span>{getSafeTranslation('blog.read_more', 'Lire Plus')}</span>
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
                  {getSafeTranslation('home.cta.title', 'Prêt à transformer votre parcours international ?')}
                </h2>
                <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed px-4">
                  {getSafeTranslation(
                    'home.cta.subtitle',
                    "Rejoignez des milliers d'expatriés qui ont transformé leur expérience internationale avec des conseils d'experts et des solutions innovantes."
                  )}
                </p>
              </div>

              {/* Stats finales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl font-black text-blue-400 mb-1 md:mb-2">125K+</div>
                  <div className="text-blue-200 text-sm md:text-base">
                    {getSafeTranslation('home.stats.expats_helped', 'Expatriés Aidés')}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl font-black text-blue-400 mb-1 md:mb-2">197</div>
                  <div className="text-blue-200 text-sm md:text-base">
                    {getSafeTranslation('home.stats.countries_covered', 'Pays Couverts')}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 md:col-span-3 lg:col-span-1">
                  <div className="text-2xl md:text-3xl font-black text-blue-400 mb-1 md:mb-2">24/7</div>
                  <div className="text-blue-200 text-sm md:text-base">
                    {getSafeTranslation('home.stats.services', 'Services')}
                  </div>
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
                  <span>
                    {getSafeTranslation('home.hero.cta_primary', 'Aide immédiate en moins de 5 minutes (SOS-Expat)')}
                  </span>
                  <ExternalLink size={14} className="md:w-4 md:h-4" />
                </a>
                <a
                  href="https://ulixai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white px-6 py-4 md:px-8 rounded-xl font-bold flex items-center justify-center space-x-2 md:space-x-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-500/25 text-sm md:text-base"
                >
                  <MessageCircle size={18} className="md:w-5 md:h-5" />
                  <span>
                    {getSafeTranslation(
                      'home.hero.cta_secondary',
                      'Un besoin de services → trouver un prestataire (Ulixai)'
                    )}
                  </span>
                  <ExternalLink size={14} className="md:w-4 md:h-4" />
                </a>
              </div>

              <div className="mt-6 md:mt-8"></div>
            </div>
          </div>
        </section>
      </main>
    </>
  
  </>
);
};

export default Home;