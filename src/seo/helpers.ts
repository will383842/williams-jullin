// src/seo/helpers.ts
import { BASE_URL, LOCALES, PATHS, type Locale } from '../router/paths';

export function buildAlternates(
  _locale: Locale,
  routeKey: keyof typeof PATHS['fr'],
  slug?: string
) {
  const links = LOCALES.map((l) => {
    const P = PATHS[l];
    const val = (P as any)[routeKey];
    const href = typeof val === 'function' ? val(slug ?? '') : val;
    return { hrefLang: l, href: `${BASE_URL}${href}` };
  });

  // x-default: version EN par défaut
  const Pdef = PATHS.en;
  const valDef = (Pdef as any)[routeKey];
  const hrefDef = typeof valDef === 'function' ? valDef(slug ?? '') : valDef;
  links.push({ hrefLang: 'x-default', href: `${BASE_URL}${hrefDef}` });

  return links;
}

export function canonical(
  locale: Locale,
  routeKey: keyof typeof PATHS['fr'],
  slug?: string
) {
  const P = PATHS[locale];
  const val = (P as any)[routeKey];
  const href = typeof val === 'function' ? val(slug ?? '') : val;
  return `${BASE_URL}${href}`;
}
