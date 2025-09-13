import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Globe, Shield, ArrowRight, ExternalLink, Mail, Phone, MessageCircle, CheckCircle, Heart, Zap, Target, Rocket, AlertTriangle, Loader2 } from 'lucide-react';
import { submitInvestorForm, type InvestorFormData } from '../services/investorService';
import FormFeedback from '../components/FormFeedback';
import FormValidation, { getFieldBorderClass } from '../components/FormValidation';
import { trackEvent } from '../lib/analytics';

interface InvestorsProps {
  navigate: (page: string) => void;
}

const Investors: React.FC<InvestorsProps> = ({ navigate }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    investorType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    website: '',
    investmentAmount: '',
    timeline: '',
    experience: '',
    platformInterest: '',
    geographicFocus: '',
    message: '',
    consent: false,
    newsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'loading' | 'success' | 'error'>('loading');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  const [formProgress, setFormProgress] = useState(0);

  // Validation en temps réel
  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    switch (name) {
      case 'investorType':
        if (!value.trim()) errors.investorType = 'Veuillez sélectionner un type d\'investisseur';
        break;
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'Le prénom est requis';
        } else if (value.trim().length < 2) {
          errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Le nom est requis';
        } else if (value.trim().length < 2) {
          errors.lastName = 'Le nom doit contenir au moins 2 caractères';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Format d\'email invalide';
        }
        break;
      case 'phone':
        if (value.trim() && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
          errors.phone = 'Format de téléphone invalide';
        }
        break;
      case 'website':
        if (value.trim() && !value.match(/^https?:\/\/.+/)) {
          errors.website = 'L\'URL doit commencer par http:// ou https://';
        }
        break;
      case 'investmentAmount':
        if (!value.trim()) errors.investmentAmount = 'Veuillez sélectionner un montant';
        break;
      case 'timeline':
        if (!value.trim()) errors.timeline = 'Veuillez sélectionner une timeline';
        break;
      case 'experience':
        if (!value.trim()) errors.experience = 'Veuillez sélectionner votre expérience';
        break;
      case 'platformInterest':
        if (!value.trim()) errors.platformInterest = 'Veuillez sélectionner votre intérêt';
        break;
      case 'message':
        if (!value.trim()) {
          errors.message = 'Le message est requis';
        } else if (value.trim().length < 20) {
          errors.message = 'Le message doit contenir au moins 20 caractères';
        } else if (value.length > 3000) {
          errors.message = 'Le message ne peut pas dépasser 3000 caractères';
        }
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: errors[name] || ''
    }));
    
    return !errors[name];
  };

  const getValidationState = (fieldName: string) => {
    const value = formData[fieldName] || '';
    const hasError = validationErrors[fieldName];
    const isTouched = touchedFields[fieldName];
    
    if (!isTouched) return { isValid: true, message: '', type: 'success' as const };
    
    if (hasError) {
      return { isValid: false, message: hasError, type: 'error' as const };
    }
    
    if (value.trim()) {
      return { isValid: true, message: 'Parfait !', type: 'success' as const };
    }
    
    return { isValid: true, message: '', type: 'success' as const };
  };

  const calculateFormProgress = () => {
    const requiredFields = ['investorType', 'firstName', 'lastName', 'email', 'investmentAmount', 'timeline', 'experience', 'platformInterest', 'message'];
    const filledFields = requiredFields.filter(field => formData[field]?.trim()).length;
    const progress = Math.round((filledFields / requiredFields.length) * 100);
    setFormProgress(progress);
    return progress;
  };

  const isFormValid = () => {
    const requiredFields = ['investorType', 'firstName', 'lastName', 'email', 'investmentAmount', 'timeline', 'experience', 'platformInterest', 'message'];
    return requiredFields.every(field => {
      const value = formData[field] || '';
      return value.trim() && !validationErrors[field];
    }) && formData.consent;
  };

  // SEO optimisé pour la page investisseurs
  React.useEffect(() => {
    document.title = "Investisseurs | Williams Jullin | Ulixai & SOS-Expat";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Opportunité d'investissement avec Williams Jullin. Écosystème Ulixai & SOS-Expat transformant l'expatriation pour 500K+ expatriés. Croissance forte, impact social mondial."
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider tous les champs
    const requiredFields = ['investorType', 'firstName', 'lastName', 'email', 'investmentAmount', 'timeline', 'experience', 'platformInterest', 'message'];
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      const isValid = validateField(field, formData[field] || '');
      if (!isValid) hasErrors = true;
      setTouchedFields(prev => ({ ...prev, [field]: true }));
    });
    
    if (hasErrors) {
      setShowFeedback(true);
      setFeedbackType('error');
      return;
    }

    // Afficher le feedback de chargement
    setShowFeedback(true);
    setFeedbackType('loading');
    setError('');
    setIsSubmitting(true);

    try {
      const investorData: InvestorFormData = {
        investorType: formData.investorType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        position: formData.position,
        website: formData.website,
        investmentAmount: formData.investmentAmount,
        timeline: formData.timeline,
        experience: formData.experience,
        platformInterest: formData.platformInterest,
        geographicFocus: formData.geographicFocus,
        message: formData.message,
        newsletter: formData.newsletter
      };

      console.log('💰 Soumission formulaire investisseur:', investorData);
      await submitInvestorForm(investorData);
      console.log('✅ Formulaire investisseur soumis avec succès');
      
      // Tracker l'événement de soumission
      await trackEvent('investor_form_submitted', {
        investorType: investorData.investorType,
        investmentAmount: investorData.investmentAmount,
        platformInterest: investorData.platformInterest
      });
      
      // Afficher le succès
      setFeedbackType('success');
      setIsSubmitting(false);
      setFormData({
        investorType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        website: '',
        investmentAmount: '',
        timeline: '',
        experience: '',
        platformInterest: '',
        geographicFocus: '',
        message: '',
        consent: false,
        newsletter: false
      });
      setTouchedFields({});
      setValidationErrors({});
      setFormProgress(0);
    } catch (err) {
      // Afficher l'erreur
      setFeedbackType('error');
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Marquer le champ comme touché et valider
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
    
    // Mettre à jour la progression
    setTimeout(() => calculateFormProgress(), 100);
  };

  const investorTypes = [
    { value: 'individual', label: t('investors.form.types.individual') },
    { value: 'family_office', label: t('investors.form.types.family_office') },
    { value: 'vc_fund', label: t('investors.form.types.vc_fund') },
    { value: 'pe_fund', label: t('investors.form.types.pe_fund') },
    { value: 'corporate', label: t('investors.form.types.corporate') },
    { value: 'angel', label: t('investors.form.types.angel') },
    { value: 'institutional', label: t('investors.form.types.institutional') },
    { value: 'other', label: t('investors.form.types.other') }
  ];

  const investmentRanges = [
    { value: '25k-50k', label: '€25K - €50K' },
    { value: '50k-100k', label: '€50K - €100K' },
    { value: '100k-250k', label: '€100K - €250K' },
    { value: '250k-500k', label: '€250K - €500K' },
    { value: '500k-1M', label: '€500K - €1M' },
    { value: '1M-5M', label: '€1M - €5M' },
    { value: '5M+', label: '€5M+' },
    { value: 'other', label: t('investors.form.range_other') }
  ];

  const timelines = [
    { value: 'immediate', label: t('investors.form.timelines.immediate') },
    { value: '1-3months', label: t('investors.form.timelines.short') },
    { value: '3-6months', label: t('investors.form.timelines.medium') },
    { value: '6-12months', label: t('investors.form.timelines.long') },
    { value: 'flexible', label: t('investors.form.timelines.flexible') }
  ];

  const platforms = [
    { value: 'both', label: t('investors.form.platforms.both') },
    { value: 'sos_expat', label: t('investors.form.platforms.sos_expat') },
    { value: 'ulixai', label: t('investors.form.platforms.ulixai') },
    { value: 'ecosystem', label: t('investors.form.platforms.ecosystem') }
  ];

  const experienceLevels = [
    { value: 'first_time', label: t('investors.form.experience.first_time') },
    { value: 'some_experience', label: t('investors.form.experience.some') },
    { value: 'experienced', label: t('investors.form.experience.experienced') },
    { value: 'professional', label: t('investors.form.experience.professional') }
  ];

  const getFeedbackContent = () => {
    switch (feedbackType) {
      case 'loading':
        return {
          title: 'Envoi en cours...',
          message: 'Votre demande d\'investissement est en cours d\'envoi. Veuillez patienter quelques instants.'
        };
      case 'success':
        return {
          title: 'Demande envoyée avec succès ! 🎉',
          message: 'Merci pour votre intérêt ! Williams vous contactera personnellement sous 24-48h pour discuter de cette opportunité d\'investissement.'
        };
      case 'error':
        return {
          title: 'Erreur lors de l\'envoi',
          message: error || 'Une erreur est survenue. Veuillez vérifier vos informations et réessayer.'
        };
      default:
        return { title: '', message: '' };
    }
  };

  const handleRetry = () => {
    setShowFeedback(false);
    setError('');
    setFeedbackType('loading');
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    if (feedbackType === 'success') {
      navigate('home');
    }
  };

  React.useEffect(() => {
    calculateFormProgress();
  }, [formData]);

  return (
    <div className="pt-24">
      {/* Form Feedback Modal */}
      <FormFeedback
        isVisible={showFeedback}
        type={feedbackType}
        title={getFeedbackContent().title}
        message={getFeedbackContent().message}
        onClose={handleCloseFeedback}
        onRetry={feedbackType === 'error' ? handleRetry : undefined}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-20 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Rocket className="w-5 h-5 text-blue-300" />
              <span className="text-blue-100 font-semibold">{t('investors.hero.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('investors.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8">
              {t('investors.hero.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">125K+</div>
                <div className="text-blue-200 text-sm">{t('investors.hero.stat_1')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">197</div>
                <div className="text-blue-200 text-sm">{t('investors.hero.stat_2')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-blue-200 text-sm">{t('investors.hero.stat_3')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('investors.vision.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('investors.vision.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('investors.problem.title')}</h3>
                    <div className="text-gray-600 space-y-3">
                      <p>• {t('investors.problem.point_1')}</p>
                      <p>• {t('investors.problem.point_2')}</p>
                      <p>• {t('investors.problem.point_3')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('investors.solution.title')}</h3>
                    <div className="text-gray-600 space-y-3">
                      <p>• {t('investors.solution.point_1')}</p>
                      <p>• {t('investors.solution.point_2')}</p>
                      <p>• {t('investors.solution.point_3')}</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('investors.community.title')}</h3>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">125K+</div>
                      <div className="text-gray-600 text-sm">{t('investors.community.stat_1')}</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">197</div>
                      <div className="text-gray-600 text-sm">{t('investors.community.stat_2')}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-700">
                      <strong>{t('investors.community.growth_title')}</strong><br/>
                      {t('investors.community.growth_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Plateformes */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('investors.platforms.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('investors.platforms.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SOS-Expat */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <Phone className="h-8 w-8" />
                    <h3 className="text-2xl font-bold">SOS-Expat</h3>
                  </div>
                  <p className="text-red-100 mb-4">{t('investors.platforms.sos.description')}</p>
                  <a
                    href="https://sos-expat.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-white hover:text-red-100 transition-colors duration-200"
                  >
                    <span>{t('investors.platforms.view_platform')}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.sos.feature_1')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.sos.feature_2')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.sos.feature_3')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.sos.feature_4')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-red-50 rounded-xl p-4">
                    <h4 className="font-bold text-red-800 mb-2">{t('investors.platforms.business_model')}</h4>
                    <p className="text-red-700 text-sm">
                      {t('investors.platforms.sos.business_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ulixai */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <MessageCircle className="h-8 w-8" />
                    <h3 className="text-2xl font-bold">Ulixai</h3>
                  </div>
                  <p className="text-blue-100 mb-4">{t('investors.platforms.ulixai.description')}</p>
                  <a
                    href="https://ulixai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200"
                  >
                    <span>{t('investors.platforms.view_platform')}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.ulixai.feature_1')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.ulixai.feature_2')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.ulixai.feature_3')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{t('investors.platforms.ulixai.feature_4')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 rounded-xl p-4">
                    <h4 className="font-bold text-blue-800 mb-2">{t('investors.platforms.business_model')}</h4>
                    <p className="text-blue-700 text-sm">
                      {t('investors.platforms.ulixai.business_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Investir */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('investors.why_invest.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('investors.why_invest.subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('investors.why_invest.growth.title')}</h3>
                    <p className="text-gray-700 mb-4">
                      {t('investors.why_invest.growth.description')}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">300%</div>
                        <div className="text-sm text-gray-600">{t('investors.why_invest.growth.metric_1')}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">85%</div>
                        <div className="text-sm text-gray-600">{t('investors.why_invest.growth.metric_2')}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">4.8/5</div>
                        <div className="text-sm text-gray-600">{t('investors.why_invest.growth.metric_3')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('investors.why_invest.team.title')}</h3>
                    <p className="text-gray-700">
                      {t('investors.why_invest.team.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('investors.why_invest.advantages.title')}</h3>
                    <p className="text-gray-700">
                      {t('investors.why_invest.advantages.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire Investisseur */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('investors.form.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('investors.form.subtitle')}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              {/* Barre de progression */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression du formulaire</span>
                  <span className="text-sm font-medium text-blue-600">{formProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${formProgress}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Résumé des erreurs */}
                {Object.keys(validationErrors).some(key => validationErrors[key]) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium text-red-800">Veuillez corriger les erreurs suivantes :</h4>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {Object.entries(validationErrors).map(([field, error]) => 
                        error ? <li key={field}>• {error}</li> : null
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Section 1: Informations Personnelles */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <span>{t('investors.form.section_personal')}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.first_name')} *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('firstName'), touchedFields.firstName)}`}
                        placeholder={t('investors.form.first_name_placeholder')}
                      />
                      <FormValidation
                        field="firstName"
                        value={formData.firstName}
                        validation={getValidationState('firstName')}
                        showValidation={touchedFields.firstName}
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.last_name')} *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('lastName'), touchedFields.lastName)}`}
                        placeholder={t('investors.form.last_name_placeholder')}
                      />
                      <FormValidation
                        field="lastName"
                        value={formData.lastName}
                        validation={getValidationState('lastName')}
                        showValidation={touchedFields.lastName}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('email'), touchedFields.email)}`}
                        placeholder={t('investors.form.email_placeholder')}
                      />
                      <FormValidation
                        field="email"
                        value={formData.email}
                        validation={getValidationState('email')}
                        showValidation={touchedFields.email}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('phone'), touchedFields.phone)}`}
                        placeholder={t('investors.form.phone_placeholder')}
                      />
                      <FormValidation
                        field="phone"
                        value={formData.phone}
                        validation={getValidationState('phone')}
                        showValidation={touchedFields.phone}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Type d'Investisseur */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <span>{t('investors.form.section_investor')}</span>
                  </h3>
                  
                  <div>
                    <label htmlFor="investorType" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('investors.form.investor_type')} *
                    </label>
                    <select
                      id="investorType"
                      name="investorType"
                      value={formData.investorType}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('investorType'), touchedFields.investorType)}`}
                    >
                      <option value="">{t('investors.form.select_investor_type')}</option>
                      {investorTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <FormValidation
                      field="investorType"
                      value={formData.investorType}
                      validation={getValidationState('investorType')}
                      showValidation={touchedFields.investorType}
                    />
                  </div>
                </div>

                {/* Section 3: Organisation */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <span>{t('investors.form.section_organization')}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.organization')}
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={t('investors.form.organization_placeholder')}
                      />
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.position')}
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={t('investors.form.position_placeholder')}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('investors.form.website')}
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('website'), touchedFields.website)}`}
                      placeholder={t('investors.form.website_placeholder')}
                    />
                    <FormValidation
                      field="website"
                      value={formData.website}
                      validation={getValidationState('website')}
                      showValidation={touchedFields.website}
                    />
                  </div>
                </div>

                {/* Section 4: Détails d'Investissement */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">4</span>
                    </div>
                    <span>{t('investors.form.section_investment')}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.investment_range')} *
                      </label>
                      <select
                        id="investmentAmount"
                        name="investmentAmount"
                        value={formData.investmentAmount}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('investmentAmount'), touchedFields.investmentAmount)}`}
                      >
                        <option value="">{t('investors.form.select_range')}</option>
                        {investmentRanges.map(range => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                      <FormValidation
                        field="investmentAmount"
                        value={formData.investmentAmount}
                        validation={getValidationState('investmentAmount')}
                        showValidation={touchedFields.investmentAmount}
                      />
                    </div>

                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.investment_timeline')} *
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('timeline'), touchedFields.timeline)}`}
                      >
                        <option value="">{t('investors.form.select_timeline')}</option>
                        {timelines.map(timeline => (
                          <option key={timeline.value} value={timeline.value}>
                            {timeline.label}
                          </option>
                        ))}
                      </select>
                      <FormValidation
                        field="timeline"
                        value={formData.timeline}
                        validation={getValidationState('timeline')}
                        showValidation={touchedFields.timeline}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('investors.form.previous_investments')} *
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('experience'), touchedFields.experience)}`}
                    >
                      <option value="">{t('investors.form.select_experience')}</option>
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    <FormValidation
                      field="experience"
                      value={formData.experience}
                      validation={getValidationState('experience')}
                      showValidation={touchedFields.experience}
                    />
                  </div>
                </div>

                {/* Section 5: Intérêt Spécifique */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">5</span>
                    </div>
                    <span>{t('investors.form.section_interest')}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="platformInterest" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.platform_interest')} *
                      </label>
                      <select
                        id="platformInterest"
                        name="platformInterest"
                        value={formData.platformInterest}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 ${getFieldBorderClass(getValidationState('platformInterest'), touchedFields.platformInterest)}`}
                      >
                        <option value="">{t('investors.form.select_platform')}</option>
                        {platforms.map(platform => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                      <FormValidation
                        field="platformInterest"
                        value={formData.platformInterest}
                        validation={getValidationState('platformInterest')}
                        showValidation={touchedFields.platformInterest}
                      />
                    </div>

                    <div>
                      <label htmlFor="geographicFocus" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('investors.form.geographic_focus')}
                      </label>
                      <input
                        type="text"
                        id="geographicFocus"
                        name="geographicFocus"
                        value={formData.geographicFocus}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={t('investors.form.geographic_focus_placeholder')}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 6: Message */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-sm">6</span>
                    </div>
                    <span>{t('investors.form.section_message')}</span>
                  </h3>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('investors.form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 resize-vertical ${getFieldBorderClass(getValidationState('message'), touchedFields.message)}`}
                      placeholder={t('investors.form.message_placeholder')}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <FormValidation
                        field="message"
                        value={formData.message}
                        validation={getValidationState('message')}
                        showValidation={touchedFields.message}
                      />
                      <span className={`text-xs ${formData.message.length > 2800 ? 'text-red-600' : 'text-gray-500'}`}>
                        {formData.message.length}/3000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 7: Consentements */}
                <div className="pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">7</span>
                    </div>
                    <span>{t('investors.form.section_consent')}</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                      />
                      <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                        {t('investors.form.consent')} *
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                      />
                      <label htmlFor="newsletter" className="text-sm text-gray-700 leading-relaxed">
                        {t('investors.form.newsletter_consent')}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className={`w-full font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isSubmitting || !isFormValid()
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                    <span>{isSubmitting ? t('investors.form.sending') : t('investors.form.submit')}</span>
                  </button>
                  
                  {!isFormValid() && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Veuillez remplir tous les champs obligatoires pour continuer
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Direct */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('investors.direct_contact.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('investors.direct_contact.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:williams@ulixai.com"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Mail size={20} />
                <span>{t('investors.direct_contact.email')}</span>
              </a>
              <a
                href="https://linkedin.com/in/williamsjullin"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <ExternalLink size={20} />
                <span>{t('investors.direct_contact.linkedin')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Investors;