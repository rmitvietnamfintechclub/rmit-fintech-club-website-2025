import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content_url: {
      type: String,
      required: true,
      validate: function (value: string) {
        try {
          new URL(value);
          return true;
        } catch (err) {
          return false;
        }
      },
    },
    illustration_url: {
      type: String,

      validate: {
        validator: function (value: string) {
          try {
            new URL(value); // Throw when the value is not a valid URL
            return true;
          } catch (err) {
            return false;
          }
        },
        message: "illustration_url must be a valid URL",
      },
    },
    authors: { type: [String], required: true },
    labels: { type: [String], required: true },
    publicationDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Article =
  mongoose.models?.Article || mongoose.model("Article", articleSchema);

export default Article;
