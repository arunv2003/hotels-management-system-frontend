import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400',
    slate: 'text-slate-600 bg-slate-50 dark:bg-slate-500/10 dark:text-slate-400',
};
export const StatCard = ({ title, value, icon: Icon, trend, color = 'indigo' }) => {
    return (<motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl flex flex-col gap-4 group">
      <div className="flex items-center justify-between">
        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", colorMap[color])}>
          <Icon className="w-6 h-6"/>
        </div>
        {trend && (<div className={cn("text-xs font-bold px-2 py-1 rounded-full", trend.isUp ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10")}>
            {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
          </div>)}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
          {value}
        </h3>
      </div>
    </motion.div>);
};
