import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink, MapPin, Users, Star, CheckCircle, Globe, Zap, Heart, Award, Building, Shield, Target, BookOpen, Calendar, Mail, Linkedin, Twitter, Instagram, Phone, Clock, UserCheck, Briefcase, Home as HomeIcon, CreditCard, Stethoscope, Scale } from 'lucide-react';

interface HomeProps {
  navigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const { t } = useTranslation();

  const achievements = [
    { number: "500K+", label: t('home.stats.expats_helped') },
    { number: "25+", label: t('home.stats.countries_covered') },
    { number: "10+", label: t('home.stats.years_experience') },
    { number: "99.9%", label: t('home.stats.satisfaction_rate') }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="min-h-screen flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
              
              {/* Contenu principal */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  <Star className="h-4 w-4 mr-2" />
                  {t('home.hero.badge')}
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                    Williams
                    <br />
                    <span className="text-blue-600">Jullin</span>
                  </h1>
                  
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-700 leading-relaxed">
                    {t('home.hero.title')}
                  </h2>
                </div>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  {t('home.hero.subtitle')}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                        {achievement.number}
                      </div>
                      <div className="text-sm text-slate-600 font-medium uppercase tracking-wider">
                        {achievement.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('contact')}
                    className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span>{t('home.hero.cta_primary')}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  
                  <button
                    onClick={() => navigate('story')}
                    className="bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t('home.hero.cta_secondary')}
                  </button>
                </div>
              </div>

              {/* Photo principale */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="relative">
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Williams Jullin"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
                    </div>
                    
                    <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-slate-900">500K+</div>
                          <div className="text-sm text-slate-600">Expats aidés</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-slate-200 rounded-full opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Photo à gauche, texte à droite - Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Williams Jullin en action"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-8 -right-8 bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl font-bold">25+</div>
                  <div className="text-sm opacity-90">Pays couverts</div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {t('home.mission.title')}
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed mb-8">
                    {t('home.mission.subtitle')}
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Mon parcours personnel d'expatrié m'a permis de comprendre les défis uniques auxquels font face des millions de personnes dans le monde. Cette expérience est devenue la base de mes solutions innovantes.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <Heart className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                    <div className="font-semibold text-slate-900">{t('home.mission.empathy')}</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                    <div className="font-semibold text-slate-900">{t('home.mission.community')}</div>
                  </div>
                  <div className="text-center">
                    <Zap className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                    <div className="font-semibold text-slate-900">{t('home.mission.innovation')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Texte à gauche, photo à droite - Expertise */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    Une Expertise Reconnue Mondialement
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed mb-8">
                    Plus de 10 ans d'expérience dans l'accompagnement d'expatriés, avec des solutions innovantes qui transforment la mobilité internationale.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Couverture Mondiale</h3>
                      <p className="text-slate-600">Présence dans plus de 25 pays avec des partenaires locaux vérifiés.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Support 24/7</h3>
                      <p className="text-slate-600">Assistance d'urgence disponible à tout moment, partout dans le monde.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Solutions Personnalisées</h3>
                      <p className="text-slate-600">Chaque expatrié est unique, nos solutions s'adaptent à vos besoins spécifiques.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Expertise mondiale"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -top-8 -left-8 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold text-slate-900">99.9%</div>
                      <div className="text-sm text-slate-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Prestataires Ulixai */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Réseau de Prestataires Ulixai
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Un écosystème de professionnels vérifiés pour accompagner chaque étape de votre relocation internationale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Avocats Immigration</h3>
                <p className="text-slate-600 mb-4">Experts en droit de l'immigration et procédures de visa</p>
                <div className="text-2xl font-bold text-blue-600">200+</div>
                <div className="text-sm text-slate-500">Avocats partenaires</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Conseillers Bancaires</h3>
                <p className="text-slate-600 mb-4">Solutions bancaires internationales pour expatriés</p>
                <div className="text-2xl font-bold text-green-600">150+</div>
                <div className="text-sm text-slate-500">Banques partenaires</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <HomeIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Agents Immobiliers</h3>
                <p className="text-slate-600 mb-4">Spécialistes du logement pour expatriés</p>
                <div className="text-2xl font-bold text-purple-600">300+</div>
                <div className="text-sm text-slate-500">Agents vérifiés</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Professionnels Santé</h3>
                <p className="text-slate-600 mb-4">Médecins et assureurs santé internationaux</p>
                <div className="text-2xl font-bold text-red-600">100+</div>
                <div className="text-sm text-slate-500">Professionnels</div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="https://ulixai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>Rejoindre le Réseau Ulixai</span>
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Demandeurs de Services */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    Qui Utilise Nos Services ?
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed mb-8">
                    Des particuliers aux multinationales, découvrez qui fait confiance à notre expertise pour leur mobilité internationale.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Particuliers & Familles</h3>
                        <div className="text-blue-600 font-semibold">450K+ utilisateurs</div>
                      </div>
                    </div>
                    <p className="text-slate-600">Expatriés individuels cherchant un accompagnement personnalisé pour leur installation à l'étranger.</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Building className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Startups & Scale-ups</h3>
                        <div className="text-green-600 font-semibold">150+ entreprises</div>
                      </div>
                    </div>
                    <p className="text-slate-600">Jeunes entreprises en croissance ayant besoin d'accompagner leurs talents internationaux.</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Multinationales</h3>
                        <div className="text-purple-600 font-semibold">50+ groupes</div>
                      </div>
                    </div>
                    <p className="text-slate-600">Grandes entreprises gérant des programmes de mobilité internationale pour leurs employés.</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Clients satisfaits"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl font-bold">97%</div>
                  <div className="text-sm opacity-90">Taux de satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section SOS-Expat Services d'Urgence */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Support d'urgence SOS-Expat"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -top-8 -right-8 bg-red-600 text-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-8 w-8" />
                    <div>
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm opacity-90">Support</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    SOS-Expat : Votre Bouée de Sauvetage
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed mb-8">
                    Quand l'urgence frappe à l'étranger, SOS-Expat est là. Notre plateforme d'assistance d'urgence vous connecte instantanément aux bonnes personnes.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Urgences Médicales</h3>
                      <p className="text-slate-600">Accès immédiat aux services médicaux d'urgence et hôpitaux partenaires.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Scale className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Assistance Juridique</h3>
                      <p className="text-slate-600">Support légal d'urgence pour problèmes administratifs ou judiciaires.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Réponse Rapide</h3>
                      <p className="text-slate-600">Temps de réponse moyen de moins de 15 minutes, 24h/24 et 7j/7.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href="https://sos-expat.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span>Accéder à SOS-Expat</span>
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl opacity-90 mb-12 leading-relaxed">
              {t('home.cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => navigate('contact')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Mail size={20} />
                <span>{t('home.cta.contact')}</span>
              </button>
              
              <button
                onClick={() => navigate('story')}
                className="bg-blue-700 hover:bg-blue-800 text-white border-2 border-blue-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                {t('home.cta.story')}
              </button>
            </div>

            <div className="flex justify-center space-x-6">
              <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;