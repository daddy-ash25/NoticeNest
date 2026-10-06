import mongoose, { Document, Schema } from "mongoose";

export type MembershipRole = "admin" | "member";

export interface IMembership extends Document {
    userId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId;
    role: MembershipRole;
    createdAt: Date;
    updatedAt: Date;
}

const membershipSchema = new Schema<IMembership>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

membershipSchema.index(
    { userId: 1, classId: 1 },
    { unique: true }
);

const Membership = mongoose.model<IMembership>(
    "Membership",
    membershipSchema
);

export default Membership;