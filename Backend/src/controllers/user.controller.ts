import { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";

import {
    getOrCreateUser,
    findUserByNoticeNestId,
} from "../services/user.service";

export const getMe = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Get the authenticated Clerk user ID
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        // Get the user's profile from Clerk
        const clerkUser = await clerkClient.users.getUser(userId);

        const name = [
            clerkUser.firstName,
            clerkUser.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
            res.status(400).json({
                message: "User does not have an email address",
            });
            return;
        }

        // Find the user in MongoDB, or create them if this is
        // their first authenticated request.
        const user = await getOrCreateUser({
            clerkUserId: userId,
            name: name || "User",
            email,
        });

        res.status(200).json({
            user,
        });
    } catch (error) {
        console.error("Get current user error:", error);

        res.status(500).json({
            message: "Failed to get current user",
        });
    }
};

export const findUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        const { noticeNestId } = req.params;

        if (!noticeNestId) {
            res.status(400).json({
                message: "NoticeNest ID is required",
            });
            return;
        }

        const user = await findUserByNoticeNestId(noticeNestId);

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            user: {
                noticeNestId: user.noticeNestId,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Find user error:", error);

        res.status(500).json({
            message: "Failed to find user",
        });
    }
};