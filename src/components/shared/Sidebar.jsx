"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut, Search, Hotel as BrandIcon, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { SUPER_ADMIN_NAV, HOTEL_NAV, EMPLOYEE_NAV } from "@/lib/navigation";
import { SubscriptionGuard } from "@/features/subscriptions/SubscriptionGuard";
export const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { user, logout, hasPermission } = useAuthStore();

    React.useEffect(() => {
        setMounted(true);
    }, []);

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
            if (item.module) {
                return hasPermission(item.module, "view");
            }
            let moduleId = "dashboard";
            const parts = item.href.split("/").filter(Boolean);
            if (parts.length > 1) {
                moduleId = parts[parts.length - 1].replace("-", "_");
            }
            if (moduleId === "reports") moduleId = "global_reports";
            if (moduleId === "cms_page") moduleId = "cms_pages";
            if (moduleId === "support_tickets") moduleId = "support_tickets";

            return hasPermission(moduleId, "view");
        });
    };
    const navItems = getNavItems();
    return (<motion.aside animate={{ width: isCollapsed ? 80 : 280 }} className={cn("relative h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-50", isCollapsed ? "px-3" : "px-4")}>
      <div className="flex items-center justify-between py-6 mb-4">
        <AnimatePresence mode="wait">
          {!isCollapsed && (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-3 px-2">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                <BrandIcon className="w-6 h-6 text-white"/>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                VEDANTA TECH
              </span>
            </motion.div>)}
        </AnimatePresence>

        {isCollapsed && (<div className="mx-auto bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <BrandIcon className="w-6 h-6 text-white"/>
          </div>)}

        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          {isCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
        </button>
      </div>

      {!isCollapsed && (<div className="px-2 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input type="text" placeholder="Search..." className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"/>
          </div>
        </div>)}

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar px-2">
        {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const content = (<Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative", isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100")}>
              <Icon className={cn("w-5 h-5 shrink-0", isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "group-hover:scale-110 transition-transform")}/>
              {!isCollapsed && (<span className="font-medium text-sm">{item.label}</span>)}
              {isActive && !isCollapsed && (<motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"/>)}
              {isCollapsed && isActive && (<div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"/>)}
            </Link>);
            if (item.module) {
                return (<SubscriptionGuard key={item.href} moduleId={item.module} fallback={!isCollapsed ? (<div className="flex items-center gap-3 px-3 py-2.5 opacity-50 cursor-not-allowed">
                      <Icon className="w-5 h-5 shrink-0"/>
                      <span className="font-medium text-sm">{item.label}</span>
                      <div className="ml-auto bg-slate-100 dark:bg-slate-800 p-1 rounded">
                        <LogOut size={12} className="rotate-180"/>
                      </div>
                    </div>) : null}>
                {content}
              </SubscriptionGuard>);
            }
            return content;
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {!isCollapsed && (<div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-600">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 truncate uppercase tracking-tighter">
                {(user?.userType || user?.role || "").replace("_", " ")}
              </p>
            </div>
          </div>)}
        <button onClick={logout} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200", isCollapsed && "justify-center")}>
          <LogOut className="w-5 h-5"/>
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>);
};
