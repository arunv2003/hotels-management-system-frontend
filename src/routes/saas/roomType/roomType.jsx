import apiClient from "@/lib/apiClient";

export const RoomTypeRoute = {
  getAllRoomstype: async () => {
    try {
      const response = await apiClient.get("/api/room/all-room-type");
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
      const response = await apiClient.post("/api/room/create-room-type", roomTypeData);
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
      const response = await apiClient.put(`/api/room/room-type/${_id}`, roomTypeData);
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
      const response = await apiClient.delete(`/api/room/room-type/${_id}`);
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
