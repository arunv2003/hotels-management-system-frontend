"use client";
import { useMemo } from "react";
// In a real app, this would come from a Zustand store or Auth session
// For now, we'll mock it or define a way to hydrate it
export function usePermission() {
    // Mocking permissions for now
    // In production, this would be: const { user } = useAuth();
    const permissions = useMemo(() => {
        return {
            "rooms": ["view", "create", "edit"],
            "bookings": ["view", "create"],
            "dashboard": ["view"],
        };
    }, []);
    const hasPermission = (module, action) => {
        return permissions[module]?.includes(action) ?? false;
    };
    const hasModule = (module) => {
        return !!permissions[module] && permissions[module].length > 0;
    };
    return { hasPermission, hasModule, permissions };
}
