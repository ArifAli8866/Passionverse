import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Flame, ArrowRight, Sparkles, Users, MessageCircle, Heart, Zap, Globe, Shield, Star, ChevronDown, Check } from "lucide-react";

const APP_SCREENSHOT = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/app-screenshot.png";
const FEATURE_MESSAGES = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/feature-messages.png";
const FEATURE_POST = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/feature-post.png";
const FEATURE_PROFILE = "https://armkyocfyzkwaabunlsq.supabase.co/storage/v1/object/public/landing/feature-profile.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
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

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const screenshotY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const screenshotScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const features = [
    { icon: Users, title: "Find Your Tribe", desc: "Connect with thousands sharing your exact hobby.", color: "from-violet-500 to-indigo-500", light: "bg-violet-50", border: "border-violet-100", img: FEATURE_PROFILE },
    { icon: MessageCircle, title: "Real-Time Chat", desc: "Instant messaging with voice, images & files.", color: "from-pink-500 to-rose-500", light: "bg-pink-50", border: "border-pink-100", img: FEATURE_MESSAGES },
    { icon: Zap, title: "Create & Share", desc: "Post photos, videos and project showcases.", color: "from-amber-500 to-orange-500", light: "bg-amber-50", border: "border-amber-100", img: FEATURE_POST },
  ];

  const allFeatures = [
    { icon: Users, title: "Community", desc: "Find people sharing your passion.", color: "from-violet-500 to-indigo-500", bg: "bg-violet-50" },
    { icon: MessageCircle, title: "Real-Time Chat", desc: "Message with voice and files.", color: "from-pink-500 to-rose-500", bg: "bg-pink-50" },
    { icon: Zap, title: "Smart Feed", desc: "Personalized hobby content.", color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
    { icon: Globe, title: "Global Reach", desc: "Connect worldwide.", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
    { icon: Heart, title: "Share Creations", desc: "Photos, videos, projects.", color: "from-rose-500 to-pink-500", bg: "bg-rose-50" },
    { icon: Shield, title: "Privacy First", desc: "Your data is always safe.", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
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
    { name: "Sana Nazeer", handle: "@sana_n", text: "My photography finally gets the love it deserves. The community here is so amazing!", avatar: "S", hobby: "📷 Photographer", color: "from-pink-500 to-rose-500" },
    { name: "Rohan Khan", handle: "@rohan", text: "Chat is so smooth! I now collaborate with musicians from around the world daily.", avatar: "R", hobby: "🎵 Musician", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Navbar */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                <Flame className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PassionVerse</span>
            </motion.div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
              {[["Features", "#features"], ["Hobbies", "#hobbies"], ["Community", "#community"], ["About", "#about"]].map(([label, href]) => (
                <motion.a key={label} href={href} className="hover:text-gray-900 transition-colors font-medium" whileHover={{ y: -1 }}>{label}</motion.a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 font-medium">Log In</Link>
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
      <section ref={heroRef} className="relative pt-36 pb-8 sm:pt-44 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-white" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #c7d2fe 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-16 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute top-32 right-1/4 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            className="absolute top-20 right-1/3 w-48 h-48 bg-pink-200/30 rounded-full blur-2xl" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-medium text-indigo-600 mb-6 shadow-sm">
            <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>✨</motion.span>
            The Social Network for Passionate People
          </motion.div>

          {/* Heading */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-5 leading-[1.05] text-gray-900">
            Connect Through
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Your Passion
            </span>{" "}
            <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="inline-block">🔥</motion.span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            PassionVerse connects you with people who share your hobbies. Post, chat, discover communities, and grow together. 🚀
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to={isAuthenticated ? "/feed" : "/register"}>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-indigo-200 flex items-center gap-2">
                  {isAuthenticated ? "Go to Feed" : "Join for Free"}
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login">
                <button className="border-2 border-gray-200 text-gray-600 font-semibold px-8 py-4 rounded-2xl text-lg hover:border-indigo-300 hover:text-indigo-600 transition-all">
                  Sign In →
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-12">
            {["✅ Free to use", "✅ No credit card", "✅ 10K+ users"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </motion.div>

          {/* App Screenshot Mockup */}
          <motion.div style={{ y: screenshotY, scale: screenshotScale }}
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-5xl">
            {/* Browser chrome */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/50 border border-gray-200">
              {/* Browser bar */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 text-center border border-gray-200">
                  passionverse.vercel.app
                </div>
              </div>
              {/* Screenshot */}
              <img src={APP_SCREENSHOT} alt="PassionVerse App" className="w-full object-cover object-top" style={{ maxHeight: "600px" }} />
              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Floating feature cards on screenshot */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">New like</p>
                  <p className="text-sm font-semibold text-gray-900">Arif liked your post!</p>
                </div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 top-32 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">New follower</p>
                  <p className="text-sm font-semibold text-gray-900">+127 this week</p>
                </div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-4 bottom-16 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Message</p>
                  <p className="text-sm font-semibold text-gray-900">Sana: "Love this! ��"</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="community" className="py-16 border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <p className={`text-4xl sm:text-5xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Feature Screenshots */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-4">
              ⚡ Features
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Built for <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Passionate People</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">Everything you need to share, connect, and grow through your hobbies.</motion.p>
          </Section>

          {/* Big feature sections */}
          <div className="space-y-32">
            {features.map((feature, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-100px" });
              const isEven = i % 2 === 0;
              return (
                <div key={i} ref={ref} className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}>
                  <motion.div className="flex-1"
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-500 text-lg leading-relaxed mb-6">{feature.desc}</p>
                    <div className="space-y-3">
                      {["Works in real-time", "Beautiful & intuitive UI", "Available on all devices"].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-600 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    <motion.div className="mt-8" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to={isAuthenticated ? "/feed" : "/register"}>
                        <button className={`bg-gradient-to-r ${feature.color} text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg`}>
                          Try it now <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </motion.div>
                  </motion.div>

                  <motion.div className="flex-1"
                    initial={{ opacity: 0, x: isEven ? 40 : -40, scale: 0.95 }}
                    animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                    <div className={`rounded-2xl overflow-hidden border ${feature.border} shadow-2xl`}>
                      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white rounded px-2 py-0.5 text-xs text-gray-400 text-center border border-gray-200">
                          passionverse.vercel.app
                        </div>
                      </div>
                      <img src={feature.img} alt={feature.title} className="w-full object-cover" />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold mb-4 text-gray-900">
              And so much <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">more...</span>
            </motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allFeatures.map((f, i) => (
              <motion.div key={i} variants={scaleIn}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(99,102,241,0.1)" }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 cursor-default">
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-lg`}>
                  <f.icon className="w-5 h-5" />
                </motion.div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Hobbies Marquee */}
      <section id="hobbies" className="py-20 overflow-hidden border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-600 mb-4">
              🌟 Explore
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              100+ <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Hobbies</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">Whatever you love, there is a community waiting for you.</motion.p>
          </Section>
        </div>
        <div className="flex gap-3 mb-3 animate-marquee whitespace-nowrap">
          {[...hobbies, ...hobbies].map((h, i) => (
            <motion.span key={i} whileHover={{ scale: 1.1, y: -3 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold cursor-pointer flex-shrink-0 shadow-sm ${h.color}`}>
              {h.emoji} {h.name}
            </motion.span>
          ))}
        </div>
        <div className="flex gap-3 animate-marquee-reverse whitespace-nowrap">
          {[...hobbies.slice().reverse(), ...hobbies.slice().reverse()].map((h, i) => (
            <motion.span key={i} whileHover={{ scale: 1.1, y: -3 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold cursor-pointer flex-shrink-0 shadow-sm ${h.color}`}>
              {h.emoji} {h.name}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-sm font-medium text-pink-600 mb-4">
              💬 Testimonials
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Loved by <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Creators</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">Real people, real passion, real connections.</motion.p>
          </Section>
          <Section className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={scaleIn}
                whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <motion.div key={j} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + j * 0.05 }} viewport={{ once: true }}>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
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
      <section id="about" className="py-24 border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Section>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600 mb-10">
              <Sparkles className="w-3.5 h-3.5" /> Meet the Creator
            </motion.div>
            <motion.div variants={scaleIn} className="relative inline-block mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-200 mx-auto">A</div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-indigo-200" />
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Flame className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built with ❤️ by{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Arif Ali</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              A passionate full-stack developer who believes hobbies bring people together. PassionVerse was built from scratch with love — from database design to production deployment. 🚀
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              {["⚛️ React", "📘 TypeScript", "🟢 Supabase", "🎨 Tailwind CSS", "▲ Vercel", "🎬 Framer Motion"].map((tech) => (
                <motion.span key={tech} whileHover={{ scale: 1.1, y: -2 }}
                  className="rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm cursor-default">
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-16 text-center overflow-hidden shadow-2xl shadow-indigo-200">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} className="absolute w-40 h-40 rounded-full bg-white/10"
                animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
                style={{ left: `${i * 22}%`, top: `${(i % 2) * 40}%` }} />
            ))}
            <div className="relative">
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-6">🎯</motion.div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Ready to Find Your<br />Passion Community?</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">Join thousands of creators already sharing what they love on PassionVerse. It is completely free!</p>
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link to={isAuthenticated ? "/feed" : "/register"}>
                  <button className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-2xl text-lg shadow-xl inline-flex items-center gap-2">
                    {isAuthenticated ? "Go to Feed" : "Start for Free 🎉"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </motion.div>
              <p className="text-indigo-200 text-sm mt-4">No credit card required · Join 10,000+ passionate people</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PassionVerse</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">The social network for hobby enthusiasts. Connect, share, and grow through your passions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <div className="space-y-2">
                {["Features", "Hobbies", "Community", "Dashboard"].map((item) => (
                  <motion.a key={item} href="#" className="block text-sm text-gray-500 hover:text-indigo-600 transition-colors" whileHover={{ x: 3 }}>{item}</motion.a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <div className="space-y-2">
                {["About", "Privacy", "Terms", "Contact"].map((item) => (
                  <motion.a key={item} href="#" className="block text-sm text-gray-500 hover:text-indigo-600 transition-colors" whileHover={{ x: 3 }}>{item}</motion.a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">© 2024 PassionVerse. Created with ❤️ by <strong className="text-gray-600">Arif Ali</strong></p>
            <div className="flex gap-2">
              {["💻", "🎨", "📷", "🎵", "💪"].map((emoji, i) => (
                <motion.span key={i} className="text-xl" animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>{emoji}</motion.span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
