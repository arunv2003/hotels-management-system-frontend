"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Download,
  Plus,
  Eye,
  Trash2,
  Edit2,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HotelRoute } from "@/routes/saas/hotels/hotels.route";
import HotelDetailsDialog from "@/components/dilogs/saas/hotelsdetailsDilogs/HotelDetailsDialog";

export function OnboardingTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const limit = 5;

  const filteredHotels = hotels.filter(
    (hotel) =>
      (hotel.hotelName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.ownerFullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.city || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHotels.length / limit);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await HotelRoute.getAllHotels();
        const fetchedHotels = response?.data?.hotels || response?.hotels || [];
        setHotels(fetchedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    })();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleOpenDetail = (hotel) => {
    setSelectedHotel(hotel);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailDialogOpen(false);
    setSelectedHotel(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Hotels Onboarding
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and monitor the onboarding progress of all hotel properties.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-11 rounded-xl gap-2 font-bold text-sm cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button
            className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold text-sm shadow-lg shadow-indigo-500/20 cursor-pointer"
            onClick={() => router.push("/super-admin/hotels/new")}
          >
            <Plus className="w-4 h-4" /> Add New Hotel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Hotels",
            value: hotels.length.toString(),
            icon: Building2,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
          },
          {
            label: "Active",
            value: hotels.filter((h) => h.isActive).length.toString(),
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "Inactive",
            value: hotels.filter((h) => !h.isActive).length.toString(),
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
          {
            label: "Needs Attention",
            value: "0",
            icon: AlertCircle,
            color: "text-rose-600",
            bg: "bg-rose-50 dark:bg-rose-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[0.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search hotels or owners..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-12 rounded-2xl border-slate-100 dark:border-slate-800 focus-visible:ring-indigo-500/20"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-12 rounded-2xl gap-2 font-bold text-sm flex-1 sm:flex-none"
            >
              <Filter className="w-4 h-4" /> Filters
            </Button>
            <Button
              variant="outline"
              className="h-12 w-12 rounded-2xl p-0 flex-none"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Hotel Name
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Location
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Status
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Plan
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Date Added
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginatedHotels.map((hotel, i) => {
                const hotelId = hotel._id || hotel.id;
                const name = hotel.hotelName || "N/A";
                const owner = hotel.ownerFullName || "N/A";
                const location =
                  hotel.city && hotel.state
                    ? `${hotel.city}, ${hotel.state}`
                    : "N/A";
                const isActive = hotel.isActive !== false;
                const dateStr = hotel.createdAt
                  ? new Date(hotel.createdAt).toLocaleDateString("en-GB")
                  : "N/A";
                const planName = hotel.planSelected?.name || "—";

                return (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={hotelId}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Hotel Name + Owner */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black shrink-0 text-sm shadow-md shadow-indigo-500/10 overflow-hidden">
                          {hotel.hotelLogo?.cloudUrl ? (
                            <img
                              src={hotel.hotelLogo.cloudUrl}
                              alt="logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-none text-sm">
                            {name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{owner}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="font-medium text-xs">{location}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          isActive
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                            : "bg-rose-50 dark:bg-rose-500/10 text-rose-600"
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {isActive ? "Active" : "Inactive"}
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                        {planName}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="font-medium text-xs">{dateStr}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenDetail(hotel)}
                          className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/super-admin/hotels/new?edit=${hotelId}`)}
                          className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredHotels.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Hotels Found
              </h3>
              <p className="text-slate-400 text-sm">
                We couldn&apos;t find any hotel matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing{" "}
            {filteredHotels.length === 0 ? 0 : (currentPage - 1) * limit + 1}–
            {Math.min(currentPage * limit, filteredHotels.length)} of{" "}
            {filteredHotels.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl text-xs font-bold"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={n === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(n)}
                  className={cn(
                    "w-10 h-10 p-0 rounded-xl text-xs font-bold",
                    n === currentPage && "bg-indigo-600 shadow-lg shadow-indigo-500/20"
                  )}
                >
                  {n}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl text-xs font-bold"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Details Dialog — rendered from external component */}
      <HotelDetailsDialog
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetail}
        hotel={selectedHotel}
      />
    </div>
  );
}
