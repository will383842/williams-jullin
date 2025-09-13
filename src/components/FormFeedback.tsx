import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2, X } from 'lucide-react';

interface FormFeedbackProps {
  isVisible: boolean;
  type: 'loading' | 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}

const FormFeedback: React.FC<FormFeedbackProps> = ({
  isVisible,
  type,
  title,
  message,
  onClose,
  onRetry
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-yellow-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl border-2 ${getBackgroundColor()} max-w-md w-full mx-4 transform transition-all duration-300 scale-100`}>
        <div className="p-6 text-center">
          {/* Close button */}
          {type !== 'loading' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}

          {/* Icon */}
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {type === 'success' && (
              <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Parfait ! 🎉
              </button>
            )}

            {type === 'error' && (
              <>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Réessayer
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Fermer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFeedback;