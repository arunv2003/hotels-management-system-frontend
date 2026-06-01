import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

export const CloudinaryImage = {

  uploadSingleImage: async (file, folderName = "others", onProgress) => {
    try {
      const token = Cookies.get("accessToken");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", folderName);

      const response = await axios.post(
        `${BACKENDURL}/api/cloudinary/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (evt) => {
            if (onProgress && evt.total) {
              onProgress(Math.round((evt.loaded * 100) / evt.total));
            }
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("CloudinaryImage.uploadSingleImage error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
        request: error.request ? "Request was made but no response received" : null,
      });
      throw error;
    }
  },

  uploadMultipleImages: async (files, folderName = "others", onProgress) => {
    try {
      const token = Cookies.get("accessToken");

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("folderName", folderName);

      const response = await axios.post(
        `${BACKENDURL}/api/cloudinary/upload-multiple`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (evt) => {
            if (onProgress && evt.total) {
              onProgress(Math.round((evt.loaded * 100) / evt.total));
            }
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("CloudinaryImage.uploadMultipleImages error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
        request: error.request ? "Request was made but no response received" : null,
      });
      throw error;
    }
  },

  deleteImage: async (publicId) => {
    try {
      const token = Cookies.get("accessToken");

      const response = await axios.delete(
        `${BACKENDURL}/api/cloudinary/delete/${publicId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data;
    } catch (error) {
      console.error("CloudinaryImage.deleteImage error detailed:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
        request: error.request ? "Request was made but no response received" : null,
      });
      throw error;
    }
  },
};
