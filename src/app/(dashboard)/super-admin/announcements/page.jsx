"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import AnnouncementsView from "@/views/saas/announcements";

export default function SuperAdminAnnouncementsPage() {
  return (
    <DashboardLayout>
      <AnnouncementsView />
    </DashboardLayout>
  );
}
