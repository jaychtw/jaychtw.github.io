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
}
export interface RenderContext {
  site: Site;
  style: string;
  script: string;
  images: Map<string, string>;
}
