import mongoose from "mongoose";
import Project from "../models/project"; // Đảm bảo đường dẫn này đúng
import dotenv from "dotenv";

// Tải biến môi trường
dotenv.config({ path: ".env" });

// --- Environment Variable Check ---
if (!process.env.CLOUDFRONT_DOMAIN) {
  throw new Error("CLOUDFRONT_DOMAIN environment variable is not set.");
}
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

// --- Mock ObjectIDs (cho 'media' products) ---
// These are needed to test the ProductReferenceSchema
const mockArticleId1 = new mongoose.Types.ObjectId();
const mockArticleId2 = new mongoose.Types.ObjectId();
const mockPodcastId1 = new mongoose.Types.ObjectId();

// --- Helper Functions ---
const generateCloudFrontUrl = (path: string): string => {
  const cleanDomain = process.env.CLOUDFRONT_DOMAIN!
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `https://${cleanDomain}/${cleanPath}`;
};

const placeholderAvatar = generateCloudFrontUrl("placeholders/avatar.png");

// Helper for PersonSchema (Project Leader / Guest Speaker)
const placeholderLeader = (name: string, position?: string, linkedin?: string) => [{
  name,
  position: position || "Project Lead",
  avatar_url: placeholderAvatar,
  linkedin_url: linkedin || `https://linkedin.com/in/${name.toLowerCase().replace(" ", "")}`,
}];

// Helper for DetailedTeamMemberSchema (Technical, Media)
const detailedTeam = (role: string, name: string, responsibilities: string[], skills: string[]) => [{
  role,
  leader_name: name,
  responsibilities,
  skills,
}];

// Helper for SimpleTeamMemberSchema (Event, Community, Career, Competition)
const simpleTeam = (role: string, name: string) => [{
  role,
  leader_name: name,
}];

// Helper for TargetAudienceSchema
const mockAudiences = (audiences: { name: string, icon: string }[]) => audiences;

// Helper for PartnerSchema
const mockPartners = (partners: { name: string, logo_url: string }[]) => partners;

// Helper for KeyMetricSchema (for 'completed' projects)
const mockMetrics = (metrics: { icon: string, value: number, prefix: string, label: string }[]) => metrics;

// Helper for Gallery (for 'completed' projects)
const mockGallery = (imagePaths: string[]) => imagePaths.map(generateCloudFrontUrl);

// Helper for CompanySchema (for 'career' projects)
const placeholderCompany = (name?: string, tagline?: string, website?: string) => ({
  name: name || "FinTech Club",
  logo_url: generateCloudFrontUrl("logos/club-logo.png"),
  website_url: website || "https://rmit.edu.vn/fintech-club",
  tagline: tagline || "Connecting students with FinTech",
});


// --- Mảng testProjects (Cập nhật với Discriminators) ---
const testProjects = [
  // =============================================
  // =========== 1. TECHNICAL (ONGOING) ==========
  // =============================================
  {
    // Base fields
    title: "AI Banking Platform (Ongoing)",
    description: "Revolutionary AI-powered banking platform for seamless financial transactions.",
    type: "large-scaled",
    status: "ongoing",
    category: "technical",
    labels: ["AI", "Banking", "FinTech"],
    image_url: generateCloudFrontUrl("projects/tech/ai-banking.png"),
    meta_title: "AI Banking Platform - FinTech Club",
    meta_description: "A revolutionary AI banking platform.",
    // 'department' fields not required for 'large-scaled'
    
    // TechnicalSchema fields
    goals: ["Create an AI-powered banking platform", "Integrate predictive analytics"],
    scope: ["Full-stack development", "AI model training", "API integration"],
    team_structure: detailedTeam(
      "Lead Developer", 
      "John Doe", 
      ["Architecture design", "Code review"], 
      ["Python", "TensorFlow", "React"]
    ),
    project_leader: placeholderLeader("John Doe", "AI Lead", "https://linkedin.com/in/johndoe"),
    timeline: [ // Required for 'ongoing'
      { time: "2024-01-15", milestoneTitle: "Phase 1: Research", milestoneDescription: "Initial research and planning." },
      { time: "2024-03-01", milestoneTitle: "Phase 2: Development", milestoneDescription: "Backend development started." }
    ],
    // 'gallery' & 'product_link' not required for 'ongoing'
  },

  // =============================================
  // ======== 2. TECHNICAL (COMPLETED) ===========
  // =============================================
  {
    // Base fields
    title: "DeFi Lending Protocol (Completed)",
    description: "A completed, audited DeFi protocol for lending and borrowing on Ethereum.",
    type: "department",
    status: "completed",
    category: "technical",
    labels: ["DeFi", "Smart Contracts", "Ethereum", "Past Project"],
    image_url: generateCloudFrontUrl("projects/tech/defi-protocol-done.png"),
    department: "Technology", // Required for 'department'
    department_description: "This semester, we’re working on three exciting projects: a blockchain-powered History Chess Game, an AI Financial Coach, and a feature-rich upgrade of the FinTech Club Website.",
    year: 2024, // Required for 'completed'
    meta_title: "DeFi Lending Protocol (2024) - FinTech Club",
    meta_description: "Showcase of the completed DeFi Lending Protocol from 2024.",
    
    // TechnicalSchema fields
    goals: ["Launch a secure and audited lending platform"],
    scope: ["Smart contract development", "Protocol design", "Security audit"],
    team_structure: detailedTeam(
      "Smart Contract Developer", 
      "Satoshi Nakamoto", 
      ["Develop core contracts", "Write tests"], 
      ["Solidity", "Hardhat", "JavaScript"]
    ),
    project_leader: placeholderLeader("Satoshi Nakamoto", "Blockchain Lead"),
    // 'timeline' not required for 'completed'
    gallery: mockGallery([ // Required for 'completed'
      "gallery/tech/defi-1.png",
      "gallery/tech/defi-2.png",
      "gallery/tech/demo-video.png"
    ]),
    product_link: "https://github.com/fintech-club/defi-protocol-2024" // Required for 'completed'
  },

  // =============================================
  // ============= 3. MEDIA (ONGOING) ============
  // =============================================
  {
    // Base fields
    title: "FinTech Article Series",
    description: "Our ongoing series of deep-dive FinTech articles, updated automatically.",
    type: "large-scaled",
    status: "ongoing",
    category: "media",
    labels: ["Articles", "Analysis", "Content"],
    image_url: generateCloudFrontUrl("projects/media/article-series.png"),
    meta_title: "FinTech Article Series - FinTech Club",
    meta_description: "Deep-dive articles on FinTech, from DeFi to RegTech.",
    
    // MediaSchema fields
    goals: ["Establish thought leadership", "Educate members on complex topics"],
    target_audience: mockAudiences([
      { name: "Readers", icon: "book-open" },
      { name: "Students", icon: "user-graduate" }
    ]),
    team_structure: detailedTeam(
      "Content Lead", 
      "Diana Prince", 
      ["Editing", "Content Strategy", "SEO"],
      ["SEO", "Content Writing", "Journalism"]
    ),
    project_leader: placeholderLeader("Diana Prince", "Head of Content"),
    products: [ // Test with mock data
      { product: mockArticleId1, onModel: "Article" },
      { product: mockArticleId2, onModel: "Article" }
    ],
    auto_update_type: "Article",
    auto_update_limit: 5 // Test non-default limit
  },

  // =============================================
  // ============= 4. MEDIA (ONGOING) ============
  // =============================================
  {
    // Base fields
    title: "The FinTech Feed Podcast",
    description: "Launching a weekly podcast featuring interviews with industry leaders, market analysis, and career advice.",
    type: "department",
    status: "ongoing",
    category: "media",
    labels: ["Podcast", "Interviews", "Media"],
    image_url: generateCloudFrontUrl("projects/media/podcast-launch.png"),
    department: "Marketing",
    department_description: "This semester, we’re launching an Internal Training Series, powering major campaigns, and revamping our TikTok Project to spotlight member stories.",
    meta_title: "The FinTech Feed Podcast - FinTech Club",
    meta_description: "A weekly podcast on all things FinTech.",
    
    // MediaSchema fields
    goals: ["Reach a wider audience through audio content", "Network with industry leaders"],
    target_audience: mockAudiences([
      { name: "Podcast Listeners", icon: "headphones" },
      { name: "Commuters", icon: "car" }
    ]),
    team_structure: detailedTeam(
      "Podcast Host", 
      "Clark Kent", 
      ["Host episodes", "Edit audio", "Book guests"], 
      ["Interviewing", "Audacity", "Networking"]
    ),
    project_leader: placeholderLeader("Clark Kent", "Podcast Lead"),
    products: [ // Test with different model
      { product: mockPodcastId1, onModel: "FinTechTainment" }
    ],
    auto_update_type: "FinTechTainment",
    // 'auto_update_limit' will use default (6)
  },

  // =============================================
  // ============= 5. EVENT (ONGOING) ============
  // =============================================
  {
    // Base fields
    title: "Business Workshop Series (Ongoing)",
    description: "Comprehensive business workshops for students and professionals.",
    type: "department",
    status: "ongoing",
    category: "event",
    labels: ["Workshop", "Business", "Networking"],
    image_url: generateCloudFrontUrl("projects/event/workshop-series.png"),
    department: "Business",
    department_description: "This semester, we are leading the Bi-weekly Article Series and Breaking the Curve, a workshop series that helps students excel academically.",
    meta_title: "Business Workshop Series - FinTech Club",
    meta_description: "Workshops for students and professionals.",
    
    // EventSchema fields
    goals: ["Provide practical business knowledge", "Connect students with experts"],
    target_audience: mockAudiences([
      { name: "Students", icon: "user-graduate" },
      { name: "Young professionals", icon: "briefcase" },
    ]),
    featured_activities: ["Case studies", "Guest speakers", "Networking sessions"],
    guest_speakers: [ // Test with optional data
      { name: "Jane Smith", position: "CEO, TechStart", avatar_url: generateCloudFrontUrl("speakers/jane-smith.jpg"), linkedin_url: "https://linkedin.com/in/janesmith" },
      { name: "Bob Lee", position: "VC, InvestCo", avatar_url: generateCloudFrontUrl("speakers/bob-lee.jpg"), linkedin_url: "https://linkedin.com/in/boblee" }
    ],
    partners: mockPartners([ // Test with optional data
      { name: "TechStart", logo_url: generateCloudFrontUrl("logos/techstart.png") },
      { name: "InvestCo", logo_url: generateCloudFrontUrl("logos/investco.png") }
    ]),
    team_structure: simpleTeam("Event Coordinator", "Alice Johnson"),
    project_leader: placeholderLeader("Alice Johnson", "Events Lead"),
    // 'key_metrics' & 'gallery' not required for 'ongoing'
  },

  // =============================================
  // ========== 6. EVENT (COMPLETED) =============
  // =============================================
  {
    // Base fields
    title: "Alumni Networking Gala (Completed)",
    description: "Our 2024 annual gala to connect current members with the club's successful alumni network.",
    type: "large-scaled",
    status: "completed",
    category: "event",
    labels: ["Alumni", "Networking", "Gala", "Past Event"],
    image_url: generateCloudFrontUrl("projects/event/alumni-gala-2024.png"),
    year: 2024, // Required for 'completed'
    meta_title: "Alumni Networking Gala 2024 - FinTech Club",
    meta_description: "Highlights from the successful 2024 Alumni Networking Gala.",
    
    // EventSchema fields
    goals: ["Strengthen the alumni community", "Provide networking opportunities"],
    target_audience: mockAudiences([
      { name: "Alumni", icon: "user-check" }, 
      { name: "Current Members", icon: "users" }
    ]),
    featured_activities: ["Keynote Speech", "Networking Dinner", "Awards Ceremony"],
    // 'guest_speakers' will use default ([])
    // 'partners' will use default ([])
    team_structure: simpleTeam("Event Lead", "Selina Kyle"),
    project_leader: placeholderLeader("Selina Kyle", "Alumni Relations"),
    key_metrics: mockMetrics([ // Required for 'completed'
      { icon: "users", value: 250, prefix: "+", label: "Attendees" },
      { icon: "user-check", value: 100, prefix: "+", label: "Alumni" },
      { icon: "building", value: 20, prefix: "", label: "Companies" }
    ]),
    gallery: mockGallery([ // Required for 'completed'
      "gallery/event/gala-1.jpg",
      "gallery/event/gala-2.jpg",
      "gallery/event/gala-3.jpg"
    ]),
  },

  // =============================================
  // =========== 7. COMMUNITY (ONGOING) ==========
  // =============================================
  {
    // Base fields
    title: "Social Media Growth Campaign",
    description: "A multi-platform campaign to double our social media following and engagement.",
    type: "department",
    status: "ongoing",
    category: "community",
    labels: ["Social Media", "Campaign", "Growth"],
    image_url: generateCloudFrontUrl("projects/community/social-campaign.png"),
    department: "Marketing",
    department_description: "This semester, we’re launching an Internal Training Series, powering major campaigns, and revamping our TikTok Project to spotlight member stories.",
    meta_title: "Social Media Growth Campaign - FinTech Club",
    meta_description: "A campaign to grow our social media presence.",
    
    // CommunitySchema fields
    goals: ["Double social media followers", "Increase engagement metrics by 50%"],
    target_audience: mockAudiences([
      { name: "Social Media Users", icon: "hashtag" }, 
      { name: "Students", icon: "user-graduate" }
    ]),
    featured_activities: ["Daily Content Posting", "Engagement Contests", "Giveaways"],
    partners: mockPartners([ // Test with partners
      { name: "UniNetwork", logo_url: generateCloudFrontUrl("logos/uninetwork.png") }
    ]),
    team_structure: simpleTeam("Social Media Manager", "Tony Stark"),
    project_leader: placeholderLeader("Tony Stark", "Marketing Lead"),
    // 'key_metrics' & 'gallery' not required for 'ongoing'
  },

  // =============================================
  // ========= 8. COMMUNITY (COMPLETED) ==========
  // =============================================
  {
    // Base fields
    title: "Charity Drive 2024 (Completed)",
    description: "Our 2024 club-wide charity drive to support local orphanages.",
    type: "large-scaled",
    status: "completed",
    category: "community",
    labels: ["Charity", "Fundraising", "Social Good"],
    image_url: generateCloudFrontUrl("projects/community/charity-drive-2024.png"),
    year: 2024, // Required
    meta_title: "Charity Drive 2024 - FinTech Club",
    meta_description: "Recap of our successful 2024 charity fundraising drive.",
    
    // CommunitySchema fields
    goals: ["Raise $10,000 for local orphanages", "Promote social responsibility"],
    target_audience: mockAudiences([
      { name: "Club Members", icon: "users" }, 
      { name: "Donors", icon: "heart" }
    ]),
    featured_activities: ["Fundraising Bake Sale", "Online Donation Portal", "Charity Gala"],
    // 'partners' will use default ([])
    team_structure: simpleTeam("Community Lead", "Peter Parker"),
    project_leader: placeholderLeader("Peter Parker", "HR Lead"),
    key_metrics: mockMetrics([ // Required
      { icon: "dollar-sign", value: 12500, prefix: "$", label: "Raised" },
      { icon: "users", value: 150, prefix: "+", label: "Volunteers" }
    ]),
    gallery: mockGallery([ // Required
      "gallery/community/charity-1.jpg",
      "gallery/community/charity-2.jpg"
    ]),
  },

  // =============================================
  // ============ 9. CAREER (ONGOING) ============
  // =============================================
  {
    // Base fields
    title: "Member Mentorship Program",
    description: "Pairing new members with senior club members and alumni for guidance.",
    type: "department",
    status: "ongoing",
    category: "career",
    labels: ["Mentorship", "Career", "Development"],
    image_url: generateCloudFrontUrl("projects/career/mentorship.png"),
    department: "Human Resources",
    department_description: "This semester, we’re bringing the community together through heartfelt initiatives, high-energy bonding, and personal growth workshops.",
    meta_title: "Member Mentorship Program - FinTech Club",
    meta_description: "A mentorship program for club members.",
    
    // CareerSchema fields
    company: placeholderCompany( // Required
      "FinTech Club Mentors", 
      "Guiding the next generation", 
      "https://rmit.edu.vn/fintech-club/mentorship"
    ), 
    goals: ["Facilitate knowledge transfer", "Improve member retention", "Enhance career readiness"],
    target_audience: mockAudiences([
      { name: "New Members (Mentees)", icon: "user-plus" }, 
      { name: "Senior Members (Mentors)", icon: "user-tie" }
    ]),
    team_structure: simpleTeam("Mentorship Coordinator", "Alfred Pennyworth"),
    project_leader: placeholderLeader("Alfred Pennyworth", "Head of HR"),
    // 'key_metrics' & 'gallery' not required for 'ongoing'
  },

  // =============================================
  // ========== 10. CAREER (COMPLETED) ===========
  // =============================================
  {
    // Base fields
    title: "Annual Recruitment Drive 2024",
    description: "Our 2024 drive to recruit talented students to join the FinTech Club.",
    type: "large-scaled",
    status: "completed",
    category: "career",
    labels: ["Recruitment", "Networking", "Career", "Past Event"],
    image_url: generateCloudFrontUrl("projects/career/recruitment-2024.png"),
    year: 2024, // Required
    meta_title: "Annual Recruitment Drive 2024 - FinTech Club",
    meta_description: "Results from the 2024 FinTech Club recruitment drive.",
    
    // CareerSchema fields
    company: placeholderCompany("FinTech Club Careers"), // Required
    goals: ["Attract top talent", "Strengthen the club's member base"],
    target_audience: mockAudiences([
      { name: "University students", icon: "user-graduate" },
      { name: "All Faculties", icon: "university" }
    ]),
    team_structure: simpleTeam("HR Lead", "Bruce Wayne"),
    project_leader: placeholderLeader("Bruce Wayne", "President"),
    key_metrics: mockMetrics([ // Required
      { icon: "file-alt", value: 300, prefix: "+", label: "Applications" },
      { icon: "user-plus", value: 45, prefix: "", label: "New Members" },
      { icon: "users", value: 5, prefix: "", label: "Departments" }
    ]),
    gallery: mockGallery([ // Required
      "gallery/career/recruitment-1.jpg",
      "gallery/career/recruitment-2.jpg"
    ]),
  },

  // =============================================
  // ========== 11. COMPETITION (ONGOING) ========
  // =============================================
  {
    // Base fields
    title: "Algorithmic Trading Bot Challenge",
    description: "A competitive challenge for members to design, build, and test their own trading algorithms.",
    type: "department",
    status: "ongoing",
    category: "competition",
    labels: ["Algo-Trading", "Python", "Competition"],
    image_url: generateCloudFrontUrl("projects/competition/algo-challenge.png"),
    department: "Technology",
    department_description: "This semester, we’re working on three exciting projects: a blockchain-powered History Chess Game, an AI Financial Coach, and a feature-rich upgrade of the FinTech Club Website.",
    meta_title: "Algorithmic Trading Challenge - FinTech Club",
    meta_description: "A competitive challenge for algorithmic trading.",
    
    // CompetitionSchema fields
    theme: "Quantitative Finance", // Required
    duration: "4 Weeks", // Required
    platformLocation: ["Online (Discord)", "RMIT Vietnam (Pitching)"], // Required
    goals: ["Foster innovation in quantitative finance", "Develop practical coding skills"],
    target_audience: mockAudiences([
      { name: "Students", icon: "user-graduate" },
      { name: "Coders", icon: "code" }
    ]),
    featured_activities: ["Introductory Workshop", "Mid-point Check-in", "Final Pitching"],
    team_structure: simpleTeam("Competition Lead", "Ada Lovelace"),
    project_leader: placeholderLeader("Ada Lovelace", "Quant Lead"),
    details_link: "https://rmit.edu.vn/fintech-club/algo-challenge-2025", // Test optional
    // 'key_metrics' & 'gallery' not required for 'ongoing'
  },

  // =============================================
  // ======== 12. COMPETITION (COMPLETED) ========
  // =============================================
  {
    // Base fields
    title: "FinTech Case Competition 2024",
    description: "Our flagship case competition from 2024, focused on solving real-world FinTech problems.",
    type: "large-scaled",
    status: "completed",
    category: "competition",
    labels: ["Case Competition", "Strategy", "FinTech", "Past Event"],
    image_url: generateCloudFrontUrl("projects/competition/case-comp-2024.png"),
    year: 2024, // Required
    meta_title: "FinTech Case Competition 2024 - FinTech Club",
    meta_description: "Recap of the 2024 FinTech Case Competition.",
    
    // CompetitionSchema fields
    theme: "Innovation in Digital Payments", // Required
    duration: "2 Weeks", // Required
    platformLocation: ["Online", "RMIT Vietnam"], // Required
    goals: ["Solve real-world industry problems", "Identify top talent"],
    target_audience: mockAudiences([
      { name: "Student Teams", icon: "users" },
      { name: "Industry Judges", icon: "gavel" }
    ]),
    featured_activities: ["Opening Ceremony", "Mentorship Sessions", "Finals Pitch"],
    team_structure: simpleTeam("Competition Manager", "Elon Musk"),
    project_leader: placeholderLeader("Elon Musk", "Head of Business"),
    // 'details_link' will use default ("")
    key_metrics: mockMetrics([ // Required
      { icon: "users", value: 80, prefix: "", label: "Teams" },
      { icon: "dollar-sign", value: 5000, prefix: "$", label: "Prize Pool" },
      { icon: "building", value: 10, prefix: "", label: "Sponsors" }
    ]),
    gallery: mockGallery([ // Required
      "gallery/competition/case-1.jpg",
      "gallery/competition/case-2.jpg",
      "gallery/competition/winners.jpg"
    ]),
  },
];

async function seedProjects() {
  const mongoUri = process.env.MONGODB_URI!;

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("Connected. Starting project seeding...");

  // 1. Xoá collection projects cũ
  console.log("Clearing existing projects...");
  await Project.deleteMany({});
  console.log("Projects collection cleared.");

  // 2. Loop qua dữ liệu test và lưu từng project
  for (const projectData of testProjects) {
    try {
      // Dữ liệu đã được cấu trúc phẳng, khớp với schema mới
      const project = new Project(projectData);
      await project.save();
      console.log(`✅ Seeded project: ${project.title} (Slug: ${project.slug})`);
    } catch (error: any) {
      console.error(`❌ Error seeding project "${projectData.title}":`);
      // Ghi lại lỗi validation nếu có
      if (error.errors) {
        for (const field in error.errors) {
          console.error(`  - ${error.errors[field].message}`);
        }
      } else {
        console.error(error.message);
      }
    }
  }

  console.log("\n--- Seeding Complete ---");
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

seedProjects().catch(err => {
  console.error("An unexpected error occurred during seeding:", err);
  mongoose.disconnect();
});