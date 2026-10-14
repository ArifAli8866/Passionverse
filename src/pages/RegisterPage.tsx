import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";
import { Mail, Lock, User, Eye, EyeOff, UserRound, ArrowRight, ArrowLeft, Plus, Check } from "lucide-react";
import { HOBBIES } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [customHobby, setCustomHobby] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
      newErrors.username = "Only letters, numbers, and underscores";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "At least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleHobby = (hobbyId: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyId)
        ? prev.filter((h) => h !== hobbyId)
        : [...prev, hobbyId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        try {
          await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              full_name: formData.fullName,
              username: formData.username,
              hobbies: selectedHobbies,
            }, { onConflict: "id" });
        } catch (e) {
          console.warn("Could not upsert profile:", e);
        }

        toast.success(
          data.session
            ? "Welcome to Passionverse!"
            : "Account created! Please check your email to verify."
        );
        if (data.session) {
          navigate("/feed");
        } else {
          navigate("/login");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/feed`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google signup failed");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Create your workspace" : "Pick your passions"}
      subtitle={
        step === 1
          ? "Join thousands of builders turning hobbies into collaborative ventures."
          : "Select at least 1 or 2 areas you love so our AI can match you with projects."
      }
      switchPrompt={{
        text: "Already a member?",
        linkText: "Sign in",
        href: "/login",
      }}
    >
      <div className="space-y-5">
        {/* Step Progress Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-800"
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Account
            </span>
          </div>

          <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div
              className={`h-full bg-violet-600 transition-all duration-300 ${
                step >= 2 ? "w-full" : "w-0"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 2
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-800"
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Passions
            </span>
          </div>
        </div>

        {step === 1 && (
          <>
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/80 transition-all shadow-xs disabled:opacity-50 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>{googleLoading ? "Connecting..." : "Sign up with Google"}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              <span className="absolute bg-surface-50 dark:bg-gray-950 px-3 text-xs uppercase tracking-wider font-semibold text-gray-400">
                or continue with email
              </span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  placeholder="Elena Rostova"
                  icon={<User className="w-4 h-4 text-gray-400" />}
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
                <Input
                  id="username"
                  name="username"
                  label="Handle"
                  placeholder="elena_r"
                  icon={<UserRound className="w-4 h-4 text-gray-400" />}
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                />
              </div>

              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                icon={<Mail className="w-4 h-4 text-gray-400" />}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full gap-2 mt-2 shadow-md shadow-violet-500/20"
              >
                <span>Continue to Passions</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1.5 rounded-2xl border border-gray-100 bg-white/60 dark:bg-gray-900/40 dark:border-gray-800">
                {HOBBIES.map((hobby) => {
                  const isSelected = selectedHobbies.includes(hobby.id);
                  return (
                    <button
                      key={hobby.id}
                      type="button"
                      onClick={() => toggleHobby(hobby.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-violet-600 text-white shadow-sm ring-2 ring-violet-400/40"
                          : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{hobby.name}</span>
                    </button>
                  );
                })}

                {/* Custom hobbies tags */}
                {selectedHobbies
                  .filter((h) => !HOBBIES.find((hb) => hb.id === h))
                  .map((custom) => (
                    <button
                      key={custom}
                      type="button"
                      onClick={() => toggleHobby(custom)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white shadow-sm ring-2 ring-violet-400/40"
                    >
                      <Check className="w-3 h-3" />
                      <span>{custom}</span>
                    </button>
                  ))}
              </div>

              {/* Add custom hobby field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customHobby}
                  onChange={(e) => setCustomHobby(e.target.value)}
                  placeholder="Add custom passion (e.g. 3D printing)..."
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (
                        customHobby.trim() &&
                        !selectedHobbies.includes(customHobby.trim())
                      ) {
                        setSelectedHobbies((prev) => [
                          ...prev,
                          customHobby.trim(),
                        ]);
                      }
                      setCustomHobby("");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (
                      customHobby.trim() &&
                      !selectedHobbies.includes(customHobby.trim())
                    ) {
                      setSelectedHobbies((prev) => [
                        ...prev,
                        customHobby.trim(),
                      ]);
                    }
                    setCustomHobby("");
                  }}
                  className="gap-1 px-3 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Selected: <strong className="text-violet-600 dark:text-violet-400 font-semibold">{selectedHobbies.length}</strong> hobbies</span>
                <span>You can always update these later</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="gap-2 flex-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="gap-2 flex-1 shadow-md shadow-violet-500/20"
                  isLoading={isLoading}
                >
                  <span>Complete Setup</span>
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </AuthLayout>
  );
}