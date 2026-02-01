export interface Member {
  _id: string;
  name: string;
  position: string;
  photo_url: string;
  linkedin_url?: string;
  generation: number;
  type: 'EB' | 'MB';
}

export type BoardType = 'EB' | 'MB';