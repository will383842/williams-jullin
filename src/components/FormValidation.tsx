import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ValidationState {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface FormValidationProps {
  field: string;
  value: string;
  validation: ValidationState;
  showValidation: boolean;
}

const FormValidation: React.FC<FormValidationProps> = ({
  field,
  value,
  validation,
  showValidation
}) => {
  if (!showValidation) return null;

  const getIcon = () => {
    switch (validation.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (validation.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      default:
        return 'text-gray-700';
    }
  };

  const getBorderColor = () => {
    switch (validation.type) {
      case 'success':
        return 'border-green-300 focus:border-green-500 focus:ring-green-500';
      case 'error':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500';
      case 'warning':
        return 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500';
      default:
        return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
  };

  return (
    <div className={`flex items-center space-x-2 mt-1 text-sm ${getTextColor()}`}>
      {getIcon()}
      <span>{validation.message}</span>
    </div>
  );
};

export const getFieldBorderClass = (validation: ValidationState, showValidation: boolean): string => {
  if (!showValidation) return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  
  switch (validation.type) {
    case 'success':
      return 'border-green-300 focus:border-green-500 focus:ring-green-500';
    case 'error':
      return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    case 'warning':
      return 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500';
    default:
      return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  }
};

export default FormValidation;