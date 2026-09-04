"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut, Search, Hotel as BrandIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/sidebarStore";
import { SUPER_ADMIN_NAV, HOTEL_NAV, EMPLOYEE_NAV } from "@/lib/navigation";

export const Sidebar = () => {
    const { isCollapsed, toggleCollapsed, isMobileOpen, closeMobile } = useSidebarStore();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, hasPermission } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        closeMobile();
        router.push("/");
    };

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    // Auto-close mobile drawer on route change
    useEffect(() => {
        closeMobile();
    }, [pathname, closeMobile]);

    const getNavItems = () => {
        if (pathname.startsWith("/super-admin")) {
            if (!mounted) return SUPER_ADMIN_NAV;
        } else if (pathname.startsWith("/employee")) {
            if (!mounted) return EMPLOYEE_NAV;
        } else {
            if (!mounted) return HOTEL_NAV;
        }

        const rawType = String(user?.userType || user?.role || "").toLowerCase();
        let rawItems = HOTEL_NAV;

        if (pathname.startsWith("/super-admin") || rawType === "super-admin" || rawType === "super_admin" || (rawType === "employee" && pathname.startsWith("/super-admin"))) {
            rawItems = SUPER_ADMIN_NAV;
        } else if (rawType === "employee" && pathname.startsWith("/employee")) {
            rawItems = EMPLOYEE_NAV;
        } else {
            rawItems = HOTEL_NAV;
        }

        if (
            rawType === "super-admin" ||
            rawType === "super_admin" ||
            rawType === "hotel-owner" ||
            rawType === "hotel_owner" ||
            rawType === "hotel" ||
            rawType === "admin" ||
            rawType === "business" ||
            user?.permissions === "ALL"
        ) {
            return rawItems;
        }

        return rawItems.filter((item) => {
            if (
                item.label === "Dashboard" ||
                item.href === "/admin" ||
                item.href === "/super-admin" ||
                item.href === "/employee"
            ) {
                return true;
            }

            const targetModule = item.module || item.href.split("/").filter(Boolean).pop()?.replace("-", "_") || "dashboard";
            return hasPermission(targetModule, "view");
        });
    };
    const navItems = getNavItems();

    const sidebarContent = (isMobile = false) => (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between py-5 px-3 mb-2 shrink-0">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-3 px-2">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
                <BrandIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                VEDANTA TECH
              </span>
            </div>
          )}

          {isCollapsed && !isMobile && (
            <div className="mx-auto bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <BrandIcon className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Desktop collapse chevron */}
          {!isMobile && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden lg:flex absolute -right-3 top-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-30"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <button
              type="button"
              onClick={closeMobile}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {(!isCollapsed || isMobile) && (
          <div className="px-3 mb-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) closeMobile();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "group-hover:scale-110 transition-transform text-slate-500 dark:text-slate-400"
                  )}
                />
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium text-sm truncate">{item.label}</span>
                )}
                {isActive && (!isCollapsed || isMobile) && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                  />
                )}
                {isCollapsed && !isMobile && isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 bg-white dark:bg-slate-900">
          {(!isCollapsed || isMobile) && (
            <Link
              href={
                pathname.startsWith("/super-admin")
                  ? "/super-admin/profile"
                  : pathname.startsWith("/employee")
                  ? "/employee/profile"
                  : "/admin/profile"
              }
              onClick={() => {
                if (isMobile) closeMobile();
              }}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
              title="View Profile Details"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0 text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {user?.name || "Logged User"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase tracking-tighter">
                  {String(user?.userType || user?.role?.name || user?.role || "").replace("_", " ")}
                </p>
              </div>
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 text-xs font-bold",
              isCollapsed && !isMobile && "justify-center"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </div>
    );

    return (
      <>
        {/* Desktop Sidebar (hidden on mobile/tablet < 1024px) */}
        <aside
          className={cn(
            "hidden lg:flex relative h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col transition-all duration-300 ease-in-out z-30 shrink-0 select-none",
            isCollapsed ? "w-20" : "w-64 xl:w-72"
          )}
        >
          {sidebarContent(false)}
        </aside>

        {/* Mobile / Tablet Drawer & Backdrop */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMobile}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden"
              />

              {/* Drawer */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed inset-y-0 left-0 w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 shadow-2xl lg:hidden pt-safe pb-safe pl-safe"
              >
                {sidebarContent(true)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
};

