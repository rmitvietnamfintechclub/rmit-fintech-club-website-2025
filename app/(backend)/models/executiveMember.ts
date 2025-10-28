import mongoose, { Schema } from "mongoose";

const executiveMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    photo_url: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\//.test(v),
        message: (props: { value: string }) => `${props.value} is not a valid URL!`
      }
    },
    linkedin_url: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => !v || /^https?:\/\//.test(v),
        message: (props: { value: string }) => `${props.value} is not a valid URL!`
      }
    },
    generation: {
      type: Number,
      required: true,
      min: [1, 'Generation must be a positive integer'],
      validate: {
        validator: Number.isInteger,
        message: 'Generation must be an integer'
      }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

executiveMemberSchema.index({ generation: 1 });

const ExecutiveMember = mongoose.models?.ExecutiveMember || mongoose.model("ExecutiveMember", executiveMemberSchema, "executivemembers");

export default ExecutiveMember; 