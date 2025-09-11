import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

interface BlogProps {
  navigate: (page: string, postId?: string) => void;
}

const Blog: React.FC<BlogProps> = ({ navigate }) => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = [
    { key: 'all', label: t('blog.tags.all'), color: 'bg-gray-100 text-gray-800' },
    { key: 'visas', label: t('blog.topics.visas'), color: 'bg-blue-100 text-blue-800' },
    { key: 'banking', label: t('blog.topics.banking'), color: 'bg-green-100 text-green-800' },
    { key: 'housing', label: t('blog.topics.housing'), color: 'bg-purple-100 text-purple-800' },
    { key: 'healthcare', label: t('blog.topics.healthcare'), color: 'bg-red-100 text-red-800' },
    { key: 'culture', label: t('blog.topics.culture'), color: 'bg-yellow-100 text-yellow-800' },
    { key: 'tips', label: t('blog.topics.tips'), color: 'bg-indigo-100 text-indigo-800' }
  ];

  const blogPosts = [
    {
      id: 'visa-guide-europe',
      title: t('blog.posts.visa_guide.title'),
      excerpt: t('blog.posts.visa_guide.excerpt'),
      date: '2024-01-15',
      tags: ['visas', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'banking-digital-nomad',
      title: t('blog.posts.banking_nomad.title'),
      excerpt: t('blog.posts.banking_nomad.excerpt'),
      date: '2024-01-10',
      tags: ['banking', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'housing-berlin',
      title: t('blog.posts.housing_berlin.title'),
      excerpt: t('blog.posts.housing_berlin.excerpt'),
      date: '2024-01-05',
      tags: ['housing', 'culture'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'healthcare-expat',
      title: t('blog.posts.healthcare_expat.title'),
      excerpt: t('blog.posts.healthcare_expat.excerpt'),
      date: '2024-01-01',
      tags: ['healthcare', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'culture-shock',
      title: t('blog.posts.culture_shock.title'),
      excerpt: t('blog.posts.culture_shock.excerpt'),
      date: '2023-12-28',
      tags: ['culture', 'tips'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'moving-checklist',
      title: t('blog.posts.moving_checklist.title'),
      excerpt: t('blog.posts.moving_checklist.excerpt'),
      date: '2023-12-25',
      tags: ['tips', 'moving'],
      language: 'EN',
      image: 'https://images.pexels.com/photos/7464860/pexels-photo-7464860.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredPosts = selectedTag === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.tags.includes(selectedTag));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('blog.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {t('blog.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Tags Filter */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {tags.map((tag) => (
              <button
                key={tag.key}
                onClick={() => setSelectedTag(tag.key)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedTag === tag.key
                    ? 'bg-amber-600 text-white shadow-lg'
                    : `${tag.color} hover:shadow-md`
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {post.language}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                    <Calendar size={16} />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tagKey) => {
                      const tag = tags.find(t => t.key === tagKey);
                      return tag ? (
                        <span key={tagKey} className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}>
                          <Tag size={12} className="inline mr-1" />
                          {tag.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => navigate('blog', post.id)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    <span>{t('blog.read_more')}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">{t('blog.no_posts')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;