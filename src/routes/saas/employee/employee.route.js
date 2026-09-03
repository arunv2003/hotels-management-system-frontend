import apiClient from "@/lib/apiClient";

export const Employee = {
  createEmployee: async (data) => {
    try {
      const response = await apiClient.post("/api/employees/create-employee", data);
      return response.data;
    } catch (error) {
      console.error("Employee.createEmployee error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAllEmployees: async () => {
    try {
      const response = await apiClient.get("/api/employees/get-all-employees");
      return response.data;
    } catch (error) {
      console.error("Employee.getAllEmployees error:", error.response?.data || error.message);
      throw error;
    }
  },
};
