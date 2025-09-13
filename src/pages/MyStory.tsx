import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Calendar, ExternalLink, Heart, Coffee, Lightbulb, Users, Quote, Star, TrendingUp, Plane, Building, Globe } from 'lucide-react';

interface MyStoryProps {
  navigate: (page: string) => void;
}

const MyStory: React.FC<MyStoryProps> = ({ navigate }) => {
  const { t } = useTranslation();
  const [hoveredEvent, setHoveredEvent] = useState(null);
  
  // SEO optimisé pour la page Mon Histoire
  React.useEffect(() => {
    document.title = "Mon Histoire - Williams Jullin | Parcours Expert Expatriation Mondiale | De l'Effondrement à la Renaissance";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "🚀 Découvrez le parcours inspirant de Williams Jullin, de l'effondrement Covid à la renaissance en Thaïlande. Comment un entrepreneur français est devenu l'expert #1 mondial en expatriation, aidant 500K+ expatriés de toutes nationalités avec Ulixai & SOS-Expat."
      );
    }
    
    // Données structurées pour l'histoire personnelle
    const storyStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Mon Histoire - Williams Jullin | Parcours Expert Expatriation Mondiale",
      "description": "Parcours inspirant de Williams Jullin, de l'effondrement à la renaissance. Comment devenir expert mondial expatriation.",
      "author": {
        "@type": "Person",
        "name": "Williams Jullin",
        "@id": "https://williamsjullin.com/#person"
      },
      "publisher": {
        "@type": "Person", 
        "name": "Williams Jullin"
      },
      "datePublished": "2024-01-01",
      "dateModified": "2024-01-01",
      "image": "https://williamsjullin.com/Williams-jullin.jpg",
      "url": "https://williamsjullin.com/mon-histoire",
      "mainEntityOfPage": "https://williamsjullin.com/mon-histoire",
      "articleSection": "Biography",
      "keywords": [
        "histoire Williams Jullin", "parcours expert expatriation", "fondateur Ulixai SOS-Expat",
        "expatriation Thaïlande", "entrepreneur expatrié", "success story expatriation",
        "inspiration expatriés", "motivation expatriation", "résilience expatrié",
        "reconstruction expatriation", "renaissance à l'étranger", "transformation expatriation"
      ],
      "about": [
        {
          "@type": "Thing",
          "name": "Expatriation",
          "description": "Processus de vivre à l'étranger"
        },
        {
          "@type": "Thing", 
          "name": "Entrepreneuriat International",
          "description": "Création d'entreprises à l'international"
        },
        {
          "@type": "Thing",
          "name": "Résilience",
          "description": "Capacité à se reconstruire après l'échec"
        }
      ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(storyStructuredData, null, 2);
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  const timelineEvents = [
    {
      year: '2017',
      title: t('story.timeline.event_1.title'),
      description: t('story.timeline.event_1.description'),
      location: t('story.timeline.event_1.location'),
      icon: <TrendingUp className="h-5 w-5" />,
      emotion: t('story.timeline.event_1.emotion'),
      feeling: t('story.timeline.event_1.feeling'),
      lesson: t('story.timeline.event_1.lesson')
    },
    {
      year: '2020-2022',
      title: t('story.timeline.event_2.title'),
      description: t('story.timeline.event_2.description'),
      location: t('story.timeline.event_2.location'),
      icon: <Heart className="h-5 w-5" />,
      emotion: t('story.timeline.event_2.emotion'),
      feeling: t('story.timeline.event_2.feeling'),
      lesson: t('story.timeline.event_2.lesson')
    },
    {
      year: '2022',
      title: t('story.timeline.event_3.title'),
      description: t('story.timeline.event_3.description'),
      location: t('story.timeline.event_3.location'),
      icon: <Plane className="h-5 w-5" />,
      emotion: t('story.timeline.event_3.emotion'),
      feeling: t('story.timeline.event_3.feeling'),
      lesson: t('story.timeline.event_3.lesson')
    },
    {
      year: '2024',
      title: t('story.timeline.event_4.title'),
      description: t('story.timeline.event_4.description'),
      location: t('story.timeline.event_4.location'),
      icon: <Globe className="h-5 w-5" />,
      emotion: t('story.timeline.event_4.emotion'),
      feeling: t('story.timeline.event_4.feeling'),
      lesson: t('story.timeline.event_4.lesson')
    },
    {
      year: '2024-2025',
      title: t('story.timeline.event_5.title'),
      description: t('story.timeline.event_5.description'),
      location: t('story.timeline.event_5.location'),
      icon: <Coffee className="h-5 w-5" />,
      emotion: t('story.timeline.event_5.emotion'),
      feeling: t('story.timeline.event_5.feeling'),
      lesson: t('story.timeline.event_5.lesson')
    },
    {
      year: '2025',
      title: t('story.timeline.event_6.title'),
      description: t('story.timeline.event_6.description'),
      location: t('story.timeline.event_6.location'),
      icon: <Building className="h-5 w-5" />,
      emotion: t('story.timeline.event_6.emotion'),
      feeling: t('story.timeline.event_6.feeling'),
      lesson: t('story.timeline.event_6.lesson')
    }
  ];

  const personalValues = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('story.values.build.title'),
      description: t('story.values.build.description'),
      story: t('story.values.build.story')
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: t('story.values.resilience.title'),
      description: t('story.values.resilience.description'),
      story: t('story.values.resilience.story')
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t('story.values.connection.title'),
      description: t('story.values.connection.description'),
      story: t('story.values.connection.story')
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: t('story.values.innovation.title'),
      description: t('story.values.innovation.description'),
      story: t('story.values.innovation.story')
    }
  ];

  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* Hero Section Moderne */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Grid pattern subtil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative container mx-auto px-6 lg:px-12 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 text-white">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium">{t('story.hero.badge')}</span>
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-light leading-tight">
                      <span className="block font-extralight text-white/80">{t('story.hero.title_1')}</span>
                      <span className="block font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t('story.hero.title_2')}</span>
                    </h1>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-xl lg:text-2xl text-slate-200 leading-relaxed font-light">
                      {t('story.hero.subtitle')}
                    </p>
                    
                    <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-blue-400" />
                        <span>{t('story.hero.companies')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-400" />
                        <span>{t('story.hero.location')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="relative group">
                    <img
                      src="/Williams Jullin.jpg"
                      alt="Williams Jullin"
                      className="w-full h-[600px] object-cover rounded-2xl shadow-2xl border-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent rounded-2xl"></div>
                    
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{t('story.hero.role_1')}</p>
                          <p className="text-sm text-slate-500">{t('story.hero.role_2')}</p>
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

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{t('story.intro.badge')}</span>
                  </div>
                  
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    {t('story.intro.title')}
                  </h2>
                </div>
                
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p className="text-xl font-medium text-slate-700">
                    {t('story.intro.paragraph_1')}
                  </p>
                  
                  <p>
                    {t('story.intro.paragraph_2')}
                  </p>
                  
                  <p>
                    {t('story.intro.paragraph_3')}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Quote className="h-8 w-8 text-white" />
                    </div>
                    
                    <blockquote className="text-xl font-medium text-slate-800 italic leading-relaxed">
                      "{t('story.intro.quote')}"
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Moderne */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Calendar className="h-4 w-4" />
                <span>De l'ascension à la reconstruction</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                {t('story.timeline.title')}
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                {t('story.timeline.subtitle')}
              </p>
              <div className="max-w-3xl mx-auto">
                <div className="bg-slate-100 rounded-2xl p-6 border-l-4 border-slate-400">
                  <p className="text-slate-700 leading-relaxed">
                    {t('story.timeline.before_2017')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="group"
                  onMouseEnter={() => setHoveredEvent(index)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Année */}
                    <div className="lg:col-span-2">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                          {event.year}
                        </div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center justify-end space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ligne et icône */}
                    <div className="lg:col-span-1 flex justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-white border-4 border-slate-200 group-hover:border-blue-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300">
                          <span className="text-2xl">{event.emotion}</span>
                        </div>
                        {index < timelineEvents.length - 1 && (
                          <div className="absolute top-16 left-1/2 transform -translate-x-0.5 w-0.5 h-12 bg-slate-200"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className="lg:col-span-9">
                      <div className={`bg-white rounded-2xl p-8 shadow-lg border border-slate-100 transition-all duration-300 ${
                        hoveredEvent === index ? 'shadow-xl border-blue-200 transform scale-[1.02]' : ''
                      }`}>
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {event.title}
                          </h3>
                          
                          <p className="text-slate-600 leading-relaxed">
                            {event.description}
                          </p>
                          
                          <div className="border-t border-slate-100 pt-4 space-y-2">
                            <p className="text-blue-600 font-medium text-sm">{event.feeling}</p>
                            <p className="text-slate-500 text-sm italic">"{event.lesson}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* L'expérience d'expatriation */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Lightbulb className="h-4 w-4" />
                <span>{t('story.expatriation.badge')}</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                {t('story.expatriation.title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-900">
                  {t('story.expatriation.shock_title')}
                </h3>
                <div className="space-y-4 text-lg text-slate-600">
                  <p>
                    {t('story.expatriation.shock_paragraph_1')}
                  </p>
                  <p>
                    {t('story.expatriation.shock_paragraph_2')}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-12 text-white text-center shadow-2xl">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold">La mission naît</h4>
                    <p className="text-blue-100 text-lg italic">
                      "Ne plus jamais laisser quelqu'un vivre ça seul"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold">
                  {t('story.expatriation.mission_title')}
                </h3>
                <p className="text-xl text-slate-200">
                  {t('story.expatriation.mission_subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les deux plateformes - Design moderne */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Building className="h-4 w-4" />
                <span>{t('story.platforms.badge')}</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                {t('story.platforms.title')}
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {t('story.platforms.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* SOS-Expat */}
              <div className="group relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 text-white">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">🆘</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">SOS-Expat</h3>
                        <p className="text-red-100">{t('story.platforms.sos.subtitle')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 text-xl">⚡</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-2">{t('story.platforms.sos.feature_1_title')}</h4>
                          <p className="text-slate-600">{t('story.platforms.sos.feature_1_desc')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 text-xl">💰</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-2">{t('story.platforms.sos.feature_2_title')}</h4>
                          <p className="text-slate-600">{t('story.platforms.sos.feature_2_desc')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href="https://sos-expat.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 group-hover:shadow-lg"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>{t('story.platforms.sos.cta')}</span>
                        <ExternalLink className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Ulixai */}
              <div className="group relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">🔍</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Ulixai</h3>
                        <p className="text-blue-100">{t('story.platforms.ulixai.subtitle')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-500 text-xl">🔄</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-2">{t('story.platforms.ulixai.feature_1_title')}</h4>
                          <p className="text-slate-600">{t('story.platforms.ulixai.feature_1_desc')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-500 text-xl">🌍</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-2">{t('story.platforms.ulixai.feature_2_title')}</h4>
                          <p className="text-slate-600">{t('story.platforms.ulixai.feature_2_desc')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href="https://ulixai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 group-hover:shadow-lg"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>{t('story.platforms.ulixai.cta')}</span>
                        <ExternalLink className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Design épuré */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Heart className="h-4 w-4" />
                <span>{t('story.values.badge')}</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                {t('story.values.title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {personalValues.map((value, index) => (
                <div key={index} className="group">
                  <div className="bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {value.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {value.description}
                        </p>
                        <div className="bg-blue-50 rounded-2xl p-4 border-l-4 border-blue-200">
                          <p className="text-blue-700 text-sm font-medium italic">
                            💭 {value.story}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final moderne */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"></div>
        
        {/* Pattern moderne */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative container mx-auto px-6 lg:px-12 z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">{t('story.cta.badge')}</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  {t('story.cta.title')}
                </h2>
              </div>
              
              <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                {t('story.cta.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <a
                  href="https://sos-expat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>{t('story.cta.sos_button')}</span>
                    <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                
                <a
                  href="https://ulixai.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>{t('story.cta.ulixai_button')}</span>
                    <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </div>
              
              <div className="pt-8">
                <p className="text-slate-400 text-sm">
                  {t('story.cta.connect')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyStory;