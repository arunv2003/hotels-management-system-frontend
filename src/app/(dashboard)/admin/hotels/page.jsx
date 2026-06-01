import DashboardLayout from "@/components/shared/DashboardLayout";
import { OnboardingTable } from "@/views/hotels/onboarding/OnboardingTable";
export default function HotelsPage() {
  return (<DashboardLayout>
    <OnboardingTable />
  </DashboardLayout>);
}
