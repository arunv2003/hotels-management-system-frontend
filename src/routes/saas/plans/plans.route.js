import apiClient from "@/lib/apiClient";

export const Plans = {
  getAllPlans: async () => {
    try {
      const response = await apiClient.get("/api/plans/all-plans");
      return response.data;
    } catch (error) {
      console.error("Plans.getAllPlans error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAllActivePlans: async () => {
    try {
      const response = await apiClient.get("/api/plans/all-active-plans");
      return response.data;
    } catch (error) {
      console.error("Plans.getAllActivePlans error:", error.response?.data || error.message);
      throw error;
    }
  },
  makePopular: async (planId) => {
    try {
      const response = await apiClient.patch(`/api/plans/make-popular/${planId}`, {});
      return response.data;
    } catch (error) {
      console.error("Plans.makePopular error:", error.response?.data || error.message);
      throw error;
    }
  },
  createPlan: async (planData) => {
    try {
      const response = await apiClient.post("/api/plans/create-plans", planData);
      return response.data;
    } catch (error) {
      console.error("Plans.createPlan error:", error.response?.data || error.message);
      throw error;
    }
  },
  updatePlan: async (planId, planData) => {
    try {
      const response = await apiClient.put(`/api/plans/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error("Plans.updatePlan error:", error.response?.data || error.message);
      throw error;
    }
  },
  deletePlan: async (planId) => {
    try {
      const response = await apiClient.delete(`/api/plans/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error("Plans.deletePlan error:", error.response?.data || error.message);
      throw error;
    }
  },
  getPlanById: async (planId) => {
    try {
      const response = await apiClient.get(`/api/plans/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error("Plans.getPlanById error:", error.response?.data || error.message);
      throw error;
    }
  },
};
