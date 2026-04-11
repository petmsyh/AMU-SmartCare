import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Find Specialists',
      desc: 'Browse verified doctors and specialists across all medical departments',
      color: '#1a73e8',
    },
    {
      icon: '📋',
      title: 'Book Consultations',
      desc: 'Schedule appointments and manage your healthcare journey easily',
      color: '#34a853',
    },
    {
      icon: '🤖',
      title: 'AI Health Assistant',
      desc: 'Get instant AI-powered health guidance and symptom analysis',
      color: '#9c27b0',
    },
    {
      icon: '🎓',
      title: 'Student Resources',
      desc: 'Academic health assistant dedicated to medical students',
      color: '#f4b400',
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      desc: 'Safe and transparent payment system with escrow protection',
      color: '#ea4335',
    },
    {
      icon: '🛡️',
      title: 'Admin Control',
      desc: 'Comprehensive platform management and user oversight tools',
      color: '#0d47a1',
    },
  ];

  const stats = [
    { value: '500+', label: 'Verified Doctors' },
    { value: '10K+', label: 'Happy Patients' },
    { value: '24/7', label: 'AI Support' },
    { value: '99%', label: 'Satisfaction Rate' },
  ];

  const steps = [
    {
      num: '1',
      title: 'Create Account',
      desc: 'Register as a patient, doctor, or student in minutes',
      icon: '✍️',
    },
    {
      num: '2',
      title: 'Find Your Care',
      desc: 'Search and connect with the right healthcare professional',
      icon: '🔍',
    },
    {
      num: '3',
      title: 'Get Help',
      desc: 'Receive quality consultations and AI-assisted guidance',
      icon: '💊',
    },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: '#1a1a2e', overflowX: 'hidden' }}>
      {/* NAVIGATION */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e0e0e0',
          padding: '0 32px',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/amu-logo.svg" alt="AMU Logo" style={{ width: 44, height: 44 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0d47a1', lineHeight: 1.2 }}>AMU SmartCare</div>
            <div style={{ fontSize: 10, color: '#666', letterSpacing: 0.5 }}>Arba Minch University</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            to="/login"
            style={{
              padding: '9px 22px',
              border: '1.5px solid #1a73e8',
              borderRadius: 24,
              color: '#1a73e8',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            style={{
              padding: '9px 22px',
              background: '#1a73e8',
              borderRadius: 24,
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0d47a1 0%, #1a73e8 50%, #1565c0 100%)',
          padding: '80px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <img
            src="/amu-logo.svg"
            alt="Arba Minch University Logo"
            style={{ width: 100, height: 100, marginBottom: 28, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}
          />
          <h1
            style={{
              margin: '0 0 20px',
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.2,
              letterSpacing: -0.5,
            }}
          >
            Smart Healthcare for<br />
            <span style={{ color: '#f4b400' }}>AMU Community</span>
          </h1>
          <p
            style={{
              margin: '0 auto 36px',
              fontSize: 18,
              color: 'rgba(255,255,255,0.88)',
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            Connect with verified doctors, get AI-powered health guidance, and manage your healthcare journey — all in one platform.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                padding: '14px 36px',
                background: '#f4b400',
                color: '#0d47a1',
                textDecoration: 'none',
                borderRadius: 32,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 4px 20px rgba(244,180,0,0.4)',
              }}
            >
              Get Started Free →
            </Link>
            <Link
              to="/login"
              style={{
                padding: '14px 36px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 32,
                fontWeight: 600,
                fontSize: 16,
                border: '1.5px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '28px 20px',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: '#1a73e8', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 32px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: '#e8f0fe', color: '#1a73e8', padding: '5px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
              Platform Features
            </div>
            <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0d47a1' }}>
              Everything You Need for Better Health
            </h2>
            <p style={{ margin: '0 auto', fontSize: 16, color: '#555', maxWidth: 520, lineHeight: 1.6 }}>
              A comprehensive healthcare platform designed specifically for the Arba Minch University community
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '28px 24px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${f.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: '#e8f0fe', color: '#1a73e8', padding: '5px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
              How It Works
            </div>
            <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0d47a1' }}>
              Get Started in 3 Simple Steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {steps.map((step, idx) => (
              <div key={step.num} style={{ textAlign: 'center', position: 'relative' }}>
                {idx < steps.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 32,
                      right: -16,
                      width: 32,
                      height: 2,
                      background: '#e0e0e0',
                    }}
                  />
                )}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: 28,
                    boxShadow: '0 4px 20px rgba(26,115,232,0.35)',
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1a73e8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                  STEP {step.num}
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, color: '#0d47a1' }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: '#666', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0d47a1, #1a73e8)',
          padding: '64px 32px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: '#fff' }}>
          Ready to Transform Your Healthcare Experience?
        </h2>
        <p style={{ margin: '0 auto 32px', fontSize: 16, color: 'rgba(255,255,255,0.85)', maxWidth: 480 }}>
          Join thousands of AMU community members already benefiting from AMU SmartCare.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            style={{
              padding: '14px 36px',
              background: '#f4b400',
              color: '#0d47a1',
              textDecoration: 'none',
              borderRadius: 32,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            style={{
              padding: '14px 36px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 32,
              fontWeight: 600,
              fontSize: 16,
              border: '1.5px solid rgba(255,255,255,0.5)',
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a1628', color: '#aaa', padding: '48px 32px 24px' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            marginBottom: 40,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src="/amu-logo.svg" alt="AMU" style={{ width: 36, height: 36 }} />
              <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>AMU SmartCare</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>
              Smart healthcare platform for Arba Minch University community members.
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 14px', color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Platform</h4>
            {['Find Doctors', 'Book Consultation', 'AI Assistant', 'Student Resources'].map((item) => (
              <div key={item} style={{ marginBottom: 8 }}>
                <Link to="/login" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>{item}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 14px', color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Company</h4>
            {['About AMU', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
              <div key={item} style={{ marginBottom: 8 }}>
                <span style={{ color: '#888', fontSize: 13, cursor: 'pointer' }}>{item}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 14px', color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact</h4>
            <p style={{ margin: '0 0 8px', fontSize: 13 }}>📍 Arba Minch, Ethiopia</p>
            <p style={{ margin: '0 0 8px', fontSize: 13 }}>📧 info@amu.edu.et</p>
            <p style={{ margin: 0, fontSize: 13 }}>🌐 www.amu.edu.et</p>
          </div>
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 20,
            textAlign: 'center',
            fontSize: 12,
            color: '#666',
          }}
        >
          © {new Date().getFullYear()} AMU SmartCare · Arba Minch University · All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
