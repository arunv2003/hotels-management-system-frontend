import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";
console.log("BACKENDURL:", BACKENDURL);
export const RoomTypeRoute = {
  getAllRoomstype: async () => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Fetching all room types with token:", token);

      const response = await axios.get(`${BACKENDURL}/api/room/all-room-type`, {
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
  createRoomsType: async (roomTypeData) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Creating room type with token:", token);

      const response = await axios.post(
        `${BACKENDURL}/api/room/create-room-type`,
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
  updateRoomsType: async (_id, roomTypeData) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Updating room type with token:", token);

      const response = await axios.put(
        `${BACKENDURL}/api/room/room-type/${_id}`,
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
  deleteRoomsType: async (_id) => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Deleting room type with token:", token);

      const response = await axios.delete(
        `${BACKENDURL}/api/room/room-type/${_id}`,
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
