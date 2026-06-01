import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";
console.log("BACKENDURL:", BACKENDURL);
export const Roles = {
  getAllRoles: async () => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Fetching all roles with token:", token);

      const response = await axios.get(`${BACKENDURL}/api/roles/all-roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Roles.getAllRoles error detailed:", {
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
  createRole: async (roleData) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Creating role with token:", token);

      const response = await axios.post(
        `${BACKENDURL}/api/roles/create`,
        roleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Roles.createRole error detailed:", {
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
