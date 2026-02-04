export interface GuestSpeaker {
  name: string;
  description: string;
  avatar_url: string;
  linkedIn_url: string;
}

export interface Podcast {
  _id: string;
  title: string;
  summary: string;
  publicationDate: string | Date;
  video_url: string;
  thumbnail_url: string; 
  guest_speaker: GuestSpeaker;
  labels: string[];
}