import apiClient from "@/lib/apiClient";

export const PaymentRoute = {
  getRazorpayKey: async () => {
    try {
      const response = await apiClient.get("/api/payment/razorpay-key");
      return response.data;
    } catch (error) {
      console.error("PaymentRoute.getRazorpayKey error:", error);
      throw error;
    }
  },

  createPlanOrder: async (data) => {
    try {
      const response = await apiClient.post("/api/payment/create-order", data);
      return response.data;
    } catch (error) {
      console.error("PaymentRoute.createPlanOrder error:", error);
      throw error;
    }
  },

  verifyPlanPayment: async (data) => {
    try {
      const response = await apiClient.post("/api/payment/verify", data);
      return response.data;
    } catch (error) {
      console.error("PaymentRoute.verifyPlanPayment error:", error);
      throw error;
    }
  },

  renewHotelPlan: async (data) => {
    try {
      const response = await apiClient.post("/api/payment/renew", data);
      return response.data;
    } catch (error) {
      console.error("PaymentRoute.renewHotelPlan error:", error);
      throw error;
    }
  },
};
