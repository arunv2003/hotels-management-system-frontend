"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShieldCheck, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MODULES = [
  { id: "dashboard",       label: "Dashboard",       actions: ["view", "global_view"] },
  { id: "hotels",          label: "Hotels",           actions: ["add", "view", "edit", "delete" , "global_view"] },
  { id: "employees",       label: "Employees",        actions: ["add", "view", "edit", "delete", "global_view"] },
  { id: "plans",           label: "Plans",            actions: ["add", "view", "edit", "delete", "global_view"] },
  { id: "coupons",         label: "Coupons",          actions: ["add", "view", "edit", "delete", "global_view"] },
  { id: "payments",        label: "Payments",         actions: ["view" , "global_view"] },
  { id: "analytics",       label: "Analytics",        actions: ["view" , "global_view"] },
  { id: "global_reports",  label: "Global Reports",   actions: ["view" , "global_view"] },
  { id: "announcements",   label: "Announcements",    actions: ["add", "view", "edit", "delete", "global_view"] },
  { id: "notifications",   label: "Notifications",    actions: ["view", "global_view"] },
  { id: "support_tickets", label: "Support Tickets",  actions: ["view", "edit" , "global_view"] },
  { id: "cms_pages",       label: "CMS Pages",        actions: ["add", "view", "edit", "delete", "global_view"] },
  { id: "testimonials",    label: "Testimonials",     actions: ["add", "view", "edit", "delete", "global_view"] },
  { id: "settings",        label: "Settings",         actions: ["view", "edit", "global_view"] },
];

const ACTIONS = [
  { id: "add", label: "Add", icon: "➕" },
  { id: "view", label: "View", icon: "👁️" },
  { id: "edit", label: "Edit", icon: "✏️" },
  { id: "delete", label: "Delete", icon: "🗑️" },
  { id: "global_view", label: "Global View", icon: "🌍" }
];

const emptyPermissions = () => {
  const perms = {};
  MODULES.forEach((m) =>
    m.actions.forEach((a) => {
      perms[`${m.id}_${a}`] = false;
    })
  );
  return perms;
};

export default function AddRoles({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState(emptyPermissions());
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (moduleId, action) => {
    const key = `${moduleId}_${action}`;
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const has = (moduleId, action) =>
    permissions[`${moduleId}_${action}`] || false;

  const toggleSection = (moduleId) => {
    setExpandedSections(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const selectAllForModule = (module) => {
    const newPermissions = { ...permissions };
    module.actions.forEach(action => {
      const key = `${module.id}_${action}`;
      newPermissions[key] = true;
    });
    setPermissions(newPermissions);
  };

  const clearAllForModule = (module) => {
    const newPermissions = { ...permissions };
    module.actions.forEach(action => {
      const key = `${module.id}_${action}`;
      newPermissions[key] = false;
    });
    setPermissions(newPermissions);
  };

  const getModulePermissionCount = (module) => {
    const availableActions = module.actions;
    const enabledActions = availableActions.filter(action => has(module.id, action));
    return { enabled: enabledActions.length, total: availableActions.length };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data ={
      name,
      description,
      permissions,
      users: 0,
    }

    console.log(data,"asasasasasa")


    onSave(data);
    setName("");
    setDescription("");
    setPermissions(emptyPermissions());
    onClose();
  };

  const filteredModules = MODULES.filter(module =>
    module.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
                <ShieldCheck size={22} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Create New Role
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure role details and granular permissions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable body */}
          <form
            id="add-role-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto"
          >
            {/* Role details */}
            <div className="px-6 py-6 space-y-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Support Specialist"
                      className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of this role's purpose"
                      className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Permission Matrix */}
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Module Permissions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure access levels for each module
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 pl-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                {filteredModules.map((module) => {
                  const { enabled, total } = getModulePermissionCount(module);
                  const isExpanded = expandedSections[module.id] !== false;
                  
                  return (
                    <div
                      key={module.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                    >
                      {/* Module Header */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleSection(module.id)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {module.label}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {enabled}/{total} permissions enabled
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => selectAllForModule(module)}
                            className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded transition-colors"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={() => clearAllForModule(module)}
                            className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
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
                              const available = module.actions.includes(action.id);
                              const checked = has(module.id, action.id);

                              return (
                                <button
                                  key={action.id}
                                  type="button"
                                  disabled={!available}
                                  onClick={() => toggle(module.id, action.id)}
                                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                                    available
                                      ? checked
                                        ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/50 cursor-pointer"
                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                                      : "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-base">{action.icon}</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                      {action.label}
                                    </span>
                                  </div>
                                  {available && (
                                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                                      checked
                                        ? "bg-indigo-600 text-white"
                                        : "border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    }`}>
                                      {checked && <Check size={10} strokeWidth={3} />}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredModules.length === 0 && (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    No modules found matching &quot;{searchTerm}&quot;
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Only checked permissions will be granted
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-10 px-5 rounded-lg font-medium cursor-pointer border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-role-form"
                className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
              >
                Create Role
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}