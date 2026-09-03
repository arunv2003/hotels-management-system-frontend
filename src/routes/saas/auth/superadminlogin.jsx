import apiClient from "@/lib/apiClient";
import Cookies from "js-cookie";

export const superAdminRouted = {
    loginSuperadmin: async (data) => {
        try {
            const response = await apiClient.post("/api/auth/superadmin/login", data);
            return response.data;
        } catch (error) {
            console.error("superAdminRouted.loginSuperadmin error detailed:", {
                message: error.message,
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
            const response = await apiClient.get("/api/auth/me");
            return response.data;
        } catch (error) {
            console.error("superAdminRouted.getProfile error:", error.response?.data || error.message);
            throw error;
        }
    },
    refreshToken: async (refreshToken) => {
        try {
            const token = refreshToken || Cookies.get("refreshToken");
            const response = await apiClient.post("/api/auth/refresh-token", { refreshToken: token });
            return response.data;
        } catch (error) {
            console.error("superAdminRouted.refreshToken error:", error.response?.data || error.message);
            throw error;
        }
    },
    logoutSuperadmin: async () => {
        try {
            const response = await apiClient.post("/api/auth/logout", {});
            return response.data;
        } catch (error) {
            console.error("superAdminRouted.logout error:", error.response?.data || error.message);
            return null;
        }
    },
};