"use client";
import { useAuthStore } from "@/store/authStore";

export function usePermission() {
    const user = useAuthStore((state) => state.user);
    const storeHasPermission = useAuthStore((state) => state.hasPermission);

    const hasPermission = (module, action = "view") => {
        return storeHasPermission(module, action);
    };

    const hasModule = (module) => {
        return storeHasPermission(module, "view");
    };

    return { hasPermission, hasModule, permissions: user?.permissions || null };
}
