'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { REVENUE_STATS } from '@/lib/mock-data';
export const RevenueChart = () => {
    return (<div className="glass-card p-6 rounded-2xl h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
          <p className="text-sm text-slate-500">Monthly SaaS growth performance</p>
        </div>
        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE_STATS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10}/>
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`}/>
            <Tooltip contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}/>
            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>);
};
