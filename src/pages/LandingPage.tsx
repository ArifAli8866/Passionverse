import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useEffect, useRef, useState } from "react";
import { Flame, ArrowRight, ChevronDown, Sparkles, Users, MessageCircle, Heart, Zap, Globe, Shield, Star } from "lucide-react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const features = [
    { icon: Users, title: "Find Your Tribe", desc: "Connect with thousands sharing your exact passion.", color: "from-indigo-500 to-purple-500", bg: "bg-indigo-50" },
    { icon: MessageCircle, title: "Real-Time Chat", desc: "Instant messaging with voice, images, and files.", color: "from-purple-500 to-pink-500", bg: "bg-purple-50" },
    { icon: Zap, title: "Smart Discovery", desc: "Discover hobbies and communities made for you.", color: "from-pink-500 to-rose-500", bg: "bg-pink-50" },
    { icon: Globe, title: "Global Community", desc: "Connect with passionate people worldwide.", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
    { icon: Heart, title: "Share Creations", desc: "Post photos, videos, and project showcases.", color: "from-orange-500 to-amber-500", bg: "bg-orange-50" },
    { icon: Shield, title: "Safe & Secure", desc: "Your privacy protected at every step.", color: "from-cyan-500 to-blue-500", bg: "bg-cyan-50" },
  ];

  const hobbies = ["💻 Programming", "�� Art", "📷 Photography", "🎵 Music", "⚽ Sports", "🍳 Cooking", "✈️ Travel", "🎮 Gaming", "💪 Fitness", "✍️ Writing", "🔬 Science", "🤖 AI"];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50+", label: "Hobby Categories" },
    { value: "100K+", label: "Posts Shared" },
    { value: "99%", label: "Satisfaction Rate" },
  ];

  const statsSection = useInView(0.2);
  const featuresSection = useInView(0.1);
  const hobbiesSection = useInView(0.2);
  const ctaSection = useInView(0.2);
  const creatorSection = useInView(0.2);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* Mouse glow - subtle */}
      <div className="fixed pointer-events-none z-0 w-80 h-80 rounded-full opacity-[0.06] blur-3xl transition-all duration-500"
        style={{
          background: "radial-gradient(circle, #6366f1, #8b5cf6)",
          left: mousePos.x - 160,
          top: mousePos.y - 160,
        }} />

      {/* Subtle dot grid */}
      <div className="fixed inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #c7d2fe 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100"
        style={{ background: `rgba(255,255,255,${Math.min(0.6 + scrollY / 200, 0.95)})`, backdropFilter: "blur(20px)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PassionVerse
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
              <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
              <a href="#hobbies" className="hover:text-gray-900 transition-colors">Hobbies</a>
              <a href="#community" className="hover:text-gray-900 transition-colors">Community</a>
              <a href="#creator" className="hover:text-gray-900 transition-colors">About</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-4 py-2">Log In</Link>
              <Link to={isAuthenticated ? "/feed" : "/register"}>
                <button className="relative group bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-indigo-300 hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    {isAuthenticated ? "Go to Feed" : "Get Started"} <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 sm:pt-48 sm:pb-32 z-10">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-100/80 rounded-full blur-[100px]" style={{ transform: `translateY(${scrollY * 0.1}px) translateX(-50%)` }} />
        <div className="absolute top-40 left-1/4 w-56 h-56 bg-purple-100 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.15}px)` }} />
        <div className="absolute top-60 right-1/4 w-40 h-40 bg-pink-100 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.12}px)` }} />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-8 animate-bounce-in">
            <Sparkles className="w-3.5 h-3.5" />
            The Social Network for Passionate People
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up leading-tight text-gray-900">
            Share What You{" "}
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Love Most
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="url(#underlineGradLight)" strokeWidth="3" strokeLinecap="round" fill="none" />
                <defs>
                  <linearGradient id="underlineGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            PassionVerse connects you with people who share your hobbies. Post, chat, discover, and grow — all in one beautiful place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to={isAuthenticated ? "/feed" : "/register"}>
              <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:scale-105 hover:shadow-xl hover:shadow-indigo-300 transition-all flex items-center gap-2">
                {isAuthenticated ? "Go to Feed" : "Join for Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/login">
              <button className="border border-gray-200 text-gray-600 font-semibold px-8 py-4 rounded-2xl text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                Sign In
              </button>
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 flex flex-col items-center gap-1 animate-bounce">
            <p className="text-xs text-gray-400">Scroll to explore</p>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Floating hobby pills */}
        <div className="relative mx-auto max-w-5xl px-4 mt-6 h-16 hidden lg:block">
          {[
            { label: "📷 Photography", x: "3%", delay: "0s", rotate: "-5deg" },
            { label: "🎵 Music", x: "20%", delay: "0.2s", rotate: "4deg" },
            { label: "💻 Coding", x: "38%", delay: "0.4s", rotate: "-2deg" },
            { label: "🎨 Art", x: "57%", delay: "0.6s", rotate: "5deg" },
            { label: "💪 Fitness", x: "74%", delay: "0.8s", rotate: "-4deg" },
          ].map((card, i) => (
            <div key={i} className="absolute border border-indigo-100 bg-white shadow-sm rounded-xl px-4 py-2 text-sm font-medium text-gray-600"
              style={{ left: card.x, transform: `rotate(${card.rotate})`, animation: `float 3s ease-in-out ${card.delay} infinite` }}>
              {card.label}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="community" className="py-16 z-10 relative border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div ref={statsSection.ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center"
                style={{ opacity: statsSection.inView ? 1 : 0, transform: statsSection.inView ? "translateY(0)" : "translateY(30px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
                <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 z-10 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div ref={featuresSection.ref} className="text-center mb-16"
            style={{ opacity: featuresSection.inView ? 1 : 0, transform: featuresSection.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s ease" }}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Thrive</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">A complete platform built for passionate people.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div key={i} className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 cursor-default hover:-translate-y-1"
                style={{ opacity: featuresSection.inView ? 1 : 0, transform: featuresSection.inView ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s ease ${i * 0.1}s` }}>
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies Marquee */}
      <section id="hobbies" className="py-20 z-10 relative overflow-hidden border-t border-gray-100 bg-gray-50/50">
        <div ref={hobbiesSection.ref} className="text-center mb-12 px-4"
          style={{ opacity: hobbiesSection.inView ? 1 : 0, transition: "opacity 0.7s ease" }}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Explore <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">100+ Hobbies</span>
          </h2>
          <p className="text-gray-500 text-lg">Whatever you love, there is a community waiting for you.</p>
        </div>
        <div className="flex gap-3 mb-3 animate-marquee whitespace-nowrap">
          {[...hobbies, ...hobbies].map((hobby, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-5 py-2.5 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer flex-shrink-0">
              {hobby}
            </span>
          ))}
        </div>
        <div className="flex gap-3 animate-marquee-reverse whitespace-nowrap">
          {[...hobbies.slice().reverse(), ...hobbies.slice().reverse()].map((hobby, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-5 py-2.5 text-sm font-medium text-gray-600 flex-shrink-0">
              {hobby}
            </span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 z-10 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Loved by <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Creators</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Zeeshan Ali", handle: "@zeeshanali", text: "PassionVerse changed how I connect with fellow coders. Found my coding buddy here!", avatar: "Z", hobby: "💻 Developer" },
              { name: "Sana Nazeer", handle: "@sana_n", text: "Finally a place where my photography gets the appreciation it deserves. Love the community!", avatar: "S", hobby: "📷 Photographer" },
              { name: "Rohan Khan", handle: "@rohan", text: "The messages feature is so smooth. I chat with musicians from around the world daily!", avatar: "R", hobby: "🎵 Musician" },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.handle} · {t.hobby}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section id="creator" className="py-24 z-10 relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-t border-gray-100">
        <div ref={creatorSection.ref} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
          style={{ opacity: creatorSection.inView ? 1 : 0, transform: creatorSection.inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s ease" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-600 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Meet the Creator
          </div>
          <div className="flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-200">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Built by <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Arif Ali</span></h2>
              <p className="text-gray-500 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                PassionVerse was created by <strong className="text-gray-900">Arif Ali</strong>, a passionate full-stack developer who believes that hobbies bring people together. 
                Built with love using React, TypeScript, Supabase, and a whole lot of passion. 🚀
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["React", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"].map((tech) => (
                  <span key={tech} className="rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-sm font-medium text-indigo-600 shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 z-10 relative">
        <div ref={ctaSection.ref} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-16 overflow-hidden shadow-xl shadow-indigo-100"
            style={{ opacity: ctaSection.inView ? 1 : 0, transform: ctaSection.inView ? "scale(1)" : "scale(0.95)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-200/50 blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Ready to Find Your<br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Passion Community?</span>
              </h2>
              <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">Join thousands of creators already sharing what they love on PassionVerse.</p>
              <Link to={isAuthenticated ? "/feed" : "/register"}>
                <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-10 py-4 rounded-2xl text-lg hover:scale-105 hover:shadow-xl hover:shadow-indigo-300 transition-all flex items-center gap-2 mx-auto">
                  {isAuthenticated ? "Go to Feed" : "Start for Free"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 z-10 relative bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PassionVerse</span>
            </div>
            <p className="text-sm text-gray-400">© 2024 PassionVerse. Created with ❤️ by <strong className="text-gray-600">Arif Ali</strong></p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
              <a href="#creator" className="hover:text-gray-600 transition-colors">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
