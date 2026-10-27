import { useEffect } from "react";
import { SITE } from "../../config/siteConfig";

/** Sets <title>, meta description, canonical, OG tags and optional JSON-LD for a page. */
export function useSeo({ title, description, path = "/", image = "/media/bg-ambient-1.jpg", jsonLd, noindex = false }) {
  useEffect(() => {
    const full = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
    document.title = full;
    const url = SITE.url.replace(/\/$/, "") + path;
    const set = (sel, attr, key, val) => {
      let el = document.head.querySelector(sel);
      if (!el) { el = document.createElement(sel.startsWith("link") ? "link" : "meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute(sel.startsWith("link") ? "href" : "content", val);
    };
    set('meta[name="description"]', "name", "description", description);
    set('meta[name="robots"]', "name", "robots", noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large");
    set('link[rel="canonical"]', "rel", "canonical", url);
    set('meta[property="og:title"]', "property", "og:title", full);
    set('meta[property="og:description"]', "property", "og:description", description);
    set('meta[property="og:url"]', "property", "og:url", url);
    set('meta[property="og:image"]', "property", "og:image", SITE.url.replace(/\/$/, "") + image);
    let ld;
    if (jsonLd) {
      ld = document.createElement("script"); ld.type = "application/ld+json"; ld.id = "ld-page";
      ld.text = JSON.stringify(jsonLd); document.head.appendChild(ld);
    }
    return () => { if (ld) ld.remove(); };
  }, [title, description, path, image, jsonLd, noindex]);
}
