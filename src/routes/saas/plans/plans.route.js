import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";
console.log("BACKENDURL:", BACKENDURL);
export const Plans = {
  getAllPlans: async () => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Fetching all plans with token:", token);

      const response = await axios.get(`${BACKENDURL}/api/plans/all-plans`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Plans.getAllPlans error detailed:", {
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
  getAllActivePlans: async () => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Fetching all active plans with token:", token);

      const response = await axios.get(`${BACKENDURL}/api/plans/all-active-plans`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Plans.getAllActivePlans error detailed:", {
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
  makePopular: async (planId) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Making plan popular with token:", token);

      const response = await axios.patch(
        `${BACKENDURL}/api/plans/make-popular/${planId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Plans.makePopular error detailed:", {
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
  createPlan: async (planData) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Creating plan with token:", token);

      const response = await axios.post(
        `${BACKENDURL}/api/plans/create-plans`,
        planData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Plans.createPlan error detailed:", {
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
