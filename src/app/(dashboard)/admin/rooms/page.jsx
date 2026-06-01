'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { Bed, Plus, Search, User, Calendar, MoreVertical, Wrench, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
const MOCK_ROOMS = [
    { id: '301', type: 'Deluxe', status: 'Occupied', guest: 'Robert Fox', checkOut: '2024-05-20' },
    { id: '302', type: 'Suite', status: 'Available', guest: null, checkOut: null },
    { id: '303', type: 'Standard', status: 'Cleaning', guest: null, checkOut: null },
    { id: '304', type: 'Deluxe', status: 'Occupied', guest: 'Jane Cooper', checkOut: '2024-05-18' },
    { id: '305', type: 'Standard', status: 'Maintenance', guest: null, checkOut: null },
    { id: '306', type: 'Suite', status: 'Available', guest: null, checkOut: null },
    { id: '401', type: 'Penthouse', status: 'Occupied', guest: 'Guy Hawkins', checkOut: '2024-05-25' },
    { id: '402', type: 'Deluxe', status: 'Available', guest: null, checkOut: null },
];
const statusStyles = {
    Available: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Occupied: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    Cleaning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Maintenance: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};
const statusIcons = {
    Available: CheckCircle2,
    Occupied: User,
    Cleaning: Clock,
    Maintenance: Wrench,
};
export default function RoomsPage() {
    const [filter, setFilter] = useState('All');
    const filteredRooms = filter === 'All'
        ? MOCK_ROOMS
        : MOCK_ROOMS.filter(r => r.status === filter);
    return (<DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Room Inventory</h1>
            <p className="text-slate-500 mt-1">Monitor and manage all property units</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl h-11 px-5 border-slate-200 dark:border-slate-800">
              Bulk Actions
            </Button>
            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-6 gap-2 shadow-lg shadow-indigo-500/20">
              <Plus size={18}/>
              Add Room
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {['All', 'Available', 'Occupied', 'Cleaning', 'Maintenance'].map((s) => (<button key={s} onClick={() => setFilter(s)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all border-2 ${filter === s
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}>
                {s}
              </button>))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <Input placeholder="Room number..." className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-900"/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room, i) => {
            const Icon = statusIcons[room.status];
            return (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={room.id} className="glass-card p-6 rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Bed size={24}/>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={20}/>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Room {room.id}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{room.type}</p>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${statusStyles[room.status]}`}>
                    <Icon size={14}/>
                    {room.status}
                  </div>

                  {room.guest ? (<div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                          {room.guest.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{room.guest}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Calendar size={10}/>
                        {room.checkOut}
                      </div>
                    </div>) : (<div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="ghost" className="w-full h-8 rounded-lg text-indigo-600 font-bold text-xs hover:bg-indigo-50">
                        Check In Now
                      </Button>
                    </div>)}
                </div>
              </motion.div>);
        })}
        </div>
      </div>
    </DashboardLayout>);
}
