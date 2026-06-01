'use client';
import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import SaaSGeneralSettingsView from '@/views/saas/settings';

export default function SuperAdminSettingsPage() {
  return (
    <DashboardLayout>
      <SaaSGeneralSettingsView />
    </DashboardLayout>
  );
}
