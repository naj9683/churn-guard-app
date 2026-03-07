'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    companyName: 'Your Company',
    logoUrl: '',
    brandColor: '#6366f1',
    fromEmail: 'noreply@yourcompany.com',
    emailSignature: 'Best regards,\nThe Team'
  });

  useEffect(() => {
    if (isLoaded && user) fetchSettings();
  }, [isLoaded, user]);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('Saving...');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setMessage('✅ Settings saved successfully!');
      } else {
        setMessage('❌ Failed to save settings');
      }
    } catch (error) {
      setMessage('❌ Error saving settings');
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      {/* Sidebar */}
      <aside style={{width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Link href="/dashboard" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>📊 Dashboard</Link>
          <Link href="/customers" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>👥 Customers</Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>⚡ Playbooks</Link>
          <Link href="/widget-messages" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>💬 Widget</Link>
          <Link href="/email-campaigns" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>📧 Email Campaigns</Link>
          <Link href="/settings" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none'}}>⚙️ Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{flex: 1, padding: '2rem', marginLeft: '250px'}}>
        <h1 style={{margin: '0 0 2rem 0', fontSize: '1.875rem'}}>⚙️ White-Label Settings</h1>
        
        <p style={{color: '#94a3b8', marginBottom: '2rem'}}>
          Customize how your emails look to your customers. All emails will use YOUR branding instead of ChurnGuard's.
        </p>

        {message && (
          <div style={{background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', borderLeft: '4px solid #6366f1'}}>
            {message}
          </div>
        )}

        <form onSubmit={saveSettings} style={{maxWidth: '600px'}}>
          {/* Company Name */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid #334155'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>
              Company Name *
            </label>
            <input 
              type="text" 
              value={settings.companyName}
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
              placeholder="TechStart Inc."
              style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '1rem'}}
              required
            />
            <p style={{margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.75rem'}}>This appears in email headers and signatures</p>
          </div>

          {/* Logo URL */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid #334155'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>
              Logo URL
            </label>
            <input 
              type="url" 
              value={settings.logoUrl}
              onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
              placeholder="https://yourcompany.com/logo.png"
              style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '1rem'}}
            />
            <p style={{margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.75rem'}}>Direct link to your logo image (PNG/SVG recommended)</p>
            {settings.logoUrl && (
              <div style={{marginTop: '1rem', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem'}}>
                <p style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.75rem'}}>Preview:</p>
                <img src={settings.logoUrl} alt="Logo preview" style={{maxHeight: '50px', maxWidth: '200px'}} onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}} />
              </div>
            )}
          </div>

          {/* Brand Color */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid #334155'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>
              Brand Color *
            </label>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <input 
                type="color" 
                value={settings.brandColor}
                onChange={(e) => setSettings({...settings, brandColor: e.target.value})}
                style={{width: '60px', height: '40px', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}
              />
              <input 
                type="text" 
                value={settings.brandColor}
                onChange={(e) => setSettings({...settings, brandColor: e.target.value})}
                style={{flex: 1, padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '1rem'}}
              />
            </div>
            <p style={{margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.75rem'}}>Used for buttons and headers in emails</p>
          </div>

          {/* From Email */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid #334155'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>
              From Email Address *
            </label>
            <input 
              type="email" 
              value={settings.fromEmail}
              onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
              placeholder="support@yourcompany.com"
              style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '1rem'}}
              required
            />
            <p style={{margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.75rem'}}>Must be verified in Resend for production use</p>
          </div>

          {/* Email Signature */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid #334155'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>
              Email Signature
            </label>
            <textarea 
              value={settings.emailSignature}
              onChange={(e) => setSettings({...settings, emailSignature: e.target.value})}
              rows={3}
              placeholder="Best regards,
The Team
support@yourcompany.com"
              style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', fontFamily: 'inherit'}}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={saving}
            style={{
              width: '100%',
              padding: '1rem',
              background: saving ? '#475569' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Saving...' : '💾 Save White-Label Settings'}
          </button>
        </form>

        {/* Preview Section */}
        <div style={{marginTop: '3rem', padding: '2rem', background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155'}}>
          <h3 style={{margin: '0 0 1rem 0'}}>📧 Email Preview</h3>
          <div style={{background: '#0f172a', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #334155'}}>
            <div style={{background: settings.brandColor, padding: '20px', borderRadius: '8px 8px 0 0', textAlign: 'center'}}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" style={{maxHeight: '40px'}} />
              ) : (
                <h2 style={{margin: 0, color: 'white'}}>{settings.companyName}</h2>
              )}
            </div>
            <div style={{background: '#f9fafb', padding: '20px', color: '#1f2937', borderRadius: '0 0 8px 8px'}}>
              <p style={{margin: '0 0 10px 0'}}><strong>Subject:</strong> We miss you! Here's a special offer 🎁</p>
              <p style={{margin: '0 0 10px 0'}}>Hi there,</p>
              <p style={{margin: '0 0 10px 0'}}>We noticed you haven't been active lately...</p>
              <div style={{textAlign: 'center', margin: '20px 0'}}>
                <span style={{display: 'inline-block', padding: '12px 24px', background: settings.brandColor, color: 'white', borderRadius: '6px'}}>Claim Your 20% Off</span>
              </div>
              <p style={{margin: '20px 0 0 0', whiteSpace: 'pre-line', color: '#6b7280', fontSize: '14px'}}>{settings.emailSignature}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
