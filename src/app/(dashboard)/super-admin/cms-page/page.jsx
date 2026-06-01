"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import CMSPageView from "@/views/saas/cms-page";

export default function SuperAdminCMSPage() {
  return (
    <DashboardLayout>
      <CMSPageView />
    </DashboardLayout>
  );
}
