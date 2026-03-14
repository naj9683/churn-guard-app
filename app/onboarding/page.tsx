'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to ChurnGuard! 🎉',
    description: 'Let\'s get you set up in less than 5 minutes.'
  },
  {
    id: 'stripe',
    title: 'Connect Stripe 💳',
    description: 'We need Stripe to track your revenue and MRR.'
  },
  {
    id: 'slack',
    title: 'Connect Slack 💬',
    description: 'Get alerts when customers are at risk.'
  },
  {
    id: 'first-customer',
    title: 'Import First Customer 👤',
    description: 'Add your first customer to start tracking.'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'Your dashboard is ready.'
  }
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState({
    stripe: false,
    slack: false,
    firstCustomer: false
  });

  useEffect(() => {
    if (isLoaded && user) {
      checkOnboardingStatus();
    }
  }, [isLoaded, user]);

  async function checkOnboardingStatus() {
    try {
      const res = await fetch('/api/onboarding/status');
      if (res.ok) {
        const data = await res.json();
        setSetupStatus(data);
        
        // If onboarding complete, redirect to dashboard
        if (data.onboardingComplete) {
          router.push('/dashboard');
          return;
        }
        
        // Set step based on what's connected
        if (!data.stripe) setCurrentStep(1);
        else if (!data.slack) setCurrentStep(2);
        else if (!data.firstCustomer) setCurrentStep(3);
        else setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  }

  async function connectStripe() {
    setLoading(true);
    // Redirect to Stripe OAuth or pricing page
    window.location.href = '/pricing';
  }

  async function connectSlack() {
    setLoading(true);
    // Redirect to Slack OAuth
    window.location.href = '/api/slack/configure';
  }

  async function addFirstCustomer() {
    setLoading(true);
    router.push('/customers?addFirst=true');
  }

  async function completeOnboarding() {
    setLoading(true);
    await fetch('/api/onboarding/complete', { method: 'POST' });
    router.push('/dashboard');
  }

  if (!isLoaded) {
    return <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white'}}>Loading...</div>;
  }

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header */}
      <div style={{padding: '1.5rem 2rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>
          Skip for now →
        </Link>
      </div>

      <div style={{maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem'}}>
        {/* Progress Bar */}
        <div style={{marginBottom: '3rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem', color: '#94a3b8'}}>
            <span>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
            <span>{Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}% Complete</span>
          </div>
          <div style={{height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden'}}>
            <div style={{
              height: '100%',
              background: '#6366f1',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
              width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%`
            }} />
          </div>
        </div>

        {/* Step Content */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            {currentStep === 0 && '🎉'}
            {currentStep === 1 && '💳'}
            {currentStep === 2 && '💬'}
            {currentStep === 3 && '👤'}
            {currentStep === 4 && '🚀'}
          </div>
          
          <h1 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '1rem'}}>
            {step.title}
          </h1>
          <p style={{fontSize: '1.125rem', color: '#94a3b8', lineHeight: '1.6'}}>
            {step.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {currentStep === 0 && (
            <button
              onClick={() => setCurrentStep(1)}
              style={{
                padding: '1rem 2rem',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Let's Get Started →
            </button>
          )}

          {currentStep === 1 && (
            <>
              <button
                onClick={connectStripe}
                disabled={loading}
                style={{
                  padding: '1rem 2rem',
                  background: '#635bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? 'Connecting...' : 'Connect with Stripe'}
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  padding: '1rem',
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Skip for now →
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <button
                onClick={connectSlack}
                disabled={loading}
                style={{
                  padding: '1rem 2rem',
                  background: '#4a154b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? 'Connecting...' : 'Connect Slack'}
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                style={{
                  padding: '1rem',
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Skip for now →
              </button>
            </>
          )}

          {currentStep === 3 && (
            <button
              onClick={addFirstCustomer}
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Loading...' : '+ Add First Customer'}
            </button>
          )}

          {currentStep === 4 && (
            <button
              onClick={completeOnboarding}
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Setting up...' : 'Go to Dashboard →'}
            </button>
          )}
        </div>

        {/* Back Button */}
        {currentStep > 0 && currentStep < 4 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            style={{
              marginTop: '2rem',
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '2rem auto 0'
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
