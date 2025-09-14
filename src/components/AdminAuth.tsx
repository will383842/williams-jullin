import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, LogOut, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdminAuthProps {
  user: any;
  onAuthChange: (user: any) => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ user, onAuthChange }) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Vérifier les custom claims pour l'admin
      const idTokenResult = await user.getIdTokenResult();

      if (idTokenResult.claims.admin) {
        onAuthChange(user);
      } else {
        setError(t('admin.auth.admin_required'));
        await signOut(auth);
      }
    } catch (error: any) {
      console.error(t('admin.auth.login_error'), error);
      if (error.code === 'auth/user-not-found') {
        setError(t('admin.auth.user_not_found'));
      } else if (error.code === 'auth/wrong-password') {
        setError(t('admin.auth.wrong_password'));
      } else if (error.code === 'auth/invalid-email') {
        setError(t('admin.auth.invalid_email'));
      } else {
        setError(t('admin.auth.login_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onAuthChange(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex-1">
          <p className="text-sm text-green-700">
            Connecté en tant qu'administrateur: <span className="font-medium">{user.email}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={16} />
          <span>{t('admin.auth.logout')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t('admin.header.title')}</h2>
        <p className="text-gray-600 mt-2">{t('admin.auth.secure_login_required')}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email administrateur
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="admin@williamsjullin.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{loading ? t('admin.auth.connecting') : t('admin.auth.sign_in')}</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Sécurité renforcée</span>
        </div>
        <p className="text-xs text-blue-700">
          L'accès administrateur nécessite des droits spéciaux configurés dans Firebase Auth.
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
