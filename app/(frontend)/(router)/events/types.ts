export interface GuestSpeaker {
  name: string;
  bio: string;
  avatar_url: string;
  linkedIn_url?: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  posterUrl: string;
  date: string; 
  startTime: string;
  endTime: string;
  mode: "Online" | "Offline" | "Hybrid";
  location: string;
  audience: string[];
  agenda: string[];
  guest_speaker: GuestSpeaker[];
  partners: string[];
  registrationLink?: string;
  registrationDeadline?: string;
  created_at?: string; 
}