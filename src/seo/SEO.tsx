// src/seo/SEO.tsx
import { Helmet } from 'react-helmet-async';

type Alt = { hrefLang: string; href: string };
type Props = {
  title: string;
  description: string;
  canonical: string;
  locale: string; // BCP-47
  alternates: Alt[];
  ogImage?: string;
  robots?: string;
  jsonLd?: object[];
};

export default function SEO({
  title, description, canonical, locale, alternates,
  ogImage, robots = 'index,follow', jsonLd = []
}: Props) {
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <link rel="canonical" href={canonical} />

      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* hreflang */}
      {alternates.map((alt) => (
        <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}

      {/* Langue HTML */}
      <html lang={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD */}
      {jsonLd.map((block, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
    </Helmet>
  );
}
