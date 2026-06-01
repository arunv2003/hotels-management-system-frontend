import axios from "axios";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

export const superAdminRouted = {
    loginSuperadmin: async (data) => {
        try {
            const response = await axios.post(`${BACKENDURL}/api/auth/superadmin/login`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("superAdminRouted.loginSuperadmin error detailed:", {
                message: error.message,
                name: error.name,
                code: error.code,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            throw error;
        }
    },
};