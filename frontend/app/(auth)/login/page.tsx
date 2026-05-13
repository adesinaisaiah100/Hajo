import { AuthPanel } from "@/app/components/shared/AuthPanel";
import { LoginForm } from "@/app/components/shared/LoginForm";

export default function LoginPage() {
  return (
    <AuthPanel
      eyebrow="Login"
      title="Continue with your phone number."
      description="We send an OTP and keep the flow passwordless so providers and customers can move quickly on mobile or desktop."
    >
      <LoginForm />
    </AuthPanel>
  );
}
