import apiClient from "@/lib/apiClient";

const logError = (methodName, error) => {
  console.error(`HotelRoute.${methodName} error:`, {
    message: error.message,
    name: error.name,
    code: error.code,
    response: error.response
      ? { status: error.response.status, data: error.response.data }
      : null,
  });
};

export const HotelRoute = {
  registerHotel: async (hotelData) => {
    try {
      const response = await apiClient.post("/api/hotels/register", hotelData);
      return response.data;
    } catch (error) {
      logError("registerHotel", error);
      throw error;
    }
  },

  getAllHotels: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/hotels/all", { params });
      return response.data;
    } catch (error) {
      logError("getAllHotels", error);
      throw error;
    }
  },

  getHotelById: async (id) => {
    try {
      const response = await apiClient.get(`/api/hotels/${id}`);
      return response.data;
    } catch (error) {
      logError("getHotelById", error);
      throw error;
    }
  },

  updateHotel: async (id, hotelData) => {
    try {
      const response = await apiClient.put(`/api/hotels/${id}`, hotelData);
      return response.data;
    } catch (error) {
      logError("updateHotel", error);
      throw error;
    }
  },

  deleteHotel: async (id) => {
    try {
      const response = await apiClient.delete(`/api/hotels/${id}`);
      return response.data;
    } catch (error) {
      logError("deleteHotel", error);
      throw error;
    }
  },

  toggleHotelStatus: async (id) => {
    try {
      const response = await apiClient.patch(`/api/hotels/${id}/toggle-status`, {});
      return response.data;
    } catch (error) {
      logError("toggleHotelStatus", error);
      throw error;
    }
  },
};
