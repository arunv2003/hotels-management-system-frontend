import apiClient from "@/lib/apiClient";

const extractErrorMessage = (error, defaultMsg) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0] ||
    error.message ||
    defaultMsg
  );
};

export const PayrollRoute = {
  getSalarySlips: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/payroll", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch salary slips."),
        data: [],
      };
    }
  },

  getPayrolls: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/payroll", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch payroll records."),
        data: [],
      };
    }
  },

  getPayrollSummary: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/payroll/summary", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch payroll summary."),
        data: null,
      };
    }
  },

  getSalarySlipById: async (id) => {
    try {
      const response = await apiClient.get(`/api/payroll/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch salary slip details."),
        data: null,
      };
    }
  },

  getPayrollById: async (id) => {
    try {
      const response = await apiClient.get(`/api/payroll/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch payroll details."),
        data: null,
      };
    }
  },

  createSalarySlip: async (data) => {
    try {
      const response = await apiClient.post("/api/payroll", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create salary slip."),
        data: null,
      };
    }
  },

  createPayroll: async (data) => {
    try {
      const response = await apiClient.post("/api/payroll", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create payroll record."),
        data: null,
      };
    }
  },

  bulkGenerateSalarySlips: async (data) => {
    try {
      const response = await apiClient.post("/api/payroll/bulk-generate", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to bulk generate salary slips."),
        data: null,
      };
    }
  },

  updateSalarySlip: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/payroll/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update salary slip."),
        data: null,
      };
    }
  },

  updatePayroll: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/payroll/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update payroll record."),
        data: null,
      };
    }
  },

  updatePaymentStatus: async (id, statusOrData) => {
    try {
      const payload = typeof statusOrData === "string" ? { paymentStatus: statusOrData } : statusOrData;
      const response = await apiClient.patch(`/api/payroll/${id}/status`, payload);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update payment status."),
        data: null,
      };
    }
  },

  deleteSalarySlip: async (id) => {
    try {
      const response = await apiClient.delete(`/api/payroll/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete salary slip."),
        data: null,
      };
    }
  },

  deletePayroll: async (id) => {
    try {
      const response = await apiClient.delete(`/api/payroll/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete payroll record."),
        data: null,
      };
    }
  },
};

export const payrollRoute = PayrollRoute;
export default PayrollRoute;
