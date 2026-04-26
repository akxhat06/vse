import type { Metadata } from "next";
import { DarkAuthLayout } from "@/app/components/auth/DarkAuthLayout";
import { ForgotPasswordForm } from "@/app/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password — VSE",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <DarkAuthLayout kicker="ACCOUNT RECOVERY" title="Reset password">
      <p className="mb-8 text-sm leading-relaxed text-[#9d98b8]">
        Enter your email and we&apos;ll send you a link to get back into your
        account.
      </p>
      <ForgotPasswordForm />
    </DarkAuthLayout>
  );
}
