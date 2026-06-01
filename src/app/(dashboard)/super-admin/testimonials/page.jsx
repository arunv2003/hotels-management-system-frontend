"use client";
import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import TestimonialsView from "@/views/saas/testimonials";

export default function SuperAdminTestimonialsPage() {
  return (
    <DashboardLayout>
      <TestimonialsView />
    </DashboardLayout>
  );
}
