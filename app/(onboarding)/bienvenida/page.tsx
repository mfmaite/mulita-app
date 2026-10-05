import type { Metadata } from "next";
import { LeaveOnboarding } from "@/components/onboarding/leave-onboarding";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { PageHeader } from "@/components/shell/page-header";
import { getOnboardingData } from "@/lib/onboarding/queries";

export const metadata: Metadata = { title: "Armemos tu presupuesto" };

export default async function WelcomePage() {
  const data = await getOnboardingData();

  return (
    <>
      <PageHeader
        title={data.onboarded ? "Armemos tu presupuesto" : "¡Arrancamos!"}
        description="Tres preguntas y quedás con las cuentas claras, y tá."
      >
        <LeaveOnboarding onboarded={data.onboarded} />
      </PageHeader>
      <OnboardingWizard data={data} />
    </>
  );
}
