import mongoose, { Schema, ValidatorProps, Document } from "mongoose";

// Define the document interface for type safety with Mongoose
export interface IReel extends Document {
  title: string;
  description: string;
  videoId: string;
  thumbnailUrl: string;
  publicationDate: Date;
  labels: string[];
}

const reelSchema = new Schema<IReel>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    videoId: { type: String, required: true, trim: true },
    thumbnailUrl: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          try {
            new URL(value);
            return true;
          } catch (err) {
            return false;
          }
        },
        message: (props: ValidatorProps) => `${props.value} is not a valid URL!`,
      },
    },
    publicationDate: { type: Date, default: Date.now },
    labels: { type: [String], required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Reel = mongoose.models.Reel || mongoose.model<IReel>("Reel", reelSchema);

export default Reel;