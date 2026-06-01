"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import CouponsView from "@/views/saas/coupons";

export default function SuperAdminCouponsPage() {
  return (
    <DashboardLayout>
      <CouponsView />
    </DashboardLayout>
  );
}
