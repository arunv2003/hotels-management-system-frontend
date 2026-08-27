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

export const StaffRoles = {
  getAllRoles: async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/staff-roles/all-roles`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("StaffRoles.getAllRoles error:", error.response?.data || error.message);
      throw error;
    }
  },

  getRoleById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/staff-roles/role/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("StaffRoles.getRoleById error:", error.response?.data || error.message);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/staff-roles/create-role`,
        roleData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("StaffRoles.createRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const response = await axios.put(
        `${BACKENDURL}/api/staff-roles/role/${id}`,
        roleData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("StaffRoles.updateRole error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await axios.delete(
        `${BACKENDURL}/api/staff-roles/role/${id}`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("StaffRoles.deleteRole error:", error.response?.data || error.message);
      throw error;
    }
  },
};
