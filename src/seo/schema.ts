// src/seo/schema.ts
export const personSchema = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Williams Jullin",
  "description": "Expert mondial en expatriation et mobilité internationale.",
  "url": "https://williamsjullin.com",
  "image": "https://williamsjullin.com/Williams-jullin.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/",
    "https://x.com/",
    "https://facebook.com/"
  ],
  "knowsLanguage": ["fr","en","de","es","pt","ru","zh"]
});

export const websiteSchema = (inLanguage: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://williamsjullin.com",
  "inLanguage": inLanguage,
  "name": "Williams Jullin"
});

export const articleSchema = (args: {
  headline: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  inLanguage: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": args.headline,
  "datePublished": args.datePublished,
  "dateModified": args.dateModified ?? args.datePublished,
  "image": args.image,
  "inLanguage": args.inLanguage,
  "mainEntityOfPage": args.url,
  "author": { "@type": "Person", "name": "Williams Jullin" },
  "publisher": { "@type": "Person", "name": "Williams Jullin" }
});

