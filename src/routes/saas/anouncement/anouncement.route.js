import apiClient from "@/lib/apiClient";

export const Announcement = {
  createAnnouncement: async (data) => {
    try {
      const response = await apiClient.post("/api/announcement/create-announcement", data);
      return response.data;
    } catch (error) {
      console.error("Announcement.createAnnouncement error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAllAnnouncements: async () => {
    try {
      const response = await apiClient.get("/api/announcement/all-announcements");
      return response.data;
    } catch (error) {
      console.error("Announcement.getAllAnnouncements error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAnnouncementById: async (id) => {
    try {
      const response = await apiClient.get(`/api/announcement/get-announcement/${id}`);
      return response.data;
    } catch (error) {
      console.error("Announcement.getAnnouncementById error:", error.response?.data || error.message);
      throw error;
    }
  },
  updateAnnouncement: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/announcement/update-announcement/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Announcement.updateAnnouncement error:", error.response?.data || error.message);
      throw error;
    }
  },
  deleteAnnouncement: async (id) => {
    try {
      const response = await apiClient.delete(`/api/announcement/delete-announcement/${id}`);
      return response.data;
    } catch (error) {
      console.error("Announcement.deleteAnnouncement error:", error.response?.data || error.message);
      throw error;
    }
  },
  addClicks: async (id) => {
    try {
      const response = await apiClient.put(`/api/announcement/add-clicks/${id}`);
      return response.data;
    } catch (error) {
      console.error("Announcement.addClicks error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export const AnnouncementRoutes = Announcement;
export default Announcement;
