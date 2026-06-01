"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { EmployeeProvider } from "@/context/employee.contex";
import EmployeeCreateForm from "@/views/saas/employee/EmployeeCreateForm";

export default function SuperAdminCreateEmployeePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Onboard Employee
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Create a new employee profile in the system.
            </p>
          </div>
        </div>

        <EmployeeProvider>
          <div className="py-6">
            <EmployeeCreateForm />
          </div>
        </EmployeeProvider>
      </div>
    </DashboardLayout>
  );
}
