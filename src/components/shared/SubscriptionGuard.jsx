"use client";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle, } from "@/components/ui/card";
import { Lock } from "lucide-react";
export function SubscriptionGuard({ feature, children, showUpgrade = true }) {
    const { hasFeature } = useSubscription();
    if (!hasFeature(feature)) {
        if (!showUpgrade)
            return null;
        return (<Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 text-center bg-muted/30">
        <div className="bg-primary/10 p-3 rounded-full mb-4">
          <Lock className="h-6 w-6 text-primary"/>
        </div>
        <CardTitle className="text-xl mb-2">Premium Feature</CardTitle>
        <CardDescription className="max-w-[300px] mb-6">
          The <strong>{feature.replace("_", " ")}</strong> module is available on our Pro and Enterprise plans.
        </CardDescription>
        <Button>Upgrade Plan</Button>
      </Card>);
    }
    return <>{children}</>;
}
