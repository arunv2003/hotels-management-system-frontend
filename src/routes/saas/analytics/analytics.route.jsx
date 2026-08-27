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
  console.error(`SaaSAnalyticsRoute.${methodName} error:`, {
    message: error.message,
    name: error.name,
    response: error.response
      ? { status: error.response.status, data: error.response.data }
      : null,
  });
};

export const SaaSAnalyticsRoute = {
  getPaymentStats: async () => {
    try {
      const response = await axios.get(
        `${BACKENDURL}/api/saas-analytics/payment-stats`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logError("getPaymentStats", error);
      throw error;
    }
  },

  getTransactions: async (params = {}) => {
    try {
      const response = await axios.get(
        `${BACKENDURL}/api/saas-analytics/transactions`,
        { headers: getAuthHeaders(), params }
      );
      return response.data;
    } catch (error) {
      logError("getTransactions", error);
      throw error;
    }
  },

  refundTransaction: async (id) => {
    try {
      const response = await axios.put(
        `${BACKENDURL}/api/saas-analytics/transactions/${id}/refund`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logError("refundTransaction", error);
      throw error;
    }
  },

  getAnalyticsOverview: async () => {
    try {
      const response = await axios.get(
        `${BACKENDURL}/api/saas-analytics/overview`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logError("getAnalyticsOverview", error);
      throw error;
    }
  },

  getHotelUsage: async () => {
    try {
      const response = await axios.get(
        `${BACKENDURL}/api/saas-analytics/hotels-usage`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logError("getHotelUsage", error);
      throw error;
    }
  },

  getPlatformReports: async () => {
    try {
      const response = await axios.get(
        `${BACKENDURL}/api/saas-analytics/reports`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logError("getPlatformReports", error);
      throw error;
    }
  },

  generateReport: async (reportData) => {
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/saas-analytics/reports/generate`,
        reportData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logError("generateReport", error);
      throw error;
    }
  },
};
