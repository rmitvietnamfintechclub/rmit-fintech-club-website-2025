export interface Reel {
  _id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnailUrl: string;
  publicationDate: string | Date;
  labels: string[];
}