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
    <div className="space-y-3.5 pb-2">
      {/* Plans Grid */}
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
                "p-4 rounded-2xl border transition-all relative text-center bg-slate-950/40 select-none cursor-pointer",
                paymentVerified ? "opacity-75 cursor-default" : "hover:border-slate-700",
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                  : "border-slate-800"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
                  Most Popular
                </div>
              )}
              <h4 className="font-semibold text-slate-300 text-xs sm:text-sm mb-1">
                {plan.name}
              </h4>
              <p className="text-xl sm:text-2xl font-black text-white">
                ₹
                {formData.billingCycle === "yearly"
                  ? plan.yearlyPrice
                  : plan.halfYearlyPrice}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 mb-3">
                per {formData.billingCycle === "yearly" ? "Year" : "6 Months"}
              </p>

              <div
                className={cn(
                  "w-4 h-4 rounded-full border mx-auto flex items-center justify-center transition-all",
                  isSelected
                    ? "border-indigo-500 bg-indigo-600"
                    : "border-slate-700"
                )}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Billing Cycle Selection */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-300">
          Select Billing Cycle <span className="text-rose-500">*</span>
        </Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={paymentVerified}
            onClick={() => updateFormData({ billingCycle: "half-yearly" })}
            className={cn(
              "flex-1 h-11 rounded-2xl border flex items-center gap-3 px-4 transition-all bg-slate-950/40 text-xs sm:text-sm cursor-pointer",
              formData.billingCycle === "half-yearly"
                ? "border-indigo-500/60 bg-indigo-500/15 text-white font-semibold ring-1 ring-indigo-500/30"
                : "border-slate-800 text-slate-300 hover:border-slate-700",
              paymentVerified && "opacity-75 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                formData.billingCycle === "half-yearly"
                  ? "border-indigo-500 bg-indigo-600"
                  : "border-slate-700"
              )}
            >
              {formData.billingCycle === "half-yearly" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <span>
              Half-Yearly{" "}
              {currentHalfYearlyPrice ? `(₹${currentHalfYearlyPrice})` : ""}
            </span>
          </button>

          <button
            type="button"
            disabled={paymentVerified}
            onClick={() => updateFormData({ billingCycle: "yearly" })}
            className={cn(
              "flex-1 h-11 rounded-2xl border flex items-center justify-between px-4 transition-all bg-slate-950/40 text-xs sm:text-sm cursor-pointer",
              formData.billingCycle === "yearly"
                ? "border-indigo-500/60 bg-indigo-500/15 text-white font-semibold ring-1 ring-indigo-500/30"
                : "border-slate-800 text-slate-300 hover:border-slate-700",
              paymentVerified && "opacity-75 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                  formData.billingCycle === "yearly"
                    ? "border-indigo-500 bg-indigo-600"
                    : "border-slate-700"
                )}
              >
                {formData.billingCycle === "yearly" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span>
                Yearly{" "}
                {currentYearlyPrice ? `(₹${currentYearlyPrice})` : ""}
              </span>
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Save {discountPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="pt-2 border-t border-slate-800/80">
        <Label className="text-xs font-semibold text-slate-300">
          Coupon Code <span className="text-[11px] text-slate-500 font-normal">(Optional)</span>
        </Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            placeholder="Enter coupon code"
            disabled={paymentVerified}
            value={formData.couponCode || ""}
            onChange={(e) => updateFormData({ couponCode: e.target.value })}
            className="h-10 rounded-xl flex-1 text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 uppercase"
          />
          <Button
            type="button"
            disabled={paymentVerified}
            className="h-10 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Final Step: Razorpay Action & Summary Card */}
      {isFinalStep && (
        <div
          className={cn(
            "p-4 sm:p-5 rounded-2xl text-white relative overflow-hidden shadow-lg transition-all",
            paymentVerified
              ? "bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-500/20"
              : "bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-indigo-500/20"
          )}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                {paymentVerified ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" /> Payment Received
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" /> Razorpay Instant Activation
                  </>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                {paymentVerified
                  ? `Payment Successful: ₹${activePrice}`
                  : `Total Payable: ₹${activePrice}`}
              </h3>
              <p className="text-white/90 text-xs mt-0.5">
                Plan:{" "}
                <span className="font-bold text-white">
                  {selectedPlanObj?.name || "Selected Plan"}
                </span>{" "}
                ({isYearly ? "1 Year Subscription" : "6 Months Subscription"})
              </p>
              {paymentVerified && paymentDetails?.razorpay_payment_id && (
                <p className="text-[10px] text-emerald-100 font-mono mt-0.5">
                  Payment ID: {paymentDetails.razorpay_payment_id}
                </p>
              )}
            </div>

            <div className="w-full sm:w-auto flex-shrink-0">
              {paymentVerified ? (
                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/30">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Verified! Click Complete Setup below</span>
                </div>
              ) : (
                <Button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={onInitiatePayment}
                  className="w-full sm:w-auto h-10 px-5 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 text-xs sm:text-sm font-extrabold shadow-md hover:scale-105 transition-all"
                >
                  {isProcessingPayment
                    ? "Opening Razorpay..."
                    : `Pay ₹${activePrice} with Razorpay`}
                </Button>
              )}
            </div>
          </div>

          <div className="relative z-10 pt-2.5 mt-2.5 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/80 gap-1.5">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
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
        </div>
      )}
    </div>
  );
}
