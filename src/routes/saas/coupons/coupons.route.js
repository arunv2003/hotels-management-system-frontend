import apiClient from "@/lib/apiClient";

export const coupons = {
  createCoupon: async (data) => {
    try {
      const response = await apiClient.post("/api/coupons/create-coupon", data);
      return response.data;
    } catch (error) {
      console.error("coupons.createCoupon error:", error.response?.data || error.message);
      throw error;
    }
  },
  createCoupons: async (data) => {
    try {
      const response = await apiClient.post("/api/coupons/create-coupon", data);
      return response.data;
    } catch (error) {
      console.error("coupons.createCoupons error:", error.response?.data || error.message);
      throw error;
    }
  },
  getAllCoupons: async () => {
    try {
      const response = await apiClient.get("/api/coupons/all-coupons");
      return response.data;
    } catch (error) {
      console.error("coupons.getAllCoupons error:", error.response?.data || error.message);
      throw error;
    }
  },
  getCouponById: async (id) => {
    try {
      const response = await apiClient.get(`/api/coupons/get-coupon/${id}`);
      return response.data;
    } catch (error) {
      console.error("coupons.getCouponById error:", error.response?.data || error.message);
      throw error;
    }
  },
  updateCoupon: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/coupons/update-coupon/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("coupons.updateCoupon error:", error.response?.data || error.message);
      throw error;
    }
  },
  deleteCoupon: async (id) => {
    try {
      const response = await apiClient.delete(`/api/coupons/delete-coupon/${id}`);
      return response.data;
    } catch (error) {
      console.error("coupons.deleteCoupon error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export const CouponRoutes = coupons;
export default coupons;
