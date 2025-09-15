// src/pages/Blog.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

import SEO from '../seo/SEO';
import { buildAlternates, canonical } from '../seo/helpers';
import { PATHS, type Locale } from '../router/paths';
import { metaBlog } from '../seo/meta';

type TagKey =
  | 'all'
  | 'visas'
  | 'banking'
  | 'housing'
  | 'healthcare'
  | 'culture'
  | 'tips'
  | 'moving';

interface PostItem {
  id: string;            // slug du billet
  title: string;
  excerpt: string;
  date: string;          // ISO YYYY-MM-DD
  tags: TagKey[];
  language: string;      // ex: 'EN'
  image: string;
}

const Blog: React.FC = () => {
  // i18n
  const { t, i18n } = useTranslation();

  // === SEO locale & URLs ===
  const locale = (i18n?.language?.split('-')[0] ?? 'fr') as Locale;
  const bcp47 = locale === 'fr' ? 'fr-FR' : `${locale}-${locale.toUpperCase()}`;
  const alternates = buildAlternates(locale, 'blog');
  const can = canonical(locale, 'blog');
  const meta = metaBlog(locale);

  const [selectedTag, setSelectedTag] = useState<TagKey>('all');

  const tags: { key: TagKey; label: string; color: string }[] = [
    { key: 'all',        label: t('blog.tags.all'),          color: 'bg-gray-100 text-gray-800' },
    { key: 'visas',      label: t('blog.topics.visas'),      color: 'bg-blue-100 text-blue-800' },
    { key: 'banking',    label: t('blog.topics.banking'),    color: 'bg-green-100 text-green-800' },
    { key: 'housing',    label: t('blog.topics.housing'),    color: 'bg-purple-100 text-purple-800' },
    { key: 'healthcare', label: t('blog.topics.healthcare'), color: 'bg-red-100 text-red-800' },
    { key: 'culture',    label: t('blog.topics.culture'),    color: 'bg-yellow-100 text-yellow-800' },
    { key: 'tips',       label: t('blog.topics.tips'),       color: 'bg-indigo-100 text-indigo-800' }
  ];

  // Ton contenu (préserve 100% de tes items)
  const blogPosts: PostItem[] = [
    {
      id: 'guide-complet-visas-europeens',
      title: t('blog.posts.visa_guide.title'),
      excerpt: t('blog.posts.visa_guide.excerpt'),
      date: '2024-01-15',
      tags: ['visas', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'banking-digital-nomades-solutions',
      title: t('blog.posts.banking_nomad.title'),
      excerpt: t('blog.posts.banking_nomad.excerpt'),
      date: '2024-01-10',
      tags: ['banking', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'trouver-logement-berlin-guide-expat',
      title: t('blog.posts.housing_berlin.title'),
      excerpt: t('blog.posts.housing_berlin.excerpt'),
      date: '2024-01-05',
      tags: ['housing', 'culture'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'systemes-sante-expatries-guide',
      title: t('blog.posts.healthcare_expat.title'),
      excerpt: t('blog.posts.healthcare_expat.excerpt'),
      date: '2024-01-01',
      tags: ['healthcare', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'surmonter-choc-culturel-guide-pratique',
      title: t('blog.posts.culture_shock.title'),
      excerpt: t('blog.posts.culture_shock.excerpt'),
      date: '2023-12-28',
      tags: ['culture', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'checklist-demenagement-international',
      title: t('blog.posts.moving_checklist.title'),
      excerpt: t('blog.posts.moving_checklist.excerpt'),
      date: '2023-12-25',
      tags: ['tips', 'moving'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/7464860/pexels-photo-7464860.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredPosts =
    selectedTag === 'all'
      ? blogPosts
      : blogPosts.filter((post) => post.tags.includes(selectedTag));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.desc}
        canonical={can}
        locale={bcp47}
        alternates={alternates}
      />

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                {t('blog.hero.title')}
              </h1>
              <p className="text-base md:text-xl lg:text-2xl text-gray-600 leading-relaxed px-4">
                {t('blog.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Tags Filter */}
        <section className="py-8 md:py-12 bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {tags.map((tag) => (
                <button
                  key={tag.key}
                  onClick={() => setSelectedTag(tag.key)}
                  className={`px-3 py-2 md:px-4 rounded-full font-medium transition-all duration-200 text-xs md:text-sm ${
                    selectedTag === tag.key
                      ? 'bg-amber-600 text-white shadow-lg'
                      : `${tag.color} hover:shadow-md`
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium text-gray-700">
                      <span>{t('blog.language_label')}</span>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm mb-2 md:mb-3">
                      <Calendar size={14} className="md:w-4 md:h-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                      {post.tags.map((tagKey) => {
                        const tag = tags.find((t) => t.key === tagKey);
                        return tag ? (
                          <span
                            key={tagKey}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
                          >
                            <Tag size={10} className="md:w-3 md:h-3 inline mr-1" />
                            {tag.label}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Remplacement du navigate() par un lien router multilingue */}
                    <Link
                      to={PATHS[locale].post(post.id)}
                      className="touch-link flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold transition-colors duration-200 text-sm md:text-base py-2"
                    >
                      <span>{t('blog.read_more')}</span>
                      <ArrowRight size={14} className="md:w-4 md:h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <p className="text-lg md:text-xl text-gray-600">{t('blog.no_posts')}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
