'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Hotel,
  Activity,
  Calendar,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const GROWTH_DATA = [
  { month: 'Jan', revenue: 45000, activeHotels: 98, newSignups: 12 },
  { month: 'Feb', revenue: 52000, activeHotels: 110, newSignups: 15 },
  { month: 'Mar', revenue: 48000, activeHotels: 118, newSignups: 10 },
  { month: 'Apr', revenue: 61000, activeHotels: 132, newSignups: 22 },
  { month: 'May', revenue: 67000, activeHotels: 145, newSignups: 18 },
  { month: 'Jun', revenue: 78000, activeHotels: 158, newSignups: 25 },
];

const PLAN_DISTRIBUTION = [
  { name: 'Premium Plan', value: 72, color: '#4f46e5' },
  { name: 'Standard Plan', value: 58, color: '#10b981' },
  { name: 'Free Trial', value: 28, color: '#f59e0b' },
];

const HOTEL_USAGE_DATA = [
  { id: '1', hotelName: 'Ocean Breeze Inn', plan: 'Premium', rooms: 45, bookingsToday: 18, systemLoad: '28%', health: 'Excellent' },
  { id: '2', hotelName: 'Mountain Peak Lodge', plan: 'Standard', rooms: 20, bookingsToday: 8, systemLoad: '14%', health: 'Excellent' },
  { id: '3', hotelName: 'Urban Suite Hotel', plan: 'Free Trial', rooms: 10, bookingsToday: 2, systemLoad: '8%', health: 'Good' },
  { id: '4', hotelName: 'Desert Oasis Resort', plan: 'Premium', rooms: 80, bookingsToday: 32, systemLoad: '52%', health: 'Excellent' },
  { id: '5', hotelName: 'Forest Hideaway', plan: 'Expired', rooms: 15, bookingsToday: 0, systemLoad: '0%', health: 'Inactive' },
  { id: '6', hotelName: 'Lake View Cabins', plan: 'Standard', rooms: 30, bookingsToday: 11, systemLoad: '22%', health: 'Good' },
];

export default function SaaSAnalyticsView() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHotels = HOTEL_USAGE_DATA.filter(hotel =>
    hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support &amp; Analytics</h1>
          <p className="text-slate-500 mt-1">Monitor real-time system performance, hotel activity, and subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 dark:border-slate-800 gap-2">
            <Calendar size={16} /> Last 30 Days
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-5 gap-2 cursor-pointer text-white font-bold">
            <Download size={18} /> Export Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'overview' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {activeTab === 'overview' && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />}
          Overview
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'hotels' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {activeTab === 'hotels' && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />}
          Hotel Activity &amp; Load
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Quick KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Monthly Active Hotels</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">158</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2">
                    <TrendingUp size={12} /> +12.3%
                  </span>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <Hotel size={24} />
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">New Subscriptions</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">+25</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2">
                    <TrendingUp size={12} /> +18.4%
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <Users size={24} />
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Global System Load</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">42%</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full mt-2">
                    <TrendingDown size={12} /> +2.1%
                  </span>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl">
                  <Activity size={24} />
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Average Load Speed</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">0.42s</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2">
                    <TrendingUp size={12} /> -5.2%
                  </span>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>

            {/* Growth & Plan distribution Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Line chart: platform growth */}
              <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Growth Trends</h3>
                    <p className="text-sm text-slate-500">Signups and active subscriptions over the last 6 months</p>
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                      <Area type="monotone" dataKey="activeHotels" name="Active Subscriptions" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                      <Area type="monotone" dataKey="newSignups" name="New Registrations" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Plan Distribution Chart */}
              <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subscription Tiers</h3>
                  <p className="text-sm text-slate-500 mb-6">Ratio breakdown of active plan tiers</p>

                  <div className="h-[200px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PLAN_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {PLAN_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {PLAN_DISTRIBUTION.map((plan) => (
                    <div key={plan.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{plan.name}</span>
                      </div>
                      <span className="font-black text-slate-950 dark:text-white">{plan.value} Hotels</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hotels"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Hotel Usage Lists */}
            <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Tenants Usage &amp; Load</h3>
                  <p className="text-sm text-slate-500">Monitor rooms, reservations, and server load utilization per tenant.</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by hotel or plan..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4">Tenant / Hotel</th>
                      <th className="py-4">Plan Type</th>
                      <th className="py-4">Rooms</th>
                      <th className="py-4">Bookings Today</th>
                      <th className="py-4">Server Load Limit</th>
                      <th className="py-4">Health Status</th>
                      <th className="py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {filteredHotels.map((hotel) => (
                      <tr key={hotel.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                            {hotel.hotelName.charAt(0)}
                          </div>
                          {hotel.hotelName}
                        </td>
                        <td className="py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase ${hotel.plan === 'Premium' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                              hotel.plan === 'Standard' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                hotel.plan === 'Free Trial' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                  'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                            {hotel.plan}
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                          {hotel.rooms} Rooms
                        </td>
                        <td className="py-4 font-bold text-slate-900 dark:text-white">
                          {hotel.bookingsToday} bookings
                        </td>
                        <td className="py-4 font-medium text-slate-500">
                          <div className="flex items-center gap-2 max-w-[120px]">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${parseInt(hotel.systemLoad) > 50 ? 'bg-rose-500' :
                                    parseInt(hotel.systemLoad) > 25 ? 'bg-amber-500' :
                                      'bg-emerald-500'
                                  }`}
                                style={{ width: hotel.systemLoad }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{hotel.systemLoad}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${hotel.health === 'Excellent' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' :
                              hotel.health === 'Good' ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' :
                                hotel.health === 'Warning' ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' :
                                  'text-slate-400 bg-slate-50 dark:bg-slate-800'
                            }`}>
                            {hotel.health === 'Excellent' && <CheckCircle size={10} />}
                            {hotel.health === 'Good' && <CheckCircle size={10} />}
                            {hotel.health === 'Warning' && <AlertTriangle size={10} />}
                            {hotel.health}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <ExternalLink size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredHotels.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400">
                          No active hotels matching search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
