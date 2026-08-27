import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKENDURL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

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

export const payrollRoute = {
  /**
   * Get salary slips with filters & search
   */
  getSalarySlips: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/payroll`, {
        params,
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch salary slips."),
        data: { salarySlips: [], total: 0 },
      };
    }
  },

  /**
   * Get payroll summary statistics
   */
  getPayrollSummary: async (params = {}) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/payroll/summary`, {
        params,
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch payroll summary."),
        data: null,
      };
    }
  },

  /**
   * Get a single salary slip by ID
   */
  getSalarySlipById: async (id) => {
    try {
      const response = await axios.get(`${BACKENDURL}/api/payroll/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to fetch salary slip details."),
        data: null,
      };
    }
  },

  /**
   * Create a new salary slip
   */
  createSalarySlip: async (data) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/payroll`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to create salary slip."),
        data: null,
      };
    }
  },

  /**
   * Auto-generate salary slips for all staff for a given month & year
   */
  bulkGenerateSalarySlips: async (data) => {
    try {
      const response = await axios.post(`${BACKENDURL}/api/payroll/bulk-generate`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to bulk generate salary slips."),
        data: null,
      };
    }
  },

  /**
   * Update an existing salary slip
   */
  updateSalarySlip: async (id, data) => {
    try {
      const response = await axios.put(`${BACKENDURL}/api/payroll/${id}`, data, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update salary slip."),
        data: null,
      };
    }
  },

  /**
   * Update payment status of salary slip (Paid/Unpaid)
   */
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const response = await axios.patch(
        `${BACKENDURL}/api/payroll/${id}/status`,
        { paymentStatus },
        {
          headers: getHeaders(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to update payment status."),
        data: null,
      };
    }
  },

  /**
   * Delete a salary slip
   */
  deleteSalarySlip: async (id) => {
    try {
      const response = await axios.delete(`${BACKENDURL}/api/payroll/${id}`, {
        headers: getHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, "Failed to delete salary slip."),
        data: null,
      };
    }
  },
};
