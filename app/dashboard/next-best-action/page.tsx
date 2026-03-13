'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NextBestActionPage() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intervening, setIntervening] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user, lastFetch]);

  async function fetchRecommendations() {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching recommendations...');
      const res = await fetch('/api/ai-recommendations');
      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error('API Error:', errorData);
        setError(`Failed to load: ${res.status} - ${errorData}`);
        setRecommendations([]);
        return;
      }

      const data = await res.json();
      console.log('Received data:', data);

      if (Array.isArray(data)) {
        setRecommendations(data);
      } else if (data.error) {
        setError(data.error);
        setRecommendations([]);
      } else {
        setRecommendations([data]);
      }
    } catch (error: any) {
      console.error('Fetch Error:', error);
      setError(`Network error: ${error.message}`);
      setRecommendations([]);
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
        // Redirect to interventions page instead of showing alert
        window.location.href = '/dashboard/interventions';
      } else {
        alert('Failed to start intervention');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error starting intervention');
    } finally {
      setIntervening(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        <div>Loading AI Recommendations...</div>
        <div style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          Checking for high-risk customers (60%+ risk score)...
        </div>
      </div>
    );
  }

  const actionLabels: Record<string, string> = {
    discount_offer: 'Retention Discount',
    check_in_call: 'Check-in Call',
    training_session: 'Training Session',
    feature_showcase: 'Feature Showcase',
    support_escalation: 'Priority Support'
  };

  const actionColors: Record<string, string> = {
    discount_offer: '#ef4444',
    check_in_call: '#f59e0b',
    training_session: '#3b82f6',
    feature_showcase: '#8b5cf6',
    support_escalation: '#10b981'
  };

  return (
    <div style={{ padding: '2rem', color: 'white', maxWidth: '1200px', minHeight: '100vh', background: '#0f172a' }}>
      {/* Back to Dashboard */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ 
          color: '#94a3b8', 
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>🤖</span> Next Best Action
        </h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          AI-recommended interventions for customers with 60%+ risk score
        </p>
      </div>

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          color: '#991b1b', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '2rem',
          border: '1px solid #fecaca'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setLastFetch(new Date())}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!error && recommendations.length === 0 && (
        <div style={{ 
          background: '#1e293b', 
          padding: '3rem', 
          borderRadius: '0.75rem', 
          textAlign: 'center',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>No high-risk customers found!</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            All your customers are healthy. Check back later or adjust risk thresholds.
          </p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginBottom: '1rem', color: '#94a3b8' }}>
          Found {recommendations.length} high-risk customer{recommendations.length !== 1 ? 's' : ''}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {recommendations.map((rec) => (
          <Card
            key={rec.customer.id}
            rec={rec}
            onExecute={() => executeIntervention(rec)}
            isLoading={intervening === rec.customer.id}
            actionLabels={actionLabels}
            actionColors={actionColors}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ rec, onExecute, isLoading, actionLabels, actionColors }: any) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #334155',
      borderLeft: `4px solid ${actionColors[rec.recommendation.action] || '#6366f1'}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>{rec.customer.name}</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{rec.customer.email}</p>
        </div>
        <div style={{
          background: '#0f172a',
          color: '#f59e0b',
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
        <Stat label="MRR" value={`$${rec.customer.mrr || 0}`} />
        <Stat label="Risk Score" value={`${rec.customer.riskScore}%`} color={rec.customer.riskScore > 80 ? '#ef4444' : '#f59e0b'} />
        <Stat label="Plan" value={rec.customer.plan || 'Unknown'} />
        <Stat label="Days Since Login" value={rec.customer.daysSinceLogin || 'N/A'} />
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
              ${(rec.recommendation.estimatedMrrSaved || 0).toLocaleString()}
            </span>
          </div>
          {rec.recommendation.historicalSuccessRate && (
            <div>
              <span style={{ color: '#64748b' }}>Historical Success: </span>
              <span style={{ color: '#6366f1', fontWeight: '600' }}>
                {rec.recommendation.historicalSuccessRate}%
              </span>
            </div>
          )}
        </div>
      </div>

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
