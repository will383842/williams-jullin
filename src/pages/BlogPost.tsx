// src/pages/BlogPost.tsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

import SEO from '../seo/SEO';
import { buildAlternates, canonical } from '../seo/helpers';
import { PATHS, type Locale } from '../router/paths';
import { articleSchema } from '../seo/schema';

type TagKey =
  | 'visas'
  | 'banking'
  | 'housing'
  | 'healthcare'
  | 'culture'
  | 'tips'
  | 'moving';

export default function BlogPost() {
  const { slug: postId = '' } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

  // === SEO locale & URLs ===
  const locale = (i18n?.language?.split('-')[0] ?? 'fr') as Locale;
  const bcp47 = locale === 'fr' ? 'fr-FR' : `${locale}-${locale.toUpperCase()}`;
  const alternates = buildAlternates(locale, 'post', postId);
  const can = canonical(locale, 'post', postId);

  // Blog posts data with full content (préservé)
  const blogPosts: Record<
    string,
    {
      id: string;
      title: string;
      content: string; // HTML localisé via t()
      date: string; // ISO
      tags: TagKey[];
      language: string;
      image: string;
      readTime: string;
    }
  > = {
    'guide-complet-visas-europeens': {
      id: 'guide-complet-visas-europeens',
      title: t('blog.posts.visa_guide.title'),
      content: `
        <p class="text-xl text-gray-600 mb-8 font-medium">
          ${t('blog.posts.visa_guide.intro')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.visa_guide.section_1_title')}</h2>
        <p>${t('blog.posts.visa_guide.section_1_intro')}</p>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li><strong>${t('blog.posts.visa_guide.tourist_visa_title')}:</strong> ${t('blog.posts.visa_guide.tourist_visa_desc')}</li>
          <li><strong>${t('blog.posts.visa_guide.work_visa_title')}:</strong> ${t('blog.posts.visa_guide.work_visa_desc')}</li>
          <li><strong>${t('blog.posts.visa_guide.student_visa_title')}:</strong> ${t('blog.posts.visa_guide.student_visa_desc')}</li>
          <li><strong>${t('blog.posts.visa_guide.business_visa_title')}:</strong> ${t('blog.posts.visa_guide.business_visa_desc')}</li>
          <li><strong>${t('blog.posts.visa_guide.residence_permit_title')}:</strong> ${t('blog.posts.visa_guide.residence_permit_desc')}</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.visa_guide.schengen_title')}</h2>
        <p class="mb-6">
          ${t('blog.posts.visa_guide.schengen_desc')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.visa_guide.documents_title')}</h2>
        <p>${t('blog.posts.visa_guide.documents_intro')}</p>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li>${t('blog.posts.visa_guide.doc_passport')}</li>
          <li>${t('blog.posts.visa_guide.doc_application')}</li>
          <li>${t('blog.posts.visa_guide.doc_photos')}</li>
          <li>${t('blog.posts.visa_guide.doc_insurance')}</li>
          <li>${t('blog.posts.visa_guide.doc_accommodation')}</li>
          <li>${t('blog.posts.visa_guide.doc_financial')}</li>
          <li>${t('blog.posts.visa_guide.doc_itinerary')}</li>
        </ul>

        <div class="bg-blue-50 p-6 rounded-lg mt-6 mb-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">${t('blog.posts.visa_guide.pro_tip_title')}</h3>
          <p class="text-blue-800">
            ${t('blog.posts.visa_guide.pro_tip_content')}
          </p>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.visa_guide.timeline_title')}</h2>
        <p class="mb-4">${t('blog.posts.visa_guide.timeline_intro')}</p>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li>${t('blog.posts.visa_guide.timeline_1')}</li>
          <li>${t('blog.posts.visa_guide.timeline_2')}</li>
          <li>${t('blog.posts.visa_guide.timeline_3')}</li>
          <li>${t('blog.posts.visa_guide.timeline_4')}</li>
        </ul>

        <p class="mt-8 text-lg">
          ${t('blog.posts.visa_guide.conclusion')}
        </p>
      `,
      date: '2024-01-15',
      tags: ['visas', 'tips'],
      language: t('blog.language_fr'),
      image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: t('blog.read_time_8')
    },
    'banking-digital-nomades-solutions': {
      id: 'banking-digital-nomades-solutions',
      title: t('blog.posts.banking_nomad.title'),
      content: `
        <p class="text-xl text-gray-600 mb-8 font-medium">
          ${t('blog.posts.banking_nomad.intro')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.banking_nomad.challenges_title')}</h2>
        <p class="mb-6">
          ${t('blog.posts.banking_nomad.challenges_desc')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.banking_nomad.solutions_title')}</h2>
        <div class="space-y-6">
          <div class="bg-green-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-green-900 mb-3">${t('blog.posts.banking_nomad.digital_banks_title')}</h3>
            <p class="text-green-800 mb-4">
              ${t('blog.posts.banking_nomad.digital_banks_desc')}
            </p>
            <ul class="list-disc pl-6 space-y-2 text-green-700">
              <li>${t('blog.posts.banking_nomad.digital_feature_1')}</li>
              <li>${t('blog.posts.banking_nomad.digital_feature_2')}</li>
              <li>${t('blog.posts.banking_nomad.digital_feature_3')}</li>
              <li>${t('blog.posts.banking_nomad.digital_feature_4')}</li>
            </ul>
          </div>

          <div class="bg-blue-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-900 mb-3">${t('blog.posts.banking_nomad.traditional_banks_title')}</h3>
            <p class="text-blue-800 mb-4">
              ${t('blog.posts.banking_nomad.traditional_banks_desc')}
            </p>
            <ul class="list-disc pl-6 space-y-2 text-blue-700">
              <li>${t('blog.posts.banking_nomad.traditional_feature_1')}</li>
              <li>${t('blog.posts.banking_nomad.traditional_feature_2')}</li>
              <li>${t('blog.posts.banking_nomad.traditional_feature_3')}</li>
              <li>${t('blog.posts.banking_nomad.traditional_feature_4')}</li>
            </ul>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.banking_nomad.tips_title')}</h2>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li>${t('blog.posts.banking_nomad.tip_1')}</li>
          <li>${t('blog.posts.banking_nomad.tip_2')}</li>
          <li>${t('blog.posts.banking_nomad.tip_3')}</li>
          <li>${t('blog.posts.banking_nomad.tip_4')}</li>
        </ul>

        <p class="mt-8 text-lg">
          ${t('blog.posts.banking_nomad.conclusion')}
        </p>
      `,
      date: '2024-01-10',
      tags: ['banking', 'tips'],
      language: t('blog.language_fr'),
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: t('blog.read_time_6')
    },
    'trouver-logement-berlin-guide-expat': {
      id: 'trouver-logement-berlin-guide-expat',
      title: t('blog.posts.housing_berlin.title'),
      content: `
        <p class="text-xl text-gray-600 mb-8 font-medium">
          ${t('blog.posts.housing_berlin.intro')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.housing_berlin.market_title')}</h2>
        <p class="mb-6">
          ${t('blog.posts.housing_berlin.market_desc')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.housing_berlin.neighborhoods_title')}</h2>
        <div class="space-y-4 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900">${t('blog.posts.housing_berlin.mitte_title')}</h3>
            <p class="text-gray-700">${t('blog.posts.housing_berlin.mitte_desc')}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900">${t('blog.posts.housing_berlin.prenzlauer_title')}</h3>
            <p class="text-gray-700">${t('blog.posts.housing_berlin.prenzlauer_desc')}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900">${t('blog.posts.housing_berlin.kreuzberg_title')}</h3>
            <p class="text-gray-700">${t('blog.posts.housing_berlin.kreuzberg_desc')}</p>
          </div>
        </div>

        <!-- ✅ A) Processus & Arnaques — i18n -->
        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${t('blog.posts.housing_berlin.process.title')}</h2>
        <ol class="list-decimal pl-6 space-y-2 mb-6">
          <li>${t('blog.posts.housing_berlin.process.file_prep')}</li>
          <li>${t('blog.posts.housing_berlin.process.search_portals')}</li>
          <li>${t('blog.posts.housing_berlin.process.react_fast')}</li>
          <li>${t('blog.posts.housing_berlin.process.group_visits')}</li>
          <li>${t('blog.posts.housing_berlin.process.negotiate')}</li>
        </ol>

        <div class="bg-yellow-50 p-6 rounded-lg mt-6 mb-6">
          <h3 class="text-lg font-semibold text-yellow-900 mb-3">${t('blog.posts.housing_berlin.scams.title')}</h3>
          <p class="text-yellow-800">
            ${t('blog.posts.housing_berlin.scams.desc')}
          </p>
        </div>

        <p class="mt-8 text-lg">
          ${t('blog.posts.housing_berlin.conclusion')}
        </p>
      `,
      date: '2024-01-05',
      tags: ['housing', 'culture'],
      language: t('blog.language_fr'),
      image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: t('blog.read_time_5')
    },
    'systemes-sante-expatries-guide': {
      id: 'systemes-sante-expatries-guide',
      title: t('blog.posts.healthcare_expat.title'),
      content: `
        <p class="text-xl text-gray-600 mb-8 font-medium">
          ${t('blog.posts.healthcare_expat.intro')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Types de Systèmes de Santé</h2>
        <div class="space-y-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-900">Système Public</h3>
            <p class="text-blue-800">Financé par les impôts, accès universel (France, UK, Canada)</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-900">Système Mixte</h3>
            <p class="text-green-800">Combinaison public/privé (Allemagne, Pays-Bas)</p>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg">
            <h3 class="font-semibold text-orange-900">Système Privé</h3>
            <p class="text-orange-800">Basé sur l'assurance privée (États-Unis)</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Assurance Santé Internationale</h2>
        <p class="mb-4">Pour les expatriés, plusieurs options s'offrent :</p>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Assurance locale :</strong> Intégration au système du pays d'accueil</li>
          <li><strong>Assurance internationale :</strong> Couverture mondiale</li>
          <li><strong>Assurance voyage longue durée :</strong> Pour les séjours temporaires</li>
          <li><strong>Assurance employeur :</strong> Fournie par votre entreprise</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conseils Pratiques</h2>
        <div class="bg-green-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-green-900 mb-3">Avant le Départ</h3>
          <ul class="list-disc pl-6 space-y-2 text-green-800">
            <li>Obtenez vos dossiers médicaux traduits</li>
            <li>Faites un bilan de santé complet</li>
            <li>Constituez une trousse de premiers secours</li>
            <li>Recherchez les hôpitaux près de votre futur domicile</li>
          </ul>
        </div>

        <!-- ✅ B) À l’arrivée — i18n -->
        <div class="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">${t('blog.posts.healthcare_expat.arrival.title')}</h3>
          <ul class="list-disc pl-6 space-y-2 text-blue-800">
            <li>${t('blog.posts.healthcare_expat.arrival.items.1')}</li>
            <li>${t('blog.posts.healthcare_expat.arrival.items.2')}</li>
            <li>${t('blog.posts.healthcare_expat.arrival.items.3')}</li>
            <li>${t('blog.posts.healthcare_expat.arrival.items.4')}</li>
          </ul>
        </div>

        <p class="mt-8 text-lg">
          ${t('blog.posts.healthcare_expat.conclusion')}
        </p>
      `,
      date: '2024-01-01',
      tags: ['healthcare', 'tips'],
      language: t('blog.language_fr'),
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: t('blog.read_time_7')
    },
    'surmonter-choc-culturel-guide-pratique': {
      id: 'surmonter-choc-culturel-guide-pratique',
      title: t('blog.posts.culture_shock.title'),
      content: `
        <p class="text-xl text-gray-600 mb-8 font-medium">
          ${t('blog.posts.culture_shock.intro')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Les Phases du Choc Culturel</h2>
        <div class="space-y-4 mb-6">
          <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h3 class="font-semibold text-yellow-900">1. Lune de Miel</h3>
            <p class="text-yellow-800">Tout semble nouveau et excitant</p>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h3 class="font-semibold text-red-900">2. Frustration</h3>
            <p class="text-red-800">Les différences deviennent irritantes</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h3 class="font-semibold text-blue-900">3. Ajustement</h3>
            <p class="text-blue-800">Vous commencez à vous adapter</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h3 class="font-semibold text-green-900">4. Adaptation</h3>
            <p class="text-green-800">Vous vous sentez chez vous</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Stratégies d'Adaptation</h2>
        <div class="space-y-6 mb-6">
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Restez Ouvert d'Esprit</h3>
            <p class="text-gray-700">
              Approchez les différences culturelles avec curiosité plutôt qu'avec jugement. Chaque culture a ses raisons d'être.
            </p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Créez des Connexions</h3>
            <p class="text-gray-700">
              Rejoignez des groupes d'expatriés, participez à des activités locales, apprenez la langue. Les relations humaines sont essentielles.
            </p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Gardez Vos Racines</h3>
            <p class="text-gray-700">
              Maintenez le contact avec votre culture d'origine. L'équilibre entre adaptation et préservation de votre identité est clé.
            </p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Quand Demander de l'Aide</h2>
        <p class="mb-4">N'hésitez pas à chercher du soutien si vous ressentez :</p>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li>Une tristesse persistante ou de l'anxiété</li>
          <li>Un isolement social prolongé</li>
          <li>Des difficultés à accomplir les tâches quotidiennes</li>
          <li>Une perte d'intérêt pour les activités habituelles</li>
        </ul>

        <div class="bg-blue-50 p-6 rounded-lg mt-6 mb-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">Ressources d'Aide</h3>
          <ul class="list-disc pl-6 space-y-2 text-blue-800">
            <li>Conseillers spécialisés en expatriation</li>
            <li>Groupes de soutien d'expatriés</li>
            <li>Services de santé mentale locaux</li>
            <li>Plateformes comme SOS-Expat pour une aide immédiate</li>
          </ul>
        </div>

        <p class="mt-8 text-lg">
          ${t('blog.posts.culture_shock.conclusion')}
        </p>
      `,
      date: '2023-12-28',
      tags: ['culture', 'tips'],
      language: t('blog.language_fr'),
      image: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: t('blog.read_time_6')
    },
    'checklist-demenagement-international': {
      id: 'checklist-demenagement-international',
      title: t('blog.posts.moving_checklist.title'),
      content: `
        <p class="text-xl text-gray-600 mb-8 font-medium">
          ${t('blog.posts.moving_checklist.intro')}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">3-6 Mois Avant le Départ</h2>
        <div class="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">Documents et Formalités</h3>
          <ul class="list-disc pl-6 space-y-2 text-blue-800">
            <li>Vérifiez la validité de votre passeport (6 mois minimum)</li>
            <li>Demandez votre visa si nécessaire</li>
            <li>Obtenez des copies certifiées de tous vos documents importants</li>
            <li>Faites traduire vos diplômes et certificats</li>
            <li>Demandez un extrait de casier judiciaire</li>
          </ul>
        </div>

        <div class="bg-green-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-green-900 mb-3">Finances</h3>
          <ul class="list-disc pl-6 space-y-2 text-green-800">
            <li>Recherchez les options bancaires dans votre pays de destination</li>
            <li>Informez votre banque de votre déménagement</li>
            <li>Étudiez les implications fiscales</li>
            <li>Souscrivez une assurance santé internationale</li>
          </ul>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1-3 Mois Avant le Départ</h2>
        <div class="bg-orange-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-orange-900 mb-3">Logement et Déménagement</h3>
          <ul class="list-disc pl-6 space-y-2 text-orange-800">
            <li>Recherchez et réservez votre logement</li>
            <li>Obtenez des devis de déménageurs internationaux</li>
            <li>Décidez ce que vous emportez, vendez ou stockez</li>
            <li>Organisez le transport de vos animaux de compagnie</li>
          </ul>
        </div>

        <div class="bg-purple-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-purple-900 mb-3">Santé et Éducation</h3>
          <ul class="list-disc pl-6 space-y-2 text-purple-800">
            <li>Faites un bilan de santé complet</li>
            <li>Obtenez vos dossiers médicaux</li>
            <li>Mettez à jour vos vaccinations</li>
            <li>Recherchez des écoles pour vos enfants</li>
          </ul>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1 Mois Avant le Départ</h2>
        <div class="bg-red-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-red-900 mb-3">Dernières Formalités</h3>
          <ul class="list-disc pl-6 space-y-2 text-red-800">
            <li>Résiliez vos contrats (électricité, gaz, internet, téléphone)</li>
            <li>Changez votre adresse auprès des administrations</li>
            <li>Videz et fermez vos comptes bancaires locaux si nécessaire</li>
            <li>Organisez une fête d'adieu</li>
          </ul>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Semaine du Départ</h2>
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Derniers Préparatifs</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-800">
            <li>Préparez votre bagage à main avec les essentiels</li>
            <li>Confirmez tous vos vols et réservations</li>
            <li>Échangez de l'argent dans la devise locale</li>
            <li>Sauvegardez vos données importantes</li>
            <li>Préparez un kit de survie pour les premiers jours</li>
          </ul>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg mt-6 mb-6">
          <h3 class="text-lg font-semibold text-yellow-900 mb-3">Conseil Final</h3>
          <p class="text-yellow-800">
            Gardez une copie numérique de tous vos documents importants dans le cloud. Préparez aussi une trousse de premiers secours avec vos médicaments essentiels.
          </p>
        </div>

        <p class="mt-8 text-lg">
          ${t('blog.posts.moving_checklist.conclusion')}
        </p>
      `,
      date: '2023-12-25',
      tags: ['tips', 'moving'],
      language: t('blog.language_fr'),
      image: 'https://images.pexels.com/photos/7464860/pexels-photo-7464860.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: t('blog.read_time_10')
    }
  };

  const blogPost = blogPosts[postId];

  // SEO values (dépendent du post)
  const seoTitle =
    blogPost?.title ??
    (postId
      ? postId
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ')
      : 'Article');

  const seoDesc = ''; // tu peux mettre un résumé court ici si tu en as un séparé
  const published = blogPost?.date ?? new Date().toISOString().slice(0, 10);
  const ogImage = blogPost?.image;

  const jsonLd = [
    articleSchema({
      headline: seoTitle,
      datePublished: published,
      dateModified: published,
      image: ogImage,
      inLanguage: bcp47,
      url: can
    })
  ];

  if (!blogPost) {
    return (
      <>
        <SEO
          title={seoTitle}
          description={seoDesc}
          canonical={can}
          locale={bcp47}
          alternates={alternates}
          ogImage={ogImage}
          jsonLd={jsonLd}
        />

        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('blog.not_found_title')}</h1>
            <Link to={PATHS[locale].blog} className="text-blue-600 hover:text-blue-700 font-semibold">
              {t('blog.back_to_blog')}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const shareUrl = can; // utilise l'URL canonique calculée
  const shareTitle = blogPost.title;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
        shareTitle
      )}`,
      color: 'hover:bg-sky-500'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-700'
    }
  ];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={can}
        locale={bcp47}
        alternates={alternates}
        ogImage={ogImage}
        jsonLd={jsonLd}
      />

      <div className="pt-24">
        {/* Back Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to={PATHS[locale].blog}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>{t('blog.back_to_blog')}</span>
          </Link>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <img
                src={blogPost.image}
                alt={blogPost.title}
                className="w-full h-64 md:h-96 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formatDate(blogPost.date)}</span>
                </div>
                <span>•</span>
                <span>{blogPost.readTime}</span>
                <span>•</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                  {t('blog.language_label')}
                </span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium mr-2">
                  <Share2 size={16} className="inline mr-1" />
                  {t('blog.share')}
                </span>
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gray-100 text-gray-600 ${link.color} hover:text-white transition-colors duration-200`}
                    title={`Share on ${link.name}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {t(`blog.topics.${tag}`)}
                </span>
              ))}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </div>

            {/* Author Box */}
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-start space-x-4">
                <img
                  src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Williams Jullin"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Williams Jullin</h3>
                  <p className="text-gray-600 mb-4">
                    {t('blog.author_bio')}
                  </p>
                  <div className="flex space-x-4">
                    <Link
                      to={PATHS[locale].story}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {t('blog.author.read_story')}
                    </Link>
                    <Link
                      to={PATHS[locale].contact}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {t('blog.author.get_in_touch')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
