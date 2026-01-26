export type ContentType = "news" | "insights" | "articles" | "projects";
export type CardModel = "feature" | "standard";

export type ContentItem = {
  type: ContentType;
  model: CardModel; // two models: feature | standard
  title: string;
  excerpt: string;
  slug: string;
  date: string; // YYYY-MM-DD
  readingTime: string; // e.g. "6 min read"
  tags: string[];
  image: string; // public path e.g. "/images/feature-1.webp"
  author?: string;
  body: string[]; // simple paragraphs for now (easy to edit)
};

export type TaxonomyItem = {
  title: string;
  slug: string;
  description: string;
};
