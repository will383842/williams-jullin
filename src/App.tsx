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
  const { i18n } = useTranslation();

  // Handle navigation
  const navigate = (page: string, postId?: string) => {
    setCurrentPage(page);
    if (postId) {
      setBlogPostId(postId);
    } else {
      setBlogPostId(null);
    }
    window.scrollTo(0, 0);
  };

  const setCurrentLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
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