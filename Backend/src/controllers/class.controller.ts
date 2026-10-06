import { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

import { getOrCreateUser } from "../services/user.service";
import {
    createClass,
    getUserClasses,
    addClassMember,
    getClassMembers,
} from "../services/class.service";

export const createClassController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Get the authenticated Clerk user
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

        // Make sure the Clerk user also exists
        // as a NoticeNest user in MongoDB.
        await getOrCreateUser({
            clerkUserId: userId,
            name: name || "User",
            email,
        });

        // Get class data sent by the frontend
        const {
            name: className,
            description,
            membersCanCreateNotices,
            memberUserIds,
        } = req.body;

        // Basic validation
        if (
            !className ||
            typeof className !== "string" ||
            !className.trim()
        ) {
            res.status(400).json({
                message: "Class name is required",
            });
            return;
        }

        // Create the class
        const newClass = await createClass(userId, {
            name: className,
            description,
            membersCanCreateNotices,
            memberUserIds,
        });

        res.status(201).json({
            message: "Class created successfully",
            class: newClass,
        });
    } catch (error) {
        console.error("Create class error:", error);

        res.status(500).json({
            message: "Failed to create class",
        });
    }
};


export const getUserClassesController = async (
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

        const memberships = await getUserClasses(userId);

        res.status(200).json({
            classes: memberships,
        });
    } catch (error) {
        console.error("Get user classes error:", error);

        res.status(500).json({
            message: "Failed to get classes",
        });
    }
};


export const addClassMemberController = async (
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

        const { classId } = req.params;
        const { noticeNestId } = req.body;

        if (!noticeNestId || typeof noticeNestId !== "string") {
            res.status(400).json({
                message: "NoticeNest ID is required",
            });
            return;
        }

        const membership = await addClassMember(
            userId,
            classId,
            noticeNestId
        );

        res.status(201).json({
            message: "Member added successfully",
            membership,
        });
    } catch (error) {
        console.error("Add class member error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to add member";

        if (
            message === "User not found" ||
            message === "User to add not found"
        ) {
            res.status(404).json({
                message,
            });
            return;
        }

        if (
            message === "You are not a member of this class" ||
            message === "Only class admins can add members"
        ) {
            res.status(403).json({
                message,
            });
            return;
        }

        if (
            message === "User is already a member of this class"
        ) {
            res.status(409).json({
                message,
            });
            return;
        }

        res.status(500).json({
            message: "Failed to add member",
        });
    }
};


export const getClassMembersController = async (
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

        const { classId } = req.params;

        const members = await getClassMembers(
            userId,
            classId
        );

        res.status(200).json({
            members,
        });
    } catch (error) {
        console.error("Get class members error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to get class members";

        if (message === "User not found") {
            res.status(404).json({ message });
            return;
        }

        if (
            message ===
            "You are not a member of this class"
        ) {
            res.status(403).json({ message });
            return;
        }

        res.status(500).json({
            message: "Failed to get class members",
        });
    }
};