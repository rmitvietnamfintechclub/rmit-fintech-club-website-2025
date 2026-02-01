export interface Honoree {
  _id: string;
  name: string;
  achievement: string;
  category: string;    
  photo_url: string;
  semester: string;
}

export const HOF_CATEGORIES = [
  "Club MVP",
  "Department MVP",
  "Project MVP",
  "Community Builder",
  "Rookie of the Semester",
  "Best Department",
  "Academic Ace",
];

export const parseSemester = (sem: string) => {
  const match = sem.match(/^(\d{4})([ABC])$/);
  if (!match) return { year: new Date().getFullYear(), term: "A" };
  return { year: parseInt(match[1]), term: match[2] };
};