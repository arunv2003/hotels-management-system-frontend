'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { StatCard } from '@/components/data-display/StatCard';
import {
  Bed,
  CalendarCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Loader2,
  Calendar,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTenantStore } from '@/store/tenantStore';
import { useSubscription } from '@/hooks/use-subscription';
import { BookingRoute } from '@/routes/business/bookingRoute';
import { RoomRoute } from '@/routes/business/roomRoute';
import RenewPlanModal from '@/components/dilogs/hotels/RenewPlanModal';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HotelOwnerDashboard() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { subscription } = useSubscription();
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [bookingRes, roomRes] = await Promise.all([
                BookingRoute.getBookings(),
                RoomRoute.getRooms(),
            ]);

            if (bookingRes && bookingRes.success !== false) {
                setBookings(bookingRes.data || (Array.isArray(bookingRes) ? bookingRes : []));
            }
            if (roomRes && roomRes.success !== false) {
                setRooms(roomRes.data || (Array.isArray(roomRes) ? roomRes : []));
            }
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Filter recent bookings
    const filteredBookings = bookings.filter((b) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const guestName = `${b.guestId?.firstName || ''} ${b.guestId?.lastName || ''}`.toLowerCase();
        const roomNum = (b.room?.roomNumber || '').toLowerCase();
        const phone = (b.guestId?.phone || '').toLowerCase();
        const status = (b.bookingStatus || '').toLowerCase();
        return guestName.includes(query) || roomNum.includes(query) || phone.includes(query) || status.includes(query);
    });

    const recentBookings = filteredBookings.slice(0, 6);

    // Dynamic metrics
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
    const availableRooms = rooms.filter((r) => r.status === 'Available' || !r.status).length;
    const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance' || r.status === 'Cleaning').length;
    const occupancyPercent = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const totalRevenue = bookings.reduce((acc, b) => acc + (Number(b.paidAmount) || 0), 0);
    const activeArrivals = bookings.filter((b) => b.bookingStatus === 'CheckedIn' || b.bookingStatus === 'Confirmed').length;

    const formattedExpiry = subscription?.endDate
      ? new Date(subscription.endDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Active";

    const daysLeft = subscription?.daysRemaining ?? 365;

    return (
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Hotel Insights</h1>
              <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">Managing {user?.hotelName || "Hotel"} Dashboard</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                <input
                  type="text"
                  placeholder="Find booking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button
                onClick={fetchDashboardData}
                title="Refresh Data"
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors shadow-sm"
              >
                <RefreshCw size={18} className={loading ? "animate-spin text-indigo-600" : ""}/>
              </button>
              <Link
                href="/dashboard/bookings"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 text-xs sm:text-sm"
              >
                <Plus size={18}/>
                New Booking
              </Link>
            </div>
          </div>

          {/* Active Subscription Plan Banner / Card */}
          <div className="py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg relative overflow-hidden border border-indigo-700/30">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-indigo-300" /> Active Subscription
                  </div>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {subscription?.status || "Active"}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {subscription?.planName || "Growth Plan"}
                </h2>
                <p className="text-indigo-200 text-xs max-w-xl font-medium">
                  Your hotel ecosystem is active on the <strong>{subscription?.subscriptionType || "Yearly"}</strong> billing cycle.
                  Valid until <strong>{formattedExpiry}</strong> ({daysLeft} days remaining).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center flex-1 sm:flex-none">
                  <p className="text-[9px] uppercase font-bold text-indigo-300 tracking-wider">Days Remaining</p>
                  <p className="text-lg font-black text-white leading-tight">{daysLeft} Days</p>
                </div>

                <Button
                  onClick={() => setShowRenewModal(true)}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-xs shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Renew / Upgrade Plan
                </Button>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Occupancy Rate"
              value={`${occupancyPercent}%`}
              icon={Bed}
              trend={{ value: occupancyPercent > 50 ? 8 : 2, isUp: true }}
              color="indigo"
            />
            <StatCard
              title="Collected Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={TrendingUp}
              trend={{ value: 12, isUp: true }}
              color="emerald"
            />
            <StatCard
              title="Active Bookings"
              value={String(activeArrivals)}
              icon={CalendarCheck}
              color="amber"
            />
            <StatCard
              title="Total Rooms"
              value={String(totalRooms)}
              icon={Users}
              color="slate"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Dynamic Recent Bookings Table */}
            <div className="lg:col-span-2 glass-card rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Recent Bookings</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Latest recorded guest reservations</p>
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  View All ({bookings.length})
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="py-16 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                  <p className="text-xs font-medium">Loading live bookings...</p>
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Bed className="h-10 w-10 mx-auto opacity-30 mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No bookings found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {searchQuery ? "No matching records found." : "Create your first booking to view it here."}
                  </p>
                  <Link
                    href="/dashboard/bookings"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={14} /> New Booking
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto table-scrollbar relative">
                  <table className="w-full text-left border-collapse whitespace-nowrap min-w-[650px] sm:min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-3.5">Guest</th>
                        <th className="px-6 py-3.5">Room</th>
                        <th className="px-6 py-3.5">Dates / Stay</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                      {recentBookings.map((booking, i) => {
                        const guest = booking.guestId || {};
                        const room = booking.room || {};
                        const checkInStr = booking.checkInDate
                          ? new Date(booking.checkInDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "N/A";

                        return (
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={booking._id}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black border border-indigo-500/20">
                                  {(guest.firstName?.[0] || 'G').toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                                    {guest.firstName} {guest.lastName}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Phone size={10} />
                                    {guest.phone || 'No phone'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 dark:text-white text-sm">
                                Room {room.roomNumber || 'N/A'}
                              </div>
                              <div className="text-xs text-slate-400">
                                {room.roomType?.roomType || 'Standard Room'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {checkInStr}
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {booking.stayType === "12h" || booking.durationHours === 12 ? "☀️ 12 Hours" : "🌙 24 Hours"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                                  booking.bookingStatus === 'Confirmed'
                                    ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400'
                                    : booking.bookingStatus === 'CheckedIn'
                                    ? 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400'
                                    : booking.bookingStatus === 'CheckedOut'
                                    ? 'text-slate-600 bg-slate-500/10 border-slate-500/20 dark:text-slate-400'
                                    : booking.bookingStatus === 'Cancelled'
                                    ? 'text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400'
                                    : 'text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400'
                                }`}
                              >
                                {booking.bookingStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-black text-slate-900 dark:text-white">
                                ₹{(booking.totalAmount || 0).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`text-[10px] font-bold ${
                                  booking.paymentStatus === 'Paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                  {booking.paymentStatus || 'Unpaid'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({booking.paymentMethod === 'Razorpay' ? '💳 Online' : '💵 Cash'})
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Room Status & Overview */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <h3 className="font-extrabold text-slate-900 dark:text-white mb-5 text-base">Live Room Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"/>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Available</span>
                    </div>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{availableRooms} Rooms</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"/>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Occupied</span>
                    </div>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{occupiedRooms} Rooms</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"/>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Maintenance</span>
                    </div>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">{maintenanceRooms} Rooms</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occupancy Rate</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{occupancyPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, occupancyPercent)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck size={13} /> Quick Management
                  </div>
                  <h3 className="font-black text-white mb-2 text-lg">Hotel Operations</h3>
                  <p className="text-indigo-100 text-xs mb-5">Manage guest bookings, rooms, and payments from your central control hub.</p>
                  
                  <div className="space-y-2.5">
                    <Link
                      href="/dashboard/bookings"
                      className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10 transition-colors text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarCheck size={15} /> Open Bookings Manager
                      </span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/admin/rooms"
                      className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10 transition-colors text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Bed size={15} /> Manage Rooms & Rates
                      </span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"/>
              </div>
            </div>
          </div>
        </div>

        {/* Renew Modal */}
        {showRenewModal && (
          <RenewPlanModal
            isOpen={showRenewModal}
            onClose={() => setShowRenewModal(false)}
            hotelId={user?.hotelId || user?.id}
            hotelName={user?.hotelName || "Hotel"}
            ownerEmail={user?.email}
            currentPlanName={subscription?.planName}
            onSuccess={() => {
              setShowRenewModal(false);
              fetchDashboardData();
            }}
          />
        )}
      </DashboardLayout>
    );
}


