import apiClient from "@/lib/apiClient";

const extractErrorMessage = (error, defaultMsg) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0] ||
    error.message ||
    defaultMsg
  );
};

export const GuestRoute = {
  createGuest: async (data) => {
    try {
      const response = await apiClient.post("/api/guests", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create guest."),
        data: null,
      };
    }
  },

  getGuests: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/guests", { params });
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
      const response = await apiClient.get(`/api/guests/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch guest details."),
        data: null,
      };
    }
  },

  updateGuest: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/guests/${id}`, data);
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
      const response = await apiClient.delete(`/api/guests/${id}`);
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
