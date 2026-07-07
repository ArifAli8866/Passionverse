import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight, Sparkles, Users, MessageCircle, Heart, Zap, Globe, Shield, Star, ChevronDown } from "lucide-react";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    { icon: Users, title: "Find Your Tribe", desc: "Connect with people sharing your exact passion.", color: "from-violet-500 to-indigo-500", bg: "bg-violet-50", text: "text-violet-600" },
    { icon: MessageCircle, title: "Real-Time Chat", desc: "Instant messaging with voice, images & files.", color: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-600" },
    { icon: Zap, title: "Smart Discovery", desc: "Find communities perfectly made for you.", color: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
    { icon: Globe, title: "Global Community", desc: "Connect with passionate people worldwide.", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600" },
    { icon: Heart, title: "Share Creations", desc: "Post photos, videos & project showcases.", color: "from-rose-500 to-pink-500", bg: "bg-rose-50", text: "text-rose-600" },
    { icon: Shield, title: "Safe & Secure", desc: "Your privacy protected at every step.", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-600" },
  ];

  const hobbies = [
    { emoji: "💻", name: "Programming", color: "bg-violet-100 text-violet-700 border-violet-200" },
    { emoji: "🎨", name: "Art", color: "bg-pink-100 text-pink-700 border-pink-200" },
    { emoji: "📷", name: "Photography", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { emoji: "🎵", name: "Music", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { emoji: "⚽", name: "Sports", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { emoji: "🍳", name: "Cooking", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { emoji: "✈️", name: "Travel", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    { emoji: "🎮", name: "Gaming", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { emoji: "💪", name: "Fitness", color: "bg-red-100 text-red-700 border-red-200" },
    { emoji: "✍️", name: "Writing", color: "bg-teal-100 text-teal-700 border-teal-200" },
    { emoji: "🔬", name: "Science", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { emoji: "🤖", name: "AI", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", color: "text-violet-600" },
    { value: "50+", label: "Hobby Categories", color: "text-pink-600" },
    { value: "100K+", label: "Posts Shared", color: "text-amber-600" },
    { value: "99%", label: "Satisfaction", color: "text-emerald-600" },
  ];

  const testimonials = [
    { name: "Zeeshan Ali", handle: "@zeeshanali", text: "Finally found my coding community! PassionVerse changed how I connect with developers.", avatar: "Z", hobby: "💻 Developer", color: "from-violet-500 to-indigo-500" },
    { name: "Sana Nazeer", handle: "@sana_n", text: "My photography finally gets the love it deserves. The community here is amazing!", avatar: "S", hobby: "📷 Photographer", color: "from-pink-500 to-rose-500" },
    { name: "Rohan Khan", handle: "@rohan", text: "Chat is so smooth! I collaborate with musicians from around the world now.", avatar: "R", hobby: "🎵 Musician", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PassionVerse</span>
            </motion.div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
              {["Features", "Hobbies", "Community", "About"].map((item) => (
                <motion.a key={item} href={`#${item.toLowerCase()}`} className="hover:text-gray-900 transition-colors" whileHover={{ y: -1 }}>
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-4 py-2">Log In</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={isAuthenticated ? "/feed" : "/register"}>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow flex items-center gap-2">
                    {isAuthenticated ? "Go to Feed" : "Get Started"} <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-36 pb-24 sm:pt-48 sm:pb-32 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-1/4 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-32 right-1/4 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-1/3 w-48 h-48 bg-pink-200/30 rounded-full blur-2xl" />
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-40 right-1/3 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl" />
        </motion.div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, #c7d2fe 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <motion.div style={{ opacity: heroOpacity }} className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-8">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            The Social Network for Passionate People ✨
          </motion.div>

          {/* Heading */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="text-gray-900">Share What</span>
            <br />
            <span className="text-gray-900">You </span>
            <motion.span
              className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}>
              Love Most
            </motion.span>
            <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="inline-block ml-4">
              🎯
            </motion.span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            PassionVerse connects you with people who share your hobbies. Post, chat, discover, and grow — all in one beautiful place. 🚀
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to={isAuthenticated ? "/feed" : "/register"}>
                <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2">
                  {isAuthenticated ? "Go to Feed" : "Join for Free"}
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login">
                <button className="border-2 border-gray-200 text-gray-600 font-semibold px-8 py-4 rounded-2xl text-lg hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  Sign In →
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating hobby pills */}
          <div className="relative h-20 mt-12 hidden lg:block">
            {[
              { label: "📷 Photography", x: "5%", color: "bg-amber-50 border-amber-200 text-amber-700", delay: 0 },
              { label: "🎵 Music", x: "22%", color: "bg-emerald-50 border-emerald-200 text-emerald-700", delay: 0.2 },
              { label: "💻 Coding", x: "40%", color: "bg-violet-50 border-violet-200 text-violet-700", delay: 0.4 },
              { label: "🎨 Art", x: "58%", color: "bg-pink-50 border-pink-200 text-pink-700", delay: 0.6 },
              { label: "💪 Fitness", x: "75%", color: "bg-red-50 border-red-200 text-red-700", delay: 0.8 },
            ].map((pill, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{ opacity: { delay: pill.delay + 0.8, duration: 0.5 }, y: { delay: pill.delay + 0.8, duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: i * 0.2 } }}
                className={`absolute border rounded-xl px-4 py-2 text-sm font-medium ${pill.color} shadow-sm`}
                style={{ left: pill.x }}>
                {pill.label}
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="mt-8 flex flex-col items-center gap-1">
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="community" className="py-16 border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <motion.p className={`text-4xl sm:text-5xl font-bold mb-1 ${stat.color}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}>
                  {stat.value}
                </motion.p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-600 mb-4">
              ✨ Features
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Thrive</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">A complete platform built for passionate people like you.</motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div key={i} variants={scaleIn}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(99,102,241,0.12)" }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 cursor-default transition-shadow">
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Hobbies Marquee */}
      <section id="hobbies" className="py-20 border-t border-gray-100 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-4">
              🌟 Explore
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              100+ <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Hobbies</span> Waiting
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">Whatever you love, there is a community waiting for you.</motion.p>
          </AnimatedSection>
        </div>

        {/* Row 1 */}
        <div className="flex gap-3 mb-3 animate-marquee whitespace-nowrap">
          {[...hobbies, ...hobbies].map((hobby, i) => (
            <motion.span key={i} whileHover={{ scale: 1.1, y: -2 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold cursor-pointer flex-shrink-0 ${hobby.color} shadow-sm`}>
              {hobby.emoji} {hobby.name}
            </motion.span>
          ))}
        </div>
        {/* Row 2 */}
        <div className="flex gap-3 animate-marquee-reverse whitespace-nowrap">
          {[...hobbies.slice().reverse(), ...hobbies.slice().reverse()].map((hobby, i) => (
            <motion.span key={i} whileHover={{ scale: 1.1, y: -2 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold cursor-pointer flex-shrink-0 ${hobby.color} shadow-sm`}>
              {hobby.emoji} {hobby.name}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-sm font-medium text-pink-600 mb-4">
              💬 Testimonials
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Loved by <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Creators</span>
            </motion.h2>
          </AnimatedSection>

          <AnimatedSection className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={scaleIn}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <motion.div key={j} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + j * 0.05 }} viewport={{ once: true }}>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>{t.avatar}</div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.handle} · {t.hobby}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Creator Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-600 mb-8">
              <Sparkles className="w-3.5 h-3.5" /> Meet the Creator
            </motion.div>
            <motion.div variants={scaleIn} className="flex flex-col items-center gap-6">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-200">A</div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 rounded-full border-2 border-dashed border-indigo-300 opacity-60" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Flame className="w-4 h-4 text-white" />
                </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Built with ❤️ by{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Arif Ali</span>
                </h2>
                <p className="text-gray-500 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                  A passionate full-stack developer who believes hobbies bring people together. Built PassionVerse from scratch using modern web technologies. 🚀
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["⚛️ React", "📘 TypeScript", "🟢 Supabase", "🎨 Tailwind CSS", "▲ Vercel"].map((tech) => (
                    <motion.span key={tech} whileHover={{ scale: 1.1, y: -2 }}
                      className="rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-sm font-medium text-indigo-600 shadow-sm cursor-default">
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-16 text-center overflow-hidden shadow-2xl shadow-indigo-200">
            {/* Animated background */}
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} className="absolute w-32 h-32 rounded-full bg-white/10"
                animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1], x: [0, 20, 0], y: [0, -20, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
                style={{ left: `${i * 18}%`, top: `${(i % 3) * 30}%` }} />
            ))}
            <div className="relative">
              <motion.p animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl mb-4">🎯</motion.p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Ready to Find Your<br />Passion Community?
              </h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">Join thousands of creators already sharing what they love on PassionVerse.</p>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to={isAuthenticated ? "/feed" : "/register"}>
                  <button className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto">
                    {isAuthenticated ? "Go to Feed" : "Start for Free — It's Free! 🎉"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PassionVerse</span>
            </motion.div>
            <p className="text-sm text-gray-400">© 2024 PassionVerse. Created with ❤️ by <strong className="text-gray-600">Arif Ali</strong></p>
            <div className="flex gap-6 text-sm text-gray-400">
              {["Privacy", "Terms", "About"].map((link) => (
                <motion.a key={link} href="#" className="hover:text-gray-600 transition-colors" whileHover={{ y: -1 }}>{link}</motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
