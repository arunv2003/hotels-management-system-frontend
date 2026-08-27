import { create } from 'zustand';
export const useTenantStore = create((set, get) => ({
    currentTenant: null,
    setTenant: (tenant) => set({ currentTenant: tenant }),
    isModuleEnabled: (moduleId) => {
        const tenant = get().currentTenant;
        if (!tenant || !tenant.modules || !Array.isArray(tenant.modules) || tenant.modules.length === 0)
            return true;
        return tenant.modules.includes(moduleId);
    },
}));
