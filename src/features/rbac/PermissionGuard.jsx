'use client';
import React from 'react';
import { useAuthStore } from '@/store/authStore';
export const PermissionGuard = ({ permission, children, fallback = null }) => {
    const hasPermission = useAuthStore((state) => state.hasPermission(permission));
    if (!hasPermission) {
        return <>{fallback}</>;
    }
    return <>{children}</>;
};
