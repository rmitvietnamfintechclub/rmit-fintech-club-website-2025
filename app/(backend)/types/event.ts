export interface IEvent {
  _id: string;
  name: string;
  description: string;
  posterUrl: string;
  date: Date;
  startTime: string;
  endTime: string;
  mode: "Online" | "Offline" | "Hybrid";
  location: string;
  audience: string[];
  agenda: string[];
  guest_speaker: {
    name: string;
    bio: string;
    avatar_url: string;
    linkedIn_url?: string;
  }[];
  partners: string[];
  registrationLink?: string;
  registrationDeadline?: Date;
  created_at?: Date;
  updated_at?: Date;
}
