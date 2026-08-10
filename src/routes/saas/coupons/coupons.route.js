import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

export const CouponRoutes = {
  getAllCoupons: async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${BACKENDURL}/api/coupons/all_coupons`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("CouponRoutes.getAllCoupons error:", error);
      throw error;
    }
  },

  getCouponById: async (id) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${BACKENDURL}/api/coupons/get_coupon/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("CouponRoutes.getCouponById error:", error);
      throw error;
    }
  },

  createCoupon: async (couponData) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${BACKENDURL}/api/coupons/create`,
        couponData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("CouponRoutes.createCoupon error:", error);
      throw error;
    }
  },

  updateCoupon: async (id, couponData) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `${BACKENDURL}/api/coupons/update_coupon/${id}`,
        couponData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("CouponRoutes.updateCoupon error:", error);
      throw error;
    }
  },

  deleteCoupon: async (id) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.delete(
        `${BACKENDURL}/api/coupons/delete_coupon/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("CouponRoutes.deleteCoupon error:", error);
      throw error;
    }
  },
};
