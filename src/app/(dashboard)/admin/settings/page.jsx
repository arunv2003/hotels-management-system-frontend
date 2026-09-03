"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import HotelSettingsView from "@/views/hotels/settings";

export default function HotelAdminSettingsPage() {
  return (
    <DashboardLayout>
      <HotelSettingsView />
    </DashboardLayout>
  );
}
