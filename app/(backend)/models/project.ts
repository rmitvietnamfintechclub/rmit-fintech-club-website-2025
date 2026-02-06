import mongoose, { Schema, Document } from "mongoose";
import { Project } from "../types/project";

interface IProjectDocument extends Omit<Project, "_id">, Document {}

const projectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["large-scaled", "department"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      required: true,
      default: "ongoing",
    },
    labels: { type: [String], required: true },
    image_url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    department: {
      type: String,
      enum: ["Business", "Technology", "Marketing", "Human Resources"],
      required: function () {
        return this.type === "department";
      },
    },
    year: {
      type: Number,
      required: function () {
        return this.status === "completed";
      },
    },
    exploreLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return (
            v === "" ||
            v === null ||
            /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v)
          );
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
projectSchema.index({ type: 1, status: 1, department: 1 });
projectSchema.index({ year: -1 });

const ProjectModel =
  mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", projectSchema);
export default ProjectModel;
