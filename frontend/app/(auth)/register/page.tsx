import { AuthPanel } from "@/app/components/shared/AuthPanel";
import { RegisterForm } from "@/app/components/shared/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthPanel
      eyebrow="Create your account"
      title="Choose your role and start with phone onboarding."
      description="Select how you want to use Hajo, then submit basic phone-led onboarding details to get started."
    >
      <RegisterForm />
    </AuthPanel>
  );
}
