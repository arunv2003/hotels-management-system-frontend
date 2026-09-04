"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { usePermission } from "@/hooks/use-permission";
import { StaffRoute } from "@/routes/hotels/staff/staff.route";
import { StaffRoles } from "@/routes/hotels/role/role.route";
import AddStaffDialog from "@/components/dilogs/hotels/staff/AddStaffDialog";
import Pagination from "@/components/shared/Pagination";

export default function HotelStaffDirectory() {
  const { notify } = useToast();
  const { hasPermission } = usePermission();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 5;

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [staffRes, rolesRes] = await Promise.all([
        StaffRoute.getAllStaff(),
        StaffRoles.getAllRoles(),
      ]);
      setStaffList(staffRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load staff data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    let ignore = false;
    const initData = async () => {
      try {
        setIsLoading(true);
        const [staffRes, rolesRes] = await Promise.all([
          StaffRoute.getAllStaff(),
          StaffRoles.getAllRoles(),
        ]);
        if (!ignore) {
          setStaffList(staffRes.data || []);
          setRoles(rolesRes.data || []);
        }
      } catch (err) {
        if (!ignore) {
          notify(err.response?.data?.message || "Failed to load staff data", "error");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };
    initData();
    return () => {
      ignore = true;
    };
  }, [notify]);

  const handleSaveStaff = async (formData) => {
    if (editingStaff) {
      await StaffRoute.updateStaff(editingStaff._id, formData);
      notify("Staff member updated successfully.", "success");
    } else {
      await StaffRoute.createStaff(formData);
      notify("Staff member created successfully.", "success");
    }
    await loadData();
  };

  const handleDeleteStaff = async (id) => {
    try {
      setIsDeleting(true);
      await StaffRoute.deleteStaff(id);
      notify("Staff member removed successfully.", "success");
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to delete staff member", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStaff = staffList.filter((emp) => {
    const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
    const email = (emp.email || "").toLowerCase();
    const phone = (emp.phone || "").toLowerCase();
    const code = (emp.staffCode || "").toLowerCase();
    const designation = (emp.designation || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search) ||
      code.includes(search) ||
      designation.includes(search);

    const matchesRole =
      roleFilter === "all" || (emp.roleId?._id || emp.roleId) === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? emp.isActive : !emp.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStaff.length / limit) || 1;
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Hotel Staff Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your hotel employee directory, shifts, roles, and access controls.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={loadData}
            className="h-10 rounded-xl gap-2 font-bold text-xs sm:text-sm cursor-pointer border-slate-200 dark:border-slate-800 flex-1 sm:flex-none"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Refresh
          </Button>
          {hasPermission("staff", "add") && (
            <Button
              className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 cursor-pointer flex-1 sm:flex-none"
              onClick={() => {
                setEditingStaff(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add Staff Member
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Staff",
            value: staffList.length,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
          },
          {
            label: "Active Staff",
            value: staffList.filter((emp) => emp.isActive).length,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "Morning Shift",
            value: staffList.filter((emp) => emp.shift === "Morning").length,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
          {
            label: "Configured Roles",
            value: roles.length,
            icon: Briefcase,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                stat.bg
              )}
            >
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, code or title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-10 sm:h-11 rounded-xl border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/20 text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Filter by Role */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold focus:outline-none flex-1 sm:flex-none"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold focus:outline-none flex-1 sm:flex-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold">Loading staff directory...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Staff Members Found
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {staffList.length === 0
                ? 'No staff registered yet. Click "Add Staff Member" to get started.'
                : "No staff match your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto table-scrollbar relative">
            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-[750px]">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Staff Code
                  </th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Employee
                  </th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Contact
                  </th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Role &amp; Title
                  </th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Shift &amp; Type
                  </th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {paginatedStaff.map((emp, i) => {
                  const roleName = emp.roleId?.name || "Staff";
                  const isConfirmingDelete = deleteConfirmId === emp._id;

                  return (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      key={emp._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-extrabold font-mono text-slate-600 dark:text-slate-400">
                          {emp.staffCode || `STF-${emp._id.slice(-4)}`}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shrink-0">
                            {emp.firstName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm leading-none">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {emp.phone}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                            {roleName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {emp.designation || "Staff Member"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                            {emp.shift || "Morning"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {emp.employmentType || "Full-Time"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                            emp.isActive
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800"
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          {emp.isActive ? "Active" : "Inactive"}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isConfirmingDelete ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs font-bold text-rose-600">
                              Delete?
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteStaff(emp._id)}
                              disabled={isDeleting}
                              className="h-8 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs"
                            >
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirmId(null)}
                              className="h-8 px-2 rounded-lg text-xs"
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            {hasPermission("staff", "edit") && (
                              <button
                                onClick={() => {
                                  setEditingStaff(emp);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Edit Staff"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission("staff", "delete") && (
                              <button
                                onClick={() => setDeleteConfirmId(emp._id)}
                                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete Staff"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredStaff.length}
          pageSize={limit}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add / Edit Staff Modal */}
      <AddStaffDialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        onSave={handleSaveStaff}
        editStaff={editingStaff}
      />
    </div>
  );
}
