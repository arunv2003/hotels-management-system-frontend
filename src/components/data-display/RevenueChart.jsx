'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { REVENUE_STATS } from '@/lib/mock-data';
import { useIsMounted } from "@/hooks/use-is-mounted";
import { SaaSAnalyticsRoute } from "@/routes/saas/analytics/analytics.route";

export const RevenueChart = () => {
  const isMounted = useIsMounted();
  const [chartData, setChartData] = useState(REVENUE_STATS);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const res = await SaaSAnalyticsRoute.getPlatformReports();
        if (res?.data?.revenueData && res.data.revenueData.length > 0) {
          setChartData(res.data.revenueData);
        }
      } catch (error) {
        console.error("Failed to load RevenueChart data from backend:", error);
      }
    };
    fetchRevenueData();
  }, []);

  return (
    <div className="glass-card p-6 rounded-lg border border-slate-100 dark:border-slate-800 h-[400px] bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
          <p className="text-sm text-slate-500">Monthly SaaS growth performance</p>
        </div>
        <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="h-[300px] w-full">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`} />
              <Tooltip contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
