import mongoose, { Schema } from "mongoose";
import { validate } from "uuid";

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
			required: true,
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
			max: [6, "Generation must be between 1 and 6"],
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

// Middleware to ensure updated_at is set on update
managementBoardSchema.pre("findOneAndUpdate", function (next) {
	this.set({ updated_at: new Date() });
	next();
});

// Middleware to validate generation on save and update
managementBoardSchema.pre(["save", "findOneAndUpdate"], function (next) {
	let gen: number | undefined;
	if (typeof (this as any).getUpdate === "function") {
		const update = (this as any).getUpdate();
		gen = update?.generation;
	} else {
		gen = (this as any).generation;
	}
	if (gen !== undefined && (!Number.isInteger(gen) || gen < 1 || gen > 6)) {
		return next(
			new Error("Generation must be a positive integer between 1 and 6"),
		);
	}
	next();
});

managementBoardSchema.index({ generation: 1 });

const ManagementBoard =
	mongoose.models?.ManagementBoard ||
	mongoose.model("ManagementBoard", managementBoardSchema);

export default ManagementBoard;
