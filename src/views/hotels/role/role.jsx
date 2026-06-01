"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import AddRoles from "@/components/dilogs/saas/roles/roles.Permission";

const MOCK_ROLES = [
  {
    id: "r1",
    name: "Platform Admin",
    type: "SAAS",
    users: 3,
    permissions: [
      "dashboard",
      "saas_hotels",
      "saas_subscriptions",
      "saas_payments",
      "saas_analytics",
      "saas_employees",
      "settings",
    ],
    description: "Full access to platform settings and global analytics.",
  },
  {
    id: "r2",
    name: "Support Specialist",
    type: "SAAS",
    users: 12,
    permissions: ["dashboard", "saas_hotels", "saas_analytics"],
    description: "Can manage hotel accounts and view performance metrics.",
  },
  {
    id: "r3",
    name: "Billing Manager",
    type: "SAAS",
    users: 2,
    permissions: ["dashboard", "saas_subscriptions", "saas_payments"],
    description: "Responsible for payments, invoices, and subscription plans.",
  },
];

const PERMISSION_GROUPS = [
  {
    title: "Hotel Operations",
    perms: [
      {
        id: "dashboard",
        label: "Dashboard",
        desc: "Access the hotel management dashboard",
      },

      {
        id: "rooms",
        label: "Rooms",
        desc: "Manage hotel rooms and room types",
      },
      {
        id: "bookings",
        label: "Bookings",
        desc: "Manage reservations and bookings",
      },
      {
        id: "guests",
        label: "Guests",
        desc: "View and manage guest information",
      },

      {
        id: "pos",
        label: "POS",
        desc: "Access Point of Sale operations",
      },

      {
        id: "restaurant",
        label: "Restaurant",
        desc: "Manage restaurant and dining services",
      },

      {
        id: "housekeeping",
        label: "Housekeeping",
        desc: "Manage housekeeping tasks and room status",
      },

      {
        id: "inventory",
        label: "Inventory",
        desc: "Track inventory and stock management",
      },

      {
        id: "staff",
        label: "Staff",
        desc: "Manage hotel employees and staff members",
      },

      {
        id: "payroll",
        label: "Payroll",
        desc: "Access payroll and salary management",
      },

      {
        id: "reports",
        label: "Reports",
        desc: "View hotel analytics and reports",
      },

      {
        id: "settings",
        label: "Settings",
        desc: "Manage hotel settings and configurations",
      },

      {
        id: "employee_dashboard",
        label: "Employee Dashboard",
        desc: "Access employee dashboard panel",
      },

      {
        id: "tasks",
        label: "Tasks",
        desc: "Manage assigned employee tasks",
      },

      {
        id: "attendance",
        label: "Attendance",
        desc: "Track employee attendance records",
      },

      {
        id: "notifications",
        label: "Notifications",
        desc: "Access employee notifications and alerts",
      },
    ],
  },
];

export default function RolesPage() {
  const pathname = usePathname();
  const isSuperAdmin = pathname?.startsWith("/super-admin");

  const [roles, setRoles] = useState(MOCK_ROLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter roles based on context (SaaS/Hotel) and search query
  const filteredRoles = roles
    .filter((r) => (isSuperAdmin ? r.type === "HOTEL" : r.type !== "HOTEL"))
    .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const [selectedRole, setSelectedRole] = useState(() => {
    return (
      MOCK_ROLES.find((r) =>
        isSuperAdmin ? r.type === "HOTEL" : r.type !== "HOTEL",
      ) || MOCK_ROLES[0]
    );
  });

  const [rolePermissions, setRolePermissions] = useState(() => {
    const def =
      MOCK_ROLES.find((r) =>
        isSuperAdmin ? r.type === "HOTEL" : r.type !== "HOTEL",
      ) || MOCK_ROLES[0];
    return def ? def.permissions : [];
  });

  const visibleGroups = PERMISSION_GROUPS.filter((group) => {
    if (isSuperAdmin) {
      return group.title === "Hotel Operations";
    }
    return group.title === "Hotel Operations";
  });

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions);
  };

  const togglePermission = (permId) => {
    setRolePermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId],
    );
  };

  const handleReset = () => {
    if (selectedRole) {
      setRolePermissions(selectedRole.permissions);
    }
  };

  const handleSave = () => {
    if (!selectedRole) return;
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id ? { ...r, permissions: rolePermissions } : r,
      ),
    );
    console.log(
      "Saving permissions for",
      selectedRole.name,
      ":",
      rolePermissions,
    );
    // TODO: connect to API
  };

  const handleDeleteRole = (roleId) => {
    const remaining = roles.filter((r) => r.id !== roleId);
    setRoles(remaining);
    const nextRole =
      remaining.find((r) =>
        isSuperAdmin ? r.type === "SAAS" : r.type !== "SAAS",
      ) || remaining[0];
    if (nextRole) {
      setSelectedRole(nextRole);
      setRolePermissions(nextRole.permissions);
    } else {
      setSelectedRole(null);
      setRolePermissions([]);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Roles &amp; Permissions
            </h1>
            <p className="text-slate-500 mt-1">
              Configure global SaaS employee access levels
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-6 gap-2 cursor-pointer"
          >
            <Plus size={18} />
            Create New Role
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Roles List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="space-y-3">
              {filteredRoles.map((role) => (
                <motion.div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                    selectedRole?.id === role.id
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10"
                      : "border-white dark:border-slate-900 bg-white dark:bg-slate-900 hover:border-indigo-100 dark:hover:border-indigo-500/20 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-bold ${selectedRole?.id === role.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"}`}
                    >
                      {role.name}
                    </h3>
                    <ShieldCheck
                      size={16}
                      className={
                        selectedRole?.id === role.id
                          ? "text-indigo-600"
                          : "text-slate-400"
                      }
                    />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {role.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded uppercase tracking-wider text-slate-500">
                      {role.users} Users
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 rounded uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {role.type}
                    </span>
                  </div>
                </motion.div>
              ))}
              {filteredRoles.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No roles found
                </div>
              )}
            </div>
          </div>

          {/* Permission Editor */}
          <div className="lg:col-span-8 flex flex-col">
            <AnimatePresence mode="wait">
              {selectedRole ? (
                <motion.div
                  key={selectedRole.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card rounded-[1rem] p-8 flex-1 flex flex-col border-none shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {selectedRole.name} Settings
                      </h2>
                      <p className="text-sm text-slate-500">
                        Define what users with this role can see and do.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteRole(selectedRole.id)}
                        className="rounded-xl h-11 px-5 text-rose-500 border-rose-100 dark:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Role
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 pr-4">
                    {visibleGroups.map((group) => (
                      <div key={group.title}>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                          {group.title}
                        </h4>
                        <div className="space-y-4">
                          {group.perms.map((perm) => {
                            const hasPerm = rolePermissions.includes(perm.id);
                            return (
                              <div
                                key={perm.id}
                                onClick={() => togglePermission(perm.id)}
                                className="flex items-start justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 cursor-pointer"
                              >
                                <div className="flex gap-4">
                                  <div
                                    className={`mt-1 p-2 rounded-xl ${hasPerm ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}
                                  >
                                    {hasPerm ? (
                                      <CheckCircle2 size={18} />
                                    ) : (
                                      <XCircle size={18} />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                                      {perm.label}
                                    </p>
                                    <p className="text-xs text-slate-500 max-w-md">
                                      {perm.desc}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="flex items-center h-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={hasPerm}
                                      onChange={() => togglePermission(perm.id)}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex gap-4">
                      <AlertCircle className="text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                        Changes to role permissions will take effect for all
                        assigned users upon their next session login. Existing
                        active sessions will not be affected until they refresh
                        their security token.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      className="rounded-xl h-11 px-8 font-bold text-slate-500 cursor-pointer"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="rounded-xl h-11 px-10 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-xl shadow-indigo-500/20 cursor-pointer"
                    >
                      Save Permissions
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                  <ShieldCheck
                    size={48}
                    className="text-slate-300 dark:text-slate-700 mb-4"
                  />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Select a role or create one to view and edit settings
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AddRoles
        key={isCreateModalOpen ? "open" : "closed"}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(newRole) => {
          setRoles((prev) => [...prev, newRole]);
          setSelectedRole(newRole);
          setRolePermissions(newRole.permissions);
        }}
        defaultType={isSuperAdmin ? "SAAS" : "HOTEL"}
      />
    </DashboardLayout>
  );
}
