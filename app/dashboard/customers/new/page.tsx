'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    riskScore: '50',
    mrr: '99',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        alert('Failed to create customer');
      }
    } catch (error) {
      alert('Error creating customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '2rem', maxWidth: '600px'}}>
      <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem'}}>Add New Customer</h1>
      
      <form onSubmit={handleSubmit} style={{backgroundColor: '#1e293b', padding: '2rem', borderRadius: '0.75rem'}}>
        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', color: '#94a3b8', marginBottom: '0.5rem'}}>Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}
          />
        </div>

        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', color: '#94a3b8', marginBottom: '0.5rem'}}>Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}
          />
        </div>

        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', color: '#94a3b8', marginBottom: '0.5rem'}}>Company (optional)</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            style={{width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}
          />
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
          <div>
            <label style={{display: 'block', color: '#94a3b8', marginBottom: '0.5rem'}}>Risk Score (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.riskScore}
              onChange={(e) => setFormData({...formData, riskScore: e.target.value})}
              style={{width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}
            />
          </div>
          <div>
            <label style={{display: 'block', color: '#94a3b8', marginBottom: '0.5rem'}}>MRR ($)</label>
            <input
              type="number"
              value={formData.mrr}
              onChange={(e) => setFormData({...formData, mrr: e.target.value})}
              style={{width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}
            />
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem'}}>
          <button
            type="submit"
            disabled={loading}
            style={{flex: 1, padding: '0.75rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'Creating...' : 'Create Customer'}
          </button>
          <a
            href="/dashboard"
            style={{padding: '0.75rem 1.5rem', backgroundColor: '#334155', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', textAlign: 'center'}}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}