'use client';
import React from 'react';
import { useTenantStore } from '@/store/tenantStore';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
export const SubscriptionGuard = ({ moduleId, children, fallback }) => {
    const isEnabled = useTenantStore((state) => state.isModuleEnabled(moduleId));
    if (!isEnabled) {
        return fallback || (<div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Lock className="w-6 h-6 text-slate-400"/>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Premium Module</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1 mb-4">
          The {moduleId} module is not available in your current plan.
        </p>
        <Button variant="outline" className="rounded-full px-6">
          Upgrade Now
        </Button>
      </div>);
    }
    return <>{children}</>;
};
