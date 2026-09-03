import apiClient from "@/lib/apiClient";

export const siteSettingsRoute = {
  // Public settings (for landing, privacy policy, contact us, about us, etc.)
  getPublicSettings: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/settings/public", { params });
      return response.data;
    } catch (error) {
      console.error("siteSettingsRoute.getPublicSettings error:", error);
      throw error;
    }
  },

  // SaaS Super Admin Settings
  getSaaSSettings: async () => {
    try {
      const response = await apiClient.get("/api/settings/saas");
      return response.data;
    } catch (error) {
      console.error("siteSettingsRoute.getSaaSSettings error:", error);
      throw error;
    }
  },

  updateSaaSSettings: async (data) => {
    try {
      const response = await apiClient.put("/api/settings/saas", data);
      return response.data;
    } catch (error) {
      console.error("siteSettingsRoute.updateSaaSSettings error:", error);
      throw error;
    }
  },

  // Hotel Admin / Owner Settings
  getHotelSettings: async () => {
    try {
      const response = await apiClient.get("/api/settings/hotel");
      return response.data;
    } catch (error) {
      console.error("siteSettingsRoute.getHotelSettings error:", error);
      throw error;
    }
  },

  updateHotelSettings: async (data) => {
    try {
      const response = await apiClient.put("/api/settings/hotel", data);
      return response.data;
    } catch (error) {
      console.error("siteSettingsRoute.updateHotelSettings error:", error);
      throw error;
    }
  },
};
