import apiClient from "@/lib/apiClient";

export const StaffRoles = {
  getAllRoles: async () => {
    try {
      const response = await apiClient.get("/api/staff-roles/all-roles");
      return response.data;
    } catch (error) {
      console.error("StaffRoles.getAllRoles error:", error.response?.data || error.message);
      throw error;
    }
  },

  getRoleById: async (id) => {
    try {
      const response = await apiClient.get(`/api/staff-roles/role/${id}`);
      return response.data;
    } catch (error) {
      console.error("StaffRoles.getRoleById error:", error.response?.data || error.message);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await apiClient.post("/api/staff-roles/create-role", roleData);
      return response.data;
    } catch (error) {
      console.error("StaffRoles.createRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const response = await apiClient.put(`/api/staff-roles/role/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error("StaffRoles.updateRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await apiClient.delete(`/api/staff-roles/role/${id}`);
      return response.data;
    } catch (error) {
      console.error("StaffRoles.deleteRole error:", error.response?.data || error.message);
      throw error;
    }
  },
};
