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

export const RoomRoute = {
  createRoom: async (data) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/rooms`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create room."),
        data: null,
      };
    }
  },

  getRooms: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/rooms`, {
        headers: getHeaders(),
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch rooms."),
        data: [],
      };
    }
  },

  getRoomSummary: async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/rooms/summary`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch room types summary."),
        data: [],
      };
    }
  },

  updateRoom: async (id, data) => {
    try {
      const response = await axios.put(`${BACKENDURL}/api/rooms/${id}`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update room."),
        data: null,
      };
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await axios.delete(`${BACKENDURL}/api/rooms/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete room."),
        data: null,
      };
    }
  },
};
