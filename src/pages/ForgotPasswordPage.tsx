import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Flame, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
              <Flame className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Reset Password</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {sent ? "Check your email for reset instructions" : "Enter your email to receive reset instructions"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {sent ? (
            <div className="text-center py-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 mb-4">
                <Mail className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If an account exists with that email, you'll receive password reset instructions shortly.
              </p>
              <Link to="/login">
                <Button variant="primary">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Reset Instructions
              </Button>
            </form>
          )}

          <div className="mt-4 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
