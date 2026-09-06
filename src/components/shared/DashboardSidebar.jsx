"use client";
import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, BedDouble, CalendarDays, Users, Utensils, ClipboardList, Wrench, Package, Clock, CircleDollarSign, BarChart3, Settings, ShieldCheck, Building2, CreditCard, TicketPercent, MessageSquare, Hotel, } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, } from "@/components/ui/sidebar";
import { usePermission } from "@/hooks/use-permission";
import { useAuthStore } from "@/store/authStore";

const hotelNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
    },
    { title: "Rooms", url: "/dashboard/rooms", icon: BedDouble, module: "rooms" },
    {
        title: "Bookings",
        url: "/dashboard/bookings",
        icon: CalendarDays,
        module: "bookings",
    },
    { title: "Guests", url: "/dashboard/guests", icon: Users, module: "guests" },
    {
        title: "Restaurant/POS",
        url: "/dashboard/pos",
        icon: Utensils,
        module: "pos",
    },
    {
        title: "Housekeeping",
        url: "/dashboard/housekeeping",
        icon: ClipboardList,
        module: "housekeeping",
    },
    {
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: Package,
        module: "inventory",
    },
    { title: "Staff", url: "/dashboard/staff", icon: Wrench, module: "staff" },
    {
        title: "Payroll",
        url: "/dashboard/payroll",
        icon: CircleDollarSign,
        module: "payroll",
    },
    {
        title: "Attendance",
        url: "/dashboard/attendance",
        icon: Clock,
        module: "attendance",
    },
    {
        title: "Reports",
        url: "/dashboard/reports",
        icon: BarChart3,
        module: "reports",
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        module: "settings",
    },
];
const saasNavItems = [
    {
        title: "Overview",
        url: "/super-admin",
        icon: LayoutDashboard,
        module: "dashboard",
    },
    {
        title: "Hotels",
        url: "/super-admin/hotels",
        icon: Building2,
        module: "saas_hotels",
    },
    {
        title: "Subscriptions",
        url: "/super-admin/subscriptions",
        icon: CreditCard,
        module: "saas_subscriptions",
    },
    {
        title: "Coupons",
        url: "/super-admin/coupons",
        icon: TicketPercent,
        module: "saas_subscriptions",
    },
    {
        title: "Revenue",
        url: "/super-admin/revenue",
        icon: CircleDollarSign,
        module: "saas_payments",
    },
    {
        title: "Support",
        url: "/super-admin/support",
        icon: MessageSquare,
        module: "saas_analytics",
    },
    {
        title: "SaaS Employees",
        url: "/super-admin/employees",
        icon: ShieldCheck,
        module: "saas_employees",
    },
    {
        title: "Global Settings",
        url: "/super-admin/settings",
        icon: Settings,
        module: "settings",
    },
];
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function DashboardSidebar({ type = "hotel", }) {
    const router = useRouter();
    const { hasModule } = usePermission();
    const { user } = useAuthStore();
    
    const userType = user?.userType || user?.role;
    const items = (userType === "super-admin" || userType === "Employee") ? saasNavItems : hotelNavItems;
    return (<Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-2.5 font-bold text-lg text-primary">
          <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/chacha-vatiza-logo.png"
              alt="CHACHA VATIZA HOTELS"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden flex flex-col min-w-0 text-left">
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white leading-tight truncate">
              CHACHA VATIZA
            </span>
            <span className="text-[9px] tracking-wider uppercase font-bold text-amber-600 dark:text-amber-400">
              HOTELS
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
            // Check if user has access to this module
            if (!hasModule(item.module))
                return null;
            return (<SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} render={(props) => (<Link {...props} href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>)}/>
                  </SidebarMenuItem>);
        })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* User profile / Logout */}</SidebarFooter>
    </Sidebar>);
}
