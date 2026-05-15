"use client";
import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
}

export default function SEOHead({ title, description, ogImage }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setOG = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setOG("og:title", title);
    setOG("og:description", description);
    setOG("og:url", window.location.href);
    if (ogImage) setOG("og:image", ogImage);

    // JSON-LD Breadcrumb
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Constitution RDC", item: "/" },
        { "@type": "ListItem", position: 2, name: title, item: window.location.href },
      ],
    };
    const scriptId = "json-ld-breadcrumb";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(breadcrumb);

    // Nettoyage
    return () => {
      const oldScript = document.getElementById(scriptId);
      if (oldScript) oldScript.remove();
    };
  }, [title, description, ogImage]);

  return null;
}
