"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import PlanTable from "@/views/saas/plan/planTable";

export default function SuperAdminPlansPage() {
  return (
    <DashboardLayout>
      <PlanTable />
    </DashboardLayout>
  );
}
