import Link from "next/link";
import { Shield, Zap, Users, CreditCard, CheckCircle, ArrowRight, BarChart3, Play } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold">ChurnGuard</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
              <a href="/pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
              <Link 
                href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1 mb-6">
            <span className="text-indigo-400 text-sm font-medium">3 Playbooks. Zero Setup. Saved Revenue.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Automated Retention<br />That Actually Runs
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Stop staring at churn dashboards. Start running pre-built playbooks that rescue at-risk customers automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 transition transform hover:scale-105"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#playbooks"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              See the Playbooks
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">3 Playbooks. Zero Configuration.</h2>
            <p className="text-slate-400 text-lg">Toggle on the workflows that fit your business.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Onboarding Rescue</h3>
              <p className="text-slate-400 text-sm">Catch users before they churn in the first week.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Silent Quitter</h3>
              <p className="text-slate-400 text-sm">Re-engage power users before they disappear.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Savior</h3>
              <p className="text-slate-400 text-sm">Recover failed payments before they become churn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Stop Churn?</h2>
          <p className="text-xl text-slate-400 mb-8">Join thousands of SaaS companies saving revenue automatically.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition transform hover:scale-105"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
