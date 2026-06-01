"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import SupportTicketsView from "@/views/saas/support-tickets";

export default function SuperAdminSupportTicketsPage() {
  return (
    <DashboardLayout>
      <SupportTicketsView />
    </DashboardLayout>
  );
}
