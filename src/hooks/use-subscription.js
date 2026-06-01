"use client";
import { useMemo } from "react";
export function useSubscription() {
    // Mocking subscription data
    const subscription = useMemo(() => {
        return {
            plan: "Basic",
            features: ["pos", "inventory"],
            limits: {
                rooms: 20,
                employees: 10,
                bookings: 100,
            },
            status: "active",
        };
    }, []);
    const hasFeature = (feature) => {
        return subscription.features.includes(feature);
    };
    const isLimitReached = (type, currentCount) => {
        return currentCount >= subscription.limits[type];
    };
    return { subscription, hasFeature, isLimitReached };
}
