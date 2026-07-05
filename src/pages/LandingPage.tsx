import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import Button from "@/components/ui/button";
import {
  Flame,
  Sparkles,
  Users,
  MessageCircle,
  Search,
  Shield,
  ArrowRight,
  Star,
  Heart,
  Camera,
  Code,
  Palette,
  Music,
  Dumbbell,
  Plane,
  Gamepad2,
  BookOpen,
  Briefcase,
  Award,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================
// 1. CUSTOM HOOKS
// ============================================================

/** Intersection Observer – triggers once when element enters viewport */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

/** Typewriter effect */
function useTypewriter(
  words: string[],
  speed = 80,
  delay = 2000
): { text: string; isComplete: boolean } {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex] || "";
    const isLastWord = wordIndex === words.length - 1;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (charIndex < currentWord.length) {
          setText((prev) => prev + currentWord.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        } else {
          // Word complete
          if (isLastWord) {
            setIsComplete(true);
            return;
          }
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, speed, delay]);

  return { text, isComplete };
}

/** Animated counter */
function useCounter(target: number, duration = 2000): number {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const update = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, inView]);

  return count;
}

// ============================================================
// 2. ANIMATED COMPONENTS
// ============================================================

/** Floating particles in the hero background */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number }[]
  >([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const count = 60;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= dx * force * 0.008;
          p.y -= dy * force * 0.008;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/** Animated gradient orbs in background */
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-300/20 via-purple-300/15 to-pink-300/10 blur-3xl animate-[float_20s_ease-in-out_infinite]" />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-purple-300/20 via-indigo-300/15 to-blue-300/10 blur-3xl animate-[float_25s_ease-in-out_infinite_1s]"
        style={{ animationDirection: "reverse" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-200/10 to-purple-200/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
    </div>
  );
}

/** Feature card with 3D tilt effect */
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  const delay = index * 100;

  return (
    <div
      ref={(node) => {
        if (node) {
          ref.current = node;
          if (cardRef.current !== node) {
            cardRef.current = node;
          }
        }
      }}
      className={`transform transition-all duration-700 ease-out ${inView
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-12"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="group relative rounded-2xl border border-gray-100/80 bg-white/70 backdrop-blur-sm p-6 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-indigo-200/50 dark:border-gray-800/50 dark:bg-gray-900/70 dark:hover:border-indigo-500/30 overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />

        <div
          className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg shadow-indigo-200/50 mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="relative text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="relative text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
        <div className="relative mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
}

/** Stat counter */
function StatItem({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const count = useCounter(value);
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`text-center transform transition-all duration-700 ${inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
    >
      <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

/** Hobby tag with animation */
function HobbyTag({ children, delay }: { children: string; delay: number }) {
  const { ref, inView } = useInView();

  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-500 hover:scale-105 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 cursor-pointer backdrop-blur-sm border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 ${inView
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-4 scale-95"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}

// ============================================================
// 3. MAIN COMPONENT
// ============================================================

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { text: typewriterText, isComplete } = useTypewriter(
    ["Passion", "Creativity", "Community", "Discovery"],
    120,
    1800
  );

  const features = [
    {
      icon: Users,
      title: "Connect with Passion",
      description:
        "Find people who share your interests and build meaningful connections around your hobbies.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description:
        "Chat instantly with fellow enthusiasts. Discuss, collaborate, and grow together.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Search,
      title: "Discover Communities",
      description:
        "Explore trending hobbies, join communities, and showcase your passion projects.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "Your data is protected. Connect with confidence in a supportive environment.",
      color: "from-orange-500 to-red-600",
    },
  ];

  const stats = [
    { label: "Active Users", value: 28473 },
    { label: "Communities", value: 1247 },
    { label: "Posts Shared", value: 89241 },
    { label: "Connections Made", value: 56192 },
  ];

  const hobbies = [
    "💻 Programming",
    "🤖 AI & ML",
    "📷 Photography",
    "🎵 Music Production",
    "⚽ Football",
    "🎨 Digital Art",
    "🍳 Gourmet Cooking",
    "💪 Fitness",
    "✈️ Traveling",
    "🎮 Gaming",
    "✍️ Creative Writing",
    "🔬 Science",
    "💼 Entrepreneurship",
    "🏏 Cricket",
    "🧘 Meditation",
    "🎭 Theater",
  ];

  const { ref: heroRef, inView: heroInView } = useInView();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden selection:bg-indigo-200 dark:selection:bg-indigo-800">

      {/* ====== NAVBAR ====== */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/50 bg-white/60 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/60 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 transition-transform hover:scale-105 duration-300">
                <Flame className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-md opacity-50 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
                PassionVerse
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                >
                  Log In
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link to="/feed">
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:shadow-indigo-300/50 transition-all group"
                  >
                    Go to Feed
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:shadow-indigo-300/50 transition-all group"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden min-h-[90vh] flex items-center">
        <GradientOrbs />
        <Particles />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div
            ref={heroRef}
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${heroInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm px-5 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100/50 dark:border-indigo-800/30 animate-[fadeIn_1s_ease-out]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Where Passions Connect
            </div>

            {/* Main heading with typewriter */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 leading-[1.1]">
              Connect Through{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {typewriterText}
                  <span
                    className={`inline-block w-0.5 h-[0.8em] ml-1 bg-gradient-to-b from-indigo-600 to-purple-600 ${isComplete ? "animate-pulse" : "animate-blink"
                      }`}
                    style={{ verticalAlign: "text-bottom" }}
                  />
                </span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              PassionVerse is the social network for your hobbies.
              Share your creations, discover new interests, and connect
              with people who share your enthusiasm.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/feed">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-full px-8 shadow-xl shadow-indigo-200/60 dark:shadow-indigo-900/40 hover:shadow-indigo-300/60 transition-all group text-base"
                  >
                    Go to Feed
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-full px-8 shadow-xl shadow-indigo-200/60 dark:shadow-indigo-900/40 hover:shadow-indigo-300/60 transition-all group text-base animate-[pulse-glow_3s_ease-in-out_infinite]"
                    >
                      Join PassionVerse
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 border-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-base"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust indicator */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>28K+ users</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>1.2K+ communities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-20 bg-gradient-to-b from-gray-50/80 via-white to-white dark:from-gray-900/30 dark:via-gray-950 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 dark:bg-indigo-900/20 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Thrive
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A complete platform to share, connect, and grow through
              your passions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StatItem
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOBBIES ====== */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Explore{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hobbies
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From coding to cooking, find your community.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {hobbies.map((hobby, i) => (
              <HobbyTag key={hobby} delay={i * 50}>
                {hobby}
              </HobbyTag>
            ))}
          </div>
        </div>
      </section>

      {/* ====== COMMUNITY SHOWCASE ====== */}
      <section className="py-20 bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-900/20 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 dark:bg-indigo-900/20 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 backdrop-blur-sm">
                <Users className="w-4 h-4" />
                Community
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                Built by{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Passionate People
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Our community is growing every day. From hobbyists to
                professionals, everyone finds their place at
                PassionVerse.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Award, label: "Verified Creators" },
                  { icon: MessageCircle, label: "Active Discussions" },
                  { icon: Sparkles, label: "Daily Inspiration" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Code, label: "Programming", color: "from-blue-500 to-cyan-600" },
                  { icon: Palette, label: "Art", color: "from-pink-500 to-rose-600" },
                  { icon: Music, label: "Music", color: "from-purple-500 to-indigo-600" },
                  { icon: Dumbbell, label: "Fitness", color: "from-emerald-500 to-teal-600" },
                  { icon: Plane, label: "Travel", color: "from-amber-500 to-orange-600" },
                  { icon: Gamepad2, label: "Gaming", color: "from-violet-500 to-purple-600" },
                  { icon: BookOpen, label: "Writing", color: "from-rose-500 to-pink-600" },
                  { icon: Briefcase, label: "Business", color: "from-indigo-500 to-blue-600" },
                ].map((item, i) => {
                  const { ref, inView } = useInView();
                  return (
                    <div
                      key={item.label}
                      ref={ref}
                      className={`flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-lg shadow-indigo-200/30 dark:shadow-indigo-900/20 transition-all duration-700 ${inView
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-8 scale-95"
                        }`}
                      style={{
                        transitionDelay: `${i * 60}ms`,
                        minHeight: "100px",
                      }}
                    >
                      <item.icon className="w-8 h-8 mb-1" />
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Floating decorative element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/10 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/10">
              <Sparkles className="w-4 h-4" />
              Join the Movement
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
              Ready to Share Your{" "}
              <span className="underline decoration-pink-300/50 underline-offset-4">
                Passion
              </span>
              ?
            </h2>
            <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators, makers, and enthusiasts who
              are already connecting through their hobbies.
            </p>
            {isAuthenticated ? (
              <Link to="/feed">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full px-10 bg-white text-indigo-600 hover:bg-indigo-50 shadow-2xl shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all group text-base"
                >
                  Go to Feed
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full px-10 bg-white text-indigo-600 hover:bg-indigo-50 shadow-2xl shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all group text-base animate-[pulse-glow_3s_ease-in-out_infinite]"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                PassionVerse
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Terms
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 PassionVerse. Connect Through Passion.
            </p>
          </div>
        </div>
      </footer>

      {/* ====== GLOBAL STYLES ====== */}
      <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(30px, -20px) scale(1.05); }
                    50% { transform: translate(-20px, 30px) scale(0.95); }
                    75% { transform: translate(20px, -10px) scale(1.02); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
                }
                .animate-blink {
                    animation: blink 0.8s step-end infinite;
                }
                .animate-pulse-glow {
                    animation: pulse-glow 3s ease-in-out infinite;
                }
            `}</style>
    </div>
  );
}