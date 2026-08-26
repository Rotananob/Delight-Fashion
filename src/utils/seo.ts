import { Metadata } from "next";

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "Delight Fashion | Premium Men's Apparel in Phnom Penh, Cambodia";
const DEFAULT_DESCRIPTION =
  "Delight Fashion is Phnom Penh's premier destination for luxury men's t-shirts, jackets, trousers, and inner/work wear. Experience sleek minimalist style with fast delivery across Cambodia.";
const DEFAULT_KEYWORDS = [
  "Delight Fashion",
  "Men's Fashion Phnom Penh",
  "Cambodia Clothing Store",
  "Men T-Shirts Cambodia",
  "Jackets Phnom Penh",
  "Men Pants Cambodia",
  "Luxury Men Fashion",
];
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://delightfashion.com.kh";

/**
 * Generates dynamic SEO Metadata for Next.js App Router pages.
 */
export function generateSeoMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = "/og-image.jpg",
  noIndex = false,
}: SeoProps = {}): Metadata {
  const fullTitle = title ? `${title} | Delight Fashion` : DEFAULT_TITLE;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl || SITE_URL,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: fullTitle,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl || SITE_URL,
      siteName: "Delight Fashion - Phnom Penh",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Generates Google Rich Snippet JSON-LD for Organization and Retail Store in Cambodia.
 */
export function getStoreJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Delight Fashion",
    image: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    telephone: "+855-012-345-678",
    address: {
      "@type": "PostalAddress",
      streetAddress: "St 271, Sangkat Tumnop Teuk",
      addressLocality: "Chamkar Mon",
      addressRegion: "Phnom Penh",
      addressCountry: "KH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "11.5564",
      longitude: "104.9282",
    },
    priceRange: "$$-$$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:30",
        closes: "20:30",
      },
    ],
  };
}
