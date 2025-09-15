import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Mail, ExternalLink } from 'lucide-react';

import SEO from '../seo/SEO';
import { buildAlternates, canonical } from '../seo/helpers';
import { PATHS, LOCALES, type Locale } from '../router/paths';
import { metaMedia } from '../seo/meta';


interface MediaProps {
  navigate: (page: string) => void;
}

const Media: React.FC<MediaProps> = ({ navigate }) => {

  // === SEO locale & URLs ===
  const locale = (i18n?.language?.split('-')[0] ?? 'fr') as Locale;
  const bcp47 = locale === 'fr' ? 'fr-FR' : `${locale}-${locale.toUpperCase()}`;
  const alternates = buildAlternates(locale, 'media');
  const can = canonical(locale, 'media');
  const meta = metaMedia(locale);
const { t, i18n } = useTranslation();
  
  const interviewTopics = [
    {
      title: t('media.topics.expat_trends.title'),
      description: t('media.topics.expat_trends.description')
    },
    {
      title: t('media.topics.digital_nomad.title'),
      description: t('media.topics.digital_nomad.description')
    },
    {
      title: t('media.topics.visa_policy.title'),
      description: t('media.topics.visa_policy.description')
    },
    {
      title: t('media.topics.relocation_tech.title'),
      description: t('media.topics.relocation_tech.description')
    },
    {
      title: t('media.topics.cultural_adaptation.title'),
      description: t('media.topics.cultural_adaptation.description')
    },
    {
      title: t('media.topics.entrepreneurship.title'),
      description: t('media.topics.entrepreneurship.description')
    }
  ];

  const pressLinks = [
    {
      title: "Featured in TechCrunch: 'The Future of Expat Services'",
      url: "#",
      date: "January 2024",
      publication: "TechCrunch"
    },
    {
      title: "Interview on BBC World Service: Digital Nomad Trends",
      url: "#",
      date: "December 2023",
      publication: "BBC World Service"
    },
    {
      title: "Forbes Article: 'Building the Expat Ecosystem'",
      url: "#",
      date: "November 2023",
      publication: "Forbes"
    },
    {
      title: "Podcast: 'The Expat Experience in 2024'",
      url: "#",
      date: "October 2023",
      publication: "Expat Network"
    }
  ];

  const handleDownload = (filename: string) => {
    // In a real application, this would trigger an actual download
    console.log(`Downloading ${filename}`);
  };

  return (
  <>
    <SEO
  title={meta.title}
  description={meta.desc}
  canonical={can}
  locale={bcp47}
  alternates={alternates}
/>

    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('media.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {t('media.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Short Bio */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('media.bio.short_title')}</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {t('media.bio.short_content')}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDownload('williams-jullin-bio-short.pdf')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Download size={18} />
                    <span>{t('media.download_short_bio')}</span>
                  </button>
                </div>
              </div>

              {/* Long Bio */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('media.bio.long_title')}</h2>
                <div className="text-lg text-gray-600 space-y-4 leading-relaxed">
                  <p>{t('media.bio.long_paragraph_1')}</p>
                  <p>{t('media.bio.long_paragraph_2')}</p>
                  <p>{t('media.bio.long_paragraph_3')}</p>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => handleDownload('williams-jullin-bio-long.pdf')}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Download size={18} />
                    <span>{t('media.download_long_bio')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Topics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('media.topics.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('media.topics.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {interviewTopics.map((topic, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600">
                    {topic.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Press Links */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('media.press.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('media.press.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {pressLinks.map((link, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {link.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="font-medium">{link.publication}</span>
                        <span>•</span>
                        <span>{link.date}</span>
                      </div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photos Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('media.photos.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('media.photos.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Professional Portrait 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Williams Jullin Professional Portrait"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t('media.photos.portrait_1_title')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('media.photos.portrait_1_description')}
                  </p>
                  <button
                    onClick={() => handleDownload('williams-jullin-portrait-1.jpg')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Download size={16} />
                    <span>{t('media.download_photo')}</span>
                  </button>
                </div>
              </div>

              {/* Professional Portrait 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Williams Jullin Casual Portrait"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t('media.photos.portrait_2_title')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('media.photos.portrait_2_description')}
                  </p>
                  <button
                    onClick={() => handleDownload('williams-jullin-portrait-2.jpg')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Download size={16} />
                    <span>{t('media.download_photo')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('media.contact.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('media.contact.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:press@williamsjullin.com"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Mail size={20} />
                <span>{t('media.contact.email')}</span>
              </a>
              <button
                onClick={() => navigate('contact')}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('media.contact.form')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  
  </>
);
};

export default Media;