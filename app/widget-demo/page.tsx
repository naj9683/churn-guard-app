'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WidgetDemoPage() {
  const [riskScore, setRiskScore] = useState(75);
  const [showWidget, setShowWidget] = useState(false);
  const [widgetDismissed, setWidgetDismissed] = useState(false);

  // Auto-show widget when risk is high
  useEffect(() => {
    if (riskScore >= 70 && !widgetDismissed) {
      const timer = setTimeout(() => setShowWidget(true), 1000);
      return () => clearTimeout(timer);
    } else if (riskScore < 70) {
      setShowWidget(false);
      setWidgetDismissed(false);
    }
  }, [riskScore, widgetDismissed]);

  const getRiskLabel = (score: number) => {
    if (score >= 70) return { text: 'HIGH RISK', color: '#ef4444' };
    if (score >= 40) return { text: 'MEDIUM RISK', color: '#f59e0b' };
    return { text: 'LOW RISK', color: '#10b981' };
  };

  const risk = getRiskLabel(riskScore);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/widget-install" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Back to Install
          </Link>
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', fontWeight: '600' }}>
            Live Widget Demo
          </h1>
        </div>
        <Link 
          href="/widget-messages" 
          style={{
            padding: '0.5rem 1rem',
            background: '#6366f1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          Create Messages
        </Link>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Control Panel - Left Side */}
        <div style={{ 
          width: '320px', 
          background: 'white', 
          borderRight: '1px solid #e2e8f0',
          padding: '1.5rem',
          overflow: 'auto'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: '#1e293b' }}>
            Risk Simulator
          </h2>

          {/* Risk Score Card */}
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '2px solid ' + risk.color
          }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: risk.color,
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}>
              {riskScore}%
            </div>
            <div style={{ 
              textAlign: 'center', 
              color: risk.color,
              fontWeight: '600',
              fontSize: '0.875rem',
              letterSpacing: '0.05em'
            }}>
              {risk.text}
            </div>
          </div>

          {/* Slider */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              color: '#64748b', 
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Adjust Risk Score
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={riskScore}
              onChange={(e) => {
                setRiskScore(Number(e.target.value));
                setWidgetDismissed(false);
              }}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}>
              <span>Safe (0%)</span>
              <span>Critical (100%)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              color: '#64748b', 
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Quick Presets
            </label>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <button
                onClick={() => { setRiskScore(25); setWidgetDismissed(false); }}
                style={{
                  padding: '0.75rem',
                  background: riskScore === 25 ? '#10b981' : '#f1f5f9',
                  color: riskScore === 25 ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                🟢 Healthy Customer (25%)
              </button>
              <button
                onClick={() => { setRiskScore(55); setWidgetDismissed(false); }}
                style={{
                  padding: '0.75rem',
                  background: riskScore === 55 ? '#f59e0b' : '#f1f5f9',
                  color: riskScore === 55 ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                🟡 At Risk (55%)
              </button>
              <button
                onClick={() => { setRiskScore(85); setWidgetDismissed(false); }}
                style={{
                  padding: '0.75rem',
                  background: riskScore === 85 ? '#ef4444' : '#f1f5f9',
                  color: riskScore === 85 ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                🔴 About to Churn (85%)
              </button>
            </div>
          </div>

          {/* Manual Toggle */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => {
                if (showWidget) {
                  setShowWidget(false);
                  setWidgetDismissed(true);
                } else {
                  setShowWidget(true);
                  setWidgetDismissed(false);
                }
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: showWidget ? '#ef4444' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {showWidget ? 'Hide Widget' : 'Show Widget Manually'}
            </button>
          </div>

          {/* Info Box */}
          <div style={{ 
            background: '#eff6ff', 
            border: '1px solid #bfdbfe',
            borderRadius: '0.5rem', 
            padding: '1rem',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
              💡 How it works:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li>Widget tracks user activity</li>
              <li>Risk score calculates automatically</li>
              <li>At 70%+ risk, widget appears</li>
              <li>Customer sees retention offer</li>
            </ul>
          </div>
        </div>

        {/* Demo Website - Right Side */}
        <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
          {/* Fake Website Content */}
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            {/* Fake Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '3rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                YourSaaS.com
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '80px', height: '12px', background: '#e2e8f0', borderRadius: '6px' }}></div>
                <div style={{ width: '80px', height: '12px', background: '#e2e8f0', borderRadius: '6px' }}></div>
              </div>
            </div>

            {/* Fake Hero */}
            <div style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '1rem',
              padding: '4rem 2rem',
              color: 'white',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Welcome back!</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>Your dashboard overview</p>
            </div>

            {/* Fake Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ 
                  background: 'white', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ width: '60px', height: '12px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '0.75rem' }}></div>
                  <div style={{ width: '100px', height: '24px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>

            {/* Fake Chart Area */}
            <div style={{ 
              background: 'white', 
              borderRadius: '0.75rem', 
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              height: '300px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '1rem'
            }}>
              {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  height: `${height}%`, 
                  background: '#e2e8f0',
                  borderRadius: '4px 4px 0 0'
                }}></div>
              ))}
            </div>
          </div>

          {/* THE WIDGET */}
          {showWidget && (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '360px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              zIndex: 999999,
              animation: 'slideInUp 0.4s ease-out'
            }}>
              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowWidget(false);
                  setWidgetDismissed(true);
                }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                ×
              </button>

              {/* Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px'
              }}>
                🎁
              </div>

              {/* Content */}
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '20px', 
                fontWeight: '700',
                lineHeight: '1.3'
              }}>
                We miss you!
              </h3>

              <p style={{ 
                margin: '0 0 24px 0', 
                fontSize: '15px', 
                lineHeight: '1.6', 
                opacity: 0.95 
              }}>
                You've been inactive for 7 days. We want you back! Here's <strong>20% off</strong> your next month to help you get back on track.
              </p>

              {/* Progress Bar */}
              <div style={{
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                marginBottom: '24px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '60%',
                  height: '100%',
                  background: 'white',
                  borderRadius: '2px'
                }}></div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => alert('✅ In real app: Redirects to billing page to claim offer')}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: 'white',
                    color: '#6366f1',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '15px',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Claim Offer Now
                </button>

                <button 
                  onClick={() => {
                    setShowWidget(false);
                    setWidgetDismissed(true);
                  }}
                  style={{
                    padding: '14px 20px',
                    background: 'transparent',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Maybe Later
                </button>
              </div>

              {/* Footer */}
              <p style={{ 
                margin: '16px 0 0 0', 
                fontSize: '12px', 
                opacity: 0.7,
                textAlign: 'center'
              }}>
                ⚡ Powered by ChurnGuard
              </p>
            </div>
          )}

          <style>{`
            @keyframes slideInUp {
              from { 
                transform: translateY(100px); 
                opacity: 0; 
              }
              to { 
                transform: translateY(0); 
                opacity: 1; 
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
