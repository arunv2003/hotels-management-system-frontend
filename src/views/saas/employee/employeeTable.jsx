"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Users,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Download,
  Plus,
  Eye,
  Trash2,
  Edit2,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Employee } from "@/routes/saas/employee/employee.route";

export default function EmployeeTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const limit = 5;

  const filteredEmployees = employees.filter((emp) => {
    const fullName =
      `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();

    const department = (emp.department || "").toLowerCase();

    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || department.includes(search);
  });

  const totalPages = Math.ceil(filteredEmployees.length / limit);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getAllEmployees = async () => {
    const result = await Employee.getAllEmployees();
    console.log("Employees fetched:", result);
    setEmployees(result?.data || []);
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Employee Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your staff directory, roles, and permissions across all
            properties.
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
            onClick={() => router.push("/super-admin/employees/create")}
          >
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Employees",
            value: employees.length,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
          },
          {
            label: "Active Staff",
            value: employees.filter((emp) => emp.isActive).length,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "On Leave",
            value: employees.filter((emp) => emp.isOnLeave).length,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
          {
            label: "Departments",
            value: "6",
            icon: Building,
            color: "text-rose-600",
            bg: "bg-rose-50 dark:bg-rose-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                stat.bg,
              )}
            >
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
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search employees or departments..."
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

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Employee Id
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Employee
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Mobile
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Department
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Status
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Join Date
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {employees.map((emp, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={emp._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      {emp.employeeCode}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-sm">
                        {emp.firstName?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-none text-sm">
                          {emp.firstName} {emp.lastName}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">{emp.phone}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-slate-500 dark:text-slate-400">
                        {emp.department}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {emp.designation}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2.5">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        emp.isActive
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                          : "bg-rose-50 dark:bg-rose-500/10 text-rose-600",
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />

                      {emp.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />

                      <span className="font-medium text-xs">
                        {new Date(emp.joiningDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg text-slate-300 hover:text-indigo-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>

                      <button className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-slate-300 hover:text-emerald-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-slate-300 hover:text-rose-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Employees Found
              </h3>
              <p className="text-slate-400 text-sm">
                We couldn&apos;t find any employee matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Table Pagination */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing{" "}
            {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * limit + 1}
            –{Math.min(currentPage * limit, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} results
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
                    n === currentPage &&
                      "bg-indigo-600 shadow-lg shadow-indigo-500/20",
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
    </div>
  );
}
