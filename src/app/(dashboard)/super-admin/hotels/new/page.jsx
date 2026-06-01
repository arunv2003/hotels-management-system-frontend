import DashboardLayout from "@/components/shared/DashboardLayout";
import { OnboardingView } from "@/views/hotels/onboarding/OnboardingView";

export const dynamic = "force-dynamic";

export default function NewHotelOnboardingPage() {
  return (
    <DashboardLayout>
       <OnboardingView />
    </DashboardLayout>
  );
}

