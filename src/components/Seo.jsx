import { useEffect } from "react";

export default function Seo({
  title,
  description,
  canonical = "https://pgihub.com/",
  schema = null,
}) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", description);

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonical);

    const existing = document.getElementById("page-schema");
    if (existing) existing.remove();

    if (schema) {
      const script = document.createElement("script");
      script.id = "page-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const node = document.getElementById("page-schema");
      if (node) node.remove();
    };
  }, [title, description, canonical, schema]);

  return null;
}

export const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PGI Hub",
  url: "https://pgihub.com/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://pgihub.com/analyze?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PGI Hub",
  url: "https://pgihub.com/",
  logo: "https://pgihub.com/favicon.svg",
};