import mongoose, { Document, Schema } from "mongoose";

export interface IClass extends Document {
    name: string;
    description?: string;
    membersCanCreateNotices: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const classSchema = new Schema<IClass>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        membersCanCreateNotices: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Class = mongoose.model<IClass>("Class", classSchema);

export default Class;