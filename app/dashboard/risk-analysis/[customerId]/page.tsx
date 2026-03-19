'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  AlertTriangle, Clock, CreditCard, TrendingDown, UserX, Zap,
  CheckCircle, Shield, MessageSquare, Phone, ArrowLeft, BarChart2,
} from 'lucide-react';
import { MP } from '@/lib/mixpanel';

interface RiskResult {
  customerId: string;
  email: string;
  name?: string;
  churnProbability: number;
  riskFactors: string[];
  recommendedAction: string;
  summary: string;
}

function riskColor(score: number) {
  if (score >= 75) return { primary: '#f87171', glow: 'rgba(248,113,113,0.3)', label: 'High Risk', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' };
  if (score >= 50) return { primary: '#fb923c', glow: 'rgba(251,146,60,0.3)', label: 'Medium Risk', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)' };
  return { primary: '#34d399', glow: 'rgba(52,211,153,0.3)', label: 'Low Risk', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' };
}

function factorIcon(factor: string) {
  const f = factor.toLowerCase();
  if (f.includes('login') || f.includes('inactive') || f.includes('session')) return <Clock size={15} />;
  if (f.includes('payment') || f.includes('billing') || f.includes('invoice')) return <CreditCard size={15} />;
  if (f.includes('mrr') || f.includes('revenue') || f.includes('downgrad')) return <TrendingDown size={15} />;
  if (f.includes('feature') || f.includes('usage') || f.includes('abandon')) return <Zap size={15} />;
  if (f.includes('cancel') || f.includes('churn') || f.includes('trial')) return <UserX size={15} />;
  return <AlertTriangle size={15} />;
}

function CircularGauge({ score }: { score: number }) {
  const { primary } = riskColor(score);
  const radius = 70;
  const stroke = 12;
  const cx = 90, cy = 90;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Background track */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        {/* Subtle tick marks */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + (radius - 8) * Math.cos(angle);
          const y1 = cy + (radius - 8) * Math.sin(angle);
          const x2 = cx + (radius + 2) * Math.cos(angle);
          const y2 = cy + (radius + 2) * Math.sin(angle);
          return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="2" />;
        })}
        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#glow)"
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
        {/* Score */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="36" fontWeight="800" fontFamily="Inter,sans-serif">
          {score}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" fontSize="13" fontFamily="Inter,sans-serif">
          out of 100
        </text>
      </svg>
    </div>
  );
}

export default function RiskAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const customerId = params.customerId as string;

  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user && customerId) runAnalysis();
  }, [isLoaded, user, customerId]);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/risk/analyze/${customerId}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        MP.riskScoreViewed(data.customerId, data.churnProbability);
      }
      else setError(data.error ?? 'Analysis failed');
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  const colors = result ? riskColor(result.churnProbability) : riskColor(0);

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0f172a',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
        fontFamily: 'Inter,-apple-system,BlinkMacSystemFont,sans-serif',
      }}>
        {/* Animated gauge placeholder */}
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
          <circle cx="90" cy="90" r="70" fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle cx="90" cy="90" r="70" fill="none" stroke="#334155" strokeWidth="12"
            strokeDasharray="60 380" transform="rotate(-90 90 90)"
            style={{ animation: 'spin 1.5s linear infinite' }} />
        </svg>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>Running AI risk analysis...</p>
          <p style={{ color: '#475569', fontSize: '13px', margin: '6px 0 0' }}>Analyzing customer behavior with GPT-4o</p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          @keyframes pulse { 0%,100% { opacity:0.6 } 50% { opacity:1 } }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0f172a',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
        fontFamily: 'Inter,-apple-system,BlinkMacSystemFont,sans-serif',
      }}>
        <div style={{ width: '56px', height: '56px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={24} color="#ef4444" />
        </div>
        <p style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Analysis Failed</p>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>{error}</p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={runAnalysis} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>
            Retry
          </button>
          <button onClick={() => router.back()} style={{ padding: '10px 20px', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayName = result.name || result.email;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: 'Inter,-apple-system,BlinkMacSystemFont,sans-serif',
      color: '#f1f5f9',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .card { animation: fadeUp 0.4s ease both; }
        .action-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .action-btn { transition: all 0.15s ease; }
      `}</style>

      {/* Top nav bar */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', padding: '6px 10px', borderRadius: '6px' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ width: '1px', height: '20px', background: '#1e293b' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={16} color="white" />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>Risk Analysis</span>
            <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>{displayName}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={runAnalysis} style={{
            padding: '7px 14px', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155',
            borderRadius: '7px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Re-run analysis
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Hero: gauge + score summary */}
        <div className="card" style={{
          background: '#111827', border: '1px solid #1e293b', borderRadius: '16px',
          padding: '36px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '40px',
          animationDelay: '0ms',
        }}>
          <div style={{ flexShrink: 0 }}>
            <CircularGauge score={result.churnProbability} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
                background: colors.bg, color: colors.primary, border: `1px solid ${colors.border}`,
              }}>
                {colors.label}
              </span>
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '800', color: '#f1f5f9', lineHeight: '1.2' }}>
              {result.churnProbability}% churn probability
            </h1>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
              {result.summary}
            </p>
            {/* Progress bar */}
            <div style={{ background: '#1e293b', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                width: `${result.churnProbability}%`, height: '100%',
                background: `linear-gradient(90deg, ${colors.primary}80, ${colors.primary})`,
                borderRadius: '999px', transition: 'width 1s ease',
                boxShadow: `0 0 8px ${colors.glow}`,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#475569' }}>0% safe</span>
              <span style={{ fontSize: '11px', color: '#475569' }}>100% certain churn</span>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        {result.riskFactors.length > 0 && (
          <div className="card" style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', marginBottom: '20px', animationDelay: '80ms' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Risk Factors
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {result.riskFactors.map((factor, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '14px 16px', background: '#0f172a', border: `1px solid ${colors.border}`,
                  borderRadius: '10px', animationDelay: `${120 + i * 40}ms`,
                }}>
                  <span style={{ color: colors.primary, flexShrink: 0, marginTop: '1px' }}>
                    {factorIcon(factor)}
                  </span>
                  <span style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.4' }}>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Action */}
        <div className="card" style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', marginBottom: '24px', animationDelay: '160ms' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recommended Action
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px' }}>
            <CheckCircle size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '15px', color: '#e2e8f0', lineHeight: '1.6', fontWeight: '500' }}>
              {result.recommendedAction}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animationDelay: '220ms' }}>
          <Link
            href={`/dashboard/interventions?customerId=${customerId}`}
            className="action-btn"
            style={{
              flex: 1, minWidth: '180px', padding: '14px 20px',
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color: 'white', textDecoration: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            }}
          >
            <Shield size={16} /> Create Intervention
          </Link>

          <a
            href={`mailto:${result.email}?subject=Checking%20in%20from%20ChurnGuard`}
            className="action-btn"
            style={{
              flex: 1, minWidth: '140px', padding: '14px 20px',
              background: '#1e293b', color: '#e2e8f0', textDecoration: 'none',
              border: '1px solid #334155', borderRadius: '10px',
              fontSize: '15px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <MessageSquare size={16} /> Send Email
          </a>

          <Link
            href={`/dashboard/customers/${customerId}`}
            className="action-btn"
            style={{
              flex: 1, minWidth: '140px', padding: '14px 20px',
              background: '#1e293b', color: '#e2e8f0', textDecoration: 'none',
              border: '1px solid #334155', borderRadius: '10px',
              fontSize: '15px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <Phone size={16} /> View Customer
          </Link>
        </div>

      </div>
    </div>
  );
}
