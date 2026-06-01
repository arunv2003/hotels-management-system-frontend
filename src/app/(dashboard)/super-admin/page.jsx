'use client';
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { StatCard } from '@/components/data-display/StatCard';
import { RevenueChart } from '@/components/data-display/RevenueChart';
import { Hotel, Users, CreditCard, ArrowUpRight, MoreVertical, Activity } from 'lucide-react';
import { MOCK_HOTELS, MOCK_USER_SUPER_ADMIN } from '@/lib/mock-data';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
export default function SuperAdminDashboard() {
    const login = useAuthStore((state) => state.login);
    useEffect(() => {
        // Auto-login as super admin for demo purposes
        login(MOCK_USER_SUPER_ADMIN);
    }, [login]);
    return (<DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
            <p className="text-slate-500 mt-1">Welcome back, Alex. Here&apos;s what&apos;s happening today.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20">
            <ArrowUpRight size={18}/>
            Export Reports
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value="$128,430" icon={CreditCard} trend={{ value: 12.5, isUp: true }} color="indigo"/>
          <StatCard title="Active Hotels" value="158" icon={Hotel} trend={{ value: 4, isUp: true }} color="emerald"/>
          <StatCard title="SaaS Employees" value="24" icon={Users} color="slate"/>
          <StatCard title="System Load" value="42%" icon={Activity} trend={{ value: 2, isUp: false }} color="amber"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Hotel Onboarding</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreVertical size={20}/>
              </button>
            </div>
            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
              {MOCK_HOTELS.map((hotel, i) => (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={hotel.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 font-bold">
                    {hotel.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{hotel.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{hotel.plan}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${hotel.status === 'Active' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'}`}>
                      {hotel.status}
                    </span>
                  </div>
                </motion.div>))}
            </div>
            <button className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              View All Hotels
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>);
}
