import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plans } from "@/routes/saas/plans/plans.route";
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function Step5Plan({
  formData,
  updateFormData,
  isFinalStep = false,
  onInitiatePayment,
  isProcessingPayment = false,
  paymentVerified = false,
  paymentDetails = null,
}) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchPlans = async () => {
      try {
        const result = await Plans.getAllActivePlans();
        if (active) {
          const fetchedPlans = result?.data || [];
          setPlans(fetchedPlans);

          if (fetchedPlans.length > 0) {
            const currentSelected = fetchedPlans.find(
              (p) =>
                p._id === formData.planSelected ||
                p.id === formData.planSelected ||
                p.name?.toLowerCase() === formData.planSelected ||
                p.slug === formData.planSelected
            );
            const defaultPlan =
              currentSelected ||
              fetchedPlans.find((p) => p.isPopular) ||
              fetchedPlans[0];
            const planId = defaultPlan._id || defaultPlan.id;

            if (planId && formData.planSelected !== planId) {
              updateFormData({ planSelected: planId });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching active plans:", error);
      }
    };
    fetchPlans();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlanObj =
    plans.find(
      (p) =>
        p._id === formData.planSelected ||
        p.id === formData.planSelected ||
        p.name?.toLowerCase() === formData.planSelected
    ) || plans[0];

  const currentHalfYearlyPrice = selectedPlanObj
    ? Number(selectedPlanObj.halfYearlyPrice)
    : 0;
  const currentYearlyPrice = selectedPlanObj
    ? Number(selectedPlanObj.yearlyPrice)
    : 0;

  const isYearly = formData.billingCycle === "yearly";
  const activePrice = isYearly ? currentYearlyPrice : currentHalfYearlyPrice;

  let discountPercent = 0;
  if (
    currentHalfYearlyPrice > 0 &&
    currentHalfYearlyPrice * 2 > currentYearlyPrice
  ) {
    discountPercent = Math.round(
      ((currentHalfYearlyPrice * 2 - currentYearlyPrice) /
        (currentHalfYearlyPrice * 2)) *
        100
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const planId = plan._id || plan.id;
          const isSelected =
            formData.planSelected === planId ||
            formData.planSelected === plan.name?.toLowerCase();

          return (
            <div
              key={planId || plan.name}
              onClick={() => {
                if (!paymentVerified) {
                  updateFormData({ planSelected: planId });
                }
              }}
              className={cn(
                "p-6 rounded-[2rem] border-2 transition-all relative text-center bg-white dark:bg-slate-900 shadow-sm",
                paymentVerified ? "opacity-80 cursor-default" : "cursor-pointer hover:border-indigo-400",
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-200/80 dark:border-slate-800"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
              )}
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-2">
                {plan.name}
              </h4>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                ₹
                {formData.billingCycle === "yearly"
                  ? plan.yearlyPrice
                  : plan.halfYearlyPrice}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1 mb-6">
                per {formData.billingCycle === "yearly" ? "Year" : "6 Months"}
              </p>

              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center transition-all",
                  isSelected
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-slate-300 dark:border-slate-700"
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Billing Cycle Selection */}
      <div className="space-y-3">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Select Billing Cycle <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            disabled={paymentVerified}
            onClick={() => updateFormData({ billingCycle: "half-yearly" })}
            className={cn(
              "flex-1 h-14 rounded-2xl border-2 flex items-center gap-4 px-6 transition-all bg-white dark:bg-slate-900",
              formData.billingCycle === "half-yearly"
                ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200"
                : "border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300",
              paymentVerified && "opacity-80 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                formData.billingCycle === "half-yearly"
                  ? "border-indigo-600"
                  : "border-slate-300 dark:border-slate-600"
              )}
            >
              {formData.billingCycle === "half-yearly" && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              )}
            </div>
            <span className="font-bold text-sm">
              Half-Yearly{" "}
              {currentHalfYearlyPrice ? `(₹${currentHalfYearlyPrice})` : ""}
            </span>
          </button>

          <button
            type="button"
            disabled={paymentVerified}
            onClick={() => updateFormData({ billingCycle: "yearly" })}
            className={cn(
              "flex-1 h-14 rounded-2xl border-2 flex items-center justify-between px-6 transition-all bg-white dark:bg-slate-900",
              formData.billingCycle === "yearly"
                ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200"
                : "border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300",
              paymentVerified && "opacity-80 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  formData.billingCycle === "yearly"
                    ? "border-indigo-600"
                    : "border-slate-300 dark:border-slate-600"
                )}
              >
                {formData.billingCycle === "yearly" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                )}
              </div>
              <span className="font-bold text-sm">
                Yearly{" "}
                {currentYearlyPrice ? `(₹${currentYearlyPrice})` : ""}
              </span>
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                Save {discountPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Coupon Code (Optional)
        </Label>
        <div className="flex gap-3 mt-2">
          <Input
            placeholder="Enter promo or coupon code"
            disabled={paymentVerified}
            value={formData.couponCode || ""}
            onChange={(e) => updateFormData({ couponCode: e.target.value })}
            className="h-12 rounded-xl flex-1"
          />
          <Button
            type="button"
            disabled={paymentVerified}
            className="h-12 px-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Final Step: Razorpay Action & Summary Card */}
      {isFinalStep && (
        <div
          className={cn(
            "p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl transition-all",
            paymentVerified
              ? "bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-500/30"
              : "bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-indigo-500/30"
          )}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-2">
                {paymentVerified ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" /> Payment Received
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Razorpay Instant Activation
                  </>
                )}
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                {paymentVerified
                  ? `Payment Successful: ₹${activePrice}`
                  : `Total Payable: ₹${activePrice}`}
              </h3>
              <p className="text-white/90 text-sm max-w-md mt-1">
                Plan:{" "}
                <span className="font-bold text-white">
                  {selectedPlanObj?.name || "Selected Plan"}
                </span>{" "}
                ({isYearly ? "1 Year Subscription" : "6 Months Subscription"})
              </p>
              {paymentVerified && paymentDetails?.razorpay_payment_id && (
                <p className="text-xs text-emerald-100 font-mono mt-1">
                  Payment ID: {paymentDetails.razorpay_payment_id}
                </p>
              )}
            </div>

            <div className="w-full md:w-auto flex-shrink-0">
              {paymentVerified ? (
                <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/30">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Verified! Click Complete Setup below</span>
                </div>
              ) : (
                <Button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={onInitiatePayment}
                  className="w-full md:w-auto h-14 px-8 rounded-2xl bg-white text-indigo-700 hover:bg-slate-100 text-base font-extrabold shadow-xl hover:scale-105 transition-all"
                >
                  {isProcessingPayment
                    ? "Opening Razorpay..."
                    : `Pay ₹${activePrice} with Razorpay`}
                </Button>
              )}
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-xs text-white/90 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>256-Bit SSL Bank Level Payment Security</span>
            </div>
            <div>
              By confirming, you agree to our{" "}
              <Link
                href="/terms-and-conditions"
                target="_blank"
                className="text-white underline font-bold"
              >
                Terms
              </Link>{" "}
              &{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-white underline font-bold"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
        </div>
      )}
    </div>
  );
}
