"use client";

import React from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { OnboardingTable } from "@/views/hotels/onboarding/OnboardingTable";

export const dynamic = "force-dynamic";

export default function SuperAdminHotelsPage() {
  return (
    <DashboardLayout>
      <OnboardingTable />
    </DashboardLayout>
  );
}

