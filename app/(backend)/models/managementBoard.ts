import mongoose, { Schema } from "mongoose";

const managementBoardSchema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    photo_url: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => !v || /^https?:\/\//.test(v),
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    linkedin_url: {
      type: String,
      required: false, 
      validate: {
        validator: (v: string) => !v || /^https?:\/\//.test(v),
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    generation: {
      type: Number,
      required: true,
      min: [1, "Generation must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Generation must be a positive integer",
      },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

managementBoardSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: new Date() });
  next();
});

managementBoardSchema.index({ generation: 1 });

const ManagementBoard =
  mongoose.models?.ManagementBoard ||
  mongoose.model("ManagementBoard", managementBoardSchema);

export default ManagementBoard;