import axios from "axios";
import Cookies from "js-cookie";

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
    getProfile: async () => {
        try {
            const token = Cookies.get("accessToken");
            const response = await axios.get(`${BACKENDURL}/api/auth/me`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("superAdminRouted.getProfile error:", error.response?.data || error.message);
            throw error;
        }
    },
    logoutSuperadmin: async () => {
        try {
            const token = Cookies.get("accessToken");
            const response = await axios.post(`${BACKENDURL}/api/auth/logout`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("superAdminRouted.logout error:", error.response?.data || error.message);
            return null;
        }
    },
};