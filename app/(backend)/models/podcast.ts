import mongoose, { Schema, ValidatorProps } from "mongoose";

const podcastSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    video_url: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          try {
            new URL(value);
            return true;
          } catch (err) {
            return false;
          }
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid URL!`,
      },
    },
    thumbnail_url: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          try {
            new URL(value);
            return true;
          } catch (err) {
            return false;
          }
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid URL!`,
      },
    },
    guest_speaker: {
      name: { type: String, required: true },
      description: { type: String, required: true },
      avatar_url: {
        type: String,
        required: true,
        validate: {
          validator: function (value: string) {
            try {
              new URL(value);
              return true;
            } catch (err) {
              return false;
            }
          },
          message: (props: ValidatorProps) =>
            `${props.value} is not a valid URL!`,
        },
      },
      linkedIn_url: {
        type: String,
        required: true,
        validate: {
          validator: function (value: string) {
            try {
              new URL(value);
              return true;
            } catch (err) {
              return false;
            }
          },
          message: (props: ValidatorProps) =>
            `${props.value} is not a valid URL!`,
        },
      },
    },
    labels: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const Podcast =
  mongoose.models?.Podcast || mongoose.model("Podcast", podcastSchema);

export default Podcast;
