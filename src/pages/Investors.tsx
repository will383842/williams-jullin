import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Globe, Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface InvestorsProps {
  navigate: (page: string) => void;
}

const Investors: React.FC<InvestorsProps> = ({ navigate }) => {
  const { t } = useTranslation();
  
  const handleRequestPack = () => {
    // Navigate to contact with investment purpose pre-selected
    navigate('contact');
  };

  const metrics = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      value: "500K+",
      label: t('investors.traction.users')
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      value: "25+",
      label: t('investors.traction.countries')
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      value: "300%",
      label: t('investors.traction.growth')
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      value: "99.9%",
      label: t('investors.traction.uptime')
    }
  ];

  const roadmapItems = [
    {
      quarter: "Q2 2024",
      title: t('investors.roadmap.q2_2024.title'),
      description: t('investors.roadmap.q2_2024.description'),
      status: "completed"
    },
    {
      quarter: "Q3 2024",
      title: t('investors.roadmap.q3_2024.title'),
      description: t('investors.roadmap.q3_2024.description'),
      status: "current"
    },
    {
      quarter: "Q4 2024",
      title: t('investors.roadmap.q4_2024.title'),
      description: t('investors.roadmap.q4_2024.description'),
      status: "planned"
    },
    {
      quarter: "Q1 2025",
      title: t('investors.roadmap.q1_2025.title'),
      description: t('investors.roadmap.q1_2025.description'),
      status: "planned"
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('investors.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8">
              {t('investors.hero.subtitle')}
            </p>
            <button
              onClick={handleRequestPack}
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg flex items-center space-x-2 mx-auto transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <span>{t('investors.hero.cta')}</span>
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Problem */}
              <div className="bg-red-50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('investors.problem.title')}
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{t('investors.problem.point_1')}</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{t('investors.problem.point_2')}</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{t('investors.problem.point_3')}</p>
                  </li>
                </ul>
              </div>

              {/* Solution */}
              <div className="bg-green-50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('investors.solution.title')}
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{t('investors.solution.point_1')}</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{t('investors.solution.point_2')}</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">{t('investors.solution.point_3')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market & Timing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {t('investors.market.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">$2.3T</div>
                <p className="text-gray-600">{t('investors.market.size')}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">15%</div>
                <p className="text-gray-600">{t('investors.market.growth')}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">50M</div>
                <p className="text-gray-600">{t('investors.market.expats')}</p>
              </div>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('investors.market.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('investors.traction.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('investors.traction.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-center mb-4">
                    {metric.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {metric.value}
                  </div>
                  <p className="text-gray-600">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('investors.products.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('investors.products.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SOS-Expat */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">SOS-Expat</h3>
                  <p className="text-red-100 mb-4">{t('investors.products.sos_description')}</p>
                  <a
                    href="https://sos-expat.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-white hover:text-red-100 transition-colors duration-200"
                  >
                    <span>{t('investors.products.view_product')}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">24/7</div>
                      <p className="text-gray-600 text-sm">{t('investors.products.sos_feature_1')}</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">25+</div>
                      <p className="text-gray-600 text-sm">{t('investors.products.sos_feature_2')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ulixai */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Ulixai</h3>
                  <p className="text-blue-100 mb-4">{t('investors.products.ulixai_description')}</p>
                  <a
                    href="https://ulixai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200"
                  >
                    <span>{t('investors.products.view_product')}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">200+</div>
                      <p className="text-gray-600 text-sm">{t('investors.products.ulixai_feature_1')}</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">15</div>
                      <p className="text-gray-600 text-sm">{t('investors.products.ulixai_feature_2')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              {t('investors.business.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  {t('investors.business.subscription.title')}
                </div>
                <p className="text-gray-700">
                  {t('investors.business.subscription.description')}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-600 mb-4">
                  {t('investors.business.commission.title')}
                </div>
                <p className="text-gray-700">
                  {t('investors.business.commission.description')}
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-purple-600 mb-4">
                  {t('investors.business.enterprise.title')}
                </div>
                <p className="text-gray-700">
                  {t('investors.business.enterprise.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Moat */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('investors.moat.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('investors.moat.subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t(`investors.moat.point_${index}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`investors.moat.point_${index}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('investors.roadmap.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('investors.roadmap.subtitle')}
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8">
                {roadmapItems.map((item, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className={`absolute left-4 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'current' ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`}></div>
                    
                    <div className="ml-10 bg-white rounded-xl shadow-lg p-6 w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-500">{item.quarter}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'current' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`investors.roadmap.status.${item.status}`)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              {t('investors.team.title')}
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Williams Jullin"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Williams Jullin</h3>
                  <p className="text-xl text-blue-600 mb-4">{t('investors.team.founder_title')}</p>
                  <p className="text-gray-600 leading-relaxed">
                    {t('investors.team.founder_bio')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">
                {t('investors.disclaimer.title')}
              </h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                {t('investors.disclaimer.content')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('investors.cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('investors.cta.subtitle')}
            </p>
            <button
              onClick={handleRequestPack}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-bold text-lg flex items-center space-x-2 mx-auto transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <span>{t('investors.cta.button')}</span>
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Investors;