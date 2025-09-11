import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ExternalLink, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  navigate: (page: string) => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'zh', flag: '🇨🇳', name: '中文' }
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
  const { t } = useTranslation();

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
    { key: 'ulixai', label: 'Ulixai.com', external: 'https://ulixai.com' },
    { key: 'sos-expat', label: 'SOS-Expat.com', external: 'https://sos-expat.com' },
    { key: 'blog', label: t('nav.blog') },
    { key: 'contact', label: t('nav.contact') }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl py-4' 
        : 'bg-slate-900/90 backdrop-blur-lg py-6'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('home')}
            className="text-2xl md:text-3xl font-bold text-white cursor-pointer hover:text-blue-300 transition-colors duration-300"
          >
            Williams Jullin
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.key} className="relative group">
                {item.external ? (
                  <a
                    href={item.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium text-base py-2"
                  >
                    <span>{item.label}</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <button
                    onClick={() => navigate(item.key)}
                    className={`text-gray-300 hover:text-white transition-colors duration-300 font-medium text-base py-2 relative ${
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
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-all duration-300 border border-slate-700/50 shadow-lg backdrop-blur-sm"
              >
                <span className="text-2xl">{currentLang.flag}</span>
                <span className="hidden sm:block text-sm font-semibold text-white uppercase tracking-wider">
                  {currentLang.code}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`flex items-center space-x-4 w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors duration-200 ${
                        currentLanguage === lang.code ? 'bg-slate-700/30 text-blue-300' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-colors duration-300 border border-slate-700/50"
            >
              {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-6 pb-6 border-t border-slate-700/50">
            <div className="pt-6 space-y-2">
              {navItems.map((item) => (
                <div key={item.key}>
                  {item.external ? (
                    <a
                      href={item.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-4 py-4 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                    >
                      <span className="text-base font-medium">{item.label}</span>
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(item.key);
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-4 rounded-xl transition-all duration-300 text-base font-medium ${
                        currentPage === item.key 
                          ? 'text-white bg-slate-800/50' 
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
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