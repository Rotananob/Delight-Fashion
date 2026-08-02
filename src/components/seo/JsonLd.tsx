import React from "react";

export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Server/Client safe JSON-LD Rich Snippets injector for Google E-Commerce SEO.
 */
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
