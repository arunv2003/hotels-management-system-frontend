import React from "react";
import HotelReportsView from "@/views/admin/reports/ReportsView";

export const metadata = {
  title: "Reports & Analytics | Hotel Management System",
  description: "Comprehensive financial audits, occupancy metrics, RevPAR, POS dining statistics, and departmental reports.",
};

export default function AdminReportsPage() {
  return <HotelReportsView />;
}
