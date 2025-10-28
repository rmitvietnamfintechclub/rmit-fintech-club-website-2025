// Dùng cho CompanyHighlight
export type Company = {
  name: string;
  logo_url: string;
  website_url: string;
  tagline?: string;
};

// Dùng cho GuestCarousel
export type Guest = {
  id: number | string; // 'id' được map từ parent
  name: string;
  position: string;
  avatar_url: string;
};

// Dùng cho KeyMetric (Dữ liệu từ API)
export type Metric = {
  icon: string; // Tên icon từ API (vd: "Users")
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

// Dùng cho Partners
export type Partner = {
  name: string;
  logo_url: string;
};

// Dùng cho ProductCarousel
export type Product = {
  id: string;
  title: string;
  image: string; // Đã map
  publicationDate?: string;
};

// Dùng cho TeamStructure
export type Leader = {
  name: string;
  role: string;
  avatarUrl: string;
  linkedinUrl: string;
};

export type Team = {
  role: string;
  leader_name?: string[];
  responsibilities?: string[];
  skills?: string[];
};

// Dùng cho Timeline
export type TimelineEvent = {
  time: string;
  milestoneTitle: string;
  milestoneDescription: string;
};

// Dùng cho TargetAudience (Dữ liệu từ API)
export type Audience = {
  name: string;
  icon?: string;
};

// --- Kiểu dữ liệu Project chính (từ API) ---
export type Project = {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  labels: string[];
  status: string;
  category: string;

  // Optional fields
  company?: Company;
  duration?: string;
  platformLocation?: string[];
  theme?: string;
  goals?: string[];
  scope?: string[];
  target_audience?: Audience[];
  project_leader?: {
    name: string;
    position: string;
    avatar_url: string;
    linkedin_url: string;
  }[];
  team_structure?: Team[];
  timeline?: TimelineEvent[];
  featured_activities?: string[];
  guest_speakers?: {
    _id?: string;
    name: string;
    position: string;
    avatar_url: string;
    linkedin_url: string;
  }[];
  key_metrics?: Metric[];
  gallery?: string[];
  partners?: Partner[];
  product_link?: string;
  details_link?: string;

  products?: {
    onModel: string;
    product: {
      _id: string;
      title: string;
      illustration_url: string;
      thumbnail_url: string;
      publicationDate?: string;
    };
  }[];
};
