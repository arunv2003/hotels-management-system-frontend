"use client";
import { usePermission } from "@/hooks/use-permission";
export function PermissionGuard({ module, action, children, fallback = null }) {
    const { hasPermission } = usePermission();
    if (!hasPermission(module, action)) {
        return <>{fallback}</>;
    }
    return <>{children}</>;
}
