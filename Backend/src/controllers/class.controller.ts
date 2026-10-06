import { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

import {
    createClass,
    getUserClasses,
    getClassDetails,
    updateClass,
    deleteClass,
    getClassMembers,
    addClassMember,
    removeClassMember,
    changeMemberRole,
} from "../services/class.service";

export const createClassController = async (
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

        const clerkUser = await clerkClient.users.getUser(
            userId
        );

        const name = [
            clerkUser.firstName,
            clerkUser.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        const email =
            clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
            res.status(400).json({
                message: "User does not have an email address",
            });
            return;
        }

        const {
            name: className,
            description,
            membersCanCreateNotices,
            memberUserIds,
        } = req.body;

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

        // Ensure local NoticeNest user exists
        const { getOrCreateUser } = await import(
            "../services/user.service"
        );

        await getOrCreateUser({
            clerkUserId: userId,
            name: name || "User",
            email,
        });

        const newClass = await createClass(userId, {
            name: className.trim(),
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


/* =========================================================
   GET USER CLASSES
========================================================= */

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


/* =========================================================
   GET CLASS DETAILS
========================================================= */

export const getClassDetailsController = async (
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

        const result = await getClassDetails(
            userId,
            classId
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("Get class details error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to get class details";

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

        if (message === "Class not found") {
            res.status(404).json({ message });
            return;
        }

        res.status(500).json({
            message: "Failed to get class details",
        });
    }
};


/* =========================================================
   UPDATE CLASS
========================================================= */

export const updateClassController = async (
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

        const {
            name,
            description,
            membersCanCreateNotices,
        } = req.body;

        if (
            name === undefined &&
            description === undefined &&
            membersCanCreateNotices === undefined
        ) {
            res.status(400).json({
                message: "No changes provided",
            });
            return;
        }

        if (
            name !== undefined &&
            (typeof name !== "string" || !name.trim())
        ) {
            res.status(400).json({
                message: "Class name must be a non-empty string",
            });
            return;
        }

        if (
            membersCanCreateNotices !== undefined &&
            typeof membersCanCreateNotices !== "boolean"
        ) {
            res.status(400).json({
                message:
                    "membersCanCreateNotices must be a boolean",
            });
            return;
        }

        const updatedClass = await updateClass(
            userId,
            classId,
            {
                name:
                    name !== undefined
                        ? name.trim()
                        : undefined,
                description,
                membersCanCreateNotices,
            }
        );

        res.status(200).json({
            message: "Class updated successfully",
            class: updatedClass,
        });
    } catch (error) {
        console.error("Update class error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to update class";

        if (
            message === "User not found" ||
            message === "Class not found"
        ) {
            res.status(404).json({ message });
            return;
        }

        if (
            message ===
                "You are not a member of this class" ||
            message ===
                "Only class admins can update class settings"
        ) {
            res.status(403).json({ message });
            return;
        }

        res.status(500).json({
            message: "Failed to update class",
        });
    }
};


/* =========================================================
   DELETE CLASS
========================================================= */

export const deleteClassController = async (
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

        await deleteClass(userId, classId);

        res.status(200).json({
            message: "Class deleted successfully",
        });
    } catch (error) {
        console.error("Delete class error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete class";

        if (
            message === "User not found" ||
            message === "Class not found"
        ) {
            res.status(404).json({ message });
            return;
        }

        if (
            message ===
                "You are not a member of this class" ||
            message ===
                "Only class admins can delete this class"
        ) {
            res.status(403).json({ message });
            return;
        }

        res.status(500).json({
            message: "Failed to delete class",
        });
    }
};


/* =========================================================
   GET CLASS MEMBERS
========================================================= */

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


/* =========================================================
   ADD MEMBER
========================================================= */

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

        if (
            !noticeNestId ||
            typeof noticeNestId !== "string"
        ) {
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
            res.status(404).json({ message });
            return;
        }

        if (
            message ===
                "You are not a member of this class" ||
            message ===
                "Only class admins can add members"
        ) {
            res.status(403).json({ message });
            return;
        }

        if (
            message ===
            "User is already a member of this class"
        ) {
            res.status(409).json({ message });
            return;
        }

        res.status(500).json({
            message: "Failed to add member",
        });
    }
};


/* =========================================================
   REMOVE MEMBER
========================================================= */

export const removeClassMemberController = async (
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

        const { classId, noticeNestId } = req.params;

        await removeClassMember(
            userId,
            classId,
            noticeNestId
        );

        res.status(200).json({
            message: "Member removed successfully",
        });
    } catch (error) {
        console.error(
            "Remove class member error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to remove member";

        if (
            message === "User not found" ||
            message === "User to remove not found"
        ) {
            res.status(404).json({ message });
            return;
        }

        if (
            message ===
                "You are not a member of this class" ||
            message ===
                "Only class admins can remove members"
        ) {
            res.status(403).json({ message });
            return;
        }

        if (
            message ===
                "User is not a member of this class" ||
            message ===
                "Cannot remove the last admin"
        ) {
            res.status(400).json({ message });
            return;
        }

        res.status(500).json({
            message: "Failed to remove member",
        });
    }
};


/* =========================================================
   CHANGE MEMBER ROLE
========================================================= */

export const changeMemberRoleController = async (
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

        const {
            classId,
            noticeNestId,
        } = req.params;

        const { role } = req.body;

        if (role !== "admin" && role !== "member") {
            res.status(400).json({
                message:
                    "Role must be either admin or member",
            });
            return;
        }

        const membership = await changeMemberRole(
            userId,
            classId,
            noticeNestId,
            role
        );

        res.status(200).json({
            message: "Member role updated successfully",
            membership,
        });
    } catch (error) {
        console.error(
            "Change member role error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to change member role";

        if (
            message === "User not found" ||
            message === "User not found"
        ) {
            res.status(404).json({ message });
            return;
        }

        if (
            message ===
                "You are not a member of this class" ||
            message ===
                "Only class admins can change member roles"
        ) {
            res.status(403).json({ message });
            return;
        }

        if (
            message ===
                "User is not a member of this class" ||
            message ===
                "Cannot demote the last admin"
        ) {
            res.status(400).json({ message });
            return;
        }

        res.status(500).json({
            message: "Failed to change member role",
        });
    }
};