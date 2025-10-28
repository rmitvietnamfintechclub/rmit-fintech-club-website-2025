import mongoose, {Schema} from "mongoose";

const eventSchema = new Schema(
    {
        name: {type: String, required: true,trim: true},
        description: {type: String, required: true, trim: true,},
        posterUrl: {
            type: String, 
            required: true,
            validate: {
				validator: (v: string) => !v || /^https?:\/\//.test(v),
				message: (props: { value: string }) =>
					`${props.value} is not a valid URL!`,
			},
        },
        date: {type: Date, required: true},
        time: {
            type: String, 
            required: true,
            validate: {
				validator: (v: string) => !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
				message: (props: { value: string }) =>
					`${props.value} must be in HH:MM format`,
			},
        },
        mode: {type: String, enum: ['Online', 'Offline', 'Hybrid'], required: true},
        location: {type: String, trim: true, required: true},
        agenda: [
            {
                time: {
                    type: String,
                    required: true,
                    validate: {
                        validator: (v: string) => !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
                        message: (props: { value: string }) =>
                            `${props.value} must be in HH:MM format`,
                    },
                },
                description: {type: String, required: true, trim: true,}
            }
        ],
        speakers: [
            {
                name: {type: String, trim: true,required: false, default: undefined},
                photoUrl: {
                    type: String,
                    validate: {
                        validator: (v: string) => !v || /^https?:\/\//.test(v),
                        message: (props: { value: string }) =>
                            `${props.value} is not a valid URL!`,
                    },
                    required: false,
                    default: undefined
                },
                bio: {type: String, trim: true,required: false, default: undefined}
            }
        ],
        partners: {
            type: [String],
            validate: {
                validator: (arr: string[]) =>  arr.every(url => /^https?:\/\//.test(url)),
                message: (props: { value: string[] }) =>
                    `${props.value} contains an invalid URL!`,
            },
            default: undefined
        },
        registrationDeadline: {type: Date, required: true}
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    },
);

// Index for filtering upcoming events by date
eventSchema.index({ date: 1 });

const Event =
    mongoose.models?.Event || mongoose.model("Event", eventSchema);

export default Event;