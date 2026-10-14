import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Flame, Sparkles, Star, Users, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  switchPrompt?: {
    text: string;
    linkText: string;
    href: string;
  };
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  switchPrompt,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-surface-50 dark:bg-gray-950 font-sans selection:bg-violet-500 selection:text-white">
      {/* Left Pane - SaaS Branding & Visual Showcase (Desktop) */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] relative flex-col justify-between p-12 bg-gray-950 text-white overflow-hidden border-r border-gray-800/80">
        {/* Generative ambient glow background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-violet-600/25 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 -ml-20 w-96 h-96 rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                Passionverse
              </span>
              <span className="text-[10px] tracking-widest text-violet-400 font-semibold uppercase">
                Creator Platform
              </span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <Sparkles className="w-3 h-3 text-violet-400" />
            SlothUI SaaS v2.4
          </span>
        </div>

        {/* Mid Showcase: Value Prop & Interactive Mini Cards */}
        <div className="relative z-10 my-auto py-8 space-y-8 max-w-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Over 14,000+ passion projects launched
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.18]">
              Where bold ideas turn into collaborative ventures.
            </h2>
            <p className="text-sm xl:text-base text-gray-400 leading-relaxed">
              Connect with fellow developers, designers, and creators who match your exact skills and creative intensity.
            </p>
          </div>

          {/* SlothUI-styled Floating Preview Card */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-gray-300">Live Workspace</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                In Review
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                Autonomous Audio Synthesizer & WebGL Visualizer
              </h4>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                Real-time audio processing pipeline using Web Audio API and generative shaders.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <AvatarGroup max={3} size="sm">
                <Avatar name="Sarah Jenkins" />
                <Avatar name="David Kim" />
                <Avatar name="Alex Rivera" />
                <Avatar name="Elena Rostova" />
              </AvatarGroup>
              <div className="flex items-center gap-1 text-xs text-violet-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>98% Passion Match</span>
              </div>
            </div>
          </div>

          {/* Social Proof Quote */}
          <div className="flex items-start gap-3.5 pt-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-400 italic">
              "Passionverse is the single fastest way to recruit complementary builders for ambitious side projects."
            </p>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 flex items-center justify-between text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} Passionverse Inc.</span>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/" className="hover:text-gray-300 transition-colors">Changelog</Link>
          </div>
        </div>
      </div>

      {/* Right Pane - Interactive Form */}
      <div className="w-full lg:w-[52%] xl:w-[55%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto">
        {/* Top Header / Switch Prompt */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Passionverse
            </span>
          </Link>

          {switchPrompt && (
            <div className="text-right text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {switchPrompt.text}{" "}
              <Link
                to={switchPrompt.href}
                className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:underline inline-flex items-center gap-0.5"
              >
                {switchPrompt.linkText}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Center Content / Form Area */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Mobile footer notice */}
        <div className="lg:hidden text-center text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Passionverse. Built for modern creators.
        </div>
      </div>
    </div>
  );
}
