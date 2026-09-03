"use client";
import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";

export function useSubscription() {
    const { user } = useAuthStore();

    const subscription = useMemo(() => {
        const userSub = user?.subscription;
        const defaultEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

        if (userSub) {
            const endDate = userSub.endDate || defaultEndDate;
            const now = new Date();
            const daysRemaining = userSub.daysRemaining !== undefined
                ? userSub.daysRemaining
                : Math.max(0, Math.ceil((new Date(endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

            const isExpired = userSub.isExpired !== undefined
                ? userSub.isExpired
                : (now > new Date(endDate) || userSub.status === "Expired");

            return {
                planName: userSub.planName || "Growth Plan",
                planId: userSub.planId || null,
                subscriptionType: userSub.subscriptionType || "Yearly",
                startDate: userSub.startDate || user?.createdAt,
                endDate: endDate,
                daysRemaining: daysRemaining,
                isExpired: isExpired,
                isExpiringSoon: daysRemaining <= 7 && !isExpired,
                status: isExpired ? "Expired" : (userSub.status || "Active"),
                amount: userSub.amount || 0,
                features: userSub.features || ["bookingManagement", "billing", "reports", "restaurantPOS", "housekeeping", "payroll", "attendance", "inventory"],
                limits: {
                    rooms: user?.totalRooms || 50,
                    employees: 30,
                    bookings: 500,
                },
            };
        }

        // Fallback default for active hotel owner/admin
        return {
            planName: "Growth Plan",
            planId: null,
            subscriptionType: "Yearly",
            startDate: user?.createdAt || new Date().toISOString(),
            endDate: defaultEndDate,
            daysRemaining: 365,
            isExpired: false,
            isExpiringSoon: false,
            status: "Active",
            amount: 4999,
            features: ["bookingManagement", "billing", "reports", "restaurantPOS", "housekeeping", "payroll", "attendance", "inventory"],
            limits: {
                rooms: user?.totalRooms || 50,
                employees: 30,
                bookings: 500,
            },
        };
    }, [user]);

    const hasFeature = (feature) => {
        if (!subscription.features) return true;
        if (Array.isArray(subscription.features)) {
            return subscription.features.includes(feature) || subscription.features.includes("ALL");
        }
        return !!subscription.features[feature];
    };

    const isLimitReached = (type, currentCount) => {
        if (!subscription.limits || !subscription.limits[type]) return false;
        return currentCount >= subscription.limits[type];
    };

    return { subscription, hasFeature, isLimitReached };
}

