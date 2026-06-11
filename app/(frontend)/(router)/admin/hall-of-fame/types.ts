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

export const getDefaultSemesterData = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  if (month <= 1) return { year: year - 1, term: "B" };
  if (month >= 2 && month <= 5) return { year: year - 1, term: "C" };
  if (month >= 6 && month <= 9) return { year, term: "A" };
  return { year, term: "B" };
};