'use client';

import { useEffect, useRef } from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  CreditCard,
  TrendingDown,
  UserX,
  Zap,
  BarChart2,
  MessageSquare,
  Phone,
  Shield,
  CheckCircle,
} from 'lucide-react';

export interface RiskAnalysisData {
  customerId: string;
  email: string;
  name?: string;
  churnProbability: number;
  riskFactors: string[];
  recommendedAction: string;
  summary: string;
}

interface Props {
  data: RiskAnalysisData;
  onClose: () => void;
  onCreateIntervention?: (customerId: string) => void;
}

// Map common risk factor keywords to icons
function factorIcon(factor: string) {
  const f = factor.toLowerCase();
  if (f.includes('login') || f.includes('inactive') || f.includes('session'))
    return <Clock size={16} />;
  if (f.includes('payment') || f.includes('billing') || f.includes('invoice'))
    return <CreditCard size={16} />;
  if (f.includes('mrr') || f.includes('revenue') || f.includes('downgrad'))
    return <TrendingDown size={16} />;
  if (f.includes('feature') || f.includes('usage') || f.includes('abandon'))
    return <Zap size={16} />;
  if (f.includes('cancel') || f.includes('churn') || f.includes('trial'))
    return <UserX size={16} />;
  return <AlertTriangle size={16} />;
}

function riskColor(score: number) {
  if (score >= 75) return { primary: '#ef4444', light: '#fef2f2', border: '#fecaca', label: 'High Risk' };
  if (score >= 50) return { primary: '#f97316', light: '#fff7ed', border: '#fed7aa', label: 'Medium Risk' };
  return { primary: '#22c55e', light: '#f0fdf4', border: '#bbf7d0', label: 'Low Risk' };
}

// SVG circular gauge
function RiskGauge({ score }: { score: number }) {
  const radius = 54;
  const stroke = 10;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * radius;
  const arc = (score / 100) * circumference;
  const { primary, label } = riskColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        {/* Score text */}
        <text
          x={cx} y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="28"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {score}
        </text>
        <text
          x={cx} y={cy + 18}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          / 100
        </text>
      </svg>
      <span style={{
        fontSize: '13px',
        fontWeight: '600',
        color: primary,
        background: riskColor(score).light,
        border: `1px solid ${riskColor(score).border}`,
        padding: '3px 10px',
        borderRadius: '20px',
      }}>
        {label}
      </span>
    </div>
  );
}

export default function RiskAnalysisModal({ data, onClose, onCreateIntervention }: Props) {
  const { churnProbability, riskFactors, recommendedAction, summary, email, name, customerId } = data;
  const { primary } = riskColor(churnProbability);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Close on backdrop click
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  const progressBarWidth = `${churnProbability}%`;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div style={{
        background: '#0f172a',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #1e293b',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 28px 20px',
          borderBottom: '1px solid #1e293b',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={18} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>
                Risk Analysis Complete
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                {name || email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#94a3b8',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#334155')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1e293b')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>
          {/* Gauge + Score row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '28px',
            background: '#111827',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #1e293b',
          }}>
            <RiskGauge score={churnProbability} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                Churn Probability
              </p>
              {/* Progress bar */}
              <div style={{
                background: '#1e293b',
                borderRadius: '999px',
                height: '10px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <div style={{
                  width: progressBarWidth,
                  height: '100%',
                  background: `linear-gradient(90deg, ${primary}99, ${primary})`,
                  borderRadius: '999px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '28px', fontWeight: '700', color: primary }}>
                {churnProbability}%
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                {summary}
              </p>
            </div>
          </div>

          {/* Risk Factors */}
          {riskFactors.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Risk Factors
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {riskFactors.map((factor, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    background: '#111827',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                  }}>
                    <span style={{
                      color: primary,
                      flexShrink: 0,
                      marginTop: '1px',
                    }}>
                      {factorIcon(factor)}
                    </span>
                    <span style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {factor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action */}
          <div style={{
            marginBottom: '24px',
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px 18px',
          }}>
            <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recommended Action
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} color="#6366f1" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', fontWeight: '500', lineHeight: '1.4' }}>
                {recommendedAction}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { onCreateIntervention?.(customerId); onClose(); }}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.35)'; }}
            >
              <Shield size={15} />
              Create Intervention
            </button>

            <a
              href={`mailto:${email}?subject=Checking%20in%20from%20ChurnGuard`}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '12px 16px',
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.borderColor = '#475569'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.borderColor = '#334155'; }}
            >
              <MessageSquare size={15} />
              Send Email
            </a>

            <button
              onClick={onClose}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '12px 16px',
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.borderColor = '#475569'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.borderColor = '#334155'; }}
            >
              <Phone size={15} />
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
