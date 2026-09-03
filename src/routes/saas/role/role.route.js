import apiClient from "@/lib/apiClient";

export const Roles = {
  getAllRoles: async () => {
    try {
      const response = await apiClient.get("/api/roles/all-roles");
      return response.data;
    } catch (error) {
      console.error("Roles.getAllRoles error:", error.response?.data || error.message);
      throw error;
    }
  },

  getRoleById: async (id) => {
    try {
      const response = await apiClient.get(`/api/roles/role/${id}`);
      return response.data;
    } catch (error) {
      console.error("Roles.getRoleById error:", error.response?.data || error.message);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await apiClient.post("/api/roles/create-role", roleData);
      return response.data;
    } catch (error) {
      console.error("Roles.createRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const response = await apiClient.put(`/api/roles/role/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error("Roles.updateRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await apiClient.delete(`/api/roles/role/${id}`);
      return response.data;
    } catch (error) {
      console.error("Roles.deleteRole error:", error.response?.data || error.message);
      throw error;
    }
  },
};
