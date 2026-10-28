export interface Thumbnail {
  path: string;
  alt: string;
}
export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  status: "draft" | "approved" | "published" | "archived";
  featured: boolean;
  order: number;
  publishedAt: string | null;
  destination: { action: string; url: string };
  repositoryUrl: string | null;
  languages: string[];
  controls: string | null;
  limitations: string | null;
  approval: { url: string; note: string };
  release: { version: string | null; commit: string | null };
  thumbnail: Thumbnail | null;
  tags: string[];
  maturity: "released" | "public" | "evolving";
}
export interface Verification {
  id: string;
  url: string;
  finalUrl: string;
  status: number;
  checkedAt: string;
  method: string;
}
export interface Site {
  name: string;
  email: string;
  canonicalOrigin: string;
  description: string;
  designVersion: string;
  approvedBaseline: string;
  homepageCollection: string;
}
export interface Collection {
  id: string;
  title: string;
  type: "gallery" | "editorial";
  description: string;
  order: number;
}
export interface Article {
  id: string;
  collection: string;
  title: string;
  date: string;
  status: "draft" | "published";
  excerpt: string;
  tags: string[];
  cover: string | null;
  markdown: string;
  images: string[];
}
export interface Media {
  src: string;
  srcset: string;
  width: number;
  height: number;
  source: "cover" | "screenshot" | "article";
  fallback?: string;
  fallbackAlt?: string;
}
export interface RenderContext {
  favicon: string;
  site: Site;
  style: string;
  script: string;
  themeScript: string;
  images: Map<string, Media>;
  collections: Collection[];
  activeCollections: Set<string>;
}
