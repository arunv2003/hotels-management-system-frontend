"use client";

import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import HotelStaffDirectory from "@/views/hotels/staff/staffTable";

export default function DashboardStaffPage() {
  return (
    <DashboardLayout>
      <HotelStaffDirectory />
    </DashboardLayout>
  );
}
