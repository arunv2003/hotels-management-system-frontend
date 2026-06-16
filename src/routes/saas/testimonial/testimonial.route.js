import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";
console.log("BACKENDURL:", BACKENDURL);
export const TestimonialRoutes = {
  getAllTestimonials: async () => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Fetching all room types with token:", token);

      const response = await axios.get(`${BACKENDURL}/api/testimonials/all-testimonials`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("RoomTypeRoute.getAllRoomstype error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
      });
      throw error;
    }
  },
  createTestimonials: async (roomTypeData) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Creating room type with token:", token);

      const response = await axios.post(
        `${BACKENDURL}/api/testimonials/create-testimonials`,
        roomTypeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("RoomTypeRoute.createRoomsType error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
      });
      throw error;
    }
  },
  updateTestimonials: async (_id, roomTypeData) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Updating room type with token:", token);

      const response = await axios.put(
        `${BACKENDURL}/api/testimonials/testimonial/${_id}`,
        roomTypeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("RoomTypeRoute.updateRoomsType error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
      });
      throw error;
    }
  },
  deletetestimonials: async (_id) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Deleting room type with token:", token);

      const response = await axios.delete(
        `${BACKENDURL}/api/testimonials/testimonial/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("RoomTypeRoute.deleteRoomsType error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
      });
      throw error;
    }
  },
};
