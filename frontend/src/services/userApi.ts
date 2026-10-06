import { useAuth } from "@clerk/react";

export const useUserApi = () => {
    const { getToken } = useAuth();

    const findUserByNoticeNestId = async (
        noticeNestId: string
    ) => {
        const token = await getToken();

        const response = await fetch(
            `http://localhost:5000/api/users/search/${encodeURIComponent(
                noticeNestId
            )}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to find user");
        }

        return data.user;
    };

    return {
        findUserByNoticeNestId,
    };
};