'use client';
import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import SaaSAnalyticsView from '@/views/saas/analytics';

export default function SuperAdminAnalyticsPage() {
  return (
    <DashboardLayout>
      <SaaSAnalyticsView />
    </DashboardLayout>
  );
}
