'use client';
import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import ProfileDetailView from '@/views/profile/ProfileDetailView';

export default function AdminProfilePage() {
  return (
    <DashboardLayout>
      <ProfileDetailView />
    </DashboardLayout>
  );
}
