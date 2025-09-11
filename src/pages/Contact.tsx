import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, CheckCircle } from 'lucide-react';

interface ContactProps {
  navigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ navigate }) => {
  const { t } = useTranslation();
  
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

  const purposes = [
    { value: 'general', label: t('contact.purposes.general') },
    { value: 'media', label: t('contact.purposes.media') },
    { value: 'partnership', label: t('contact.purposes.partnership') },
    { value: 'investment', label: t('contact.purposes.investment') },
    { value: 'support', label: t('contact.purposes.support') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        purpose: '',
        fullName: '',
        email: '',
        title: '',
        message: '',
        country: '',
        consent: false
      });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (isSuccess) {
    return (
      <div className="pt-24">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('contact.success.title')}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t('contact.success.message')}
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  navigate('home');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('contact.success.back_home')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Form */}
              <div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <MessageCircle className="h-8 w-8 text-amber-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t('contact.form.title')}
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Purpose */}
                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.purpose')} *
                      </label>
                      <select
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">{t('contact.form.select_purpose')}</option>
                        {purposes.map(purpose => (
                          <option key={purpose.value} value={purpose.value}>
                            {purpose.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.full_name')} *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder={t('contact.form.full_name_placeholder')}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder={t('contact.form.email_placeholder')}
                      />
                    </div>

                    {/* Title/Subject */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.subject')} *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder={t('contact.form.subject_placeholder')}
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.country')}
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder={t('contact.form.country_placeholder')}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.message')} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                        placeholder={t('contact.form.message_placeholder')}
                      />
                    </div>

                    {/* Consent */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-1 h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <label htmlFor="consent" className="text-sm text-gray-700">
                        {t('contact.form.consent')} *
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-700 transform hover:scale-105'
                      }`}
                    >
                      {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info & Visual */}
              <div className="space-y-8">
                {/* Contact Info */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Mail className="h-8 w-8 text-amber-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t('contact.info.title')}
                    </h2>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="text-lg leading-relaxed">
                      {t('contact.info.description')}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        <span>{t('contact.info.response_time')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        <span>{t('contact.info.languages')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        <span>{t('contact.info.availability')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Contact Williams Jullin"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-600/20"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {t('contact.visual.title')}
                    </h3>
                    <p className="text-amber-100">
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
  );
};

export default Contact;