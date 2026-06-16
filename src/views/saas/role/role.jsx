"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Check,
  Edit2,
  Users,
  Key,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Filter,
  XCircle,
} from "lucide-react";
import AddRoles from "@/components/dilogs/saas/roles/roles.Permission";
import { Roles } from "@/routes/saas/role/role.route";

const ROLES = [
  {
    id: "1",
    name: "Platform Admin",
    users: 4,
    description: "Full system access with all permissions",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Support Manager",
    users: 8,
    description: "Manage support tickets and user inquiries",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Billing Manager",
    users: 2,
    description: "Handle payments, invoices, and subscriptions",
    createdAt: "2024-03-10",
  },
];

const MODULES = [
  {
    id: "dashboard",
    label: "Dashboard",
    actions: ["view", "global_view"],
    icon: "📊",
  },
  {
    id: "hotels",
    label: "Hotels",
    actions: ["add", "view", "edit", "delete", "global_view"],
    icon: "🏨",
  },
  {
    id: "employees",
    label: "Employees",
    actions: ["add", "view", "edit", "delete", "global_view"],
    icon: "👥",
  },
  {
    id: "plans",
    label: "Plans",
    actions: ["add", "view", "edit", "delete", "global_view"],
    icon: "📋",
  },
  {
    id: "coupons",
    label: "Coupons",
    actions: ["add", "view", "edit", "delete", "global_view"],
    icon: "🎫",
  },
  {
    id: "payments",
    label: "Payments",
    actions: ["view", "global_view"],
    icon: "💰",
  },
  {
    id: "analytics",
    label: "Analytics",
    actions: ["view", "global_view"],
    icon: "📈",
  },
  {
    id: "global_reports",
    label: "Global Reports",
    actions: ["view", "global_view"],
    icon: "🌍",
  },
  {
    id: "announcements",
    label: "Announcements",
    actions: ["add", "view", "edit", "delete", "global_view"],
    icon: "📢",
  },
  {
    id: "notifications",
    label: "Notifications",
    actions: ["view", "global_view"],
    icon: "🔔",
  },
  {
    id: "support_tickets",
    label: "Support Tickets",
    actions: ["view", "edit", "global_view"],
    icon: "🎫",
  },
  {
    id: "cms_pages",
    label: "CMS Pages",
    actions: ["add", "view", "edit", "delete", "global_view"],
    icon: "📄",
  },
  {
    id: "testimonials",
    label: "Testimonials",
    actions: ["add", "view", "edit", "delete", "global_view"],
    icon: "⭐",
  },
  {
    id: "settings",
    label: "Settings",
    actions: ["view", "edit", "global_view"],
    icon: "⚙️",
  },
];

const ACTIONS = [
  {
    id: "add",
    label: "Add",
    icon: "➕",
    color: "emerald",
    description: "Create new entries",
  },
  {
    id: "view",
    label: "View",
    icon: "👁️",
    color: "blue",
    description: "Read access",
  },
  {
    id: "edit",
    label: "Edit",
    icon: "✏️",
    color: "amber",
    description: "Modify existing entries",
  },
  {
    id: "delete",
    label: "Delete",
    icon: "🗑️",
    color: "red",
    description: "Remove entries",
  },
  {
    id: "global_view",
    label: "Global View",
    icon: "🌍",
    color: "purple",
    description: "Cross-organization access",
  },
];

const getActionColor = (actionId) => {
  const action = ACTIONS.find((a) => a.id === actionId);
  return action?.color || "gray";
};

// Build default permissions for a role
const buildDefaultPerms = (roleId) => {
  if (roleId === "1") {
    // Platform Admin gets all permissions
    const perms = {};
    MODULES.forEach((module) => {
      module.actions.forEach((action) => {
        perms[`${module.id}_${action}`] = true;
      });
    });
    return perms;
  }
  return {};
};

export default function RolesPermissionsPage() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [filterAction, setFilterAction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // permissions keyed by role id
  const [allPermissions, setAllPermissions] = useState({});

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()),
  );

  const permissions = allPermissions[selectedRole?.id] || {};

  const togglePermission = (moduleId, action) => {
    const key = `${moduleId}_${action}`;
    setAllPermissions((prev) => ({
      ...prev,
      [selectedRole.id]: {
        ...(prev[selectedRole.id] || {}),
        [key]: !(prev[selectedRole.id] || {})[key],
      },
    }));
  };

  const hasPermission = (moduleId, action) => {
    return permissions[`${moduleId}_${action}`] || false;
  };

  const fetchAllRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await Roles.getAllRoles();
      const formattedRoles = (result.data || []).map((role) => {
        const formattedPermissions = {};
        Object.entries(role.permissions || {}).forEach(([module, actions]) => {
          actions.forEach((action) => {
            formattedPermissions[`${module}_${action}`] = true;
          });
        });
        return { ...role, id: role._id, permissionsMap: formattedPermissions };
      });
      setRoles(formattedRoles);
      const permissionState = {};
      formattedRoles.forEach((role) => {
        permissionState[role.id] = role.permissionsMap;
      });
      setAllPermissions(permissionState);
      if (formattedRoles.length > 0) {
        setSelectedRole((prev) => prev || formattedRoles[0]);
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to fetch roles", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);
  const toggleModuleExpand = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const selectAllForModule = (module) => {
    const newPermissions = { ...permissions };
    module.actions.forEach((action) => {
      newPermissions[`${module.id}_${action}`] = true;
    });
    setAllPermissions((prev) => ({
      ...prev,
      [selectedRole.id]: newPermissions,
    }));
  };

  const clearAllForModule = (module) => {
    const newPermissions = { ...permissions };
    module.actions.forEach((action) => {
      newPermissions[`${module.id}_${action}`] = false;
    });
    setAllPermissions((prev) => ({
      ...prev,
      [selectedRole.id]: newPermissions,
    }));
  };

  const handleReset = () => {
    if (confirm("Reset all permissions for this role?")) {
      setAllPermissions((prev) => ({
        ...prev,
        [selectedRole.id]: buildDefaultPerms(selectedRole.id),
      }));
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    try {
      setIsSaving(true);
      await Roles.updateRole(selectedRole.id, { permissions });
      showToast(`Permissions saved for "${selectedRole.name}"`, "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save permissions", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      setIsDeleting(true);
      await Roles.deleteRole(roleId);
      const remaining = roles.filter((r) => r.id !== roleId);
      setRoles(remaining);
      setSelectedRole(remaining[0] || null);
      setShowDeleteConfirm(false);
      showToast("Role deleted successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete role", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateRole = async (newRoleData) => {
    try {
      const result = await Roles.createRole(newRoleData);
      const created = result.data;
      const formattedPermissions = {};
      Object.entries(created.permissions || {}).forEach(([module, actions]) => {
        actions.forEach((action) => {
          formattedPermissions[`${module}_${action}`] = true;
        });
      });
      const newRole = { ...created, id: created._id, permissionsMap: formattedPermissions };
      setRoles((prev) => [...prev, newRole]);
      setAllPermissions((prev) => ({ ...prev, [newRole.id]: formattedPermissions }));
      setSelectedRole(newRole);
      showToast(`Role "${newRole.name}" created successfully`, "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create role", "error");
    }
  };

  const getModulePermissionStats = (module) => {
    const availableActions = module.actions;
    const enabledCount = availableActions.filter((action) =>
      hasPermission(module.id, action),
    ).length;
    const totalCount = availableActions.length;
    const percentage = totalCount > 0 ? (enabledCount / totalCount) * 100 : 0;
    return { enabledCount, totalCount, percentage };
  };

  const getOverallPermissionStats = () => {
    let totalEnabled = 0;
    let totalPossible = 0;
    MODULES.forEach((module) => {
      totalPossible += module.actions.length;
      totalEnabled += module.actions.filter((action) =>
        hasPermission(module.id, action),
      ).length;
    });
    return {
      totalEnabled,
      totalPossible,
      percentage: (totalEnabled / totalPossible) * 100,
    };
  };

  const stats = getOverallPermissionStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading roles...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedRole) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 mb-6">No roles found. Create your first role to get started.</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 gap-2"
            >
              <Plus size={18} />
              Create Role
            </Button>
          </div>
        </div>
        <AddRoles
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateRole}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Roles & Permissions
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage role-based access control for your platform
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 cursor-pointer gap-2"
          >
            <Plus size={18} />
            Create Role
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Roles List */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
              {/* Search Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    placeholder="Search roles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Roles List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                {filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      selectedRole.id === role.id
                        ? "bg-indigo-50 dark:bg-indigo-500/10 border-l-4 border-l-indigo-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {role.name}
                          {role.id === "1" && (
                            <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </h3>
                        {role.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {role.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Users size={12} />
                            <span>{role.users} users</span>
                          </div>
                        </div>
                      </div>
                      <ShieldCheck
                        size={16}
                        className={
                          selectedRole.id === role.id
                            ? "text-indigo-600"
                            : "text-slate-400"
                        }
                      />
                    </div>
                  </div>
                ))}

                {filteredRoles.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No roles found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Permission Matrix */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header with Role Info */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
                        <ShieldCheck
                          size={20}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedRole.name}
                        </h2>
                        {selectedRole.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {selectedRole.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                          <Key
                            size={14}
                            className="text-emerald-600 dark:text-emerald-400"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Permissions</p>
                          <p className="text-sm font-semibold">
                            {stats.totalEnabled}/{stats.totalPossible}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                          <Users
                            size={14}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Assigned Users
                          </p>
                          <p className="text-sm font-semibold">
                            {selectedRole.users}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/50 cursor-pointer"
                      disabled={selectedRole.id === "1"}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Role
                    </Button>
                  </div>
                </div>
              </div>

              {/* Permission Matrix */}
              <div className="p-6">
                {/* Action Filter Bar */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="text-xs text-slate-500 mr-2">
                    Filter by action:
                  </span>
                  <button
                    onClick={() => setFilterAction(null)}
                    className={`px-2 py-1 text-xs rounded-md transition-all ${
                      !filterAction
                        ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                    }`}
                  >
                    All
                  </button>
                  {ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      onClick={() =>
                        setFilterAction(
                          filterAction === action.id ? null : action.id,
                        )
                      }
                      className={`px-2 py-1 text-xs rounded-md transition-all flex items-center gap-1 ${
                        filterAction === action.id
                          ? `bg-${getActionColor(action.id)}-100 dark:bg-${getActionColor(action.id)}-500/20 text-${getActionColor(action.id)}-700`
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                      }`}
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Modules List */}
                <div className="space-y-3">
                  {MODULES.map((module) => {
                    const { enabledCount, totalCount, percentage } =
                      getModulePermissionStats(module);
                    const isExpanded = expandedModules[module.id] !== false;

                    // Filter modules based on action filter
                    if (
                      filterAction &&
                      !module.actions.includes(filterAction)
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={module.id}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                      >
                        {/* Module Header */}
                        <div
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          onClick={() => toggleModuleExpand(module.id)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button type="button" className="p-1">
                              {isExpanded ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                            <span className="text-xl">{module.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {module.label}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 max-w-[200px]">
                                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                  {enabledCount}/{totalCount} enabled
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => selectAllForModule(module)}
                              className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded transition-colors"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => clearAllForModule(module)}
                              className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Module Permissions */}
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                              {ACTIONS.map((action) => {
                                const available = module.actions.includes(
                                  action.id,
                                );
                                const checked = hasPermission(
                                  module.id,
                                  action.id,
                                );

                                if (!available) return null;

                                return (
                                  <button
                                    key={action.id}
                                    type="button"
                                    onClick={() =>
                                      togglePermission(module.id, action.id)
                                    }
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                      checked
                                        ? `bg-${getActionColor(action.id)}-50 dark:bg-${getActionColor(action.id)}-500/10 border-${getActionColor(action.id)}-300 dark:border-${getActionColor(action.id)}-500/50`
                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">
                                        {action.icon}
                                      </span>
                                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {action.label}
                                      </span>
                                    </div>
                                    <div
                                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                        checked
                                          ? `bg-${getActionColor(action.id)}-600 text-white`
                                          : "border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                      }`}
                                    >
                                      {checked && (
                                        <Check size={12} strokeWidth={3} />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Changes are saved locally until you click Save
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSaving}
                    className="cursor-pointer border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-lg shadow-indigo-500/25 disabled:opacity-50 gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Permissions"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-full">
                <Trash2 size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Delete Role
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedRole.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteRole(selectedRole.id)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Role"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddRoles
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateRole}
      />
    </DashboardLayout>
  );
}
