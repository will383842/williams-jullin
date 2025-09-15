// src/pages/Contact.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { submitContactForm, type ContactFormData } from '../services/contactService';
import FormFeedback from '../components/FormFeedback';
import FormValidation, { getFieldBorderClass } from '../components/FormValidation';

import { trackEvent } from '../lib/analytics';

import SEO from '../seo/SEO';
import { buildAlternates, canonical } from '../seo/helpers';
import { PATHS, LOCALES, type Locale } from '../router/paths';
import { metaContact } from '../seo/meta';


interface ContactProps {
  navigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ navigate }) => {
  // Au dÃ©but

  // === SEO locale & URLs ===
  const locale = (i18n?.language?.split('-')[0] ?? 'fr') as Locale;
  const bcp47 = locale === 'fr' ? 'fr-FR' : `${locale}-${locale.toUpperCase()}`;
  const alternates = buildAlternates(locale, 'contact');
  const can = canonical(locale, 'contact');
  const meta = metaContact(locale);
const { t, i18n } = useTranslation();

  // SEO (i18n)
  React.useEffect(() => {
    document.title = t('contact.seo.title');

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('contact.seo.description'));
    }
  }, [t]);

  const [formData, setFormData] = useState({
    purpose: '',
    fullName: '',
    email: '',
    title: '',
    message: '',
    country: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'loading' | 'success' | 'error'>('loading');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

  // Validation en temps rÃ©el
  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    switch (name) {
      case 'purpose':
        if (!value.trim()) {
          // - errors.purpose = 'Veuillez sÃ©lectionner un objet';
          // + errors.purpose = t('contact.validation.purpose_required');
          errors.purpose = t('contact.validation.purpose_required');
        }
        break;
      case 'fullName':
        if (!value.trim()) {
          // - 'Le nom complet est requis'
          errors.fullName = t('contact.validation.name_required');
        } else if (value.trim().length < 2) {
          // - errors.fullName = 'Le nom doit contenir au moins 2 caractÃ¨res';
          // + errors.fullName = t('contact.validation.name_min');
          errors.fullName = t('contact.validation.name_min');
        } else if (!/^[\p{L}\p{M}\s'’-]+$/u.test(value)) {
          // - 'Le nom ne peut contenir que des lettres, espaces et tirets'
          errors.fullName = t('contact.validation.name_charset');
        }
        break;
      case 'email':
        if (!value.trim()) {
          // - 'L'email est requis'
          errors.email = t('contact.validation.email_required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          // - 'Format d'email invalide'
          errors.email = t('contact.validation.email_invalid');
        }
        break;
      case 'message':
        if (!value.trim()) {
          errors.message = 'Le message est requis';
        } else if (value.trim().length < 10) {
          errors.message = 'Le message doit contenir au moins 10 caractÃ¨res';
        } else if (value.length > 2000) {
          errors.message = 'Le message ne peut pas dÃ©passer 2000 caractÃ¨res';
        }
        break;
      case 'title':
        if (value && value.length > 200) {
          errors.title = 'Le titre ne peut pas dÃ©passer 200 caractÃ¨res';
        }
        break;
      case 'country':
        if (value && value.length > 100) {
          errors.country = 'Le nom du pays ne peut pas dÃ©passer 100 caractÃ¨res';
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
    const value = (formData as any)[fieldName] || '';
    const hasError = validationErrors[fieldName];
    const isTouched = touchedFields[fieldName];
    
    if (!isTouched) return { isValid: true, message: '', type: 'success' as const };
    
    if (hasError) {
      return { isValid: false, message: hasError, type: 'error' as const };
    }
    
    if (value.trim()) {
      // - 'Parfait !'
      return { isValid: true, message: t('form.feedback.perfect'), type: 'success' as const };
    }
    
    return { isValid: true, message: '', type: 'success' as const };
  };

  const isFormValid = () => {
    const requiredFields = ['purpose', 'fullName', 'email', 'message'] as const;
    return requiredFields.every(field => {
      const value = (formData as any)[field] || '';
      return value.trim() && !validationErrors[field];
    }) && formData.consent;
  };

  const purposes = [
    { value: 'general', label: t('contact.purposes.general') },
    { value: 'media', label: t('contact.purposes.media') },
    { value: 'partnership', label: t('contact.purposes.partnership') },
    { value: 'investment', label: t('contact.purposes.investment') },
    { value: 'support', label: t('contact.purposes.support') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation complÃ¨te avant soumission
    const requiredFields = ['purpose', 'fullName', 'email', 'message'] as const;
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      const isValid = validateField(field, (formData as any)[field] || '');
      if (!isValid) hasErrors = true;
      setTouchedFields(prev => ({ ...prev, [field]: true }));
    });
    
    // Valider aussi les champs optionnels s'ils sont remplis
    if (formData.title) {
      const titleValid = validateField('title', formData.title);
      if (!titleValid) hasErrors = true;
      setTouchedFields(prev => ({ ...prev, title: true }));
    }
    
    if (formData.country) {
      const countryValid = validateField('country', formData.country);
      if (!countryValid) hasErrors = true;
      setTouchedFields(prev => ({ ...prev, country: true }));
    }
    
    // VÃ©rifier le consentement
    if (!formData.consent) {
      setShowFeedback(true);
      setFeedbackType('error');
      // - setError('Vous devez accepter le traitement de vos donnÃ©es personnelles');
      // + i18n
      setError(t('contact.validation.consent_required'));
      return;
    }
    
    if (hasErrors) {
      setShowFeedback(true);
      setFeedbackType('error');
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Afficher le feedback de chargement
    setShowFeedback(true);
    setFeedbackType('loading');
    setError('');
    setIsSubmitting(true);

    try {
      const contactData: ContactFormData = {
        purpose: formData.purpose,
        fullName: formData.fullName,
        email: formData.email,
        title: formData.title,
        message: formData.message,
        country: formData.country
      };

      console.log('ðŸ“§ Soumission formulaire contact:', contactData);
      await submitContactForm(contactData);
      console.log('âœ… Formulaire contact soumis avec succÃ¨s');
      
      // Tracker l'Ã©vÃ©nement de soumission
      await trackEvent('contact_form_submitted', {
        purpose: contactData.purpose,
        country: contactData.country || 'Unknown'
      });
      
      // Afficher le succÃ¨s
      setFeedbackType('success');
      setIsSubmitting(false);
      setFormData({
        purpose: '',
        fullName: '',
        email: '',
        title: '',
        message: '',
        country: '',
        consent: false
      });
      setTouchedFields({});
      setValidationErrors({});
    } catch (err) {
      // Afficher l'erreur
      setFeedbackType('error');
      setIsSubmitting(false);
      // Harmoniser avec la clÃ© i18n en fallback
      setError(err instanceof Error ? err.message : t('contact.toast.error_message'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Marquer le champ comme touchÃ© et valider
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, value as string);
  };

  const getFeedbackContent = () => {
    switch (feedbackType) {
      case 'loading':
        return {
          title: 'Envoi en cours...',
          message: 'Votre message est en cours d\'envoi. Veuillez patienter quelques instants.'
        };
      case 'success':
        return {
          // - 'Message envoyÃ© avec succÃ¨s ! ðŸŽ‰'
          title: t('contact.toast.success_title'),
          // - 'Merci pour votre message. Williams vous rÃ©pondra personnellement sous 24-48h.'
          message: t('contact.toast.success_message'),
        };
      case 'error':
        return {
          title: 'Erreur lors de l\'envoi',
          // - message: error || 'Une erreur est survenue. Veuillez vÃ©rifier vos informations et rÃ©essayer.'
          message: error || t('contact.toast.error_message'),
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

  return (
  <>
    <SEO
  title={meta.title}
  description={meta.desc}
  canonical={can}
  locale={bcp47}
  alternates={alternates}
/>

    <div className="pt-20 md:pt-24 bg-slate-50 min-h-screen">
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
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 md:py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">
              {t('contact.hero.title')}
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-blue-100 leading-relaxed px-4">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Form */}
              <div>
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center space-x-3 mb-6 md:mb-8">
                    <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                      {t('contact.form.title')}
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* RÃ©sumÃ© des erreurs */}
                    {Object.keys(validationErrors).some(key => (validationErrors as any)[key]) && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h4 className="font-medium text-red-800">{t('contact.form.errors_title')}</h4>
                        </div>
                        <ul className="text-sm text-red-700 space-y-1">
                          {Object.entries(validationErrors).map(([field, error]) => 
                            error ? <li key={field}>â€¢ {error}</li> : null
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Purpose */}
                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                        {t('contact.form.purpose')} *
                      </label>
                      <select
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-3 md:px-4 border rounded-lg md:rounded-xl focus:ring-2 transition-all durÃ©e-200 text-sm md:text-base ${getFieldBorderClass(getValidationState('purpose'), touchedFields.purpose)}`}
                      >
                        <option value="">{t('contact.form.select_purpose')}</option>
                        {purposes.map(purpose => (
                          <option key={purpose.value} value={purpose.value}>
                            {purpose.label}
                          </option>
                        ))}
                      </select>
                      <FormValidation
                        field="purpose"
                        value={formData.purpose}
                        validation={getValidationState('purpose')}
                        showValidation={touchedFields.purpose}
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                        {t('contact.form.full_name')} *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-3 md:px-4 border rounded-lg md:rounded-xl focus:ring-2 transition-all durÃ©e-200 text-sm md:text-base ${getFieldBorderClass(getValidationState('fullName'), touchedFields.fullName)}`}
                        placeholder={t('contact.form.full_name_placeholder')}
                      />
                      <FormValidation
                        field="fullName"
                        value={formData.fullName}
                        validation={getValidationState('fullName')}
                        showValidation={touchedFields.fullName}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-3 md:px-4 border rounded-lg md:rounded-xl focus:ring-2 transition-all durÃ©e-200 text-sm md:text-base ${getFieldBorderClass(getValidationState('email'), touchedFields.email)}`}
                        placeholder={t('contact.form.email_placeholder')}
                      />
                      <FormValidation
                        field="email"
                        value={formData.email}
                        validation={getValidationState('email')}
                        showValidation={touchedFields.email}
                      />
                    </div>

                    {/* Title/Subject */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                        {t('contact.form.subject')}
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-3 md:px-4 border border-slate-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all durÃ©e-200 text-sm md:text-base"
                        placeholder={t('contact.form.subject_placeholder')}
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                        {t('contact.form.country')}
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full px-3 py-3 md:px-4 border rounded-lg md:rounded-xl focus:ring-2 transition-all durÃ©e-200 text-sm md:text-base ${getFieldBorderClass(getValidationState('country'), touchedFields.country)}`}
                        placeholder={t('contact.form.country_placeholder')}
                      />
                      <FormValidation
                        field="country"
                        value={formData.country}
                        validation={getValidationState('country')}
                        showValidation={touchedFields.country}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                        {t('contact.form.message')} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className={`w-full px-3 py-3 md:px-4 border rounded-lg md:rounded-xl focus:ring-2 transition-all durÃ©e-200 resize-vertical text-sm md:text-base md:rows-6 ${getFieldBorderClass(getValidationState('message'), touchedFields.message)}`}
                        placeholder={t('contact.form.message_placeholder')}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <FormValidation
                          field="message"
                          value={formData.message}
                          validation={getValidationState('message')}
                          showValidation={touchedFields.message}
                        />
                        <span className={`text-xs ${formData.message.length > 1800 ? 'text-red-600' : 'text-gray-500'}`}>
                          {formData.message.length}/2000
                        </span>
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="flex items-start space-x-3 pt-2">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 flex-shrink-0"
                      />
                      <label htmlFor="consent" className="text-xs md:text-sm text-slate-700 leading-relaxed">
                        {t('contact.form.consent_text')} *
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !isFormValid()}
                      className={`touch-button w-full py-4 px-6 rounded-lg md:rounded-xl font-semibold text-white transition-all durÃ©e-200 text-base md:text-base flex items-center justify-center space-x-2 ${
                        isSubmitting || !isFormValid()
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                      <span>{isSubmitting ? t('contact.form.sending') : t('contact.form.send')}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info & Visual */}
              <div className="space-y-6 md:space-y-8 mt-8 lg:mt-0">
                {/* Contact Info */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl md:rounded-3xl p-6 md:p-8">
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <Mail className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                      {t('contact.info.title')}
                    </h2>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4 text-slate-700">
                    <p className="text-sm md:text-lg leading-relaxed">
                      {t('contact.info.description')}
                    </p>
                    
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm md:text-base">{t('contact.info.response_time')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm md:text-base">{t('contact.info.languages')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm md:text-base">{t('contact.info.availability')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Contact Williams Jullin"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-600/20"></div>
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">
                      {t('contact.visual.title')}
                    </h3>
                    <p className="text-blue-100 text-sm md:text-base">
                      {t('contact.visual.subtitle')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  
  </>
);
};

export default Contact;
