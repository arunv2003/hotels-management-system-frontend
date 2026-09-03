"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plans } from "@/routes/saas/plans/plans.route";
import { PaymentRoute } from "@/routes/saas/payment/payment.route";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function RenewPlanModal({
  isOpen,
  onClose,
  hotelId,
  hotelName = "Hotel",
  ownerEmail = "",
  currentPlanName = "",
  onSuccess,
}) {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await Plans.getAllActivePlans();
        if (active) {
          const fetched = res?.data || [];
          setPlans(fetched);
          if (fetched.length > 0) {
            const match = fetched.find(
              (p) =>
                p.name?.toLowerCase() === currentPlanName?.toLowerCase() ||
                p._id === currentPlanName
            );
            const defaultPlan = match || fetched.find((p) => p.isPopular) || fetched[0];
            setSelectedPlanId(defaultPlan?._id || defaultPlan?.id || "");
          }
        }
      } catch (err) {
        console.error("Failed to load active plans for renewal:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPlans();
    return () => {
      active = false;
    };
  }, [isOpen, currentPlanName]);

  if (!isOpen) return null;

  const selectedPlan =
    plans.find((p) => p._id === selectedPlanId || p.id === selectedPlanId) ||
    plans[0];

  const halfYearlyPrice = selectedPlan ? Number(selectedPlan.halfYearlyPrice) : 0;
  const yearlyPrice = selectedPlan ? Number(selectedPlan.yearlyPrice) : 0;
  const activePrice = billingCycle === "yearly" ? yearlyPrice : halfYearlyPrice;

  const handleRenewPayment = async () => {
    if (!selectedPlanId) {
      notify("Please select a subscription plan.", "error");
      return;
    }

    setProcessingPayment(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      // Create Razorpay Order
      const orderRes = await PaymentRoute.createPlanOrder({
        planId: selectedPlanId,
        billingCycle,
        hotelName,
        ownerEmail,
      });

      const orderData = orderRes?.data;
      if (!orderData?.orderId) {
        throw new Error("Failed to initialize Razorpay renewal order.");
      }

      const razorpayOptions = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RqJtOyGfDiW0vw",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "VEDANTA TECH SaaS",
        description: `Plan Renewal: ${selectedPlan?.name || "Subscription"} (${billingCycle === "yearly" ? "1 Year" : "6 Months"})`,
        order_id: orderData.orderId,
        prefill: {
          email: ownerEmail,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async function (razorpayResponse) {
          try {
            await PaymentRoute.verifyPlanPayment({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              hotelId,
              planId: selectedPlanId,
              billingCycle,
              amount: orderData.amount / 100,
            });

            notify(`Plan renewed successfully! Your subscription is now active.`, "success");
            setProcessingPayment(false);
            if (onSuccess) onSuccess();
            onClose();
          } catch (verErr) {
            console.error("Renewal verification failed:", verErr);
            notify("Payment captured, activating subscription...", "info");
            if (onSuccess) onSuccess();
            onClose();
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            notify("Renewal payment cancelled.", "info");
          },
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on("payment.failed", function (failResp) {
        setProcessingPayment(false);
        notify(failResp?.error?.description || "Payment failed. Please try again.", "error");
      });
      rzp.open();
    } catch (err) {
      console.error("Renewal error:", err);
      notify(err?.response?.data?.message || err.message || "Failed to initiate renewal.", "error");
      setProcessingPayment(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Renew Subscription Plan
                </h3>
                <p className="text-xs text-slate-500">
                  {hotelName} • Reactivate & extend your hotel management ecosystem
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={processingPayment}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-slate-500 font-medium">Loading subscription plans...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Plan Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {plans.map((p) => {
                  const pId = p._id || p.id;
                  const isSelected = selectedPlanId === pId;
                  const price = billingCycle === "yearly" ? p.yearlyPrice : p.halfYearlyPrice;

                  return (
                    <div
                      key={pId}
                      onClick={() => setSelectedPlanId(pId)}
                      className={cn(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all relative text-center bg-slate-50 dark:bg-slate-800/40",
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md"
                          : "border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                      )}
                    >
                      {p.isPopular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          Popular
                        </span>
                      )}
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
                        {p.name}
                      </h4>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{price}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                        per {billingCycle === "yearly" ? "Year" : "6 Mos"}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Billing Cycle Switch */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setBillingCycle("half-yearly")}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl font-bold text-xs transition-all",
                    billingCycle === "half-yearly"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  Half-Yearly (6 Months)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5",
                    billingCycle === "yearly"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <span>Yearly (12 Months)</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                    Save 15%
                  </span>
                </button>
              </div>

              {/* Payment Summary Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                      Total Payable
                    </span>
                    <h2 className="text-3xl font-black mt-1">₹{activePrice}</h2>
                    <p className="text-xs text-indigo-100 mt-0.5">
                      {selectedPlan?.name || "Selected Plan"} • {billingCycle === "yearly" ? "1 Year Extension" : "6 Months Extension"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    disabled={processingPayment || activePrice <= 0}
                    onClick={handleRenewPayment}
                    className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-extrabold shadow-lg transition-transform hover:scale-105"
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Opening Razorpay...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ₹{activePrice} & Renew
                      </>
                    )}
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>256-Bit Encrypted Razorpay Bank Level Secure Checkout</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
