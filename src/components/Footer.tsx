import React from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, Linkedin, Facebook, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Social */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-blue-300">
              Williams Jullin
            </div>
            <p className="text-blue-200 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-800 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-800 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-800 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.platforms')}</h3>
            <div className="space-y-2">
              <a
                href="https://ulixai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-200 hover:text-blue-300 transition-colors duration-200"
              >
                <span>Ulixai</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="https://sos-expat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-200 hover:text-blue-300 transition-colors duration-200"
              >
                <span>SOS-Expat</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Legal & Investors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.legal')}</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('investors')}
                className="block text-blue-200 hover:text-blue-300 transition-colors duration-200"
              >
                {t('footer.investors')}
              </button>
              <button
                onClick={() => navigate('privacy')}
                className="block text-blue-200 hover:text-blue-300 transition-colors duration-200"
              >
                {t('footer.privacy')}
              </button>
              <button
                onClick={() => navigate('legal')}
                className="block text-blue-200 hover:text-blue-300 transition-colors duration-200"
              >
                {t('footer.legal_notice')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300 text-sm">
          <p>&copy; {currentYear} Williams Jullin. {t('footer.rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;