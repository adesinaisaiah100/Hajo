import { AuthPanel } from "@/app/components/shared/AuthPanel";
import { RegisterForm } from "@/app/components/shared/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthPanel
      eyebrow="Create your account"
      title="Choose your role and start with phone onboarding."
      description="Phase 1 keeps registration intentionally lean: select how you want to use SkillBridge, then submit basic phone-led onboarding details."
    >
      <RegisterForm />
    </AuthPanel>
  );
}
