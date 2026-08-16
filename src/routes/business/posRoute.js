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

export const PosRoute = {
  getMenuItems: async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/pos/items`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch POS menu items."),
        data: [],
      };
    }
  },

  createMenuItem: async (data) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/pos/items`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create menu item."),
        data: null,
      };
    }
  },

  updateMenuItem: async (id, data) => {
    try {
      const response = await axios.put(`${BACKENDURL}/api/pos/items/${id}`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update menu item."),
        data: null,
      };
    }
  },

  deleteMenuItem: async (id) => {
    try {
      const response = await axios.delete(`${BACKENDURL}/api/pos/items/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete menu item."),
        data: null,
      };
    }
  },

  seedMenuItems: async () => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/pos/items/seed`, {}, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to seed menu items."),
        data: [],
      };
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/pos/orders`, orderData, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create POS order."),
        data: null,
      };
    }
  },

  getOrders: async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/pos/orders`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch POS orders."),
        data: [],
      };
    }
  },

  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await axios.patch(`${BACKENDURL}/api/pos/orders/${id}/status`, statusData, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update order status."),
        data: null,
      };
    }
  },
};
