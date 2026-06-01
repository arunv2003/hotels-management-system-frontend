"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import EmployeeTable from "@/views/saas/employee/employeeTable";

export default function SuperAdminEmployeeManagementPage() {
  return (
    <DashboardLayout>
      <EmployeeTable />
    </DashboardLayout>
  );
}
