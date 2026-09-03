import apiClient from "@/lib/apiClient";

export const CloudinaryImage = {
  uploadSingleImage: async (file, folderName = "others", onProgress) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", folderName);

      const response = await apiClient.post("/api/cloudinary/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });

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
      });
      throw error;
    }
  },

  uploadMultipleImages: async (files, folderName = "others", onProgress) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("folderName", folderName);

      const response = await apiClient.post("/api/cloudinary/upload-multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });

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
      });
      throw error;
    }
  },

  deleteImage: async (publicId) => {
    try {
      const response = await apiClient.delete(`/api/cloudinary/delete/${publicId}`);
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
      });
      throw error;
    }
  },
};
