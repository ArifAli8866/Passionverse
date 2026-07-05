import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import Button from "@/components/ui/button";
import { Flame, Sparkles, Users, MessageCircle, Search, Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Users,
      title: "Connect with Passion",
      description: "Find people who share your interests and build meaningful connections around your hobbies.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description: "Chat instantly with fellow enthusiasts. Discuss, collaborate, and grow together.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Search,
      title: "Discover Communities",
      description: "Explore trending hobbies, join communities, and showcase your passion projects.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your data is protected. Connect with confidence in a supportive environment.",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
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
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              {isAuthenticated ? (
                <Link to="/feed">
                  <Button variant="primary" size="sm">Go to Feed <ArrowRight className="w-4 h-4" /></Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started <ArrowRight className="w-4 h-4" /></Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6">
              <Sparkles className="w-4 h-4" />
              Where Passions Connect
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
              Connect Through{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Passion
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              PassionVerse is the social network for your hobbies. Share your creations, discover new interests,
              and connect with people who share your enthusiasm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/feed">
                  <Button variant="primary" size="lg">
                    Go to Feed <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="lg">
                      Join PassionVerse <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A complete platform to share, connect, and grow through your passions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Explore Hobbies
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From coding to cooking, find your community.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["💻 Programming", "🤖 AI", "📷 Photography", "🎵 Music", "⚽ Football", "🎨 Art", "🍳 Cooking", "💪 Fitness", "✈️ Traveling", "🎮 Gaming", "✍️ Writing", "🔬 Science", "💼 Entrepreneurship", "🏏 Cricket"].map(
              (hobby) => (
                <span
                  key={hobby}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 cursor-pointer"
                >
                  {hobby}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Share Your Passion?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators, makers, and enthusiasts who are already connecting through their hobbies.
          </p>
          {isAuthenticated ? (
            <Link to="/feed">
              <Button variant="secondary" size="lg">
                Go to Feed <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-gray-900 dark:text-gray-100">PassionVerse</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 PassionVerse. Connect Through Passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
