export interface HallOfFameMember {
  name: string;
  achievement?: string;
  category: string;
  semester: string;
  photo_url: string;
  uuid?: string;
}

// For main Hall of Fame page (filter view)
export type HallDisplayProps = {
  categories: string[];
  semesters: string[];
  onCategorySelect?: (category: string) => void;
};

// For the filtered category view
export type CategoryPageProps = {
  members: HallOfFameMember[];
  category: string;
  semester: string;
  onBack?: () => void;
};

// For the card used in category selection
export type CategoryCardProps = {
  category: string;
  setSelectedCategory?: (category: string) => void;
};

// For the semester dropdown
export type SemesterFilterProps = {
  semesters: string[];
  onSelect?: (semester: string) => void;
  selectedLabel: string;
};

// For each honoree display card
export type HonoreeCardProps = {
  name: string;
  achievement?: string;
  photo_url: string;
  category: string;
  hideAchievement: boolean;
};

// For the list of honorees shown under a category/semester
export type HonoreeListProps = {
  members: HallOfFameMember[];
};

export type FilterProps = {
  categories: string[];
  setSelectedCategory?: (category: string) => void;
};
