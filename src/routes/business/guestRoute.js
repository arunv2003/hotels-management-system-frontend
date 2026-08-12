import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const getHeaders = () => {
  const token = Cookies.get("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const extractErrorMessage = (error, defaultMsg) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0] ||
    error.message ||
    defaultMsg
  );
};

export const GuestRoute = {
  getGuests: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/guests`, {
        headers: getHeaders(),
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch guests."),
        data: [],
      };
    }
  },

  getGuestById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/guests/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch guest details."),
        data: null,
      };
    }
  },

  createGuest: async (data) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/guests`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create guest."),
        data: null,
      };
    }
  },

  updateGuest: async (id, data) => {
    try {
      const response = await axios.put(`${BACKENDURL}/api/guests/${id}`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update guest."),
        data: null,
      };
    }
  },

  deleteGuest: async (id) => {
    try {
      const response = await axios.delete(`${BACKENDURL}/api/guests/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete guest."),
        data: null,
      };
    }
  },
};
