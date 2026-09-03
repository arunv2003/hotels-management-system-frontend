import apiClient from "@/lib/apiClient";

export const StaffRoute = {
  getAllStaff: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/staffs/all", { params });
      return response.data;
    } catch (error) {
      console.error("StaffRoute.getAllStaff error:", error.response?.data || error.message);
      throw error;
    }
  },

  getStaffById: async (id) => {
    try {
      const response = await apiClient.get(`/api/staffs/${id}`);
      return response.data;
    } catch (error) {
      console.error("StaffRoute.getStaffById error:", error.response?.data || error.message);
      throw error;
    }
  },

  createStaff: async (staffData) => {
    try {
      const response = await apiClient.post("/api/staffs/create", staffData);
      return response.data;
    } catch (error) {
      console.error("StaffRoute.createStaff error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      const response = await apiClient.put(`/api/staffs/${id}`, staffData);
      return response.data;
    } catch (error) {
      console.error("StaffRoute.updateStaff error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteStaff: async (id) => {
    try {
      const response = await apiClient.delete(`/api/staffs/${id}`);
      return response.data;
    } catch (error) {
      console.error("StaffRoute.deleteStaff error:", error.response?.data || error.message);
      throw error;
    }
  },
};
