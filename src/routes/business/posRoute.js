import apiClient from "@/lib/apiClient";

const extractErrorMessage = (error, defaultMsg) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0] ||
    error.message ||
    defaultMsg
  );
};

export const PosRoute = {
  // Menu Item endpoints
  getMenuItems: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/pos/items", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch menu items."),
        data: [],
      };
    }
  },

  createMenuItem: async (data) => {
    try {
      const response = await apiClient.post("/api/pos/items", data);
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
      const response = await apiClient.put(`/api/pos/items/${id}`, data);
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
      const response = await apiClient.delete(`/api/pos/items/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete menu item."),
        data: null,
      };
    }
  },

  // POS Order endpoints
  createOrder: async (data) => {
    try {
      const response = await apiClient.post("/api/pos/orders", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create POS order."),
        data: null,
      };
    }
  },

  createPosOrder: async (data) => {
    try {
      const response = await apiClient.post("/api/pos/orders", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create POS order."),
        data: null,
      };
    }
  },

  getOrders: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/pos/orders", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch POS orders."),
        data: [],
      };
    }
  },

  getPosOrders: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/pos/orders", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch POS orders."),
        data: [],
      };
    }
  },

  updateOrderStatus: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/pos/orders/${id}/status`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update POS order status."),
        data: null,
      };
    }
  },

  getPosOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/api/pos/orders/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch POS order details."),
        data: null,
      };
    }
  },

  updatePosOrder: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/pos/orders/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update POS order."),
        data: null,
      };
    }
  },

  deletePosOrder: async (id) => {
    try {
      const response = await apiClient.delete(`/api/pos/orders/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete POS order."),
        data: null,
      };
    }
  },
};

export default PosRoute;
