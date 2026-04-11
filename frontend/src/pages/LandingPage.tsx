import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const features = [
    { icon: '🔍', title: 'Find Specialists', desc: 'Browse verified doctors across all departments', color: 'text-primary-500', bg: 'bg-primary-50' },
    { icon: '📋', title: 'Book Consultations', desc: 'Schedule appointments and manage your journey', color: 'text-success-500', bg: 'bg-success-100' },
    { icon: '🤖', title: 'AI Health Assistant', desc: 'Get instant AI-powered guidance and analysis', color: 'text-purple-500', bg: 'bg-purple-100' },
    { icon: '🎓', title: 'Student Resources', desc: 'Academic health assistant for medical students', color: 'text-accent-400', bg: 'bg-accent-50' },
    { icon: '💳', title: 'Secure Payments', desc: 'Safe payment system with escrow protection', color: 'text-danger-500', bg: 'bg-danger-100' },
    { icon: '🛡️', title: 'Admin Control', desc: 'Comprehensive platform management tools', color: 'text-primary-900', bg: 'bg-primary-50' },
  ];

  const stats = [
    { value: '500+', label: 'Verified Doctors' },
    { value: '10K+', label: 'Happy Patients' },
    { value: '24/7', label: 'AI Support' },
    { value: '99%', label: 'Satisfaction Rate' },
  ];

  const steps = [
    { num: '1', title: 'Create Account', desc: 'Register as patient, doctor, or student in minutes', icon: '✍️' },
    { num: '2', title: 'Find Your Care', desc: 'Search and connect with the right healthcare professional', icon: '🔍' },
    { num: '3', title: 'Get Help', desc: 'Receive quality consultations and AI-assisted guidance', icon: '💊' },
  ];

  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">

      {/* ── NAVIGATION ──────────────────────────────────── */}
      <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/amu-logo.svg" alt="AMU Logo" className="w-11 h-11" />
            <div>
              <div className="font-extrabold text-lg text-primary-900 leading-tight">AMU SmartCare</div>
              <div className="text-[10px] text-gray-400 tracking-wide">Arba Minch University</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-outline hidden sm:inline-flex">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/[0.04]" />
        <div className="relative max-w-3xl mx-auto">
          <img src="/amu-logo.svg" alt="Arba Minch University Logo" className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
            Smart Healthcare for<br />
            <span className="text-accent-400">AMU Community</span>
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto mb-10 leading-relaxed">
            Connect with verified doctors, get AI-powered health guidance, and manage your healthcare journey — all in one platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn btn-lg bg-accent-400 text-primary-900 hover:bg-accent-500 font-bold shadow-[0_4px_20px_rgba(244,180,0,0.4)]">
              Get Started Free →
            </Link>
            <Link to="/login" className="btn btn-lg bg-white/15 text-white border border-white/40 hover:bg-white/25 backdrop-blur-sm">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────── */}
      <section className="bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-8 text-center ${i < stats.length - 1 ? 'border-r border-gray-100' : ''}`}>
              <div className="text-3xl font-extrabold text-primary-500 leading-none">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-tag">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900 mb-3">
              Everything You Need for Better Health
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              A comprehensive healthcare platform designed for the Arba Minch University community
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-hover p-7">
                <div className={`w-13 h-13 w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center text-2xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-tag">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
              Get Started in 3 Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-900 flex items-center justify-center mx-auto mb-5 text-3xl shadow-[0_4px_20px_rgba(26,115,232,0.35)]">
                  {step.icon}
                </div>
                <div className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-2">
                  Step {step.num}
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-500 py-20 px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Ready to Transform Your Healthcare Experience?
        </h2>
        <p className="text-white/80 text-base max-w-md mx-auto mb-10">
          Join thousands of AMU community members already benefiting from AMU SmartCare.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn btn-lg bg-accent-400 text-primary-900 hover:bg-accent-500 font-bold">
            Create Free Account
          </Link>
          <Link to="/login" className="btn btn-lg bg-white/15 text-white border border-white/50 hover:bg-white/25">
            Sign In
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="bg-[#0a1628] text-gray-400 px-6 pt-14 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/amu-logo.svg" alt="AMU" className="w-9 h-9" />
              <span className="font-bold text-base text-white">AMU SmartCare</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[200px]">
              Smart healthcare platform for the Arba Minch University community.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Platform</h4>
            {['Find Doctors', 'Book Consultation', 'AI Assistant', 'Student Resources'].map((item) => (
              <div key={item} className="mb-2">
                <Link to="/login" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{item}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Company</h4>
            {['About AMU', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
              <div key={item} className="mb-2">
                <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-300 transition-colors">{item}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Contact</h4>
            <p className="text-sm mb-2">📍 Arba Minch, Ethiopia</p>
            <p className="text-sm mb-2">📧 info@amu.edu.et</p>
            <p className="text-sm">🌐 www.amu.edu.et</p>
          </div>
        </div>
        <div className="border-t border-white/[0.07] pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} AMU SmartCare · Arba Minch University · All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
