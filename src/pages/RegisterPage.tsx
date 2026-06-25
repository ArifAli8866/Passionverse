import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Flame, Mail, Lock, User, Eye, EyeOff, UserRound } from "lucide-react";
import { HOBBIES } from "@/lib/utils";
import type { User as UserType } from "@/types";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
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
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = "Only letters, numbers, and underscores";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "At least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleHobby = (hobbyId: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyId) ? prev.filter((h) => h !== hobbyId) : [...prev, hobbyId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newUser: UserType = {
        id: "currentUser",
        fullName: formData.fullName,
        username: formData.username,
        avatar: "",
        bio: "",
        location: "",
        website: "",
        hobbies: selectedHobbies,
        followers: 0,
        following: 0,
        posts: 0,
      };
      login(newUser);
      setIsLoading(false);
      navigate("/feed");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
              <Flame className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {step === 1 ? "Create Account" : "Choose Your Interests"}
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {step === 1 ? "Join the PassionVerse community" : "Select hobbies you're passionate about"}
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
          }`}>1</div>
          <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700">
            <div className={`h-full bg-indigo-600 transition-all ${step >= 2 ? "w-full" : "w-0"}`} />
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
          }`}>2</div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <Input
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
                <Input
                  id="username"
                  name="username"
                  label="Username"
                  placeholder="johndoe"
                  icon={<UserRound className="w-4 h-4" />}
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                />
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4" />}
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
                    placeholder="Create a strong password"
                    icon={<Lock className="w-4 h-4" />}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Next Step
                </Button>
              </>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {HOBBIES.map((hobby) => (
                    <button
                      key={hobby.id}
                      type="button"
                      onClick={() => toggleHobby(hobby.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedHobbies.includes(hobby.id)
                          ? "bg-indigo-50 text-indigo-700 border-2 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700"
                          : "bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {hobby.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Selected: {selectedHobbies.length} hobbies
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Back
                  </button>
                  <Button type="submit" variant="primary" size="lg" className="flex-1" isLoading={isLoading}>
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                <button className="mt-4 w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>
              </div>
              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
