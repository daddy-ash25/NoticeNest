import { useAuth } from "@clerk/react";

interface CreateClassData {
    name: string;
    description?: string;
    membersCanCreateNotices?: boolean;
    memberUserIds?: string[];
}

export const useClassApi = () => {
    const { getToken } = useAuth();

    const createClass = async (classData: CreateClassData) => {
        const token = await getToken();

        const response = await fetch(
            "http://localhost:5000/api/classes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(classData),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to create class"
            );
        }

        return data;
    };

    const addClassMember = async (
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
                body: JSON.stringify({
                    noticeNestId,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to add member"
            );
        }

        return data;
    };

    const getUserClasses = async () => {
        const token = await getToken();

        const response = await fetch(
            "http://localhost:5000/api/classes",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to get classes"
            );
        }

        return data.classes;
    };

    const getClassMembers = async (
        classId: string
    ) => {
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
            throw new Error(
                data.message || "Failed to get class members"
            );
        }

        return data.members;
    };

    return {
        createClass,
        getUserClasses,
        addClassMember,
        getClassMembers,
    };
};