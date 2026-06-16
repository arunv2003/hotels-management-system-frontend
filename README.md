# HotelFlow | Hotel Management SaaS Frontend

A production-ready, multi-tenant Hotel Management SaaS platform built with Next.js 15, TypeScript, and modern design principles.

## 🚀 Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand (Auth, Tenant, Settings)
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## 🏗️ Architecture
- **Feature-Based**: Logic is co-located within `src/features`.
- **RBAC**: Dynamic Role-Based Access Control using `PermissionGuard`.
- **Subscription Guard**: Module-level gating based on tenant plans.
- **Multi-Tenant Routing**: Support for tenant-specific dashboards and layouts.

## 🔑 User Panels
1. **Super Admin**: SaaS platform oversight, hotel onboarding, global analytics.
2. **Hotel Owner**: Property management, room inventory, booking oversight, staff payroll.
3. **Hotel Employee**: Task management, shift tracking, and notifications.

## 🛠️ Getting Started
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Access the dashboard:
   - Login: `/login` (auto-logs as Super Admin for demo)
   - Register: `/register`

## 📂 Project Structure
- `src/app`: Routing and layout system.
- `src/components`: UI primitives and shared SaaS components.
- `src/features`: Business logic (Auth, RBAC, Subscriptions).
- `src/store`: Global state management.
- `src/lib`: Mock data and utilities.
