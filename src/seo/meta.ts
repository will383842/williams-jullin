// src/seo/meta.ts
import { type Locale } from '../router/paths';

// Helper: prend la valeur locale sinon retombe sur EN
function pick<T extends Record<string, any>>(map: T, l: Locale) {
  return map[l] ?? map.en;
}

export function metaHome(l: Locale) {
  const map = {
    fr: {
      title: 'Williams Jullin — Expert mondial de l’expatriation | 197 pays',
      desc: 'Conseils et solutions d’expatriation pour toutes nationalités et langues. 197 pays couverts.'
    },
    en: {
      title: 'Williams Jullin — Global Expat Expert | 197 countries',
      desc: 'Expatriation advice and solutions for all nationalities and languages. Coverage across 197 countries.'
    },
    de: {
      title: 'Williams Jullin — Expat-Experte weltweit | 197 Länder',
      desc: 'Beratung und Lösungen für Auswanderer in 197 Ländern.'
    },
    es: {
      title: 'Williams Jullin — Experto global en expatriación | 197 países',
      desc: 'Consejos y soluciones para expatriados en 197 países.'
    },
    pt: {
      title: 'Williams Jullin — Especialista global em expatriação | 197 países',
      desc: 'Orientação e soluções para expatriados em 197 países.'
    },
    ru: {
      title: 'Williams Jullin — Эксперт по экспатриации | 197 стран',
      desc: 'Консультации и решения для экспатов в 197 странах.'
    },
    zh: {
      title: 'Williams Jullin — 全球外派专家 | 覆盖197个国家',
      desc: '为各国各语人群提供外派咨询与解决方案，覆盖197个国家。'
    }
  } as const;
  return pick(map, l);
}

export function metaStory(l: Locale) {
  const map = {
    fr: { title: 'Mon histoire — Williams Jullin', desc: 'Le parcours, la vision et les valeurs de Williams Jullin.' },
    en: { title: 'My Story — Williams Jullin', desc: 'Williams Jullin’s background, vision and values.' },
    de: { title: 'Meine Geschichte — Williams Jullin', desc: 'Werdegang, Vision und Werte.' },
    es: { title: 'Mi historia — Williams Jullin', desc: 'Trayectoria, visión y valores.' },
    pt: { title: 'Minha história — Williams Jullin', desc: 'Trajetória, visão e valores.' },
    ru: { title: 'Моя история — Williams Jullin', desc: 'Путь, видение и ценности.' },
    zh: { title: '我的故事 — Williams Jullin', desc: '经历、愿景与价值观。' }
  } as const;
  return pick(map, l);
}

export function metaContact(l: Locale) {
  const map = {
    fr: { title: 'Contact — Williams Jullin', desc: 'Écrivez-nous pour vos projets d’expatriation et interventions.' },
    en: { title: 'Contact — Williams Jullin', desc: 'Get in touch about relocation projects and speaking.' },
    de: { title: 'Kontakt — Williams Jullin', desc: 'Kontakt für Projekte und Vorträge.' },
    es: { title: 'Contacto — Williams Jullin', desc: 'Contacto para proyectos y conferencias.' },
    pt: { title: 'Contato — Williams Jullin', desc: 'Fale conosco sobre projetos e palestras.' },
    ru: { title: 'Контакты — Williams Jullin', desc: 'Свяжитесь с нами по проектам и выступлениям.' },
    zh: { title: '联系 — Williams Jullin', desc: '关于项目与分享请联系我们。' }
  } as const;
  return pick(map, l);
}

export function metaMedia(l: Locale) {
  const map = {
    fr: { title: 'Médias — Williams Jullin', desc: 'Interviews, dossiers de presse et sujets d’expertise.' },
    en: { title: 'Media — Williams Jullin', desc: 'Interviews, press kits and expertise topics.' },
    de: { title: 'Medien — Williams Jullin', desc: 'Interviews, Pressematerial und Fachthemen.' },
    es: { title: 'Medios — Williams Jullin', desc: 'Entrevistas, kit de prensa y temas de experiencia.' },
    pt: { title: 'Mídia — Williams Jullin', desc: 'Entrevistas, press kit e temas de expertise.' },
    ru: { title: 'Медиа — Williams Jullin', desc: 'Интервью, пресс-материалы и темы экспертизы.' },
    zh: { title: '媒体 — Williams Jullin', desc: '采访、媒体资料与专业话题。' }
  } as const;
  return pick(map, l);
}

export function metaInvestors(l: Locale) {
  const map = {
    fr: { title: 'Investisseurs — Williams Jullin', desc: 'Vision, traction et opportunités d’investissement.' },
    en: { title: 'Investors — Williams Jullin', desc: 'Vision, traction and investment opportunities.' },
    de: { title: 'Investoren — Williams Jullin', desc: 'Vision, Traktion und Investitionschancen.' },
    es: { title: 'Inversores — Williams Jullin', desc: 'Visión, tracción y oportunidades de inversión.' },
    pt: { title: 'Investidores — Williams Jullin', desc: 'Visão, tração e oportunidades de investimento.' },
    ru: { title: 'Инвесторы — Williams Jullin', desc: 'Видение, динамика и инвестиционные возможности.' },
    zh: { title: '投资者 — Williams Jullin', desc: '愿景、成果与投资机会。' }
  } as const;
  return pick(map, l);
}

export function metaBlog(l: Locale) {
  const map = {
    fr: { title: 'Blog — Williams Jullin', desc: 'Guides, analyses et retours d’expérience pour mieux préparer votre expatriation.' },
    en: { title: 'Blog — Williams Jullin', desc: 'Guides, analyses and insights to plan your expatriation.' },
    de: { title: 'Blog — Williams Jullin', desc: 'Guides und Analysen rund um Auswanderung.' },
    es: { title: 'Blog — Williams Jullin', desc: 'Guías y análisis para preparar tu expatriación.' },
    pt: { title: 'Blog — Williams Jullin', desc: 'Guias e análises para sua expatriação.' },
    ru: { title: 'Блог — Williams Jullin', desc: 'Гайды и анализы по подготовке к переезду.' },
    zh: { title: '博客 — Williams Jullin', desc: '关于外派的指南与分析。' }
  } as const;
  return pick(map, l);
}
