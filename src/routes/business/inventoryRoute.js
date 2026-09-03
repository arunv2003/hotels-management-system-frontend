import apiClient from "@/lib/apiClient";

const extractErrorMessage = (error, defaultMsg) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0] ||
    error.message ||
    defaultMsg
  );
};

export const InventoryRoute = {
  getInventoryStats: async () => {
    try {
      const response = await apiClient.get("/api/inventory/stats");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch inventory stats."),
        data: null,
      };
    }
  },

  getInventoryLogs: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/inventory/logs", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch inventory logs."),
        data: [],
      };
    }
  },

  getInventoryItems: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/inventory", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch inventory items."),
        data: [],
      };
    }
  },

  createInventoryItem: async (data) => {
    try {
      const response = await apiClient.post("/api/inventory", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create inventory item."),
        data: null,
      };
    }
  },

  getInventoryItemById: async (id) => {
    try {
      const response = await apiClient.get(`/api/inventory/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch item details."),
        data: null,
      };
    }
  },

  updateInventoryItem: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/inventory/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update item."),
        data: null,
      };
    }
  },

  adjustStock: async (id, data) => {
    try {
      const response = await apiClient.post(`/api/inventory/${id}/adjust-stock`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to adjust stock."),
        data: null,
      };
    }
  },

  deleteInventoryItem: async (id) => {
    try {
      const response = await apiClient.delete(`/api/inventory/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete item."),
        data: null,
      };
    }
  },
};

export default InventoryRoute;
