import apiClient from "@/lib/apiClient";

const extractErrorMessage = (error, defaultMsg) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0] ||
    error.message ||
    defaultMsg
  );
};

export const ReportRoute = {
  getReports: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/reports", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch reports."),
        data: [],
      };
    }
  },

  createReport: async (data) => {
    try {
      const response = await apiClient.post("/api/reports", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to generate report."),
        data: null,
      };
    }
  },

  deleteReport: async (id) => {
    try {
      const response = await apiClient.delete(`/api/reports/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete report."),
        data: null,
      };
    }
  },
};
