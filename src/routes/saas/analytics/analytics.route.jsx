import apiClient from "@/lib/apiClient";

export const SaaSAnalyticsRoute = {
  // Payment Stats & Revenue Metrics
  getPaymentStats: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/payment-stats");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getPaymentStats error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Transactions list
  getTransactions: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/saas-analytics/transactions", { params });
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getTransactions error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Refund transaction
  refundTransaction: async (id) => {
    try {
      const response = await apiClient.put(`/api/saas-analytics/transactions/${id}/refund`);
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.refundTransaction error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Overview Analytics (Growth, Plan Distribution, Load)
  getAnalyticsOverview: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/overview");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getAnalyticsOverview error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Active Tenants Usage & Health
  getHotelUsage: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/hotels-usage");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getHotelUsage error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Platform Reports & Revenue History
  getPlatformReports: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/reports");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getPlatformReports error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Generate Report
  generateReport: async (data) => {
    try {
      const response = await apiClient.post("/api/saas-analytics/reports/generate", data);
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.generateReport error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Aliases for backwards compatibility
  getStats: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/payment-stats");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getStats error:", error.response?.data || error.message);
      throw error;
    }
  },
  getGrowth: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/overview");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getGrowth error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAnalytics: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/overview");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getAnalytics error:", error.response?.data || error.message);
      throw error;
    }
  },
  getReports: async () => {
    try {
      const response = await apiClient.get("/api/saas-analytics/reports");
      return response.data;
    } catch (error) {
      console.error("SaaSAnalyticsRoute.getReports error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export const saasAnalytics = SaaSAnalyticsRoute;
export default SaaSAnalyticsRoute;
