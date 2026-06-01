import {
  LayoutDashboard,
  Hotel,
  FileText,
  CreditCard,
  MessageSquareQuote,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  Bed,
  CalendarCheck,
  UserSquare2,
  Store,
  ClipboardList,
  Utensils,
  Wrench,
  Box,
  Wallet,
  Clock,
  Bell,
  FileBarChart,
  LifeBuoy,
  BellRing,
  TicketPercent,
} from "lucide-react";
export const SUPER_ADMIN_NAV = [
  { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },

  { label: "Hotels", href: "/super-admin/hotels", icon: Hotel },
  { label: "Employees", href: "/super-admin/employees", icon: Users },
  {
    label: "Roles & Permissions",
    href: "/super-admin/roles",
    icon: ShieldCheck,
  },

  { label: "Plans", href: "/super-admin/plans", icon: CreditCard },
  { label: "Coupons", href: "/super-admin/coupons", icon: TicketPercent },
  { label: "Payments", href: "/super-admin/payments", icon: Wallet },

  { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { label: "Global Reports", href: "/super-admin/reports", icon: FileBarChart },

  {
    label: "Announcements",
    href: "/super-admin/announcements",
    icon: BellRing,
  },
  { label: "Notifications", href: "/super-admin/notifications", icon: Bell },

  { label: "Support Tickets", href: "/super-admin/support-tickets", icon: LifeBuoy },

  { label: "CMS Pages", href: "/super-admin/cms-page", icon: FileText },
  {
    label: "Testimonials",
    href: "/super-admin/testimonials",
    icon: MessageSquareQuote,
  },

  { label: "Settings", href: "/super-admin/settings", icon: Settings },
];

export const HOTEL_NAV = [
  { label: "Dashboard", href: "/hotel-owner", icon: LayoutDashboard },
  { label: "Rooms", href: "/hotel-owner/rooms", icon: Bed },
  { label: "Bookings", href: "/hotel-owner/bookings", icon: CalendarCheck },
  { label: "Guests", href: "/hotel-owner/guests", icon: UserSquare2 },

  {
    label: "POS",
    href: "/hotel-owner/pos",
    icon: Store,
    module: "pos_access",
  },

  {
    label: "Restaurant",
    href: "/hotel-owner/restaurant",
    icon: Utensils,
    module: "pos_access",
  },

  {
    label: "Housekeeping",
    href: "/hotel-owner/housekeeping",
    icon: Wrench,
  },

  {
    label: "Inventory",
    href: "/hotel-owner/inventory",
    icon: Box,
    module: "inventory_manage",
  },

  {
    label: "Staff",
    href: "/hotel-owner/staff",
    icon: Users,
  },

  {
    label: "Payroll",
    href: "/hotel-owner/payroll",
    icon: Wallet,
    module: "payroll_manage",
  },
  {
    label: "Roles & Permissions",
    href: "/hotel-owner/roles",
    icon: ShieldCheck,
  },
  {
    label: "Reports",
    href: "/hotel-owner/reports",
    icon: BarChart3,
    module: "reports_export",
  },

  {
    label: "Settings",
    href: "/hotel-owner/settings",
    icon: Settings,
  },

  {
    label: "Dashboard",
    href: "/employee",
    icon: LayoutDashboard,
  },

  {
    label: "Tasks",
    href: "/employee/tasks",
    icon: ClipboardList,
  },

  {
    label: "Attendance",
    href: "/employee/attendance",
    icon: Clock,
  },

  {
    label: "Notifications",
    href: "/employee/notifications",
    icon: Bell,
  },
];
