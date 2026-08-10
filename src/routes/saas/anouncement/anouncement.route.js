import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

export const AnnouncementRoutes = {
  getAllAnnouncements: async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${BACKENDURL}/api/announcement/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("AnnouncementRoutes.getAllAnnouncements error:", error);
      throw error;
    }
  },

  getAnnouncementById: async (id) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${BACKENDURL}/api/announcement/get/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("AnnouncementRoutes.getAnnouncementById error:", error);
      throw error;
    }
  },

  createAnnouncement: async (announcementData) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${BACKENDURL}/api/announcement/create`,
        announcementData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("AnnouncementRoutes.createAnnouncement error:", error);
      throw error;
    }
  },

  updateAnnouncement: async (id, announcementData) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `${BACKENDURL}/api/announcement/update/${id}`,
        announcementData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("AnnouncementRoutes.updateAnnouncement error:", error);
      throw error;
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.delete(
        `${BACKENDURL}/api/announcement/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("AnnouncementRoutes.deleteAnnouncement error:", error);
      throw error;
    }
  },

  addClicks: async (id) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `${BACKENDURL}/api/announcement/addClicks/${id}`,
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
      console.error("AnnouncementRoutes.addClicks error:", error);
      throw error;
    }
  },
};
