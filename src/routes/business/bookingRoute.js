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

export const BookingRoute = {
  createBooking: async (data) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/bookings`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create booking."),
        data: null,
      };
    }
  },

  getBookings: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/bookings`, {
        headers: getHeaders(),
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch bookings."),
        data: [],
      };
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/bookings/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch booking details."),
        data: null,
      };
    }
  },

  updateBooking: async (id, data) => {
    try {
      const response = await axios.put(`${BACKENDURL}/api/bookings/${id}`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update booking."),
        data: null,
      };
    }
  },

  deleteBooking: async (id) => {
    try {
      const response = await axios.delete(`${BACKENDURL}/api/bookings/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete booking."),
        data: null,
      };
    }
  },
};
