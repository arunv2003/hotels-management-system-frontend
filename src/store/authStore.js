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
    hasPermission: (permission) => {
        const user = get().user;
        if (!user)
            return false;
        // Super Admin has all permissions
        if (user.userType === 'super-admin' || user.role === 'SUPER_ADMIN')
            return true;
        return user.permissions ? user.permissions.includes(permission) : false;
    },
}), {
    name: 'auth-storage',
}));
