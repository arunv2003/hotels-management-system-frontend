import apiClient from "@/lib/apiClient";

export const testimonials = {
  createTestimonials: async (data) => {
    try {
      const response = await apiClient.post("/api/testimonials/create-testimonials", data);
      return response.data;
    } catch (error) {
      console.error("testimonials.createTestimonials error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAllTestimonials: async () => {
    try {
      const response = await apiClient.get("/api/testimonials/all-testimonials");
      return response.data;
    } catch (error) {
      console.error("testimonials.getAllTestimonials error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAllActiveTestimonials: async () => {
    try {
      const response = await apiClient.get("/api/testimonials/all-active-testimonials");
      return response.data;
    } catch (error) {
      console.error("testimonials.getAllActiveTestimonials error:", error.response?.data || error.message);
      throw error;
    }
  },
  updateTestimonials: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/testimonials/testimonial/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("testimonials.updateTestimonials error:", error.response?.data || error.message);
      throw error;
    }
  },
  deletetestimonials: async (id) => {
    try {
      const response = await apiClient.delete(`/api/testimonials/testimonial/${id}`);
      return response.data;
    } catch (error) {
      console.error("testimonials.deletetestimonials error:", error.response?.data || error.message);
      throw error;
    }
  },
  getTestimonialById: async (id) => {
    try {
      const response = await apiClient.get(`/api/testimonials/testimonial/${id}`);
      return response.data;
    } catch (error) {
      console.error("testimonials.getTestimonialById error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export const TestimonialRoutes = testimonials;
export default testimonials;
