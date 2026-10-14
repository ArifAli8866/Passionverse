import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Password reset instructions sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={
        sent
          ? "We sent recovery instructions to your email address."
          : "Enter your registered email and we'll send you a link to reset your password."
      }
      switchPrompt={{
        text: "Remember your password?",
        linkText: "Back to login",
        href: "/login",
      }}
    >
      <div className="space-y-5">
        {sent ? (
          <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Instructions Dispatched
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                If an account exists for <strong className="text-emerald-600">{email}</strong>, you will receive an email shortly with a secure password reset link.
              </p>
            </div>
            <Link to="/login" className="block pt-2">
              <Button variant="primary" size="lg" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Account Email"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4 text-gray-400" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 shadow-md shadow-violet-500/20"
              isLoading={isLoading}
            >
              <span>Send Recovery Link</span>
              <Send className="w-4 h-4" />
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
