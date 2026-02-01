import mongoose, { Schema } from "mongoose";

const clubSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const ClubSettings =
  mongoose.models?.ClubSettings || mongoose.model("ClubSettings", clubSettingsSchema);

export default ClubSettings;