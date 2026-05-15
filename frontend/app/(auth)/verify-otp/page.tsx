import { AuthPanel } from "@/app/components/shared/AuthPanel";
import { VerifyOtpForm } from "@/app/components/shared/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <AuthPanel
      eyebrow="Verify OTP"
      title="Confirm your phone and continue into Hajo."
      description="Enter the 6-digit code sent to your phone to confirm your identity and access your dashboard."
    >
      <VerifyOtpForm />
    </AuthPanel>
  );
}
