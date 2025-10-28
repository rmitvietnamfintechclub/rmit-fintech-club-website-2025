export interface Reel {
  _id?: string;
  title: string;
  description: string;
  videoId: string;
  thumbnailUrl: string;
  publicationDate: Date;
  labels: string[];
  createdAt?: Date;
  updatedAt?: Date;
}