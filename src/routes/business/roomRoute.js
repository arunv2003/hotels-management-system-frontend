import apiClient from "@/lib/apiClient";

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
      const response = await apiClient.post("/api/rooms", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create room."),
        data: null,
      };
    }
  },

  getRoomSummary: async () => {
    try {
      const response = await apiClient.get("/api/rooms/summary");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch room summary."),
        data: [],
      };
    }
  },

  getRooms: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/rooms", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch rooms."),
        data: [],
      };
    }
  },

  getRoomById: async (id) => {
    try {
      const response = await apiClient.get(`/api/rooms/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch room details."),
        data: null,
      };
    }
  },

  updateRoom: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/rooms/${id}`, data);
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
      const response = await apiClient.delete(`/api/rooms/${id}`);
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

export default RoomRoute;
