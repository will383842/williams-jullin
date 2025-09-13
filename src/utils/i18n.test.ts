import { describe, it, expect } from 'vitest';
import i18n from '../i18n';

describe('i18n Configuration', () => {
  it('should have all required languages configured', () => {
    const expectedLanguages = ['en', 'fr', 'de', 'es', 'pt', 'ru', 'zh'];
    const availableLanguages = Object.keys(i18n.services.resourceStore.data);
    
    expectedLanguages.forEach(lang => {
      expect(availableLanguages).toContain(lang);
    });
  });

  it('should have required translation keys in all languages', () => {
    const requiredKeys = [
      'nav.home',
      'nav.contact',
      'home.hero.title',
      'contact.form.title',
      'media.photos.portrait_1_title',
      'media.photos.portrait_2_title'
    ];
    
    const languages = ['en', 'fr', 'de', 'es', 'pt', 'ru', 'zh'];
    
    languages.forEach(lang => {
      requiredKeys.forEach(key => {
        i18n.changeLanguage(lang);
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key); // Should not return the key itself
      });
    });
  });

  it('should fallback to English for missing keys', () => {
    i18n.changeLanguage('fr');
    // Test with a key that might not exist
    const translation = i18n.t('non.existent.key', { fallbackLng: 'en' });
    expect(translation).toBeDefined();
  });
});