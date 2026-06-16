import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

const getHeaders = () => {
  const token = Cookies.get("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const Roles = {
  getAllRoles: async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/roles/all-roles`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Roles.getAllRoles error:", error.response?.data || error.message);
      throw error;
    }
  },

  getRoleById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/roles/role/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Roles.getRoleById error:", error.response?.data || error.message);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/roles/create-role`,
        roleData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Roles.createRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const response = await axios.put(
        `${BACKENDURL}/api/roles/role/${id}`,
        roleData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Roles.updateRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await axios.delete(
        `${BACKENDURL}/api/roles/role/${id}`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Roles.deleteRole error:", error.response?.data || error.message);
      throw error;
    }
  },
};
