import { describe, it, expect } from 'vitest';
import { validateInvestorForm, type InvestorFormData } from './investorService';

describe('Investor Service', () => {
  describe('validateInvestorForm', () => {
    it('should return no errors for valid data', () => {
      const validData: InvestorFormData = {
        investorType: 'individual',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        investmentAmount: '100k-250k',
        timeline: '3-6_months',
        experience: 'experienced',
        platformInterest: 'both_platforms',
        message: 'Interested in investing in your platforms'
      };
      
      const errors = validateInvestorForm(validData);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for missing required fields', () => {
      const invalidData: InvestorFormData = {
        investorType: '',
        firstName: '',
        lastName: '',
        email: '',
        investmentAmount: '',
        timeline: '',
        experience: '',
        platformInterest: '',
        message: ''
      };
      
      const errors = validateInvestorForm(invalidData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Le type d\'investisseur est requis');
      expect(errors).toContain('Le prénom est requis');
      expect(errors).toContain('Le nom est requis');
    });

    it('should validate email format', () => {
      const invalidEmailData: InvestorFormData = {
        investorType: 'individual',
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        investmentAmount: '100k-250k',
        timeline: '3-6_months',
        experience: 'experienced',
        platformInterest: 'both_platforms',
        message: 'Test message'
      };
      
      const errors = validateInvestorForm(invalidEmailData);
      expect(errors).toContain('Le format de l\'email est invalide');
    });

    it('should validate website URL format', () => {
      const invalidWebsiteData: InvestorFormData = {
        investorType: 'vc_fund',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        website: 'invalid-url',
        investmentAmount: '1M-2M',
        timeline: '1-3_months',
        experience: 'professional',
        platformInterest: 'ecosystem',
        message: 'Test message'
      };
      
      const errors = validateInvestorForm(invalidWebsiteData);
      expect(errors).toContain('Le format du site web est invalide (doit commencer par http:// ou https://)');
    });

    it('should accept valid website URLs', () => {
      const validWebsiteData: InvestorFormData = {
        investorType: 'vc_fund',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        website: 'https://example.com',
        investmentAmount: '1M-2M',
        timeline: '1-3_months',
        experience: 'professional',
        platformInterest: 'ecosystem',
        message: 'Test message'
      };
      
      const errors = validateInvestorForm(validWebsiteData);
      expect(errors).toHaveLength(0);
    });
  });
});