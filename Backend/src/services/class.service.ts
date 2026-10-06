import Class, { IClass } from "../models/Class";
import Membership, {
    MembershipRole,
} from "../models/Membership";
import User from "../models/User";

interface CreateClassData {
    name: string;
    description?: string;
    membersCanCreateNotices?: boolean;
    memberUserIds?: string[];
}

export const createClass = async (
    creatorUserId: string,
    classData: CreateClassData
): Promise<IClass> => {
    const {
        name,
        description,
        membersCanCreateNotices = true,
        memberUserIds = [],
    } = classData;

    // Find the NoticeNest user creating the class
    const creator = await User.findOne({
        clerkUserId: creatorUserId,
    });

    if (!creator) {
        throw new Error("User not found");
    }

    // Create the class
    const newClass = await Class.create({
        name,
        description,
        membersCanCreateNotices,
    });

    // Creator automatically becomes an admin
    await Membership.create({
        userId: creator._id,
        classId: newClass._id,
        role: "admin",
    });

    // Add selected users as members
    if (memberUserIds.length > 0) {
        const users = await User.find({
            noticeNestId: {
                $in: memberUserIds.map((id) =>
                    id.replace(/^@/, "").trim().toUpperCase()
                ),
            },
        });

        const memberships = users
            .filter(
                (user) =>
                    user._id.toString() !==
                    creator._id.toString()
            )
            .map((user) => ({
                userId: user._id,
                classId: newClass._id,
                role: "member" as MembershipRole,
            }));

        if (memberships.length > 0) {
            await Membership.insertMany(memberships);
        }
    }

    return newClass;
};

export const getUserClasses = async (
    clerkUserId: string
) => {
    const user = await User.findOne({
        clerkUserId,
    });

    if (!user) {
        throw new Error("User not found");
    }

    const memberships = await Membership.find({
        userId: user._id,
    }).populate("classId");

    return memberships;
};

export const addClassMember = async (
    clerkUserId: string,
    classId: string,
    noticeNestId: string
) => {
    // Find the user making the request
    const requester = await User.findOne({
        clerkUserId,
    });

    if (!requester) {
        throw new Error("User not found");
    }

    // Check that requester is an admin of this class
    const requesterMembership = await Membership.findOne({
        userId: requester._id,
        classId,
    });

    if (!requesterMembership) {
        throw new Error("You are not a member of this class");
    }

    if (requesterMembership.role !== "admin") {
        throw new Error("Only class admins can add members");
    }

    // Find the user being added
    const userToAdd = await User.findOne({
        noticeNestId: noticeNestId
            .replace(/^@/, "")
            .trim()
            .toUpperCase(),
    });

    if (!userToAdd) {
        throw new Error("User to add not found");
    }

    // Check whether they are already a member
    const existingMembership = await Membership.findOne({
        userId: userToAdd._id,
        classId,
    });

    if (existingMembership) {
        throw new Error("User is already a member of this class");
    }

    // Add the user as a member
    const membership = await Membership.create({
        userId: userToAdd._id,
        classId,
        role: "member",
    });

    return membership;
};


export const getClassMembers = async (
    clerkUserId: string,
    classId: string
) => {
    const requester = await User.findOne({
        clerkUserId,
    });

    if (!requester) {
        throw new Error("User not found");
    }

    // Make sure requester belongs to this class
    const requesterMembership = await Membership.findOne({
        userId: requester._id,
        classId,
    });

    if (!requesterMembership) {
        throw new Error("You are not a member of this class");
    }

    const memberships = await Membership.find({
        classId,
    }).populate("userId", "noticeNestId name");

    return memberships.map((membership) => {
        const user = membership.userId as any;

        return {
            noticeNestId: user.noticeNestId,
            name: user.name,
            role: membership.role,
        };
    });
};