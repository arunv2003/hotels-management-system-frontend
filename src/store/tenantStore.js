import { create } from 'zustand';
export const useTenantStore = create((set, get) => ({
    currentTenant: null,
    setTenant: (tenant) => set({ currentTenant: tenant }),
    isModuleEnabled: (moduleId) => {
        const tenant = get().currentTenant;
        if (!tenant)
            return false;
        return tenant.modules.includes(moduleId);
    },
}));
