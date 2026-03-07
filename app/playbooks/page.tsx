'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Playbook {
  id: string;
  name: string;
  trigger: string;
  isActive: boolean;
  description: string | null;
  lastRun: string | null;
}

export default function PlaybooksPage() {
  const { user, isLoaded } = useUser();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchPlaybooks();
    }
  }, [isLoaded, user]);

  async function fetchPlaybooks() {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setPlaybooks(data.playbooks || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function runPlaybook(id: string) {
    setRunningId(id);
    try {
      const response = await fetch('/api/playbooks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId: id })
      });
      if (response.ok) {
        alert('Playbook executed!');
      }
    } catch (error) {
      alert('Failed to run playbook');
    } finally {
      setRunningId(null);
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (