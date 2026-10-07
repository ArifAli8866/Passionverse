import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  ArrowRight,
  Sparkles,
  Users,
  MessageCircle,
  Zap,
  Shield,
  Star,
  Check,
  AlertTriangle,
  Workflow,
  DollarSign,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Brain,
  Code2,
  Cpu,
  Rocket,
  CalendarX,
  TrendingDown,
  Boxes,
  Clock3,
  TrendingUp,
  Target,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Music,
  Camera,
  Palette,
  Gamepad2,
  Dumbbell,
  BookOpen,
  Atom,
  Bot,
  Compass,
  Repeat,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";

// Micro-animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// Social Avatars for Trust Badge
const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
];

// Problem Cards for dual-row scrolling marquee
const PROBLEMS_ROW_1 = [
  { icon: CalendarX, title: "Isolated Learning & Building", desc: "No immediate feedback or team to share progress with" },
  { icon: TrendingDown, title: "Scattered Tools, Zero Results", desc: "Juggling 5 different chat apps with no project momentum" },
  { icon: Boxes, title: "Hard to Find Collaborators", desc: "Cold DMs go unanswered and skill sets rarely align" },
  { icon: Clock3, title: "Creative Block & Idea Paralysis", desc: "Wasting weeks debating what to build next" },
  { icon: ShieldAlert, title: "Noisy Feeds & Spam", desc: "Meaningful work gets drowned out by unrelated social noise" },
];

const PROBLEMS_ROW_2 = [
  { icon: Target, title: "Unstructured Roadmaps", desc: "Starting with passion but abandoning projects after week 2" },
  { icon: Users, title: "Skill Mismatch in Projects", desc: "Struggling to find frontend, hardware, or design counterparts" },
  { icon: Rocket, title: "Unnoticed Passion Projects", desc: "Hard to gain authentic visibility without algorithm gimmicks" },
  { icon: Brain, title: "Overwhelming Learning Curves", desc: "Navigating new fields without seasoned guidance" },
  { icon: Repeat, title: "Inconsistent Milestones", desc: "Lack of accountability leads to unfinished repositories" },
];

// Ecosystem / Integration Brands
const ECOSYSTEM_PLATFORMS = [
  { name: "GitHub", tag: "Code & Repos", icon: Code2, color: "text-gray-900 dark:text-white" },
  { name: "Discord", tag: "Live Voice & Chat", icon: MessageCircle, color: "text-indigo-500" },
  { name: "Figma", tag: "UI / UX Design", icon: Palette, color: "text-purple-500" },
  { name: "VS Code", tag: "Developer Tools", icon: Laptop, color: "text-blue-500" },
  { name: "Hugging Face", tag: "AI Models & Datasets", icon: Bot, color: "text-yellow-500" },
  { name: "YouTube", tag: "Tutorials & Demos", icon: Camera, color: "text-red-500" },
  { name: "Reddit", tag: "Communities", icon: Users, color: "text-orange-500" },
  { name: "Stack Overflow", tag: "Q&A Knowledge", icon: BookOpen, color: "text-amber-500" },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [processStep, setProcessStep] = useState(0);

  // Auto cycle tabs gently if user hasn't clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const featureTabs = [
    {
      id: "ai-match",
      title: "AI Passion Matching",
      subtitle: "Semantic synergy scoring connects you with compatible creators based on complementary skills.",
      icon: Users,
    },
    {
      id: "project-gen",
      title: "AI Project Generator",
      subtitle: "Transform raw passions and skill sets into detailed, actionable 4-week project blueprints.",
      icon: Cpu,
    },
    {
      id: "passion-guard",
      title: "PassionGuard AI",
      subtitle: "Intelligent moderation verifies every post relates to authentic crafts, hobbies, and learning.",
      icon: Shield,
    },
    {
      id: "roadmaps",
      title: "Step-by-Step Roadmaps",
      subtitle: "Break complex technical & creative ambitions into trackable milestones and task lists.",
      icon: Workflow,
    },
  ];

  const processSteps = [
    {
      num: 1,
      title: "Define Your Passions & Stack",
      desc: "Select your hobbies, technologies, skill levels, and learning goals in seconds.",
      detail: "Passionverse maps your unique creator fingerprint across 50+ categories.",
    },
    {
      num: 2,
      title: "AI Computes Semantic Synergy",
      desc: "Our local AI calculates deep compatibility scores beyond simple keyword tags.",
      detail: "Identifies partners with complementary strengths (e.g. your Python backend + their robotics).",
    },
    {
      num: 3,
      title: "Collaborate, Build & Showcase",
      desc: "Generate project blueprints, coordinate milestones, and celebrate real finished work.",
      detail: "Receive verified feedback and community recognition for every shipped project.",
    },
  ];

  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Full-Stack Engineer & AI Hobbyist",
      avatar: AVATARS[0],
      text: "The AI Passion Matching paired me with an IoT robotics builder in 48 hours. We just shipped our smart hydroponics project and couldn't be happier!",
      rating: 5,
      badge: "Verified Maker",
    },
    {
      name: "Michael Chen",
      role: "Computer Vision Researcher",
      avatar: AVATARS[1],
      text: "The Project Generator broke down an academic computer vision paper into 4 weekly milestones with YOLOv8. It eliminated weeks of procrastination.",
      rating: 5,
      badge: "AI Creator",
    },
    {
      name: "Elena Rostova",
      role: "3D Modeler & Indie Game Dev",
      avatar: AVATARS[2],
      text: "I met my music composer and level designer directly through Passionverse. Finally a platform with zero commercial clickbait, just pure craftsmanship.",
      rating: 5,
      badge: "Game Maker",
    },
    {
      name: "David Park",
      role: "Embedded Hardware Hacker",
      avatar: AVATARS[3],
      text: "PassionGuard keeps discussions remarkably high signal. When someone shares an Arduino or PCB build, the comments are genuinely insightful and supportive.",
      rating: 5,
      badge: "Hardware Pro",
    },
    {
      name: "Amina Al-Mansoor",
      role: "Digital Artist & Creative Coder",
      avatar: AVATARS[4],
      text: "The synergy score is uncannily accurate. It suggested a creative partner based on our shared love of generative shaders and music visualization.",
      rating: 5,
      badge: "Creative Coder",
    },
    {
      name: "Lucas Bennett",
      role: "Self-Taught Web Developer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      text: "Having an AI-powered roadmap completely changed my learning trajectory. I went from tutorial hell to shipping a live collaborative SaaS in 30 days.",
      rating: 5,
      badge: "Active Learner",
    },
  ];

  const faqs = [
    {
      q: "What makes Passionverse different from traditional social platforms?",
      a: "Traditional platforms optimize for endless outrage and viral memes. Passionverse is engineered exclusively for makers, learners, and hobbyists. Everything is centered around passions, project milestones, complementary skill matching, and constructive collaboration.",
    },
    {
      q: "How does the AI Passion Matching work?",
      a: "Rather than simple exact-word matching, our system uses semantic vector embeddings to understand your deeper interests, projects, and goals. It looks for complementary synergy—such as pairing someone skilled in machine learning with someone experienced in robotics hardware.",
    },
    {
      q: "Is Passionverse really 100% free to use?",
      a: "Yes! Passionverse is an open-source initiative designed to empower creators worldwide. All core AI features—including PassionGuard, Semantic Matching, and the Project Generator—are completely free with no paywalled subscriptions.",
    },
    {
      q: "What is PassionGuard AI and how does it protect the feed?",
      a: "PassionGuard evaluates new posts before publishing to ensure they connect with hobbies, skills, learning, or projects. It scores relevance against a taxonomy of 50+ passion domains, gently helping creators reframe content to maintain our inspiring, noise-free ecosystem.",
    },
    {
      q: "Can I use Passionverse for non-tech hobbies?",
      a: "Absolutely. Passionverse supports everything from photography, traditional painting, music production, cooking, gardening, writing, fitness, woodworking, to robotics, electronics, and software development.",
    },
    {
      q: "How is my personal data and privacy protected?",
      a: "We believe in privacy-by-design. We do not sell your personal data, run targeted surveillance ads, or train external commercial AI models on your private messages. RLS security rules protect your private interactions.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans selection:bg-[#1A5AF0]/20 selection:text-[#1A5AF0] overflow-x-hidden">

      {/* 1. FLOATING PILL NAVBAR */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4" role="banner">
        <div className="container mx-auto flex h-16 rounded-full max-w-6xl items-center justify-between px-6 py-2 shadow-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/60 dark:border-gray-800">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A5AF0] text-white shadow-md shadow-[#1A5AF0]/30 transition-transform group-hover:scale-105">
              <Flame className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Passion<span className="text-[#1A5AF0]">verse</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
            <a href="#problems" className="font-medium rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#1A5AF0] transition-colors">
              Problems
            </a>
            <a href="#features" className="font-medium rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#1A5AF0] transition-colors">
              Solution
            </a>
            <a href="#benefits" className="font-medium rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#1A5AF0] transition-colors">
              Benefits
            </a>
            <a href="#process" className="font-medium rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#1A5AF0] transition-colors">
              How It Works
            </a>
            <a href="#reviews" className="font-medium rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#1A5AF0] transition-colors">
              Reviews
            </a>
            <a href="#pricing" className="font-medium rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#1A5AF0] transition-colors">
              Pricing
            </a>
            <a href="#faqs" className="font-medium rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#1A5AF0] transition-colors">
              FAQs
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center font-medium rounded-full h-10 px-5 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              to={isAuthenticated ? "/feed" : "/register"}
              className="inline-flex items-center justify-center gap-2 font-medium rounded-full h-10 px-5 text-sm bg-[#1A5AF0] text-white hover:bg-[#1A5AF0]/90 shadow-md shadow-[#1A5AF0]/25 transition"
            >
              <span>{isAuthenticated ? "Open Feed" : "Get Started"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-20">
        {/* Vibrant Gradient Background with Blue Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A5AF0] via-indigo-600 to-[#1A5AF0]/90" />
        {/* Glowing blur mesh blob */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 pt-16 text-center">

          {/* Floating Avatar & Rating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/15 shadow-inner"
          >
            <div className="flex -space-x-2.5">
              {AVATARS.map((src, i) => (
                <div key={i} className="relative size-8 overflow-hidden rounded-full border-2 border-white shadow-sm">
                  <img src={src} alt={`creator-${i}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex gap-0.5 text-yellow-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-white/95 tracking-wide">
                Trusted by 10,000+ Creators
              </span>
            </div>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-5xl text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Turn Your Passions Into Projects &amp; Collaborations
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/90"
          >
            Connect with kindred makers, generate AI project blueprints, safeguard your creative feed, and build what you love across 50+ hobbies.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to={isAuthenticated ? "/feed" : "/register"}
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full h-12 px-7 text-sm bg-white text-gray-900 hover:bg-white/90 shadow-xl transition-transform hover:scale-[1.02]"
            >
              <span>{isAuthenticated ? "Launch Dashboard" : "Get Started Free"}</span>
              <ArrowRight className="w-4 h-4 text-[#1A5AF0]" />
            </Link>
            <Link
              to="/discover"
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full h-12 px-7 text-sm bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur-md transition-colors"
            >
              <span>Explore Discover Feed</span>
              <Compass className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Hero Dashboard Showcase Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="relative mt-12 w-full max-w-5xl"
          >
            <div className="rounded-3xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-xl shadow-2xl">
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 overflow-hidden shadow-2xl text-left">
                {/* Browser bar */}
                <div className="bg-gray-100 dark:bg-gray-800/80 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-gray-500 font-mono hidden sm:inline">
                      https://passionverse.app/discover
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1A5AF0]/10 text-[#1A5AF0]">
                      <Sparkles className="w-3 h-3" /> PassionMatch AI v2.0
                    </span>
                  </div>
                </div>

                {/* Dashboard Inside Mockup */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 dark:bg-gray-900/50">
                  {/* Left Column: AI Synergy Match Preview */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-white to-blue-50/40 dark:from-gray-800 dark:to-gray-800/60 p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={AVATARS[1]}
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#1A5AF0]"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 text-sm sm:text-base">
                              Marcus Vance
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1A5AF0] text-white">
                                Robotics
                              </span>
                            </h4>
                            <p className="text-xs text-gray-500">Autonomous Drones &amp; Embedded C++</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-black text-[#1A5AF0]">94%</div>
                          <span className="text-[11px] font-medium text-gray-500">Passion Match</span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3 text-xs text-gray-700 dark:text-gray-300">
                        <p className="font-medium text-[#1A5AF0] flex items-center gap-1 mb-1">
                          <Brain className="w-3.5 h-3.5" /> Complementary Synergy Detected
                        </p>
                        Both of you are passionate about autonomous navigation. Marcus brings embedded firmware experience while you have Computer Vision and PyTorch expertise.
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {["Computer Vision", "Python", "ROS2", "Robotics", "Edge AI"].map((tag, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Second post item */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> PassionGuard: 96% Approved
                        </span>
                        <span>2 hours ago</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        "Just open-sourced my Arduino-powered automated plant irrigation system with real-time moisture telemetry!"
                      </p>
                    </div>
                  </div>

                  {/* Right Column: AI Project Roadmap Blueprint */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1A5AF0]">
                          Generated Roadmap
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                          Active Project
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                        Smart Home Energy Optimizer
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">4-Week Collaborative Blueprint</p>

                      <div className="mt-4 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="line-through text-gray-400">Week 1: Sensor data pipeline &amp; MQTT</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-4 rounded-full border-2 border-[#1A5AF0] flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-[#1A5AF0]" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Week 2: Anomaly prediction model</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shrink-0" />
                          <span>Week 3: Real-time React dashboard</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shrink-0" />
                          <span>Week 4: Beta launch &amp; documentation</span>
                        </div>
                      </div>

                      <button className="w-full mt-4 py-2 rounded-xl bg-[#1A5AF0] text-white text-xs font-semibold hover:bg-[#1A5AF0]/90 transition">
                        Join Project Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trusted Communities Marquee */}
          <div className="mt-16 w-full max-w-5xl">
            <p className="text-center text-sm font-semibold text-white/90 uppercase tracking-widest mb-6">
              Empowering Creators From Leading Communities
            </p>
            <div className="relative w-full overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#1A5AF0] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#1A5AF0] to-transparent" />
              
              <div className="flex gap-8 items-center justify-center flex-wrap py-2 text-white/80 font-medium text-sm">
                {["GitHub Makers", "Figma Designers", "Product Hunt", "Discord Hackers", "Hugging Face AI", "Reddit r/buildinpublic", "Dev.to"].map((comm, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                    <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                    <span>{comm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PROBLEMS SECTION (#problems) */}
      <section id="problems" className="relative w-full overflow-hidden py-24 bg-white dark:bg-gray-950">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm px-3.5 py-1.5 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 text-[#1A5AF0]" />
            <span className="text-gray-700 dark:text-gray-300">Problems</span>
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            The problems holding makers back
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Most creators don't fail because they lack ambition. They struggle because finding the right collaborators, clear roadmaps, and authentic feedback feels scattered across disconnected tools.
          </p>

          {/* Dual Row Infinite Marquee */}
          <div className="mt-14 w-full space-y-6">

            {/* Row 1 */}
            <div className="relative overflow-hidden w-full py-2">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-28 bg-gradient-to-r from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-28 bg-gradient-to-l from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent" />

              <div className="flex w-max gap-5 animate-marquee">
                {[...PROBLEMS_ROW_1, ...PROBLEMS_ROW_1].map((prob, i) => {
                  const Icon = prob.icon;
                  return (
                    <div
                      key={i}
                      className="flex min-w-[320px] max-w-[360px] flex-col items-center justify-center rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-7 shadow-sm hover:border-[#1A5AF0]/40 transition-colors text-center"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A5AF0]/10 text-[#1A5AF0]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {prob.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                        {prob.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 2 */}
            <div className="relative overflow-hidden w-full py-2">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-28 bg-gradient-to-r from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-28 bg-gradient-to-l from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent" />

              <div className="flex w-max gap-5 animate-marquee-reverse">
                {[...PROBLEMS_ROW_2, ...PROBLEMS_ROW_2].map((prob, i) => {
                  const Icon = prob.icon;
                  return (
                    <div
                      key={i}
                      className="flex min-w-[320px] max-w-[360px] flex-col items-center justify-center rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-7 shadow-sm hover:border-[#1A5AF0]/40 transition-colors text-center"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A5AF0]/10 text-[#1A5AF0]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {prob.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                        {prob.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SOLUTION / FEATURES SECTION (#features) */}
      <section id="features" className="relative w-full overflow-hidden py-24 bg-slate-50/70 dark:bg-gray-900/40 border-y border-gray-200/60 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl px-6 text-center">

          {/* Badge */}
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-[#1A5AF0]" />
              <span className="text-gray-700 dark:text-gray-300">Solution</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Everything You Need in One Place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-400">
            Intelligent AI tools to match passions, draft step-by-step blueprints, protect community signal, and ship together.
          </p>

          {/* Interactive Feature Tab Selector */}
          <div className="mt-12 flex w-full flex-nowrap items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {featureTabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#1A5AF0] text-white shadow-lg shadow-[#1A5AF0]/25 scale-[1.02]"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#1A5AF0]/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#1A5AF0]"}`} />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Subtitle Description */}
          <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto min-h-6">
            {featureTabs[activeTab].subtitle}
          </p>

          {/* Feature Interactive Showcase Card */}
          <div className="relative mx-auto mt-8 max-w-5xl rounded-3xl bg-[#1A5AF0]/5 dark:bg-[#1A5AF0]/10 border border-[#1A5AF0]/20 p-6 sm:p-10 text-left">
            {/* Arrows */}
            <button
              onClick={() => setActiveTab((prev) => (prev === 0 ? 3 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 hover:text-[#1A5AF0] z-20 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab((prev) => (prev === 3 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 hover:text-[#1A5AF0] z-20 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div
                  key="tab-0"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-white dark:bg-gray-900 p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <img src={AVATARS[0]} alt="avatar" className="w-16 h-16 rounded-full object-cover ring-4 ring-[#1A5AF0]/20" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Alex Rivera</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1A5AF0]/10 text-[#1A5AF0]">
                            96% Synergy
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Full-Stack &amp; Applied Machine Learning</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#1A5AF0] text-white text-sm font-semibold hover:bg-[#1A5AF0]/90 transition shadow-md">
                      <span>Propose Collaboration</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/20 p-4 border border-blue-100 dark:border-blue-900/40">
                      <h4 className="text-sm font-bold text-[#1A5AF0] flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-4 h-4" /> Why You Match
                      </h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        You both share a primary interest in <strong>AI Audio Processing</strong>. Alex specializes in PyTorch spectrogram models, while you bring WebAudio and React frontend skills.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Shared &amp; Complementary Passions</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Audio DSP", "PyTorch", "TypeScript", "FastAPI", "Synthesizers", "Next.js"].map((skill, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="tab-1"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-white dark:bg-gray-900 p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1A5AF0]">
                        AI Project Blueprint
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        Edge Vision Wildlife Monitor
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">Autonomous solar camera trap with local species classification</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 self-start sm:self-auto">
                      Difficulty: Intermediate
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                      <span className="text-xs font-bold text-[#1A5AF0]">Phase 1 (Week 1)</span>
                      <h5 className="font-semibold text-sm text-gray-900 dark:text-white mt-1">Hardware &amp; Camera Loop</h5>
                      <p className="text-xs text-gray-500 mt-1">ESP32-CAM trigger circuit and battery sleep mode configuration.</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                      <span className="text-xs font-bold text-[#1A5AF0]">Phase 2 (Weeks 2-3)</span>
                      <h5 className="font-semibold text-sm text-gray-900 dark:text-white mt-1">Model Inference</h5>
                      <p className="text-xs text-gray-500 mt-1">Quantized MobileNet model recognizing local birds and mammals.</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                      <span className="text-xs font-bold text-[#1A5AF0]">Phase 3 (Week 4)</span>
                      <h5 className="font-semibold text-sm text-gray-900 dark:text-white mt-1">Dashboard &amp; Sync</h5>
                      <p className="text-xs text-gray-500 mt-1">Sync findings to community map with location and timestamps.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div
                  key="tab-2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-white dark:bg-gray-900 p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-lg"
                >
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                        <Check className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">PassionGuard Status: Approved</h3>
                        <p className="text-xs text-gray-500">Content relevance score: 95% passion synergy</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                      READY TO PUBLISH
                    </span>
                  </div>

                  <div className="mt-6 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Post Draft Verified</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                      "Finished custom PCB milling for my analog synthesizer VCO. Tested square wave and triangle wave outputs on the oscilloscope!"
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Detected Taxonomies:</span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#1A5AF0] font-medium">Audio Electronics</span>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">Hardware</span>
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">Music Tech</span>
                  </div>
                </motion.div>
              )}

              {activeTab === 3 && (
                <motion.div
                  key="tab-3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-white dark:bg-gray-900 p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-lg"
                >
                  <div className="pb-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step-by-Step Milestones</h3>
                    <p className="text-xs text-gray-500">Track progress with shared checklists, code links, and automated team reminders</p>
                  </div>

                  <div className="mt-6 space-y-3.5">
                    {[
                      { step: "Milestone 1", title: "Project Architecture & Wireframes", done: true },
                      { step: "Milestone 2", title: "Core Engine Prototype & Benchmarks", done: true },
                      { step: "Milestone 3", title: "Collaborative Realtime State Sync", done: false, active: true },
                      { step: "Milestone 4", title: "Public Beta & Community Feedback", done: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3.5 rounded-xl border ${
                          item.active
                            ? "border-[#1A5AF0] bg-blue-50/50 dark:bg-blue-950/20"
                            : "border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : item.active ? (
                            <div className="w-5 h-5 rounded-full border-2 border-[#1A5AF0] flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#1A5AF0]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600" />
                          )}
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{item.step}</span>
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h5>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                          {item.done ? "Completed" : item.active ? "In Progress" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 5. BENEFITS SECTION (#benefits) */}
      <section id="benefits" className="w-full py-24 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3.5 py-1.5 text-sm font-medium">
              <Zap className="w-4 h-4 text-[#1A5AF0]" />
              <span className="text-gray-700 dark:text-gray-300">Benefits</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Grow Faster with Less Effort
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-base">
            Passionverse eliminates the friction of networking and roadmapping so you can focus on mastering your craft and shipping ambitious projects.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="group rounded-3xl border border-gray-200/90 dark:border-gray-800 p-8 shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg hover:border-[#1A5AF0]/40 bg-white dark:bg-gray-900">
            <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#1A5AF0] text-white shadow-md shadow-[#1A5AF0]/20 group-hover:scale-105 transition-transform">
              <Clock3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Save Weeks of Searching</h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Semantic synergy instantly connects you with makers who complement your specific stack—no awkward networking or endless cold pitching.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="group rounded-3xl border border-gray-200/90 dark:border-gray-800 p-8 shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg hover:border-[#1A5AF0]/40 bg-white dark:bg-gray-900">
            <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#1A5AF0] text-white shadow-md shadow-[#1A5AF0]/20 group-hover:scale-105 transition-transform">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Stay Fully Accountable</h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Step-by-step blueprints break complex projects into weekly milestones with automatic checklist updates and team visibility.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="group rounded-3xl border border-gray-200/90 dark:border-gray-800 p-8 shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg hover:border-[#1A5AF0]/40 bg-white dark:bg-gray-900">
            <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#1A5AF0] text-white shadow-md shadow-[#1A5AF0]/20 group-hover:scale-105 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pure Inspiration, Zero Spam</h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              PassionGuard ensures every post relates to authentic creative or technical passions, keeping your community signal pristine.
            </p>
          </div>
        </div>
      </section>

      {/* 6. PROCESS SECTION (#process) */}
      <section id="process" className="relative w-full overflow-hidden py-24 bg-slate-50/70 dark:bg-gray-900/40 border-y border-gray-200/60 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-sm font-medium">
                <Workflow className="w-4 h-4 text-[#1A5AF0]" />
                <span className="text-gray-700 dark:text-gray-300">Process</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A streamlined, 3-step workflow designed to take your ideas from spark to shipped product.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-center">
            {/* Steps Column */}
            <div className="space-y-4">
              {processSteps.map((step, idx) => {
                const isActive = processStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setProcessStep(idx)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-gray-800 border-[#1A5AF0] shadow-md shadow-[#1A5AF0]/10"
                        : "bg-white/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                          isActive
                            ? "bg-[#1A5AF0] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.num}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Process Illustration Preview */}
            <div className="rounded-3xl bg-[#1A5AF0]/5 dark:bg-[#1A5AF0]/10 border border-[#1A5AF0]/20 p-8 min-h-[380px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {processStep === 0 && (
                  <motion.div
                    key="p-0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-4 text-[#1A5AF0] font-bold text-xs uppercase tracking-wider">
                      <Palette className="w-4 h-4" /> Step 1: Profile Taxonomy Setup
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">Select Your Passions &amp; Skills</h4>
                    <p className="text-xs text-gray-500 mt-1">Our AI creates a multi-dimensional interest vector.</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        { label: "Robotics", active: true },
                        { label: "Machine Learning", active: true },
                        { label: "Photography", active: false },
                        { label: "Game Dev", active: true },
                        { label: "Web3", active: false },
                        { label: "Synthesizers", active: true },
                        { label: "Writing", active: false },
                      ].map((item, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            item.active
                              ? "bg-[#1A5AF0] text-white shadow-sm"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {processStep === 1 && (
                  <motion.div
                    key="p-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-4 text-[#1A5AF0] font-bold text-xs uppercase tracking-wider">
                      <Brain className="w-4 h-4" /> Step 2: Semantic Compatibility
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Synergy Score</span>
                        <span className="text-lg font-black text-[#1A5AF0]">95% Match</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#1A5AF0] h-full rounded-full w-[95%]" />
                      </div>
                      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        Matches your skill gaps with creators eager to explore the same challenges.
                      </p>
                    </div>
                  </motion.div>
                )}

                {processStep === 2 && (
                  <motion.div
                    key="p-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-4 text-[#1A5AF0] font-bold text-xs uppercase tracking-wider">
                      <Rocket className="w-4 h-4" /> Step 3: Collaborative Workspace
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">Ship, Showcase &amp; Inspire</h4>
                    <p className="text-xs text-gray-500 mt-1">Publish live demos and receive verified community feedback.</p>

                    <div className="mt-4 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Project Shipped</p>
                          <p className="text-[11px] text-gray-500">Autonomous Weather Station v1.0</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#1A5AF0]">View Showcase</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ECOSYSTEM / INTEGRATIONS SECTION */}
      <section className="relative w-full overflow-hidden py-24 bg-white dark:bg-gray-950">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3.5 py-1.5 text-sm font-medium">
            <LayoutDashboard className="w-4 h-4 text-[#1A5AF0]" />
            <span className="text-gray-700 dark:text-gray-300">Ecosystem</span>
          </div>

          <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Seamlessly Integrated with Your Creator Stack
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Connect your portfolios, repositories, design libraries, and live feeds to share authentic progress.
          </p>

          {/* Marquee for Integrations */}
          <div className="mt-14 w-full relative overflow-hidden py-4">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent" />

            <div className="flex w-max gap-6 animate-marquee">
              {[...ECOSYSTEM_PLATFORMS, ...ECOSYSTEM_PLATFORMS].map((plat, idx) => {
                const Icon = plat.icon;
                return (
                  <div
                    key={idx}
                    className="flex min-w-[240px] items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 shadow-sm hover:border-[#1A5AF0]/40 transition"
                  >
                    <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{plat.name}</h4>
                      <p className="text-xs text-gray-500">{plat.tag}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. REVIEWS / TESTIMONIALS SECTION (#reviews) */}
      <section id="reviews" className="w-full py-24 px-6 bg-slate-50/70 dark:bg-gray-900/40 border-y border-gray-200/60 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-sm font-medium">
              <Star className="w-4 h-4 text-[#1A5AF0]" />
              <span className="text-gray-700 dark:text-gray-300">Reviews</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Loved by Creators, Trusted by Makers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-base">
            See how passionate individuals find project partners and take their crafts to the next level.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <article
              key={idx}
              className="rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={rev.avatar} alt={rev.name} className="size-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" />
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">{rev.name}</h4>
                      <p className="text-xs text-gray-500">{rev.role}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1A5AF0]/10 text-[#1A5AF0]">
                    {rev.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 text-yellow-400 pt-4 border-t border-gray-100 dark:border-gray-800">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 9. PRICING SECTION (#pricing) */}
      <section id="pricing" className="relative w-full overflow-hidden py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3.5 py-1.5 text-sm font-medium">
              <DollarSign className="w-4 h-4 text-[#1A5AF0]" />
              <span className="text-gray-700 dark:text-gray-300">Plans and Pricing</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Simple, 100% Free for Every Creator
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-400">
            Passionverse is an open social platform with zero hidden paywalls. Built for learners, makers, and dreamers.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod((prev) => (prev === "monthly" ? "yearly" : "monthly"))}
              className="relative h-7 w-13 rounded-full bg-[#1A5AF0]/20 p-1 transition cursor-pointer"
            >
              <div
                className={`size-5 rounded-full bg-[#1A5AF0] shadow-sm transition-transform ${
                  billingPeriod === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === "yearly" ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"}`}>
              Yearly
            </span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase bg-emerald-100 text-emerald-700">
              Free Forever
            </span>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mt-14 grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto text-left">
            {/* Tier 1: Starter */}
            <div className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Hobbyist</h3>
                <p className="mt-2 text-xs text-gray-500 min-h-10">
                  Ideal for casual hobbyists and students exploring new interests.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">$0</span>
                  <span className="text-xs text-gray-500">/always free</span>
                </div>

                <Link
                  to="/register"
                  className="mt-6 w-full inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Join Free
                </Link>

                <div className="my-6 border-t border-gray-100 dark:border-gray-800" />
                <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Access to 50+ passion communities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Basic AI Passion Matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited posts &amp; community comments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Direct 1-on-1 messaging</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tier 2: Creator Pro (Recommended) */}
            <div className="relative rounded-3xl border-2 border-[#1A5AF0] bg-white dark:bg-gray-900 p-8 shadow-xl ring-4 ring-[#1A5AF0]/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#1A5AF0] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                Recommended
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Creator Pro</h3>
                <p className="mt-2 text-xs text-gray-500 min-h-10">
                  Everything you need to launch serious collaborative projects and build an audience.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">$0</span>
                  <span className="text-xs text-gray-500">/open access</span>
                </div>

                <Link
                  to="/register"
                  className="mt-6 w-full inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-semibold bg-[#1A5AF0] text-white hover:bg-[#1A5AF0]/90 transition shadow-md shadow-[#1A5AF0]/25"
                >
                  Start Building
                </Link>

                <div className="my-6 border-t border-gray-100 dark:border-gray-800" />
                <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-gray-900 dark:text-white">Everything in Hobbyist, plus:</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Deep AI Semantic Synergy Analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>AI Project Generator &amp; Milestones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Priority PassionGuard pre-flight checks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Verified Maker portfolio badges</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tier 3: Open Source & Teams */}
            <div className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Community</h3>
                <p className="mt-2 text-xs text-gray-500 min-h-10">
                  For university clubs, hackathon squads, and open-source teams.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">Open</span>
                  <span className="text-xs text-gray-500">/source</span>
                </div>

                <a
                  href="https://github.com/ArifAli8866/Passionverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full h-11 px-5 text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <span>Star on GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="my-6 border-t border-gray-100 dark:border-gray-800" />
                <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Full GitHub repository access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Self-hosted local AI pipeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Collaborative team channels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Community governance participation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE FAQS SECTION (#faqs) */}
      <section id="faqs" className="relative overflow-hidden py-24 bg-slate-50/70 dark:bg-gray-900/40 border-t border-gray-200/60 dark:border-gray-800">
        <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-sm font-medium">
            <HelpCircle className="w-4 h-4 text-[#1A5AF0]" />
            <span className="text-gray-700 dark:text-gray-300">FAQs</span>
          </div>

          <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-400">
            Everything you need to know about Passionverse, AI matching, project generation, and privacy.
          </p>

          <div className="w-full mt-12 space-y-3 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white text-base cursor-pointer hover:text-[#1A5AF0] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <div
                      className={`size-8 rounded-full flex items-center justify-center transition-colors shrink-0 ml-4 ${
                        isOpen ? "bg-[#1A5AF0] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. FLOATING BOTTOM CTA CARD */}
      <section className="px-6 py-20 bg-white dark:bg-gray-950">
        <div className="relative overflow-hidden mx-auto max-w-6xl rounded-[2.5rem] bg-gradient-to-br from-[#1A5AF0] via-indigo-600 to-[#1A5AF0]/90 text-white p-10 sm:p-16 lg:p-20 shadow-2xl text-center">
          {/* Subtle glowing blur blob */}
          <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-3xl pointer-events-none" />

          {/* Floating brand icons around the card (hidden on mobile, visible on desktop) */}
          <div className="hidden lg:flex absolute left-12 top-16 size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div className="hidden lg:flex absolute left-16 bottom-16 size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div className="hidden lg:flex absolute right-12 top-16 size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="hidden lg:flex absolute right-16 bottom-16 size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Music className="w-6 h-6 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Start Building Your Next Passion Project Today
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/90 leading-relaxed">
              Join 10,000+ creators discovering compatible partners, generating AI roadmaps, and sharing their craft.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? "/feed" : "/register"}
                className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-8 text-sm font-bold bg-white text-gray-900 hover:bg-white/95 shadow-xl transition-transform hover:scale-105"
              >
                <span>{isAuthenticated ? "Go to Live Feed" : "Get Started Free"}</span>
                <ArrowRight className="w-4 h-4 text-[#1A5AF0]" />
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-8 text-sm font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <span>Explore Communities</span>
                <Compass className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Col 1: Brand Info */}
            <div className="md:col-span-5 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#1A5AF0] text-white">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Passion<span className="text-[#1A5AF0]">verse</span>
                </span>
              </Link>
              <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                The open-source AI social network for makers, learners, and hobbyists to discover collaborators and ship ideas.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-gray-400">
                <span>Free &amp; Open Source</span>
                <span>•</span>
                <span>Built for Creators</span>
              </div>
            </div>

            {/* Col 2: Navigation Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs mb-4">
                  Product
                </h4>
                <ul className="space-y-2.5 text-gray-600 dark:text-gray-400">
                  <li><Link to="/discover" className="hover:text-[#1A5AF0] transition">Discover</Link></li>
                  <li><Link to="/feed" className="hover:text-[#1A5AF0] transition">Live Feed</Link></li>
                  <li><a href="#features" className="hover:text-[#1A5AF0] transition">AI Synergy Match</a></li>
                  <li><a href="#features" className="hover:text-[#1A5AF0] transition">Project Generator</a></li>
                  <li><a href="#features" className="hover:text-[#1A5AF0] transition">PassionGuard AI</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs mb-4">
                  Community
                </h4>
                <ul className="space-y-2.5 text-gray-600 dark:text-gray-400">
                  <li><a href="https://github.com/ArifAli8866/Passionverse" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A5AF0] transition">GitHub Repo</a></li>
                  <li><a href="#reviews" className="hover:text-[#1A5AF0] transition">Creator Stories</a></li>
                  <li><a href="#process" className="hover:text-[#1A5AF0] transition">Project Blueprints</a></li>
                  <li><Link to="/login" className="hover:text-[#1A5AF0] transition">Sign In</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs mb-4">
                  Legal &amp; Trust
                </h4>
                <ul className="space-y-2.5 text-gray-600 dark:text-gray-400">
                  <li><a href="#faqs" className="hover:text-[#1A5AF0] transition">Privacy Policy</a></li>
                  <li><a href="#faqs" className="hover:text-[#1A5AF0] transition">Community Guidelines</a></li>
                  <li><a href="#faqs" className="hover:text-[#1A5AF0] transition">Open Source License</a></li>
                  <li><a href="#faqs" className="hover:text-[#1A5AF0] transition">Security &amp; RLS</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} Passionverse. All rights reserved.</p>
            <p>Designed with speed, passion &amp; open source spirit.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
