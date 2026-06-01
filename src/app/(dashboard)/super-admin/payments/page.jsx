'use client';
import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import SaaSPaymentView from '@/views/saas/payment';

export default function SuperAdminPaymentsPage() {
  return (
    <DashboardLayout>
      <SaaSPaymentView />
    </DashboardLayout>
  );
}
