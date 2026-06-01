import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

export const Employee = {
  createEmployee: async (data) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Creating employee with token:", token);

      const response = await axios.post(`${BACKENDURL}/api/employees/create-employee`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Employee.createEmployee error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      throw error;
    }
  },
  getAllEmployees: async () => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Fetching all employees with token:", token);

      const response = await axios.get(`${BACKENDURL}/api/employees/get-all-employees`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Employee.getAllEmployees error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      throw error;
    }
  },
};


