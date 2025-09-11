import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface BlogPostProps {
  navigate: (page: string) => void;
  postId: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ navigate, postId }) => {
  const { t } = useTranslation();
  
  // Mock blog post data - in a real app, this would come from an API
  const blogPost = {
    id: postId,
    title: t('blog.posts.visa_guide.title'),
    content: t('blog.posts.visa_guide.content'),
    date: '2024-01-15',
    tags: ['visas', 'tips'],
    language: 'EN',
    image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '8 min read'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = `${window.location.origin}/blog/${postId}`;
  const shareTitle = blogPost.title;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'hover:bg-sky-500'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-700'
    }
  ];

  return (
    <div className="pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('blog')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>{t('blog.back_to_blog')}</span>
        </button>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(blogPost.date)}</span>
              </div>
              <span>•</span>
              <span>{blogPost.readTime}</span>
              <span>•</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                {blogPost.language}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 font-medium mr-2">
                <Share2 size={16} className="inline mr-1" />
                {t('blog.share')}
              </span>
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg bg-gray-100 text-gray-600 ${link.color} hover:text-white transition-colors duration-200`}
                  title={`Share on ${link.name}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blogPost.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blogPost.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                <Tag size={12} className="inline mr-1" />
                {t(`blog.topics.${tag}`)}
              </span>
            ))}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              <p className="text-xl text-gray-600 mb-8 font-medium">
                Moving to a new country can be one of life's most exciting adventures, but navigating the visa process doesn't have to be overwhelming. This comprehensive guide will walk you through everything you need to know about obtaining visas for European countries.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding Visa Types</h2>
              <p>
                European countries offer various types of visas depending on your purpose of visit. The most common categories include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tourist Visas:</strong> For short-term visits up to 90 days</li>
                <li><strong>Work Visas:</strong> For employment purposes with specific employer sponsorship</li>
                <li><strong>Student Visas:</strong> For educational pursuits at recognized institutions</li>
                <li><strong>Business Visas:</strong> For short-term business activities</li>
                <li><strong>Residence Permits:</strong> For long-term stays exceeding 90 days</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Schengen Agreement</h2>
              <p>
                One of the most important concepts to understand is the Schengen Area, which allows free movement between 27 European countries with a single visa. This means that once you have a Schengen visa, you can travel freely within all member countries during your authorized stay period.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Essential Documents</h2>
              <p>
                Regardless of the visa type, you'll typically need:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Valid passport with at least 6 months remaining validity</li>
                <li>Completed visa application form</li>
                <li>Recent passport-sized photographs</li>
                <li>Travel insurance covering €30,000 minimum</li>
                <li>Proof of accommodation</li>
                <li>Financial statements showing sufficient funds</li>
                <li>Flight itinerary or travel bookings</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Country-Specific Requirements</h2>
              <p>
                While the Schengen area has standardized many requirements, each country may have specific additional requirements. For example:
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Pro Tip</h3>
                <p className="text-blue-800">
                  Always check the specific requirements for your destination country, as regulations can change frequently. Consider consulting with the embassy or consulate directly for the most up-to-date information.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Timeline and Planning</h2>
              <p>
                Visa processing times can vary significantly depending on your nationality, the type of visa, and the time of year. Generally, you should:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Apply 3-4 weeks before your intended travel date</li>
                <li>Schedule appointments well in advance, especially during peak seasons</li>
                <li>Prepare all documents thoroughly to avoid delays</li>
                <li>Consider premium processing services if available and needed</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Mistakes to Avoid</h2>
              <p>
                Based on my experience helping thousands of expats, here are the most common mistakes that can derail your visa application:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Incomplete or incorrectly filled application forms</li>
                <li>Insufficient financial documentation</li>
                <li>Inadequate travel insurance coverage</li>
                <li>Missing or expired supporting documents</li>
                <li>Applying to the wrong embassy or consulate</li>
              </ul>

              <div className="bg-yellow-50 p-6 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Note</h3>
                <p className="text-yellow-800">
                  Visa denials can affect future applications, so it's crucial to get everything right the first time. When in doubt, seek professional assistance or consult with experienced expats who have successfully navigated the process.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
              <p>
                Once you have your visa approved, the real adventure begins! Remember to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register with local authorities within the required timeframe</li>
                <li>Set up essential services like banking and healthcare</li>
                <li>Consider long-term residence options if you plan to stay</li>
                <li>Connect with local expat communities for support and networking</li>
              </ul>

              <p className="mt-8 text-lg">
                The visa process might seem daunting at first, but with proper preparation and understanding of the requirements, you'll be well on your way to your European adventure. Remember, every successful expat started exactly where you are now – with a dream and the determination to make it happen.
              </p>
            </div>
          </div>

          {/* Author Box */}
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-start space-x-4">
              <img
                src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Williams Jullin"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Williams Jullin</h3>
                <p className="text-gray-600 mb-4">
                  {t('blog.author_bio')}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('story')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {t('blog.read_story')}
                  </button>
                  <button
                    onClick={() => navigate('contact')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {t('blog.get_in_touch')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;