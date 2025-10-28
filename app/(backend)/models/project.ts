import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

// Reusable Sub-Document Schemas
const PersonSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, trim: true }, 
    avatar_url: { type: String, required: true, trim: true },
    linkedin_url: { type: String, trim: true },
  },
  { _id: false }
);

const DetailedTeamMemberSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    leader_name: { type: [String], trim: true },
    responsibilities: { type: [String], required: true },
    skills: { type: [String], required: true },
  },
  { _id: false }
);

const SimpleTeamMemberSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    leader_name: { type: [String], required: true, trim: true },
  },
  { _id: false }
);

const KeyMetricSchema = new Schema(
  {
    icon: { type: String, required: true, trim: true },
    value: { type: Number, required: true },
    prefix: { type: String, trim: true, default: "" },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TimelineSchema = new Schema(
  {
    time: { type: String, required: true, trim: true },
    milestoneTitle: { type: String, required: true, trim: true },
    milestoneDescription: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TargetAudienceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, trim: true, default: "Target" },
  },
  { _id: false }
);

const PartnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo_url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CompanySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo_url: { type: String, required: true, trim: true },
    website_url: { type: String, trim: true, default: "" },
    tagline: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ProductReferenceSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Article", "FinTechTainment"],
    },
  },
  { _id: false }
);

// Base Project Schema
const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["large-scaled", "department"],
      required: true,
    },
    status: { type: String, enum: ["Ongoing", "Completed"], required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "technical",
        "media",
        "event",
        "community",
        "career",
        "competition",
      ],
    },
    labels: { type: [String], default: [] },
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: function (this: any): boolean {
        return this.type === "department";
      },
    },
    department_description: {
      type: String,
      required: function (this: any): boolean {
        return this.type === "department";
      },
    },
    year: {
      type: Number,
      required: function (this: any): boolean {
        return this.status === "Completed";
      },
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    discriminatorKey: "category",
  }
);

// Middleware to auto-generate the slug before saving
projectSchema.pre("save", function (next) {
  // Only generate a slug if the title is new or has been modified
  if (this.isModified("title") || this.isNew) {
    // Create the base slug from the title
    const baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, ""); // Create a unique suffix to prevent collisions

    const uniqueSuffix = crypto.randomBytes(4).toString("hex");

    this.slug = `${baseSlug}-${uniqueSuffix}`;
  }
  next();
});

// Indexes for query optimization
projectSchema.index({ type: 1, status: 1, category: 1 });
projectSchema.index({ year: -1 });

// Discriminator Schemas (Category-Specific)
const TechnicalSchema = new Schema({
  goals: { type: [String], required: true },
  scope: { type: [String] },
  target_audience: { type: [TargetAudienceSchema] },
  team_structure: { type: [DetailedTeamMemberSchema], required: true },
  project_leader: { type: [PersonSchema], required: true },
  timeline: {
    type: [TimelineSchema],
    required: function (this: any): boolean {
      return this.parent().status === "Ongoing";
    },
  },
  gallery: {
    type: [String],
    trim: true,
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
  product_link: {
    type: String,
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
});

const MediaSchema = new Schema({
  goals: { type: [String], required: true },
  target_audience: { type: [TargetAudienceSchema], required: true },
  team_structure: { type: [DetailedTeamMemberSchema], required: true },
  project_leader: { type: [PersonSchema], required: true },
  products: { type: [ProductReferenceSchema], default: [] },
  auto_update_type: {
    type: String,
    enum: ["Article", "FinTechTainment"],
    required: true,
  },
  auto_update_limit: {
    type: Number,
    default: 6,
  },
});

const EventSchema = new Schema({
  goals: { type: [String], required: true },
  target_audience: { type: [TargetAudienceSchema], required: true },
  featured_activities: { type: [String], required: true },
  guest_speakers: { type: [PersonSchema], default: [] },
  partners: {
    type: [PartnerSchema],
    default: [],
  },
  team_structure: { type: [SimpleTeamMemberSchema], required: true },
  project_leader: { type: [PersonSchema], required: true },
  key_metrics: {
    type: [KeyMetricSchema],
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
  gallery: {
    type: [String],
    trim: true,
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
});

const CommunitySchema = new Schema({
  goals: { type: [String], required: true },
  target_audience: { type: [TargetAudienceSchema], required: true },
  featured_activities: { type: [String], required: true },
  partners: {
    type: [PartnerSchema],
    default: [],
  },
  team_structure: { type: [SimpleTeamMemberSchema], required: true },
  project_leader: { type: [PersonSchema], required: true },
  key_metrics: {
    type: [KeyMetricSchema],
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
  gallery: {
    type: [String],
    trim: true,
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
});

const CareerSchema = new Schema({
  company: { type: CompanySchema, required: true },
  goals: { type: [String], required: true },
  target_audience: { type: [TargetAudienceSchema], required: true },
  team_structure: { type: [SimpleTeamMemberSchema], required: true },
  project_leader: { type: [PersonSchema], required: true },
  key_metrics: {
    type: [KeyMetricSchema],
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
  gallery: {
    type: [String],
    trim: true,
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
});

const CompetitionSchema = new Schema({
  theme: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
  platformLocation: { type: [String], required: true },
  goals: { type: [String], required: true },
  target_audience: { type: [TargetAudienceSchema], required: true },
  featured_activities: { type: [String], required: true },
  team_structure: { type: [SimpleTeamMemberSchema], required: true },
  project_leader: { type: [PersonSchema], required: true },
  details_link: { type: String, trim: true, default: "" },
  key_metrics: {
    type: [KeyMetricSchema],
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
  gallery: {
    type: [String],
    trim: true,
    required: function (this: any): boolean {
      return this.parent().status === "Completed";
    },
  },
});

const Project =
  mongoose.models?.Project || mongoose.model("Project", projectSchema);

if (!Project.discriminators) {
  Project.discriminator("technical", TechnicalSchema);
  Project.discriminator("media", MediaSchema);
  Project.discriminator("event", EventSchema);
  Project.discriminator("community", CommunitySchema);
  Project.discriminator("career", CareerSchema);
  Project.discriminator("competition", CompetitionSchema);
}

export default Project;
