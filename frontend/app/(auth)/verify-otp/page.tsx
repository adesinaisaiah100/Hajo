import { AuthPanel } from "@/app/components/shared/AuthPanel";
import { VerifyOtpForm } from "@/app/components/shared/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <AuthPanel
      eyebrow="Verify OTP"
      title="Confirm your phone and continue into SkillBridge."
      description="This screen is wired for the Phase 1 auth foundation and can be connected directly to the backend OTP verification endpoint."
    >
      <VerifyOtpForm />
    </AuthPanel>
  );
}
