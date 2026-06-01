import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plans } from "@/routes/saas/plans/plans.route";


export default function Step5Plan({ formData, updateFormData }) {

  const [plans, setPlans] = useState([])


  useEffect(() => {
    let active = true;
    const fetchPlans = async () => {
      try {
        const result = await Plans.getAllActivePlans();
        if (active) {
          setPlans(result?.data || []);
        }
      } catch (error) {
        console.error("Error fetching active plans:", error);
      }
    };
    fetchPlans();
    return () => {
      active = false;
    };
  }, []);

  const selectedPlanObj = plans.find(
    (p) =>
      p._id === formData.planSelected ||
      p.id === formData.planSelected ||
      p.name?.toLowerCase() === formData.planSelected
  ) || plans[0];

  const currentHalfYearlyPrice = selectedPlanObj ? selectedPlanObj.halfYearlyPrice : 0;
  const currentYearlyPrice = selectedPlanObj ? selectedPlanObj.yearlyPrice : 0;
  
  let discountPercent = 0;
  if (currentHalfYearlyPrice > 0 && currentHalfYearlyPrice * 2 > currentYearlyPrice) {
    discountPercent = Math.round(
      (((currentHalfYearlyPrice * 2) - currentYearlyPrice) / (currentHalfYearlyPrice * 2)) * 100
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => {
          const planId = plan._id || plan.id;
          const isSelected = formData.planSelected === planId || formData.planSelected === plan.name?.toLowerCase();
          
          return (
            <div
              key={planId || plan.name}
              onClick={() => updateFormData({ planSelected: planId })}
              className={cn(
                "p-6 rounded-[2rem] border-2 transition-all relative text-center cursor-pointer",
                isSelected
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10"
                  : "border-slate-100 dark:border-slate-800"
              )}
            >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                Popular
              </div>
            )}
            <h4 className="font-bold text-slate-600 dark:text-slate-400 mb-4">
              {plan.name}
            </h4>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{formData.billingCycle === "yearly" ? plan.yearlyPrice : plan.halfYearlyPrice}
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              {formData.billingCycle === "yearly" ? "Year" : "6 Months"}
            </p>
            <div  
              className={cn(
                "w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center",
                isSelected
                  ? "border-indigo-600"
                  : "border-slate-200 dark:border-slate-700"
              )}
            >
              {isSelected && (
                <div className="w-3 h-3 rounded-full bg-indigo-600" />
              )}
            </div>
          </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <Label className="text-xs font-bold uppercase text-slate-400">
          Billing Cycle
        </Label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => updateFormData({ billingCycle: "half-yearly" })}
            className={cn(
              "flex-1 h-14 rounded-2xl border-2 flex items-center gap-4 px-6 transition-all",
              formData.billingCycle === "half-yearly"
                ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10"
                : "border-slate-100 dark:border-slate-800"
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
            <span className="font-bold text-sm">Half-Yearly {currentHalfYearlyPrice ? `(₹${currentHalfYearlyPrice})` : ''}</span>
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ billingCycle: "yearly" })}
            className={cn(
              "flex-1 h-14 rounded-2xl border-2 flex items-center justify-between px-6 transition-all",
              formData.billingCycle === "yearly"
                ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10"
                : "border-slate-100 dark:border-slate-800"
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
              <span className="font-bold text-sm">Yearly {currentYearlyPrice ? `(₹${currentYearlyPrice})` : ''}</span>
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">
                Save {discountPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
        <Label className="text-xs font-bold uppercase text-slate-400">
          Coupon Code (Optional)
        </Label>
        <div className="flex gap-3 mt-2">
          <Input placeholder="Enter coupon code" className="h-12 rounded-xl flex-1" />
          <Button type="button" className="h-12 px-8 rounded-xl bg-indigo-600 text-white">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
