// Audit complet du système i18n pour détecter les traductions manquantes

export interface I18nAuditResult {
  page: string;
  component: string;
  missingKeys: string[];
  language: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface I18nCompleteness {
  language: string;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  completeness: number;
}

export class I18nAuditor {
  private results: I18nAuditResult[] = [];
  
  // Clés critiques qui doivent être traduites dans toutes les langues
  private criticalKeys = [
    // Navigation
    'nav.home', 'nav.story', 'nav.blog', 'nav.contact',
    
    // Page d'accueil
    'home.hero.title', 'home.hero.subtitle', 'home.stats.expats_helped',
    'home.mission.title', 'home.solutions.title',
    
    // Page contact
    'contact.hero.title', 'contact.form.title', 'contact.form.purpose',
    'contact.form.full_name', 'contact.form.email', 'contact.form.message',
    'contact.form.send', 'contact.form.sending',
    
    // Page investisseurs
    'investors.hero.title', 'investors.form.title', 'investors.form.subtitle',
    'investors.form.section_personal', 'investors.form.section_investor',
    'investors.form.section_organization', 'investors.form.section_investment',
    'investors.form.section_interest', 'investors.form.section_message',
    'investors.form.section_consent',
    'investors.form.first_name', 'investors.form.last_name',
    'investors.form.email', 'investors.form.phone',
    'investors.form.investor_type', 'investors.form.select_investor_type',
    'investors.form.organization', 'investors.form.position',
    'investors.form.website', 'investors.form.investment_range',
    'investors.form.investment_timeline', 'investors.form.previous_investments',
    'investors.form.platform_interest', 'investors.form.geographic_focus',
    'investors.form.message', 'investors.form.consent',
    'investors.form.newsletter_consent', 'investors.form.submit',
    'investors.form.sending',
    
    // Types d'investisseurs
    'investors.form.types.individual', 'investors.form.types.family_office',
    'investors.form.types.vc_fund', 'investors.form.types.pe_fund',
    'investors.form.types.corporate', 'investors.form.types.angel',
    'investors.form.types.institutional', 'investors.form.types.other',
    
    // Timelines
    'investors.form.timelines.immediate', 'investors.form.timelines.short',
    'investors.form.timelines.medium', 'investors.form.timelines.long',
    'investors.form.timelines.flexible',
    
    // Expérience
    'investors.form.experience.first_time', 'investors.form.experience.some',
    'investors.form.experience.experienced', 'investors.form.experience.professional',
    
    // Plateformes
    'investors.form.platforms.both', 'investors.form.platforms.sos_expat',
    'investors.form.platforms.ulixai', 'investors.form.platforms.ecosystem',
    
    // Placeholders
    'investors.form.first_name_placeholder', 'investors.form.last_name_placeholder',
    'investors.form.email_placeholder', 'investors.form.phone_placeholder',
    'investors.form.organization_placeholder', 'investors.form.position_placeholder',
    'investors.form.website_placeholder', 'investors.form.geographic_focus_placeholder',
    'investors.form.message_placeholder',
    
    // Sélecteurs
    'investors.form.select_range', 'investors.form.select_timeline',
    'investors.form.select_experience', 'investors.form.select_platform',
    
    // Succès
    'investors.success.title', 'investors.success.message', 'investors.success.back_home',
    
    // Contact direct
    'investors.direct_contact.title', 'investors.direct_contact.subtitle',
    'investors.direct_contact.email', 'investors.direct_contact.linkedin',
    
    // Blog
    'blog.hero.title', 'blog.hero.subtitle', 'blog.tags.all',
    'blog.topics.visas', 'blog.topics.banking', 'blog.topics.housing',
    'blog.topics.healthcare', 'blog.topics.culture', 'blog.topics.tips',
    'blog.read_more', 'blog.back_to_blog', 'blog.share',
    
    // Story
    'story.hero.title_1', 'story.hero.title_2', 'story.hero.subtitle',
    'story.timeline.title', 'story.values.title',
    
    // Media
    'media.hero.title', 'media.bio.short_title', 'media.bio.long_title',
    'media.topics.title', 'media.press.title', 'media.photos.title',
    
    // Footer
    'footer.description', 'footer.platforms', 'footer.investors',
    'footer.rights_reserved'
  ];

  auditTranslationCompleteness(i18nInstance: any): I18nCompleteness[] {
    const languages = ['en', 'fr', 'de', 'es', 'pt', 'ru', 'zh'];
    const results: I18nCompleteness[] = [];

    languages.forEach(lang => {
      const store = i18nInstance.services.resourceStore;
      const translations = store.data[lang]?.translation || {};
      
      let translatedCount = 0;
      const missingKeys: string[] = [];

      this.criticalKeys.forEach(key => {
        const value = this.getNestedValue(translations, key);
        if (value && value !== key) {
          translatedCount++;
        } else {
          missingKeys.push(key);
        }
      });

      const completeness = Math.round((translatedCount / this.criticalKeys.length) * 100);

      results.push({
        language: lang,
        totalKeys: this.criticalKeys.length,
        translatedKeys: translatedCount,
        missingKeys,
        completeness
      });
    });

    return results;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  generateReport(completenessResults: I18nCompleteness[]): string {
    let report = `🌍 RAPPORT D'AUDIT I18N COMPLET\n`;
    report += `=====================================\n\n`;

    completenessResults.forEach(result => {
      const status = result.completeness >= 95 ? '✅' : result.completeness >= 80 ? '⚠️' : '❌';
      report += `${status} ${result.language.toUpperCase()}: ${result.completeness}% (${result.translatedKeys}/${result.totalKeys})\n`;
      
      if (result.missingKeys.length > 0) {
        report += `   Clés manquantes: ${result.missingKeys.slice(0, 5).join(', ')}`;
        if (result.missingKeys.length > 5) {
          report += ` (+${result.missingKeys.length - 5} autres)`;
        }
        report += `\n`;
      }
      report += `\n`;
    });

    return report;
  }
}

export const runI18nAudit = (i18nInstance: any) => {
  const auditor = new I18nAuditor();
  return auditor.auditTranslationCompleteness(i18nInstance);
};