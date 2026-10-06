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

interface UpdateClassData {
    name?: string;
    description?: string;
    membersCanCreateNotices?: boolean;
}

/* =========================================================
   CREATE CLASS
========================================================= */

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

    const creator = await User.findOne({
        clerkUserId: creatorUserId,
    });

    if (!creator) {
        throw new Error("User not found");
    }

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

    // Add selected members
    if (memberUserIds.length > 0) {
        const normalizedIds = memberUserIds.map((id) =>
            id.replace(/^@/, "").trim().toUpperCase()
        );

        const users = await User.find({
            noticeNestId: {
                $in: normalizedIds,
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


/* =========================================================
   GET USER'S CLASSES
========================================================= */

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


/* =========================================================
   GET CLASS DETAILS
========================================================= */

export const getClassDetails = async (
    clerkUserId: string,
    classId: string
) => {
    const user = await User.findOne({
        clerkUserId,
    });

    if (!user) {
        throw new Error("User not found");
    }

    // User must belong to the class
    const membership = await Membership.findOne({
        userId: user._id,
        classId,
    });

    if (!membership) {
        throw new Error(
            "You are not a member of this class"
        );
    }

    const classData = await Class.findById(classId);

    if (!classData) {
        throw new Error("Class not found");
    }

    return {
        class: classData,
        role: membership.role,
    };
};


/* =========================================================
   UPDATE CLASS
========================================================= */

export const updateClass = async (
    clerkUserId: string,
    classId: string,
    updateData: UpdateClassData
) => {
    const user = await User.findOne({
        clerkUserId,
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Only admins can change class settings
    const membership = await Membership.findOne({
        userId: user._id,
        classId,
    });

    if (!membership) {
        throw new Error(
            "You are not a member of this class"
        );
    }

    if (membership.role !== "admin") {
        throw new Error(
            "Only class admins can update class settings"
        );
    }

    const classData = await Class.findByIdAndUpdate(
        classId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!classData) {
        throw new Error("Class not found");
    }

    return classData;
};


/* =========================================================
   DELETE CLASS
========================================================= */

export const deleteClass = async (
    clerkUserId: string,
    classId: string
) => {
    const user = await User.findOne({
        clerkUserId,
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Any admin can delete the class.
    // There is no owner role in our system.
    const membership = await Membership.findOne({
        userId: user._id,
        classId,
    });

    if (!membership) {
        throw new Error(
            "You are not a member of this class"
        );
    }

    if (membership.role !== "admin") {
        throw new Error(
            "Only class admins can delete this class"
        );
    }

    const classData = await Class.findById(classId);

    if (!classData) {
        throw new Error("Class not found");
    }

    // Delete the class
    await Class.deleteOne({
        _id: classId,
    });

    // Delete all memberships belonging to it
    await Membership.deleteMany({
        classId,
    });

    return true;
};


/* =========================================================
   GET CLASS MEMBERS
========================================================= */

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

    // Any class member can view members
    const requesterMembership = await Membership.findOne({
        userId: requester._id,
        classId,
    });

    if (!requesterMembership) {
        throw new Error(
            "You are not a member of this class"
        );
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


/* =========================================================
   ADD MEMBER
========================================================= */

export const addClassMember = async (
    clerkUserId: string,
    classId: string,
    noticeNestId: string
) => {
    const requester = await User.findOne({
        clerkUserId,
    });

    if (!requester) {
        throw new Error("User not found");
    }

    // Requester must be an admin
    const requesterMembership = await Membership.findOne({
        userId: requester._id,
        classId,
    });

    if (!requesterMembership) {
        throw new Error(
            "You are not a member of this class"
        );
    }

    if (requesterMembership.role !== "admin") {
        throw new Error(
            "Only class admins can add members"
        );
    }

    const userToAdd = await User.findOne({
        noticeNestId: noticeNestId
            .replace(/^@/, "")
            .trim()
            .toUpperCase(),
    });

    if (!userToAdd) {
        throw new Error("User to add not found");
    }

    const existingMembership = await Membership.findOne({
        userId: userToAdd._id,
        classId,
    });

    if (existingMembership) {
        throw new Error(
            "User is already a member of this class"
        );
    }

    const membership = await Membership.create({
        userId: userToAdd._id,
        classId,
        role: "member",
    });

    return membership;
};


/* =========================================================
   REMOVE MEMBER
========================================================= */

export const removeClassMember = async (
    clerkUserId: string,
    classId: string,
    noticeNestId: string
) => {
    const requester = await User.findOne({
        clerkUserId,
    });

    if (!requester) {
        throw new Error("User not found");
    }

    const requesterMembership = await Membership.findOne({
        userId: requester._id,
        classId,
    });

    if (!requesterMembership) {
        throw new Error(
            "You are not a member of this class"
        );
    }

    if (requesterMembership.role !== "admin") {
        throw new Error(
            "Only class admins can remove members"
        );
    }

    const targetUser = await User.findOne({
        noticeNestId: noticeNestId
            .replace(/^@/, "")
            .trim()
            .toUpperCase(),
    });

    if (!targetUser) {
        throw new Error("User to remove not found");
    }

    const targetMembership = await Membership.findOne({
        userId: targetUser._id,
        classId,
    });

    if (!targetMembership) {
        throw new Error(
            "User is not a member of this class"
        );
    }

    // Do not allow the last admin to be removed
    if (targetMembership.role === "admin") {
        const adminCount = await Membership.countDocuments({
            classId,
            role: "admin",
        });

        if (adminCount <= 1) {
            throw new Error(
                "Cannot remove the last admin"
            );
        }
    }

    await Membership.deleteOne({
        _id: targetMembership._id,
    });

    return true;
};


/* =========================================================
   CHANGE MEMBER ROLE
========================================================= */

export const changeMemberRole = async (
    clerkUserId: string,
    classId: string,
    noticeNestId: string,
    newRole: MembershipRole
) => {
    const requester = await User.findOne({
        clerkUserId,
    });

    if (!requester) {
        throw new Error("User not found");
    }

    const requesterMembership = await Membership.findOne({
        userId: requester._id,
        classId,
    });

    if (!requesterMembership) {
        throw new Error(
            "You are not a member of this class"
        );
    }

    if (requesterMembership.role !== "admin") {
        throw new Error(
            "Only class admins can change member roles"
        );
    }

    const targetUser = await User.findOne({
        noticeNestId: noticeNestId
            .replace(/^@/, "")
            .trim()
            .toUpperCase(),
    });

    if (!targetUser) {
        throw new Error("User not found");
    }

    const targetMembership = await Membership.findOne({
        userId: targetUser._id,
        classId,
    });

    if (!targetMembership) {
        throw new Error(
            "User is not a member of this class"
        );
    }

    // Prevent the class from having zero admins
    if (
        targetMembership.role === "admin" &&
        newRole === "member"
    ) {
        const adminCount = await Membership.countDocuments({
            classId,
            role: "admin",
        });

        if (adminCount <= 1) {
            throw new Error(
                "Cannot demote the last admin"
            );
        }
    }

    targetMembership.role = newRole;

    await targetMembership.save();

    return targetMembership;
};