import User, { IUser } from "../models/User";
import generateNoticeNestId from "../utils/generateNoticeNestId";

interface ClerkUserData {
    clerkUserId: string;
    name: string;
    email: string;
}

export const getOrCreateUser = async (
    clerkUserData: ClerkUserData
): Promise<IUser> => {
    const { clerkUserId, name, email } = clerkUserData;

    let user = await User.findOne({ clerkUserId });

    // User already exists
    if (user) {
        // Existing users created before NoticeNest IDs were introduced
        // will not have a noticeNestId yet.
        if (!user.noticeNestId) {
            user.noticeNestId = generateNoticeNestId();
            await user.save();
        }

        return user;
    }

    // Create a new user
    let noticeNestId = generateNoticeNestId();

    // Make sure the generated ID is unique
    while (await User.exists({ noticeNestId })) {
        noticeNestId = generateNoticeNestId();
    }

    user = await User.create({
        clerkUserId,
        noticeNestId,
        name,
        email,
    });

    return user;
};


export const findUserByNoticeNestId = async (
    noticeNestId: string
): Promise<IUser | null> => {
    const normalizedId = noticeNestId
        .replace(/^@/, "")
        .trim()
        .toUpperCase();

    const user = await User.findOne({
        noticeNestId: normalizedId,
    });

    return user;
};