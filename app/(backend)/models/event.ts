import mongoose, { Schema, ValidatorProps } from "mongoose";

const urlValidator = (value: string) => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch (err) {
    return false;
  }
};

const eventSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    
    posterUrl: {
      type: String,
      required: true,
      validate: {
        validator: urlValidator,
        message: (props: ValidatorProps) => `${props.value} is not a valid URL!`,
      },
    },

    date: { type: Date, required: true },
    
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "startTime must be in HH:MM format"],
    },
    
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "endTime must be in HH:MM format"],
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      required: true,
    },

    location: { type: String, trim: true, required: true },

    audience: {
      type: [String],
      required: true, 
      default: [], 
    },

    agenda: [{ type: String, trim: true }], 

    guest_speaker: {
      type: [
        {
          name: { type: String, required: true },
          bio: { type: String, required: true },
          avatar_url: {
            type: String,
            required: true,
            validate: {
              validator: urlValidator,
              message: (props: ValidatorProps) => `${props.value} is not a valid URL!`,
            },
          },
          linkedIn_url: {
            type: String,
            required: false,
            validate: {
              validator: urlValidator,
              message: (props: ValidatorProps) => `${props.value} is not a valid URL!`,
            },
          },
        },
      ],
      default: [],
    },

    partners: {
      type: [String],
      validate: {
        validator: (arr: string[]) => {
          if (!arr || arr.length === 0) return true;
          return arr.every((url) => urlValidator(url));
        },
        message: (props: ValidatorProps) => `${props.value} contains an invalid URL!`,
      },
      default: [],
    },

    registrationLink: { 
      type: String, 
      required: false, 
      trim: true,
      validate: {
        validator: urlValidator,
        message: (props: ValidatorProps) => `${props.value} is not a valid URL!`,
      }
    },
    
    registrationDeadline: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ date: 1 });

const Event = mongoose.models?.Event || mongoose.model("Event", eventSchema);

export default Event;