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

export const InventoryRoute = {
  /**
   * Fetch all inventory items with optional filters
   */
  getInventoryItems: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/inventory`, {
        params,
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch inventory items."),
        data: [],
      };
    }
  },

  /**
   * Fetch inventory KPI stats & summary
   */
  getInventoryStats: async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/inventory/stats`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch inventory stats."),
        data: null,
      };
    }
  },

  /**
   * Fetch a single inventory item by ID
   */
  getInventoryItemById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/inventory/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch inventory item details."),
        data: null,
      };
    }
  },

  /**
   * Create a new inventory item
   */
  createInventoryItem: async (data) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/inventory`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create inventory item."),
        data: null,
      };
    }
  },

  /**
   * Update an existing inventory item
   */
  updateInventoryItem: async (id, data) => {
    try {
      const response = await axios.put(
        `${BACKENDURL}/api/inventory/${id}`,
        data,
        {
          headers: getHeaders(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update inventory item."),
        data: null,
      };
    }
  },

  /**
   * Adjust stock (Stock In, Stock Out, Consumed, Damaged)
   */
  adjustStock: async (id, payload) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/inventory/${id}/adjust-stock`,
        payload,
        {
          headers: getHeaders(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to adjust stock."),
        data: null,
      };
    }
  },

  /**
   * Delete an inventory item
   */
  deleteInventoryItem: async (id) => {
    try {
      const response = await axios.delete(
        `${BACKENDURL}/api/inventory/${id}`,
        {
          headers: getHeaders(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete inventory item."),
        data: null,
      };
    }
  },

  /**
   * Get stock movement audit logs
   */
  getInventoryLogs: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/inventory/logs`, {
        params,
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch stock logs."),
        data: [],
      };
    }
  },

  /**
   * Seed demo items for housekeeping & restaurant
   */
  seedDemoItems: async () => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/inventory/seed`,
        {},
        {
          headers: getHeaders(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to seed demo items."),
        data: null,
      };
    }
  },
};
