import { describe, it, expect } from 'vitest';
import { validateContactForm, type ContactFormData } from './contactService';

describe('Contact Service', () => {
  describe('validateContactForm', () => {
    it('should return no errors for valid data', () => {
      const validData: ContactFormData = {
        purpose: 'general',
        fullName: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message'
      };
      
      const errors = validateContactForm(validData);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for missing required fields', () => {
      const invalidData: ContactFormData = {
        purpose: '',
        fullName: '',
        email: '',
        message: ''
      };
      
      const errors = validateContactForm(invalidData);
      expect(errors).toContain('Purpose is required');
      expect(errors).toContain('Full name is required');
      expect(errors).toContain('Email is required');
      expect(errors).toContain('Message is required');
    });

    it('should validate email format', () => {
      const invalidEmailData: ContactFormData = {
        purpose: 'general',
        fullName: 'John Doe',
        email: 'invalid-email',
        message: 'Test message'
      };
      
      const errors = validateContactForm(invalidEmailData);
      expect(errors).toContain('Email format is invalid');
    });

    it('should accept optional fields', () => {
      const dataWithOptionals: ContactFormData = {
        purpose: 'general',
        fullName: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
        title: 'Optional title',
        country: 'France'
      };
      
      const errors = validateContactForm(dataWithOptionals);
      expect(errors).toHaveLength(0);
    });
  });
});