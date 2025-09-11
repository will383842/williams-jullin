import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface MyStoryProps {
  navigate: (page: string) => void;
}

const MyStory: React.FC<MyStoryProps> = ({ navigate }) => {
  const { t } = useTranslation();
  
  const timelineEvents = [
    {
      year: '2015',
      title: t('story.timeline.event_1.title'),
      description: t('story.timeline.event_1.description'),
      location: 'Paris, France',
      icon: <MapPin className="h-5 w-5" />
    },
    {
      year: '2018',
      title: t('story.timeline.event_2.title'),
      description: t('story.timeline.event_2.description'),
      location: 'Berlin, Germany',
      icon: <MapPin className="h-5 w-5" />
    },
    {
      year: '2020',
      title: t('story.timeline.event_3.title'),
      description: t('story.timeline.event_3.description'),
      location: 'Barcelona, Spain',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      year: '2022',
      title: t('story.timeline.event_4.title'),
      description: t('story.timeline.event_4.description'),
      location: 'Lisbon, Portugal',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      year: '2024',
      title: t('story.timeline.event_5.title'),
      description: t('story.timeline.event_5.description'),
      location: 'Global',
      icon: <MapPin className="h-5 w-5" />
    }
  ];

  const values = [
    {
      icon: '🌍',
      title: t('story.values.global.title'),
      description: t('story.values.global.description')
    },
    {
      icon: '🤝',
      title: t('story.values.community.title'),
      description: t('story.values.community.description')
    },
    {
      icon: '💡',
      title: t('story.values.innovation.title'),
      description: t('story.values.innovation.description')
    },
    {
      icon: '🎯',
      title: t('story.values.impact.title'),
      description: t('story.values.impact.description')
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('story.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {t('story.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {t('story.intro.title')}
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>{t('story.intro.paragraph_1')}</p>
                  <p>{t('story.intro.paragraph_2')}</p>
                  <p>{t('story.intro.paragraph_3')}</p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Williams Jullin"
                  className="w-full rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-amber-600/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('story.timeline.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('story.timeline.subtitle')}
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-blue-200"></div>

              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <div key={index} className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                    
                    {/* Content */}
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="ml-16 md:ml-0 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center space-x-2 text-amber-600 mb-2">
                          {event.icon}
                          <span className="text-sm font-medium">{event.location}</span>
                        </div>
                        <div className="text-2xl font-bold text-amber-600 mb-2">{event.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('story.values.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('story.values.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('story.cta.title')}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t('story.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://sos-expat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <span>{t('story.cta.sos_button')}</span>
                <ExternalLink size={20} />
              </a>
              <a
                href="https://ulixai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <span>{t('story.cta.ulixai_button')}</span>
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyStory;