"use client";
import React from "react";
import { motion } from "framer-motion";
export default function DashboardLayout({ children, type, }) {
    return (<div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center px-8 shrink-0">
        <div className="flex-1"/>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              Server Status
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-8 relative">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto w-full">
          {children}
        </motion.div>
      </div>
    </div>);
}
