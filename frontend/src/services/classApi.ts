import { useAuth } from "@clerk/react";
import { useCallback } from "react";

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

export const useClassApi = () => {
    const { getToken } = useAuth();

    const createClass = useCallback(async (classData: CreateClassData) => {
        const token = await getToken();

        const response = await fetch("http://localhost:5000/api/classes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(classData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create class");
        }

        return data;
    }, [getToken]);

    const getUserClasses = useCallback(async () => {
        const token = await getToken();

        const response = await fetch("http://localhost:5000/api/classes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get classes");
        }

        return data.classes;
    }, [getToken]);

    const getClassDetails = useCallback(async (classId: string) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/classes/${classId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get class details");
        }

        return data;
    }, [getToken]);

    const updateClass = useCallback(async (
        classId: string,
        updateData: UpdateClassData
    ) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/classes/${classId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update class");
        }

        return data;
    }, [getToken]);

    const deleteClass = useCallback(async (classId: string) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/classes/${classId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete class");
        }

        return data;
    }, [getToken]);

    const getClassMembers = useCallback(async (classId: string) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/classes/${classId}/members`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get class members");
        }

        return data.members;
    }, [getToken]);

    const addClassMember = useCallback(async (
        classId: string,
        noticeNestId: string
    ) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/classes/${classId}/members`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ noticeNestId }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add member");
        }

        return data;
    }, [getToken]);

    const removeClassMember = useCallback(async (
        classId: string,
        noticeNestId: string
    ) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/classes/${classId}/members/${encodeURIComponent(
                noticeNestId
            )}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to remove member");
        }

        return data;
    }, [getToken]);

    const changeMemberRole = useCallback(async (
        classId: string,
        noticeNestId: string,
        role: "admin" | "member"
    ) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/classes/${classId}/members/${encodeURIComponent(
                noticeNestId
            )}/role`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to change member role");
        }

        return data;
    }, [getToken]);

    return {
        createClass,
        getUserClasses,
        getClassDetails,
        updateClass,
        deleteClass,
        getClassMembers,
        addClassMember,
        removeClassMember,
        changeMemberRole,
    };
};
