import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Flame, ArrowRight, Sparkles, Users, MessageCircle, Heart, Zap, Globe, Shield, Star, Check } from "lucide-react";

const APP_SCREENSHOT = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/app-screenshot.png";
const FEATURE_MESSAGES = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/feature-messages.png";
const FEATURE_POST = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/feature-post.png";
const FEATURE_PROFILE = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/feature-profile.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

// Connected Apps Section - center logo with connecting lines
function ConnectedApps() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const apps = [
    { name: "Instagram", color: "from-pink-500 to-rose-500", icon: "IG", angle: 0 },
    { name: "Twitter / X", color: "from-sky-500 to-blue-500", icon: "X", angle: 40 },
    { name: "YouTube", color: "from-red-500 to-rose-600", icon: "YT", angle: 80 },
    { name: "TikTok", color: "from-gray-800 to-gray-900", icon: "TT", angle: 120 },
    { name: "LinkedIn", color: "from-blue-600 to-blue-700", icon: "LI", angle: 160 },
    { name: "Discord", color: "from-indigo-500 to-violet-600", icon: "DC", angle: 200 },
    { name: "GitHub", color: "from-gray-700 to-gray-900", icon: "GH", angle: 240 },
    { name: "Spotify", color: "from-green-500 to-emerald-600", icon: "SP", angle: 280 },
    { name: "Pinterest", color: "from-red-600 to-rose-700", icon: "PT", angle: 320 },
  ];

  const radius = 180;

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ height: "480px" }}>
      {/* Grid lines background */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Rotating outer ring */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 rounded-full border border-indigo-100 border-dashed" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 rounded-full border border-purple-100 border-dashed" />

      {/* Connection lines from center to apps */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        {apps.map((app, i) => {
          const angleRad = (app.angle * Math.PI) / 180;
          const x2 = 50 + (radius * Math.cos(angleRad) / 5);
          const y2 = 50 + (radius * Math.sin(angleRad) / 4.8);
          return (
            <motion.line key={i}
              x1="50%" y1="50%"
              x2={`${x2}%`} y2={`${y2}%`}
              stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.4 } : {}}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          );
        })}
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* App icons around circle */}
      {apps.map((app, i) => {
        const angleRad = (app.angle * Math.PI) / 180;
        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);
        return (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.15, y: -4 }}
            className="absolute flex flex-col items-center gap-1 cursor-pointer"
            style={{ transform: `translate(${x}px, ${y}px)` }}>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
              {app.icon}
            </div>
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{app.name}</span>
          </motion.div>
        );
      })}

      {/* Center - PassionVerse logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-3">
        <motion.div animate={{ boxShadow: ["0 0 20px rgba(99,102,241,0.3)", "0 0 50px rgba(99,102,241,0.6)", "0 0 20px rgba(99,102,241,0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-300">
          <Flame className="w-10 h-10 text-white" />
        </motion.div>
        <div className="text-center bg-white rounded-xl px-4 py-2 shadow-lg border border-indigo-100">
          <p className="font-bold text-gray-900 text-sm">PassionVerse</p>
          <p className="text-xs text-indigo-600">Your Passion Hub</p>
        </div>
      </motion.div>

      {/* Pulse rings from center */}
      {[1, 2, 3].map((i) => (
        <motion.div key={i}
          className="absolute rounded-full border border-indigo-300"
          animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
          style={{ width: 80, height: 80 }} />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const screenshotY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const features = [
    { icon: Users, title: "Find Your Community", desc: "Connect with thousands of people sharing your exact hobby. Build real friendships around what you love.", color: "from-violet-500 to-indigo-500", border: "border-violet-100", img: FEATURE_PROFILE },
    { icon: MessageCircle, title: "Real-Time Messaging", desc: "Chat instantly with text, images, voice messages and files. Stay connected with your passion community.", color: "from-pink-500 to-rose-500", border: "border-pink-100", img: FEATURE_MESSAGES },
    { icon: Zap, title: "Create and Share", desc: "Post your creations, photos, videos and project showcases. Get the appreciation your work deserves.", color: "from-amber-500 to-orange-500", border: "border-amber-100", img: FEATURE_POST },
  ];

  const smallFeatures = [
    { icon: Globe, title: "Global Reach", desc: "Connect with passionate people from every corner of the world.", color: "from-emerald-500 to-teal-500" },
    { icon: Heart, title: "Like and Save", desc: "Appreciate great content and save posts for later inspiration.", color: "from-rose-500 to-pink-500" },
    { icon: Shield, title: "Privacy First", desc: "Full control over your profile visibility and data privacy.", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, title: "Smart Discovery", desc: "Find new hobbies and communities perfectly suited for you.", color: "from-amber-500 to-orange-500" },
    { icon: Users, title: "Follow System", desc: "Follow creators you love and build your own following.", color: "from-violet-500 to-indigo-500" },
    { icon: MessageCircle, title: "Notifications", desc: "Real-time alerts for likes, comments, follows and messages.", color: "from-indigo-500 to-purple-500" },
  ];

  const hobbies = [
    { name: "Programming", color: "bg-violet-100 text-violet-700 border-violet-200" },
    { name: "Art", color: "bg-pink-100 text-pink-700 border-pink-200" },
    { name: "Photography", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { name: "Music", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { name: "Sports", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { name: "Cooking", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { name: "Travel", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    { name: "Gaming", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { name: "Fitness", color: "bg-red-100 text-red-700 border-red-200" },
    { name: "Writing", color: "bg-teal-100 text-teal-700 border-teal-200" },
    { name: "Science", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { name: "AI & Tech", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", color: "text-violet-600" },
    { value: "50+", label: "Hobby Categories", color: "text-pink-600" },
    { value: "100K+", label: "Posts Shared", color: "text-amber-600" },
    { value: "99%", label: "Satisfaction", color: "text-emerald-600" },
  ];

  const testimonials = [
    { name: "Zeeshan Ali", handle: "@zeeshanali", text: "Finally found my coding community. PassionVerse changed how I connect with developers completely.", avatar: "Z", hobby: "Developer", color: "from-violet-500 to-indigo-500" },
    { name: "Sana Nazeer", handle: "@sana_n", text: "My photography finally gets the appreciation it deserves. The people here truly understand the art.", avatar: "S", hobby: "Photographer", color: "from-pink-500 to-rose-500" },
    { name: "Rohan Khan", handle: "@rohan", text: "The chat feature is incredible. I collaborate with musicians from around the world every single day.", avatar: "R", hobby: "Musician", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Navbar */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.02 }}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PassionVerse</span>
            </motion.div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              {[["Features", "#features"], ["Hobbies", "#hobbies"], ["Community", "#community"], ["About", "#about"]].map(([label, href]) => (
                <motion.a key={label} href={href} className="hover:text-gray-900 transition-colors" whileHover={{ y: -1 }}>{label}</motion.a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors">Log In</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={isAuthenticated ? "/feed" : "/register"}>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2">
                    {isAuthenticated ? "Go to Feed" : "Get Started"} <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-36 pb-0 sm:pt-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "radial-gradient(circle, #e0e7ff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-100/80 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-32 right-1/4 w-80 h-80 bg-purple-100/80 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-100/60 rounded-full blur-2xl" />
        </motion.div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-medium text-indigo-600 mb-7 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            The Social Network for Passionate People
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-[88px] font-bold tracking-tight mb-5 leading-[1.05] text-gray-900">
            Connect Through
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Your Passion
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            PassionVerse connects you with people who share your hobbies. Post, chat, discover communities, and grow — all in one beautiful place.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to={isAuthenticated ? "/feed" : "/register"}>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-indigo-200 flex items-center gap-2 hover:shadow-indigo-300 transition-shadow">
                  {isAuthenticated ? "Go to Feed" : "Join for Free"}
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login">
                <button className="border-2 border-gray-200 text-gray-600 font-semibold px-8 py-4 rounded-2xl text-lg hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all">
                  Sign In
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-8 text-sm text-gray-400 mb-14">
            {["Free to use", "No credit card required", "10K+ active users"].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {item}
              </span>
            ))}
          </motion.div>

          {/* App Screenshot */}
          <motion.div style={{ y: screenshotY }}
            initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100/80 border border-gray-200/80 ring-1 ring-black/5">
              <div className="bg-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 text-center border border-gray-200 max-w-xs mx-auto">
                  passionverse.vercel.app
                </div>
              </div>
              <img src={APP_SCREENSHOT} alt="PassionVerse Feed" className="w-full" style={{ maxHeight: 560, objectFit: "cover", objectPosition: "top" }} />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Floating notification cards */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-12 top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 hidden lg:flex items-center gap-3 min-w-52">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Just now</p>
                <p className="text-sm font-semibold text-gray-900">Arif liked your post</p>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-12 top-28 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 hidden lg:flex items-center gap-3 min-w-52">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">This week</p>
                <p className="text-sm font-semibold text-gray-900">+127 new followers</p>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-8 bottom-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 hidden lg:flex items-center gap-3 min-w-56">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">New message</p>
                <p className="text-sm font-semibold text-gray-900">Sana: "Love this post!"</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="community" className="py-20 border-t border-gray-100 bg-gray-50/50 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <motion.p className={`text-5xl font-bold mb-2 ${stat.color}`}
                  initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  {stat.value}
                </motion.p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Features - Big screenshot sections */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 mb-5">
              Features
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-5 text-gray-900 leading-tight">
              Built for <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Passionate People</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">Everything you need to share, connect, and grow through your hobbies.</motion.p>
          </Section>

          <div className="space-y-36">
            {features.map((feature, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-100px" });
              const isEven = i % 2 === 0;
              return (
                <div key={i} ref={ref} className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-16`}>
                  <motion.div className="flex-1 max-w-lg"
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                    <div className={`inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg p-3`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{feature.title}</h3>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8">{feature.desc}</p>
                    <div className="space-y-3 mb-8">
                      {["Works in real-time", "Beautiful and intuitive design", "Available on all devices"].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-600 text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.05, x: 4 }} whileTap={{ scale: 0.95 }}>
                      <Link to={isAuthenticated ? "/feed" : "/register"}
                        className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        Try it now <ArrowRight className="w-4 h-4 text-indigo-600" />
                      </Link>
                    </motion.div>
                  </motion.div>

                  <motion.div className="flex-1 w-full"
                    initial={{ opacity: 0, x: isEven ? 50 : -50, scale: 0.92 }}
                    animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                    <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.3 }}
                      className={`rounded-2xl overflow-hidden border ${feature.border} shadow-2xl ring-1 ring-black/5`}>
                      <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white rounded px-2 py-0.5 text-xs text-gray-400 text-center border border-gray-200 max-w-xs mx-auto">passionverse.vercel.app</div>
                      </div>
                      <img src={feature.img} alt={feature.title} className="w-full object-cover object-top" style={{ maxHeight: 400 }} />
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Small features grid */}
      <section className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold mb-4 text-gray-900">
              And so much <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">more</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">A complete platform packed with everything you need.</motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {smallFeatures.map((f, i) => (
              <motion.div key={i} variants={scaleIn}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(99,102,241,0.1)" }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 cursor-default transition-all">
                <motion.div whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.5 }}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-lg`}>
                  <f.icon className="w-5 h-5" />
                </motion.div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Connected to Everything */}
      <section className="py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-4">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 mb-5">
              Connections
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-5 text-gray-900">
              Your Passion Hub,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Connected</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">
              PassionVerse sits at the center of your social life. Share your content across all your favorite platforms and bring your whole community together in one place.
            </motion.p>
          </Section>
          <ConnectedApps />
        </div>
      </section>

      {/* Hobbies Marquee */}
      <section id="hobbies" className="py-20 border-t border-gray-100 bg-gray-50/30 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-600 mb-5">
              Explore
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              100+ <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Hobbies</span> Waiting
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">Whatever you love, there is a community waiting for you.</motion.p>
          </Section>
        </div>
        <div className="flex gap-3 mb-3 animate-marquee whitespace-nowrap">
          {[...hobbies, ...hobbies].map((h, i) => (
            <motion.span key={i} whileHover={{ scale: 1.08, y: -3 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold cursor-pointer flex-shrink-0 shadow-sm ${h.color}`}>
              {h.name}
            </motion.span>
          ))}
        </div>
        <div className="flex gap-3 animate-marquee-reverse whitespace-nowrap">
          {[...hobbies.slice().reverse(), ...hobbies.slice().reverse()].map((h, i) => (
            <motion.span key={i} whileHover={{ scale: 1.08, y: -3 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold cursor-pointer flex-shrink-0 shadow-sm ${h.color}`}>
              {h.name}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-sm font-semibold text-pink-600 mb-5">
              Testimonials
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Loved by <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Creators</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">Real people, real passions, real connections.</motion.p>
          </Section>
          <Section className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={scaleIn}
                whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <motion.div key={j} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1 + j * 0.06 }}>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold`}>{t.avatar}</div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.handle} · {t.hobby}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Creator */}
      <section id="about" className="py-28 bg-gradient-to-b from-indigo-50/50 to-white border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Section>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-600 mb-10">
              <Sparkles className="w-3.5 h-3.5" /> Meet the Creator
            </motion.div>
            <motion.div variants={scaleIn} className="relative inline-block mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-200 mx-auto">A</div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-full border-2 border-dashed border-indigo-200 opacity-60" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-full border border-purple-100 opacity-40" />
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Flame className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built with care by{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Arif Ali</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              A passionate full-stack developer who believes hobbies bring people together. PassionVerse was built from scratch — from database design to production deployment on Vercel.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              {["React", "TypeScript", "Supabase", "Tailwind CSS", "Vercel", "Framer Motion"].map((tech) => (
                <motion.span key={tech} whileHover={{ scale: 1.1, y: -2 }}
                  className="rounded-full border border-indigo-100 bg-white px-5 py-2 text-sm font-medium text-indigo-600 shadow-sm cursor-default">
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-16 text-center overflow-hidden shadow-2xl shadow-indigo-200">
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} className="absolute rounded-full bg-white/10"
                animate={{ scale: [1, 2, 1], opacity: [0.05, 0.15, 0.05], x: [0, 15, 0], y: [0, -15, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7 }}
                style={{ width: 120 + i * 30, height: 120 + i * 30, left: `${i * 18}%`, top: `${(i % 2) * 35}%` }} />
            ))}
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Ready to Find Your<br />Passion Community?
              </h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of creators already sharing what they love on PassionVerse. Completely free.
              </p>
              <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link to={isAuthenticated ? "/feed" : "/register"}>
                  <button className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-2xl text-lg shadow-xl inline-flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                    {isAuthenticated ? "Go to Feed" : "Start for Free — No Credit Card"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </motion.div>
              <p className="text-indigo-200/70 text-sm mt-4">Join 10,000+ passionate people today</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PassionVerse</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-4">
                The social network for hobby enthusiasts. Connect, share, and grow through your passions.
              </p>
              <div className="flex gap-3">
                {["In", "Tw", "Gh"].map((s, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.1, y: -2 }}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Product</h4>
              <div className="space-y-2.5">
                {["Features", "Hobbies", "Community", "Dashboard", "Messages"].map((item) => (
                  <motion.a key={item} href="#" className="block text-sm text-gray-500 hover:text-indigo-600 transition-colors" whileHover={{ x: 3 }}>{item}</motion.a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Company</h4>
              <div className="space-y-2.5">
                {["About", "Privacy Policy", "Terms of Service", "Contact", "Blog"].map((item) => (
                  <motion.a key={item} href="#" className="block text-sm text-gray-500 hover:text-indigo-600 transition-colors" whileHover={{ x: 3 }}>{item}</motion.a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              2024 PassionVerse. Created with care by{" "}
              <motion.span className="font-semibold text-gray-600 cursor-default" whileHover={{ color: "#6366f1" }}>Arif Ali</motion.span>
            </p>
            <p className="text-sm text-gray-400">Made with React, TypeScript and Supabase</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
