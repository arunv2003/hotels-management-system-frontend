import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { superAdminRouted } from '@/routes/saas/auth/superadminlogin';

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
    logout: async () => {
        try {
            await superAdminRouted.logoutSuperadmin();
        } catch (error) {
            console.error("Logout API call error:", error);
        }
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    },
    hasPermission: (moduleOrPermission, action = "view") => {
        const user = get().user;
        if (!user) return false;
        
        const rawType = String(user.userType || user.role?.name || user.role || "").toLowerCase();

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

        let perms = user.permissions;
        if ((!perms || (typeof perms === "object" && Object.keys(perms).length === 0)) && user.role && typeof user.role === "object" && user.role.permissions) {
            perms = user.role.permissions;
        }

        if (!perms) return false;

        if (perms instanceof Map) {
            perms = Object.fromEntries(perms);
        }

        // SaaS Employee & Hotel Staff Object format ({ moduleName: ["view", "add", ...] })
        if (typeof perms === "object" && !Array.isArray(perms)) {
            const modulePerms = perms[moduleOrPermission];
            if (!modulePerms) return false;
            if (!action) return Array.isArray(modulePerms) && modulePerms.length > 0;
            if (Array.isArray(modulePerms)) {
                return modulePerms.includes(action) || modulePerms.includes("global_view");
            }
            return false;
        }

        // Array format (Array of strings or objects)
        if (Array.isArray(perms)) {
            if (!moduleOrPermission) return true;
            const permStr = String(moduleOrPermission);
            const requiredActionKey = action ? `${permStr}_${action}` : permStr;

            return perms.some((p) => {
                const pName = typeof p === "object" ? (p.name || p.module) : String(p);
                return pName === permStr || pName === requiredActionKey || pName === "ALL";
            });
        }

        return false;
    },
}), {
    name: 'auth-storage',
}));
