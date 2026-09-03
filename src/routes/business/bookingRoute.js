import apiClient from "@/lib/apiClient";

const extractErrorMessage = (error, defaultMsg) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0] ||
    error.message ||
    defaultMsg
  );
};

export const BookingRoute = {
  createBookingRazorpayOrder: async (data) => {
    try {
      const response = await apiClient.post("/api/bookings/create-razorpay-order", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create Razorpay order."),
        data: null,
      };
    }
  },

  createBooking: async (data) => {
    try {
      const response = await apiClient.post("/api/bookings", data);
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
      const response = await apiClient.get("/api/bookings", { params });
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
      const response = await apiClient.get(`/api/bookings/${id}`);
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
      const response = await apiClient.put(`/api/bookings/${id}`, data);
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
      const response = await apiClient.delete(`/api/bookings/${id}`);
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
