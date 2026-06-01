import { Suspense } from "react";
import { OnboardingView } from "@/views/hotels/onboarding/OnboardingView";
import { OnboardingProvider } from "@/context/OnboardingContext";
export default function RegisterPage() {
  return (<OnboardingProvider>
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
      <OnboardingView />
    </Suspense>
  </OnboardingProvider>);
}
