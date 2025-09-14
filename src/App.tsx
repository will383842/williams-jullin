// src/App.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyStory from './pages/MyStory';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Investors from './pages/Investors';
import Admin from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [blogPostId, setBlogPostId] = useState<string | null>(null);
  const { i18n } = useTranslation(); // ✅ récupère i18n

  // Deep-link: ouvre directement l’admin si l’URL est /admin
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  // Handle navigation
  const navigate = (page: string, postId?: string) => {
    setCurrentPage(page);
    if (postId) {
      setBlogPostId(postId);
    } else {
      setBlogPostId(null);
    }
    window.scrollTo(0, 0);
    // (Optionnel) mets l’URL "propre" quand on navigue
    if (page === 'admin') {
      window.history.replaceState({}, '', '/admin');
    } else {
      window.history.replaceState({}, '', '/');
    }
  };

  // ✅ changement de langue : i18n + persistance + <html lang>
  const setCurrentLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang); // persistance explicite
    document.documentElement.lang = lang;     // <html lang="...">
  };

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/blog/')) {
      const postId = path.replace('/blog/', '');
      setCurrentPage('blog');
      setBlogPostId(postId);
    } else if (path === '/mon-histoire') {
      setCurrentPage('story');
    } else if (path === '/blog') {
      setCurrentPage('blog');
    } else if (path === '/media') {
      setCurrentPage('media');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/investors') {
      setCurrentPage('investors');
    } else if (path === '/admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // ✅ Mount: synchronise <html lang> et persiste la langue courante
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    localStorage.setItem('i18nextLng', i18n.language);
  }, []); // mount only

  // ✅ À chaque changement de langue: maj <html lang> pour SEO/a11y
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const renderPage = () => {
    switch (currentPage) {
      case 'story':
        return <MyStory navigate={navigate} />;
      case 'blog':
        if (blogPostId) {
          return <BlogPost navigate={navigate} postId={blogPostId} />;
        }
        return <Blog navigate={navigate} />;
      case 'media':
        return <Media navigate={navigate} />;
      case 'contact':
        return <Contact navigate={navigate} />;
      case 'investors':
        return <Investors navigate={navigate} />;
      case 'admin':
        return <Admin navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentPage={currentPage}
        navigate={navigate}
        currentLanguage={i18n.language}
        setCurrentLanguage={setCurrentLanguage}
      />
      <main>
        {renderPage()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
