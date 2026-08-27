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

export const StaffRoute = {
  getAllStaff: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/staffs/all`, {
        headers: getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error("StaffRoute.getAllStaff error:", error.response?.data || error.message);
      throw error;
    }
  },

  getStaffById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/staffs/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("StaffRoute.getStaffById error:", error.response?.data || error.message);
      throw error;
    }
  },

  createStaff: async (staffData) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/staffs/create`,
        staffData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("StaffRoute.createStaff error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      const response = await axios.put(
        `${BACKENDURL}/api/staffs/${id}`,
        staffData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("StaffRoute.updateStaff error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteStaff: async (id) => {
    try {
      const response = await axios.delete(
        `${BACKENDURL}/api/staffs/${id}`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("StaffRoute.deleteStaff error:", error.response?.data || error.message);
      throw error;
    }
  },
};
