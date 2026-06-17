"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEmployeeContext } from "@/context/employee.contex";
import {
  User,
  MapPin,
  Briefcase,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/ToastProvider";
import PersonalStep from "./steps/PersonalStep";
import AddressStep from "./steps/AddressStep";
import ProfessionalStep from "./steps/ProfessionalStep";
import DocumentStep from "./steps/DocumentStep";
import { Employee } from "../../../routes/saas/employee/employee.route";
import { useRouter } from "next/navigation";
const steps = [
  { id: 0, title: "Personal", icon: User },
  { id: 1, title: "Address", icon: MapPin },
  { id: 2, title: "Professional", icon: Briefcase },
  { id: 3, title: "Documents", icon: FileText },
];

export default function EmployeeCreateForm() {
  const { notify } = useToast();
 const router = useRouter();
  const { currentStep, nextStep, prevStep, setStep, formData } =
    useEmployeeContext();

  const isLastStep = currentStep === steps.length - 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLastStep) {
      const payload = { ...formData };
      delete payload.profileImagePreview;

      if (payload.profileImage && typeof payload.profileImage !== "string") {
        payload.profileImage = "";
      }

      if (payload.documents && typeof payload.documents === "object") {
        payload.documents = Object.fromEntries(
          Object.entries(payload.documents)
            .filter(([, value]) => value && (value.cloudUrl || value.publicId))
            .map(([key, value]) => [key, { cloudUrl: value.cloudUrl, publicId: value.publicId }])
        );
      }

      console.log("Form Submitted Successfully:", payload);
      await Employee.createEmployee(payload);
      router.push("/super-admin/employees");
      notify("Employee created successfully", "success");
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalStep />;
      case 1:
        return <AddressStep />;
      case 2:
        return <ProfessionalStep />;
      case 3:
        return <DocumentStep />;
      default:
        return null;
    }
  };

  return (
    <div className=" mx-auto w-full">
      {/* Stepper Header */}
      <div className="mb-10 relative">
        <div className="flex justify-between items-center relative z-10">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-3 relative z-10"
                onClick={() => isCompleted && setStep(step.id)}
                style={{ cursor: isCompleted ? "pointer" : "default" }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 scale-110"
                      : isCompleted
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? <Check size={24} /> : <step.icon size={24} />}
                </div>
                <span
                  className={`text-sm font-bold ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : isCompleted
                        ? "text-emerald-500"
                        : "text-slate-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar line */}
        <div className="absolute top-7 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 -z-0 rounded-full px-8">
          <div className="w-full h-full relative">
            <div
              className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Area */}
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-xl border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl"
      >
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {steps[currentStep].title} Details
                </h2>
                <p className="text-slate-500 mt-1">
                  Please provide the {steps[currentStep].title.toLowerCase()}{" "}
                  information for the new employee.
                </p>
              </div>

              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`gap-2 h-12 px-6 rounded-xl font-bold ${currentStep === 0 ? "invisible" : ""}`}
          >
            <ChevronLeft size={20} />
            Back
          </Button>

          <Button
            type="submit"
            className="gap-2 h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30"
          >
            {isLastStep ? "Create Employee" : "Next Step"}
            {!isLastStep && <ChevronRight size={20} />}
          </Button>
        </div>
      </form>
    </div>
  );
}
