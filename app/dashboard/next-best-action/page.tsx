'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NextBestActionPage() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [intervening, setIntervening] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user]);

  async function fetchRecommendations() {
    try {
      const res = await fetch('/api/ai-recommendations');
      if (res.ok) {
        const data = await res.json();
        setRecommendations(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function executeIntervention(rec: any) {
    setIntervening(rec.customer.id);
    try {
      const res = await fetch('/api/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: rec.customer.id,
          interventionType: rec.recommendation.action,
          mrrAtRisk: rec.customer.mrr,
          customerSegment: rec.customer.plan,
          riskScoreAtStart: rec.customer.riskScore,
          daysSinceLogin: rec.customer.daysSinceLogin,
          plan: rec.customer.plan
        })
      });

      if (res.ok) {
        alert(`Intervention "${rec.recommendation.action}" started for ${rec.customer.name}`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIntervening(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        Loading AI Recommendations...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: 'white', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖 Next Best Action</h1>
          <p style={{ color: '#94a3b8' }}>
            AI-recommended interventions based on patterns from your successful saves
          </p>
        </div>
        <button 
          onClick={fetchRecommendations}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Refresh Recommendations
        </button>
      </div>

      {!rec.recommendation.isPatternBased && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '2rem',
          color: '#f59e0b',
          fontSize: '0.875rem'
        }}>
          💡 <strong>Learning mode:</strong> {rec.recommendation.note}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {recommendations.length > 0 ? recommendations.map((rec) => (
          <RecommendationCard 
            key={rec.customer.id} 
            rec={rec} 
            onExecute={() => executeIntervention(rec)}
            isLoading={intervening === rec.customer.id}
          />
        )) : (
          <div style={{ 
            background: '#1e293b', 
            borderRadius: '1rem', 
            padding: '3rem',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            No high-risk customers found. Great job! 🎉
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ rec, onExecute, isLoading }: { rec: any, onExecute: () => void, isLoading: boolean }) {
  const actionLabels: Record<string, string> = {
    'ceo_call': 'Executive Intervention',
    'discount_offer': 'Retention Discount',
    'training_session': 'Training & Onboarding',
    'check_in_call': 'Proactive Check-in',
    'personal_outreach': 'Personal Outreach',
    'webinar_invite': 'Exclusive Webinar Invite',
    'feature_demo': 'Personalized Demo'
  };

  const actionColors: Record<string, string> = {
    'ceo_call': '#ef4444',
    'discount_offer': '#f59e0b',
    'training_session': '#10b981',
    'check_in_call': '#6366f1',
    'personal_outreach': '#8b5cf6',
    'webinar_invite': '#ec4899',
    'feature_demo': '#06b6d4'
  };

  const confidenceColor = rec.recommendation.confidence >= 80 ? '#10b981' : 
                         rec.recommendation.confidence >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ 
      background: '#1e293b', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      border: `2px solid ${actionColors[rec.recommendation.action] || '#6366f1'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{rec.customer.name}</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{rec.customer.email}</p>
        </div>
        <div style={{ 
          background: confidenceColor + '20',
          color: confidenceColor,
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {rec.recommendation.confidence}% Confidence
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <Stat label="MRR" value={`$${rec.customer.mrr}`} />
        <Stat label="Risk Score" value={`${rec.customer.riskScore}%`} color={rec.customer.riskScore > 80 ? '#ef4444' : '#f59e0b'} />
        <Stat label="Plan" value={rec.customer.plan || 'Unknown'} />
        <Stat label="Days Since Login" value={rec.customer.daysSinceLogin} />
      </div>

      <div style={{ 
        background: '#0f172a',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: actionColors[rec.recommendation.action] || '#6366f1'
          }} />
          <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
            Recommended: {actionLabels[rec.recommendation.action] || rec.recommendation.action.replace(/_/g, ' ')}
          </span>
        </div>
        
        <p style={{ margin: '0 0 1rem 0', color: '#94a3b8', lineHeight: '1.6' }}>
          {rec.recommendation.reasoning}
        </p>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: '#64748b' }}>Est. MRR Saved: </span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>
              ${rec.recommendation.estimatedMrrSaved.toLocaleString()}
            </span>
          </div>
          {rec.recommendation.historicalSuccessRate && (
            <div>
              <span style={{ color: '#64748b' }}>Historical Success: </span>
              <span style={{ color: '#6366f1', fontWeight: '600' }}>
                {rec.recommendation.historicalSuccessRate}%
              </span>
              <span style={{ color: '#475569', marginLeft: '0.5rem' }}>
                ({rec.recommendation.similarCasesSaved}/{rec.recommendation.similarCasesAttempted} cases)
              </span>
            </div>
          )}
        </div>
      </div>

      {rec.recommendation.alternativeActions.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Alternative approaches:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {rec.recommendation.alternativeActions.map((alt: any, idx: number) => (
              <span key={idx} style={{
                background: '#334155',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                {actionLabels[alt.action] || alt.action.replace(/_/g, ' ')} ({alt.successRate}%)
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onExecute}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '1rem',
          background: actionColors[rec.recommendation.action] || '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '1rem',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Starting Intervention...' : `Execute ${actionLabels[rec.recommendation.action] || 'Intervention'}`}
      </button>
    </div>
  );
}

function Stat({ label, value, color = '#94a3b8' }: { label: string, value: any, color?: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: '600', color }}>
        {value}
      </div>
    </div>
  );
}
