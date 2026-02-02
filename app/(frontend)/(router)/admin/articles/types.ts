export interface Article {
  _id: string;
  title: string;
  summary: string;
  content_url: string;
  illustration_url: string;
  authors: string[];
  labels: string[];
  publicationDate: string;
  createdAt?: string;
  updatedAt?: string;
}
