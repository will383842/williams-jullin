import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ExternalLink, ChevronDown } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

interface HeaderProps {
  currentPage: string;
  navigate: (page: string) => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const languages = [
  { code: 'en', countryCode: 'GB', name: 'English' },
  { code: 'fr', countryCode: 'FR', name: 'Français' },
  { code: 'de', countryCode: 'DE', name: 'Deutsch' },
  { code: 'es', countryCode: 'ES', name: 'Español' },
  { code: 'pt', countryCode: 'PT', name: 'Português' },
  { code: 'ru', countryCode: 'RU', name: 'Русский' },
  { code: 'zh', countryCode: 'CN', name: '中文' }
];

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  navigate, 
  currentLanguage, 
  setCurrentLanguage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { t } = useTranslation();

  // Vérifier si on est en mode admin (combinaison de touches secrète)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Combinaison Ctrl+Shift+A pour activer le mode admin
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdminMode(true);
        console.log('🔐 Mode admin activé');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'story', label: t('nav.story') },
    { key: 'ulixai', label: t('nav.ulixai'), external: 'https://ulixai.com' },
    { key: 'sos-expat', label: t('nav.sos_expat'), external: 'https://sos-expat.com' },
    { key: 'blog', label: t('nav.blog') },
    ...(isAdminMode ? [{ key: 'admin', label: '🔐 Admin', adminOnly: true }] : []),
    { key: 'contact', label: t('nav.contact') }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl py-3 md:py-4' 
        : 'bg-slate-900/90 backdrop-blur-lg py-4 md:py-6'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('home')}
            className="cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl shadow-lg group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-black text-base md:text-lg lg:text-xl">WJ</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <div key={item.key} className="relative group">
                {item.adminOnly && (
                  <button
                    onClick={() => navigate(item.key)}
                    className={`text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm xl:text-base py-2 relative ${
                      currentPage === item.key ? 'text-white' : ''
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 rounded-full transition-all duration-300 ${
                      currentPage === item.key ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </button>
                )}
                {!item.adminOnly && item.external ? (
                  <a
                    href={item.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm xl:text-base py-2"
                  >
                    <span>{item.label}</span>
                    <ExternalLink size={12} className="xl:w-3.5 xl:h-3.5" />
                  </a>
                ) : !item.adminOnly && (
                  <button
                    onClick={() => navigate(item.key)}
                    className={`text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm xl:text-base py-2 relative ${
                      currentPage === item.key ? 'text-white' : ''
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 rounded-full transition-all duration-300 ${
                      currentPage === item.key ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 md:space-x-3 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-all duration-300 border border-slate-700/50 shadow-lg backdrop-blur-sm"
                aria-label={`Current language: ${currentLang.name}`}
              >
                <ReactCountryFlag
                  countryCode={currentLang.countryCode}
                  svg
                  style={{
                    width: '16px',
                    height: '12px',
                  }}
                  className="md:w-5 md:h-4"
                  title={currentLang.name}
                />
                <span className="hidden sm:block text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                  {currentLang.code}
                </span>
                <ChevronDown size={14} className="md:w-4 md:h-4 text-gray-400" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 md:mt-3 w-48 md:w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-slate-700/50 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`touch-button flex items-center space-x-3 md:space-x-4 w-full px-4 py-3 md:px-4 md:py-3 text-left hover:bg-slate-700/50 active:bg-slate-600/50 transition-colors duration-150 ${
                        currentLanguage === lang.code ? 'bg-slate-700/30 text-blue-300' : 'text-gray-300'
                      }`}
                      aria-label={`Switch to ${lang.name}`}
                      title={lang.name}
                    >
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: '16px',
                          height: '12px',
                        }}
                        className="md:w-5 md:h-4"
                      />
                      <span className="font-medium text-sm md:text-base">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden touch-button p-3 md:p-3 rounded-lg md:rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600/80 transition-colors duration-200 border border-slate-700/50"
            >
              {isMenuOpen ? <X size={20} className="md:w-6 md:h-6 text-white" /> : <Menu size={20} className="md:w-6 md:h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 md:mt-6 pb-4 md:pb-6 border-t border-slate-700/50">
            <div className="pt-4 md:pt-6 space-y-1 md:space-y-2">
              {navItems.map((item) => (
                <div key={item.key}>
                  {item.external ? (
                    <a
                      href={item.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-link flex items-center space-x-3 px-4 py-4 md:px-4 md:py-4 text-gray-300 hover:text-white hover:bg-slate-800/50 active:bg-slate-700/50 rounded-lg md:rounded-xl transition-all duration-200"
                    >
                      <span className="text-sm md:text-base font-medium">{item.label}</span>
                      <ExternalLink size={14} className="md:w-4 md:h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(item.key);
                        setIsMenuOpen(false);
                      }}
                      className={`touch-button block w-full text-left px-4 py-4 md:px-4 md:py-4 rounded-lg md:rounded-xl transition-all duration-200 text-sm md:text-base font-medium ${
                        currentPage === item.key 
                          ? 'text-white bg-slate-800/50' 
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/50 active:bg-slate-700/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;