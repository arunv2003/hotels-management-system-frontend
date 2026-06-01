import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

const getAuthHeaders = () => {
  const token = Cookies.get("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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
      const response = await axios.post(
        `${BACKENDURL}/api/hotels/register`,
        hotelData,
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      logError("registerHotel", error);
      throw error;
    }
  },

 
  getAllHotels: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/hotels/all`, {
        headers: getAuthHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      logError("getAllHotels", error);
      throw error;
    }
  },

  getHotelById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/hotels/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      logError("getHotelById", error);
      throw error;
    }
  },

  updateHotel: async (id, hotelData) => {
    try {
      const response = await axios.put(
        `${BACKENDURL}/api/hotels/${id}`,
        hotelData,
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      logError("updateHotel", error);
      throw error;
    }
  },

  deleteHotel: async (id) => {
    try {
      const response = await axios.delete(`${BACKENDURL}/api/hotels/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      logError("deleteHotel", error);
      throw error;
    }
  },


  toggleHotelStatus: async (id) => {
    try {
      const response = await axios.patch(
        `${BACKENDURL}/api/hotels/${id}/toggle-status`,
        {},
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      logError("toggleHotelStatus", error);
      throw error;
    }
  },
};
