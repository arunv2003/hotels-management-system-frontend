'use client';
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { StatCard } from '@/components/data-display/StatCard';
import { Bed, CalendarCheck, TrendingUp, Users, CheckCircle2, Clock, Search, Filter, Plus } from 'lucide-react';
import { HOTEL_STATS, MOCK_USER_HOTEL_OWNER, MOCK_TENANT } from '@/lib/mock-data';
import { useAuthStore } from '@/store/authStore';
import { useTenantStore } from '@/store/tenantStore';
import { motion } from 'framer-motion';
export default function HotelOwnerDashboard() {
    const login = useAuthStore((state) => state.login);
    const setTenant = useTenantStore((state) => state.setTenant);
    useEffect(() => {
        // Auto-login as hotel owner and set tenant for demo
        login(MOCK_USER_HOTEL_OWNER);
        setTenant(MOCK_TENANT);
    }, [login, setTenant]);
    const recentBookings = [
        { id: '101', guest: 'Robert Fox', room: '302', type: 'Deluxe', date: '2024-05-16', status: 'Confirmed', amount: '$450' },
        { id: '102', guest: 'Jane Cooper', room: '105', type: 'Standard', date: '2024-05-16', status: 'Checked In', amount: '$220' },
        { id: '103', guest: 'Wade Warren', room: '204', type: 'Suite', date: '2024-05-17', status: 'Pending', amount: '$890' },
        { id: '104', guest: 'Guy Hawkins', room: '410', type: 'Deluxe', date: '2024-05-18', status: 'Confirmed', amount: '$450' },
    ];
    return (<DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hotel Insights</h1>
            <p className="text-slate-500 mt-1">Managing {MOCK_TENANT.name} Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <input type="text" placeholder="Find booking..." className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20"/>
            </div>
            <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Filter size={20}/>
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20">
              <Plus size={18}/>
              New Booking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Occupancy" value={`${HOTEL_STATS.occupancy}%`} icon={Bed} trend={{ value: 5, isUp: true }} color="indigo"/>
          <StatCard title="Revenue Today" value={`$${HOTEL_STATS.revenueToday}`} icon={TrendingUp} trend={{ value: 12, isUp: true }} color="emerald"/>
          <StatCard title="Arrivals" value={HOTEL_STATS.arrivals} icon={CalendarCheck} color="amber"/>
          <StatCard title="Staff On Duty" value="14" icon={Users} color="slate"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border-none shadow-xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Recent Bookings</h3>
              <button className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentBookings.map((booking, i) => (<motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            {booking.guest.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{booking.guest}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {booking.room} ({booking.type})
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{booking.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${booking.status === 'Confirmed' ? 'text-emerald-600 bg-emerald-50' :
                booking.status === 'Checked In' ? 'text-indigo-600 bg-indigo-50' :
                    'text-amber-600 bg-amber-50'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{booking.amount}</td>
                    </motion.tr>))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Room Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"/>
                    <span className="text-sm font-medium">Available</span>
                  </div>
                  <span className="text-sm font-bold">24 Rooms</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"/>
                    <span className="text-sm font-medium">Occupied</span>
                  </div>
                  <span className="text-sm font-bold">68 Rooms</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"/>
                    <span className="text-sm font-medium">Maintenance</span>
                  </div>
                  <span className="text-sm font-bold">8 Rooms</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Weekly Goal</span>
                  <span className="text-xs font-bold text-indigo-600">85%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-indigo-600"/>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-indigo-600 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-white mb-2 text-lg">Quick Tasks</h3>
                <p className="text-indigo-100 text-sm mb-6">You have 5 pending maintenance requests.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <Clock size={16}/>
                    <span className="text-xs font-medium">Room 302: Light repair</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <CheckCircle2 size={16}/>
                    <span className="text-xs font-medium">Staff Payroll: Pending</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"/>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);
}
