import apiClient from "@/lib/apiClient";

export const hotelRoomType = {
  createRoomType: async (data) => {
    try {
      const response = await apiClient.post("/api/room/create-room-type", data);
      return response.data;
    } catch (error) {
      console.error("hotelRoomType.createRoomType error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAllRoomTypes: async () => {
    try {
      const response = await apiClient.get("/api/room/all-room-type");
      return response.data;
    } catch (error) {
      console.error("hotelRoomType.getAllRoomTypes error:", error.response?.data || error.message);
      throw error;
    }
  },
};
