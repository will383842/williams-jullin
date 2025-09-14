import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  Upload, 
  Image as ImageIcon,
  Calendar,
  Tag,
  Globe,
  FileText
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  lang: string;
  imageUrl: string;
  publishedAt: any;
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
}

const BlogEditor: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    lang: 'fr',
    imageUrl: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsSnapshot = await getDocs(
        query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      );
      
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      
      setPosts(postsData);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      setEditingPost(prev => ({
        ...prev,
        imageUrl: downloadURL
      }));
    } catch (error) {
      console.error('Erreur upload image:', error);
    }
    setUploadingImage(false);
  };

  const savePost = async () => {
    if (!editingPost.title || !editingPost.content) return;
    
    setLoading(true);
    try {
      const slug = editingPost.slug || generateSlug(editingPost.title);
      const postData = {
        ...editingPost,
        slug,
        tags: editingPost.tags || [],
        updatedAt: serverTimestamp()
      };

      if (editingPost.id) {
        // Mise à jour
        await updateDoc(doc(db, 'posts', editingPost.id), postData);
      } else {
        // Création
        await addDoc(collection(db, 'posts'), {
          ...postData,
          createdAt: serverTimestamp()
        });
      }

      setIsEditing(false);
      setEditingPost({
        title: '',
        excerpt: '',
        content: '',
        tags: [],
        lang: 'fr',
        imageUrl: '',
        status: 'draft'
      });
      loadPosts();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
    setLoading(false);
  };

  const publishPost = async (postId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const updateData: any = { 
        status: newStatus,
        updatedAt: serverTimestamp()
      };
      
      if (newStatus === 'published') {
        updateData.publishedAt = serverTimestamp();
      }
      
      await updateDoc(doc(db, 'posts', postId), updateData);
      loadPosts();
    } catch (error) {
      console.error('Erreur publication:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm(t('admin.blog.confirm_delete'))) return;
    
    try {
      await deleteDoc(doc(db, 'posts', postId));
      loadPosts();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const editPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
  };

  const addTag = (tag: string) => {
    if (tag && !editingPost.tags?.includes(tag)) {
      setEditingPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditingPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion du Blog</h2>
          <p className="text-gray-600">Créer et gérer les articles du blog</p>
        </div>
        
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Nouvel Article</span>
        </button>
      </div>

      {/* Éditeur */}
      {isEditing && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingPost.id ? 'Modifier l\'article' : 'Nouvel article'}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={editingPost.slug || generateSlug(editingPost.title || '')}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="url-de-l-article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extrait
                </label>
                <textarea
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Résumé de l'article..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select
                    value={editingPost.lang || 'fr'}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, lang: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={editingPost.status || 'draft'}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>
              </div>

              {/* Upload image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-2 transition-colors"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Upload size={16} />
                    )}
                    <span>{uploadingImage ? 'Upload...' : 'Upload Image'}</span>
                  </label>
                  
                  {editingPost.imageUrl && (
                    <img
                      src={editingPost.imageUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingPost.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  {['visas', 'banking', 'housing', 'healthcare', 'culture', 'tips'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Éditeur de contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu (Markdown)
              </label>
              <textarea
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Écrivez votre article en Markdown..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setEditingPost(prev => ({ ...prev, status: 'draft' }))}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Sauver Brouillon</span>
              </button>
              
              <button
                onClick={savePost}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={16} />
                )}
                <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des articles */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Articles existants</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {post.lang.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>
                        {post.publishedAt 
                          ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString()
                          : 'Non publié'
                        }
                      </span>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag size={14} />
                        <span>{post.tags.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => editPost(post)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  
                  <button
                    onClick={() => publishPost(post.id, post.status)}
                    className={`p-2 rounded-lg transition-colors ${
                      post.status === 'published'
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={post.status === 'published' ? 'Dépublier' : 'Publier'}
                  >
                    {post.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun article créé</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Créer le premier article
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;