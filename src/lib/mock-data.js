export const MOCK_USER_SUPER_ADMIN = {
    id: 'sa_1',
    name: 'Alex SaaS Master',
    email: 'admin@HotelFlow.com',
    role: 'SUPER_ADMIN',
    permissions: ['saas_hotel_manage', 'saas_subscription_manage', 'saas_analytics_view'],
    avatar: 'https://i.pravatar.cc/150?u=sa_1'
};
export const MOCK_USER_HOTEL_OWNER = {
    id: 'ho_1',
    name: 'John Hotelier',
    email: 'owner@grandview.com',
    role: 'HOTEL_OWNER',
    tenantId: 't_1',
    permissions: [
        'booking_view', 'booking_create', 'booking_edit', 'booking_delete',
        'room_view', 'room_create', 'room_edit', 'room_delete',
        'payroll_manage', 'reports_export', 'user_manage', 'role_manage'
    ],
    avatar: 'https://i.pravatar.cc/150?u=ho_1'
};
export const MOCK_TENANT = {
    id: 't_1',
    name: 'Grand View Resort',
    planId: 'p_premium',
    status: 'active',
    maxRooms: 100,
    maxEmployees: 25,
    modules: ['pos_access', 'inventory_manage', 'reports_export'],
    expiryDate: '2026-12-31'
};
export const MOCK_PLANS = [
    {
        id: 'p_free',
        name: 'Free Trial',
        price: 0,
        billingCycle: 'monthly',
        features: { maxRooms: 5, maxEmployees: 2, modules: [], storageLimitGB: 1 }
    },
    {
        id: 'p_standard',
        name: 'Standard',
        price: 49,
        billingCycle: 'monthly',
        features: { maxRooms: 20, maxEmployees: 10, modules: ['reports_export'], storageLimitGB: 10 }
    },
    {
        id: 'p_premium',
        name: 'Premium',
        price: 99,
        billingCycle: 'monthly',
        features: { maxRooms: 100, maxEmployees: 50, modules: ['pos_access', 'inventory_manage', 'reports_export', 'payroll_manage'], storageLimitGB: 100 }
    }
];
export const MOCK_HOTELS = [
    { id: '1', name: 'Ocean Breeze Inn', owner: 'Alice Smith', plan: 'Premium', status: 'Active', rooms: 45, revenue: 12500 },
    { id: '2', name: 'Mountain Peak Lodge', owner: 'Bob Jones', plan: 'Standard', status: 'Active', rooms: 20, revenue: 8400 },
    { id: '3', name: 'Urban Suite Hotel', owner: 'Charlie Brown', plan: 'Free Trial', status: 'Pending', rooms: 10, revenue: 0 },
    { id: '4', name: 'Desert Oasis Resort', owner: 'David Wilson', plan: 'Premium', status: 'Active', rooms: 80, revenue: 25000 },
    { id: '5', name: 'Forest Hideaway', owner: 'Eva Green', plan: 'Expired', status: 'Suspended', rooms: 15, revenue: 4200 },
];
export const REVENUE_STATS = [
    { month: 'Jan', revenue: 45000, hotels: 120 },
    { month: 'Feb', revenue: 52000, hotels: 125 },
    { month: 'Mar', revenue: 48000, hotels: 132 },
    { month: 'Apr', revenue: 61000, hotels: 140 },
    { month: 'May', revenue: 55000, hotels: 145 },
    { month: 'Jun', revenue: 67000, hotels: 158 },
];
export const HOTEL_STATS = {
    occupancy: 78,
    revenueToday: 2450,
    arrivals: 12,
    departures: 8,
    pendingHousekeeping: 5
};
