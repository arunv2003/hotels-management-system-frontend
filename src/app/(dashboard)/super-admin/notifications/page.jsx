"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import NotificationsView from "@/views/saas/notifications";

export default function SuperAdminNotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsView />
    </DashboardLayout>
  );
}
