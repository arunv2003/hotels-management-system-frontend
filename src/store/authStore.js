import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    login: (payload) => {
        if (payload?.data?.user) {
            set({ 
                user: payload.data.user, 
                accessToken: payload.data.accessToken,
                refreshToken: payload.data.refreshToken,
                isAuthenticated: true 
            });
        } else if (payload?.user) {
            set({ 
                user: payload.user, 
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
                isAuthenticated: true 
            });
        } else {
            set({ user: payload, isAuthenticated: true });
        }
    },
    logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    hasPermission: (moduleOrPermission, action = "view") => {
        const user = get().user;
        if (!user)
            return false;
        
        const rawType = String(user.userType || user.role || "").toLowerCase();

        // Super-admin and hotel-owner (and hotel / admin / business) have full access in their portals
        if (
            rawType === "super-admin" ||
            rawType === "super_admin" ||
            rawType === "hotel-owner" ||
            rawType === "hotel_owner" ||
            rawType === "hotel" ||
            rawType === "admin" ||
            rawType === "business" ||
            user.permissions === "ALL"
        ) {
            return true;
        }

        if (!user.permissions)
            return false;

        // SaaS Employee format (Object: { moduleName: ["view", "add", ...] })
        if (typeof user.permissions === "object" && !Array.isArray(user.permissions)) {
            const modulePerms = user.permissions[moduleOrPermission];
            if (!modulePerms)
                return false;
            if (!action)
                return modulePerms.length > 0;
            return modulePerms.includes(action) || modulePerms.includes("global_view");
        }

        // Hotel Staff format (Array of strings or objects)
        if (Array.isArray(user.permissions)) {
            if (!moduleOrPermission)
                return true;
            const permStr = String(moduleOrPermission);
            const requiredActionKey = action ? `${permStr}_${action}` : permStr;

            return user.permissions.some((p) => {
                const pName = typeof p === "object" ? (p.name || p.module) : String(p);
                return pName === permStr || pName === requiredActionKey || pName === "ALL";
            });
        }

        return false;
    },
}), {
    name: 'auth-storage',
}));
