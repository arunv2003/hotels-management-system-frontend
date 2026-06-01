"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import ReportsView from "@/views/saas/reports";

export default function SuperAdminReportsPage() {
  return (
    <DashboardLayout>
      <ReportsView />
    </DashboardLayout>
  );
}
